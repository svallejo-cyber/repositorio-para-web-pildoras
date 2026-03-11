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
- Un trabajo no se considera cerrado si no queda tambien publicado en el remoto y navegable desde la web.

## Estilo del presidente conectado

Este repo ya tiene una capa local para reescribir borradores de píldoras con tu voz antes de pasarlos a HTML o PDF.

- Reglas: `config/style_rules.yaml`
- Rewriter general: `scripts/style_rewriter.py`
- Wrapper para píldoras: `scripts/rewrite_pill.py`
- Entrada sugerida: `drafts/input/pill_draft.txt`
- Salida sugerida: `drafts/output/pill_rewritten.txt`

Flujo recomendado:

1. Escribes el borrador base de la píldora.
2. Lo pasas por `python3 scripts/rewrite_pill.py`.
3. Revisas `drafts/output/pill_rewritten.txt` y `drafts/output/pill_changes.md`.
4. Con esa versión ya pulida, pides la conversión a HTML o PDF dentro del hub.
5. Se enlaza en el repositorio, se valida la ruta final y se hace push para publicación real.

Ejemplo:

```bash
python3 scripts/rewrite_pill.py \
  --input drafts/input/pill_draft.txt \
  --type reflexion \
  --goal informar \
  --audience directivo \
  --firmness medio \
  --length estandar
```

Si la pieza es más exigente, cambia `--goal` a `pedir_accion`, `corregir`, `negociar`, `reconocer` o `escalar`.

## Cloudflare

- Build command: vacio
- Output directory: `.`
- Si usas Wrangler, `wrangler.toml` ya declara assets estaticos.
