# Comparación entre ramas `master` y `dev`

Esta comparativa destaca las diferencias a nivel de archivos entre las ramas `master` (producción/estable) y `dev` (desarrollo), con un enfoque en los nuevos bloques y secciones.

## Resumen General
La rama `dev` introduce una arquitectura moderna basada en componentes, utilizando **Storybook**, **Alpine.js** y **Bulma CSS**. Se observa una migración significativa de plantillas Liquid tradicionales a plantillas JSON (Shopify 2.0).

## Nuevos Blocks (Bloques)
Archivos añadidos en el directorio `blocks/`:

*   `blocks/a-vertical-tab-card.liquid`
*   `blocks/b-card-article.liquid`
*   `blocks/b-card-collection.liquid`
*   `blocks/b-card-collections-grid.liquid`
*   `blocks/b-card-products-grid.liquid`
*   `blocks/b-carousel.liquid`
*   `blocks/b-cell.liquid`
*   `blocks/b-header.liquid`

> **Nota:** El prefijo `b-` indica componentes estilizados con Bulma.

## Nuevas Sections (Secciones)
Archivos añadidos en el directorio `sections/`:

*   `sections/a-age-verification.liquid` (Verificación de edad)
*   `sections/a-logo-motto.liquid`
*   `sections/a-matrix.liquid`
*   `sections/b-section.liquid`
*   `sections/featured-collection-BK.liquid`
*   `sections/newsletter-BK.liquid`

## Otros Cambios Importantes

### Estructura de Fuentes (`src/`)
*   Nueva carpeta `src/components/` con componentes modulares (HTML, JS, SCSS, Stories).
*   Configuración de **Storybook** en `src/stories/`.
*   Scripts de entrada para Alpine: `src/alpine-bundle.js`.

### Snippets
*   Nuevos snippets con prefijo `c-` (ej. `snippets/c-basic-product-card.liquid`), correspondientes a componentes reutilizables.

### Plantillas JSON
*   Nuevas plantillas JSON para `cart`, `collection`, y `search`, reemplazando versiones Liquid antiguas.
