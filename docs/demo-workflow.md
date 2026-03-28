# DEMO Workflow

## Objetivo

Trabajar una versión DEMO paralela del hub sin tocar las rutas activas.

## Regla de enrutado

- Cualquier petición a `/demo/*` intenta servir primero un archivo real dentro de `demo/`.
- Si ese archivo no existe, el worker sirve automáticamente la ruta viva equivalente sin el prefijo `/demo`.

Ejemplos:

- `/demo/es/` -> usa `demo/es/index.html` si existe; si no, cae a `/es/`
- `/demo/projects/colaborativa-4/es/` -> usa `demo/projects/colaborativa-4/es/index.html` si existe; si no, cae a la ficha viva

## Método de trabajo recomendado

1. No tocar archivos activos para experimentar.
2. Crear dentro de `demo/` solo los archivos que quieras rediseñar.
3. Mantener el mismo path relativo que en producción.
4. Validar navegación y comportamiento en `/demo/...`.
5. Promocionar solo los overrides aprobados.

## Qué sí se puede cambiar en DEMO

- portada interna
- jerarquía de navegación
- páginas de proyectos y píldoras
- nuevas secciones
- estructura visual

## Qué no se toca en esta fase

- autenticación
- contenido vivo
- rutas activas
- APIs existentes

## Sustitución final

Cuando la DEMO esté aprobada:

1. ejecutar el script `scripts/promote_demo_to_live.py --dry-run`
2. revisar los archivos que se van a promocionar
3. ejecutar `scripts/promote_demo_to_live.py --apply`
4. validar la web activa

## Criterio

La DEMO no es una copia masiva. Es una capa de overrides controlados sobre la web actual.
