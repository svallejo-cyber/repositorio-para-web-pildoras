# Isaval AI Executive Hub

Hub unico de publicaciones HTML para directivos no tecnicos.

## Estructura

- `index.html` (portada)
- `projects/tenantflow/index.html`
- `projects/tenantflow/assets/tenantflow-desktop-icon.png`
- `projects/pildora-3/index.html`

## Regla de trabajo (a partir de ahora)

- Todo nuevo HTML se crea dentro de este repo, bajo `projects/<slug>/index.html`.
- Despues se añade su tarjeta/enlace en `index.html`.
- Se hace commit y push a `main` en cada publicacion.

## Cloudflare

- Build command: vacio
- Output directory: `.`
- Si usas Wrangler, `wrangler.toml` ya declara assets estaticos.
