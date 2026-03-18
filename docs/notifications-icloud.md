## Notificaciones del Hub con iCloud SMTP

La solución activa para no depender de IT es:

- el Hub genera el contenido y los destinatarios;
- este Mac envía los correos desde `svallejoi@icloud.com` usando SMTP de iCloud;
- tras el envío, el script marca el aviso como enviado dentro del Hub.

### Requisito único

Crear una **contraseña específica de app** para la cuenta Apple y exportarla como variable:

```bash
export ICLOUD_APP_PASSWORD='TU_APP_SPECIFIC_PASSWORD'
```

Apple documenta este modelo aquí:

- iCloud Mail SMTP: `smtp.mail.me.com:587`
- contraseña específica de app para apps de terceros

### Script local

Archivo:

- [`/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py`](/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py)

### Comandos

Correo inicial a todos los invitados activos:

```bash
export ICLOUD_APP_PASSWORD='TU_APP_SPECIFIC_PASSWORD'
python3 '/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py' --kind initial-hub
```

Aviso diario de nuevas píldoras:

```bash
export ICLOUD_APP_PASSWORD='TU_APP_SPECIFIC_PASSWORD'
python3 '/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py' --kind daily-pills
```

Resumen semanal de comentarios:

```bash
export ICLOUD_APP_PASSWORD='TU_APP_SPECIFIC_PASSWORD'
python3 '/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py' --kind weekly-comments
```

Modo prueba en seco:

```bash
python3 '/Users/santiagoisaacvallejoizquierdo/codex programas/01-isaval-ia/isaval-ai-executive-hub/scripts/send_hub_notifications.py' --kind initial-hub --dry-run
```

### Cómo funciona

1. El script hace login admin en el Hub con `svallejoi@icloud.com`.
2. Recupera el borrador ya preparado por el Worker.
3. Envía el correo desde `svallejoi@icloud.com`.
4. Marca el aviso como enviado para no repetirlo.

### Observación

El envío desde navegador queda descartado para esta vía. El canal de salida es local y controlado por este Mac.
