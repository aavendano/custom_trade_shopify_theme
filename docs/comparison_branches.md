# Comparación de Ramas: `master` vs `dev` vs `migration`

Este documento analiza las diferencias técnicas, estratégicas y de archivos entre las tres ramas principales del proyecto: `master` (producción), `dev` (arquitectura) y `migration` (implementación activa).

## Resumen Ejecutivo

| Característica | `master` | `dev` | `migration` |
| :--- | :--- | :--- | :--- |
| **Rol** | Producción / Legacy | Base Arquitectónica | Ejecución de Tareas |
| **Estado** | Estable (Híbrido) | Limpio (Refactorizado) | En Progreso (Activo) |
| **Stack** | Liquid + Dawn + JS Vanilla | Bulma + Alpine + Storybook | Bulma + Alpine + Storybook + Tests |
| **Build System** | N/A (Manual) | `npm run build` | `npm run build` + Scripts de Validación |
| **Testing** | Ninguno | Vitest + Playwright (Config) | Vitest (Suites Completas) |
| **Documentación** | Mínima | `docs/` | `.codex/` (Tracking Granular) |

---

## 1. Análisis por Rama

### `master` (El Pasado)
Representa el estado actual de la tienda en producción.
*   **Contenido:** Código legado de Shopify Dawn, múltiples archivos CSS/JS sin unificar, y bloques experimentales generados por IA (`blocks/ai_gen_block_*.liquid`).
*   **Deuda Técnica:** Alta. Carga assets innecesarios y tiene código muerto.
*   **Uso:** Solo para hotfixes críticos en producción.

### `dev` (El Futuro / La Base)
Representa la arquitectura "ideal" y limpia del nuevo stack.
*   **Cambios Clave:**
    *   Eliminación masiva de bloques IA y secciones legacy.
    *   Introducción de **Storybook** (`src/stories/`) para desarrollo de componentes.
    *   Configuración de build con **esbuild** y **PurgeCSS**.
*   **Uso:** Rama base para nuevas características una vez estabilizada la migración.

### `migration` (El Presente / La Obra)
Es la rama donde ocurre el trabajo pesado de migración paso a paso. Se basa en `dev` pero contiene la **ejecución** del plan.
*   **Diferencias con `dev`:**
    *   **Tracking:** Contiene la carpeta `.codex/` con logs detallados de tareas (`TASK-*-COMPLETE.md`) y especificaciones.
    *   **Implementación:** Contiene secciones ya migradas que podrían no estar en `dev` aún (ej. `aa-header.liquid`, `aa-footer.liquid`, `aa-hero.liquid`).
    *   **Testing Activo:** Scripts específicos de validación en `package.json` (`test:validate`, `test:purge`) y suites de pruebas en `src/tests/` para componentes específicos (hero, navbar, etc.).
    *   **Dependencias:** Añade `jsdom` para pruebas unitarias de componentes DOM.

---

## 2. Diferencias a Nivel de Archivos

### Archivos Exclusivos de `migration` (vs `dev`)
*   **Gestión de Proyecto:** Todo el directorio `.codex/` (specs, logs de tareas).
*   **Secciones Migradas:**
    *   `sections/aa-header.liquid`
    *   `sections/aa-footer.liquid`
    *   `sections/aa-hero.liquid`
    *   `sections/aa-megamenu.liquid`
    *   `sections/aa-featured-blog.liquid`
*   **Tests:**
    *   `src/tests/foundation-complete.test.js`
    *   `src/tests/hero-banner.test.js`
    *   `src/tests/navigation-integration.test.js`
    *   `src/tests/purgecss-safelist.test.js`

### Archivos en `dev` y `migration` (Ausentes en `master`)
*   **Stack:** `src/bulma/`, `src/alpine-bundle.js`, `package.json` (scripts modernos).
*   **Componentes:** `blocks/b-*.liquid`, `snippets/c-*.liquid`.
*   **Storybook:** `src/stories/`, `.storybook/`.

### Archivos en `master` (Eliminados en `dev` y `migration`)
*   `blocks/ai_gen_block_*.liquid` (Bloques basura de IA).
*   `assets/aa-bulma.css` (Versión antigua).
*   Secciones legacy (`collage.liquid`, `image-grid.liquid`, etc.).

---

## 3. Conclusión: ¿Cuál es la opción más sólida?

*   **Para Estabilidad Inmediata:** `master` (porque es lo que ya funciona, aunque mal optimizado).
*   **Para Desarrollo:** `migration` es actualmente la rama más avanzada y sólida técnicamente. Contiene:
    1.  La **arquitectura limpia** de `dev`.
    2.  Las **implementaciones funcionales** (Header/Footer/Hero) que faltan en `dev`.
    3.  Los **tests de validación** que aseguran que el código nuevo no rompa nada.

**Recomendación:** Considerar `migration` como la rama "Beta" o "Staging" real, y `dev` como la rama "Alpha" o de arquitectura pura. Eventualmente, `migration` debería fusionarse en `dev` (o viceversa) y luego a `master`.
