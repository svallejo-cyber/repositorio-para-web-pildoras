## Notificaciones del Hub por Microsoft 365

El Worker ya deja preparada la lógica para dos envíos automáticos:

1. `08:00` hora España del día siguiente a una nueva publicación:
   aviso al colectivo activo del Hub.
2. `08:00` de cada lunes:
   resumen semanal de comentarios al autor de cada píldora.

### Estado actual

La lógica está desplegable, pero los envíos **no se activan** hasta que se configuren los secretos de Microsoft 365 y se cambie:

```toml
M365_NOTIFICATIONS_ENABLED = "true"
```

### Variables no secretas

Definidas en [`wrangler.toml`](/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/wrangler.toml):

- `NOTIFY_SENDER_EMAIL = "svallejo@isaval.es"`
- `NOTIFY_TIMEZONE = "Europe/Madrid"`
- `M365_NOTIFICATIONS_ENABLED = "false"`

### Secretos necesarios

Configurar con `wrangler secret put`:

```bash
cd "/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub"
wrangler secret put M365_TENANT_ID
wrangler secret put M365_CLIENT_ID
wrangler secret put M365_CLIENT_SECRET
```

### Configuración requerida en Microsoft 365 / Graph

Registrar una app en Azure / Entra ID con:

- permiso de aplicación `Mail.Send`
- consentimiento de administrador concedido
- capacidad de enviar como `svallejo@isaval.es`

El Worker usa flujo `client_credentials` y llama a:

- token: `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`
- envío: `POST https://graph.microsoft.com/v1.0/users/svallejo@isaval.es/sendMail`

### Cómo validar antes de activar

Con acceso admin al hub:

- preview aviso diario:
  - `/api/admin-notifications/preview?kind=daily-pills`
- preview resumen semanal:
  - `/api/admin-notifications/preview?kind=weekly-comments`

Estas rutas no envían nada. Solo devuelven el contenido generado con el estado actual del hub.

### Destinatarios

- Aviso colectivo: usuarios activos de la tabla de invitados.
- Resumen semanal: email del autor definido en los metadatos internos de cada píldora.

### Criterio actual

- Solo cuentan las píldoras `es`.
- El aviso colectivo se manda una sola vez por publicación.
- El resumen semanal solo incluye comentarios aún no digeridos y anteriores al inicio de la semana en curso.
