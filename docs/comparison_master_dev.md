# Comparación entre ramas `master` y `dev`

Esta comparativa destaca las diferencias a nivel de archivos, arquitectura y estrategia entre las ramas `master` (producción/estable) y `dev` (desarrollo/migración).

## 1. Diferencias Clave a Nivel de Archivos

### Nuevos Blocks (Bloques) en `dev`
Archivos añadidos en `blocks/` que introducen componentes estilizados con Bulma (`b-`):
*   `blocks/b-card-article.liquid`, `blocks/b-card-collection.liquid`
*   `blocks/b-carousel.liquid`, `blocks/b-header.liquid`
*   `blocks/b-cell.liquid`, `blocks/b-card-products-grid.liquid`

### Nuevas Sections (Secciones) en `dev`
Archivos añadidos en `sections/` para funcionalidades específicas:
*   `sections/a-age-verification.liquid`
*   `sections/a-logo-motto.liquid`
*   `sections/a-matrix.liquid`
*   `sections/b-section.liquid`

### Archivos Eliminados en `dev` (Presentes en `master`)
La rama `dev` ha realizado una limpieza masiva de código legado y experimental:
*   **Bloques Generados por IA:** Se eliminaron ~10 archivos `blocks/ai_gen_block_*.liquid`.
*   **Secciones Legacy/Dawn:** Se eliminaron secciones como `collage.liquid`, `image-grid.liquid`, `announcement-bar.liquid`, `multicolumn-*.liquid`.
*   **Assets Antiguos:** Se eliminaron `assets/aa-bulma.css` (versión antigua), `assets/twicpics-bundle.js` (reemplazado por build), y `assets/cards.css`.
*   **Documentación Obsoleta:** Se eliminó toda la carpeta `docs/storefront-web-components/`.

---

## 2. Estatus de `master` vs `dev`

### Estatus de `master`
*   **Estado:** Híbrido Legacy/Estable.
*   **Características:** Contiene la versión funcional actual de la tienda, pero acumula "deuda técnica" (bloques generados por IA, múltiples archivos CSS/JS sin unificar).
*   **Ventaja:** Es la versión que (presumiblemente) está funcionando en producción. Tiene todas las secciones antiguas por si algo falla en la migración.
*   **Desventaja:** Código sucio, difícil de mantener, carga de assets no optimizada (múltiples requests), falta de tests.

### Estatus de `dev`
*   **Estado:** En Migración Activa (Fase de Refactorización).
*   **Características:** Introduce una arquitectura de ingeniería de software moderna.
    *   **Build Pipeline:** Usa `npm run build` para compilar SASS (Bulma), purgar CSS no usado (PurgeCSS) y empaquetar JS (Alpine Bundle).
    *   **Testing:** Integra **Vitest** y **Playwright** para pruebas unitarias y e2e.
    *   **Desarrollo UI:** Integra **Storybook** para desarrollar componentes de forma aislada (`src/stories/`).
    *   **Limpieza:** Ha eliminado cientos de líneas de código muerto y archivos basura.
*   **Ventaja:** Código modular, testearle, performante (menos requests, CSS más pequeño) y mantenible.
*   **Desventaja:** Al estar en migración, algunas secciones antiguas podrían no funcionar si no se han reemplazado totalmente (aunque el plan menciona un estado "híbrido" controlado).

---

## 3. ¿Por qué `dev` es una opción más sólida?

La rama `dev` representa una **evolución profesional** del tema. Es más sólida porque:

1.  **Arquitectura de Componentes:** En lugar de código espagueti en Liquid, usa componentes definidos en `src/components/` con su propio HTML/JS/SCSS.
2.  **Calidad de Código:** La inclusión de herramientas de linting (Prettier) y testing (Vitest) asegura que el código sea robusto y consistente.
3.  **Performance:**
    *   **CSS:** Uso de variables CSS nativas mapeadas a settings de Shopify (`--b-primary-h`) para evitar estilos inline masivos.
    *   **JS:** Un solo bundle (`alpine-bundle.js`) en lugar de múltiples scripts dispersos.
4.  **Mantenibilidad:** La estructura de carpetas `src/` separa claramente la lógica (JS), el estilo (SASS) y la estructura (Liquid/HTML), facilitando el trabajo en equipo.

En conclusión, **`master` es el pasado (funcional pero desordenado)** y **`dev` es el futuro (ingeniería sólida y optimizada)**.
