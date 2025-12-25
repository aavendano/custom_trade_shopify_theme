# Plan de Migración y Arquitectura: Shopify Theme → b-Bulma-Alpine
**Proyecto:** PlayLoveToys Theme Migration
**Role:** Lead UI Architect & Performance Engineer

Este documento define la estrategia técnica para migrar el theme actual de Shopify hacia el stack propietario **b-Bulma-Alpine**.
Este plan es la *fuente de verdad* para el agente de ejecución (Codex).

---

## 1️⃣ Evaluación Inicial del Theme Original

### 🕵️ Análisis de Situación Actual
El theme actual es un **híbrido**.
1.  **Carga Legacy:** Carga `base.css` (Dawn) y `global.js`, lo que introduce cientos de reglas CSS no utilizadas y JS vanilla redundante.
2.  **Carga Nueva:** Carga `a-bulma-full.css` (o `purged`) y `alpine-bundle.js`.
3.  **Resultado:** Doble carga de estilos, especificidad conflictiva y performance degradada.

### 🗑️ Qué se debe ELIMINAR (Phase-out)
*   **CSS:** `base.css`, `component-*.css` (todos los archivos CSS modulares de Dawn).
*   **JS:** `global.js`, `details-disclosure.js`, `cart.js` (legacy), `product-form.js` (legacy).
*   **Sections:** `image-banner.liquid` (Dawn version), `header.liquid` (Legacy version), `footer.liquid` (Legacy version).
*   **Snippets:** `card-product.liquid`, `price.liquid` (Legacy con muchas clases utilitarias de Shopify).

### ♻️ Qué se debe REFACTORIZAR
*   **Layout:** `layout/theme.liquid` debe limpiarse de variables CSS inline masivas (`:root { ... }`) que controlan el diseño de Dawn. Estas deben ser reemplazadas por variables SASS de Bulma.
*   **Estructura:** Mantener `templates/*.json` para preservar la configuración del comerciante, pero reemplazar el *contenido* de las secciones apuntadas.

### 💾 Qué se debe CONSERVAR (Base)
*   `config/settings_schema.json`: Mantener configuración, pero limpiar settings visuales que ya no apliquen.
*   `locales/*`: Textos y traducciones.
*   `assets/a-*.css` y `src/*`: El núcleo del nuevo stack.

---

## 2️⃣ Plan de Migración por Fases

La migración no será un "Big Bang". Será incremental para mantener la tienda funcional.

### 🏁 Fase 1: Cimientos (Foundation)
*   **Objetivo:** Establecer el entorno `b-Bulma` como la autoridad de estilos.
*   **Archivos Afectados:** `layout/theme.liquid`, `src/bulma/bulma.scss`.
*   **Acciones:**
    *   Mover variables críticas de Shopify (colores, fuentes) a variables CSS que Bulma pueda consumir.
    *   Asegurar que `a-bulma-purged.css` incluya reset y helpers básicos.
    *   Eliminar scripts deferidos innecesarios de `theme.liquid`.
*   **Criterio de Aceptación:** El theme carga, la tipografía es correcta, no hay errores de consola por falta de variables.

### 🧭 Fase 2: Navegación Global (Header & Footer)
*   **Objetivo:** Migrar los elementos presentes en todas las páginas.
*   **Archivos:** `sections/header.liquid` → `sections/aa-header.liquid`, `sections/footer.liquid` → `sections/aa-footer.liquid`.
*   **Acciones:**
    *   Implementar Header con Nav de Bulma.
    *   Menu Mobile usando **Alpine.js** para el toggle (`x-data="{ open: false }"`).
    *   Eliminar `component-list-menu.css`.
*   **Riesgo:** Romper la navegación en mobile.
*   **Validación:** El menú abre/cierra suavemente en mobile sin layout shifts.

### 🃏 Fase 3: La Célula (Product Card)
*   **Objetivo:** Migrar el componente más repetido. Clave para performance.
*   **Archivos:** `snippets/card-product.liquid` → `snippets/c-product-card.liquid`.
*   **Acciones:**
    *   Diseño **1:1 Image**.
    *   Uso estricto de `image_tag` con `loading: 'lazy'`.
    *   Título, Precio y Botón "Add" (o Quick View) usando clases `b-`.
    *   Reemplazar su uso en `featured-collection.liquid`.
*   **Prohibido:** Usar Grid CSS complejo; usar columnas de Bulma.

### 🏠 Fase 4: Homepage & Hero
*   **Objetivo:** Migrar la primera impresión.
*   **Archivos:** `sections/image-banner.liquid` → `sections/aa-hero.liquid`.
*   **Acciones:**
    *   Hero Banner con imagen 1:1 (mobile) y 2:1 (desktop) o lo que dicte diseño, pero optimizado para LCP.
    *   Texto sobre imagen usando overlays de Bulma.
*   **Performance:** La imagen del Hero debe tener `fetchpriority="high"` y `loading="eager"`.

### 🛍️ Fase 5: Product Detail Page (PDP)
*   **Objetivo:** La página de conversión.
*   **Archivos:** `sections/main-product.liquid` → `sections/aa-main-product.liquid`.
*   **Acciones:**
    *   Galería de imágenes: **Scroll Snap nativo** (CSS), no sliders JS.
    *   Selector de variantes: Alpine.js para manejar estado (`x-data="{ selectedVariant: ... }"`).
    *   Add to Cart: AJAX submit con Alpine.
*   **Riesgo:** Romper la lógica de variantes (cambio de precio/imagen).

### 🛒 Fase 6: Cart (Drawer & Page)
*   **Objetivo:** Checkout flow.
*   **Archivos:** `snippets/cart-drawer.liquid`, `sections/main-cart.liquid`.
*   **Acciones:**
    *   Cart Drawer controlado 100% por Alpine Store (`Alpine.store('cart')`).
    *   Actualización en tiempo real sin recarga.
    *   Visualización de "Free Shipping Bar" con `<progress class="b-progress">`.

### 🧹 Fase 7: Limpieza Final (The Purge)
*   **Objetivo:** Remover el soporte vital legado.
*   **Acciones:**
    *   Eliminar `{{ 'base.css' | asset_url | stylesheet_tag }}` de `theme.liquid`.
    *   Eliminar `global.js`.
    *   Ejecutar PurgeCSS final y verificar que no se rompieron estilos dinámicos.

---

## 3️⃣ Reglas Técnicas Clave para Codex

### 🟢 DO (Permitido y Requerido)
1.  **Clases:** Usa siempre clases con prefijo `b-` (ej. `b-columns`, `b-button`, `b-is-primary`).
2.  **Alpine:** Toda interactividad debe ser Alpine (`x-data`, `@click`). Si necesitas acceder al DOM fuera del componente, piénsalo dos veces.
3.  **Imágenes:** Siempre envueltas en contenedor con aspect-ratio. Usa `class="b-image b-is-square"` (o similar).
4.  **Mobile-First:** Escribe el HTML pensando en mobile. Las columnas son `b-column b-is-12-mobile b-is-4-desktop`.
5.  **Semántica:** Usa `<section>`, `<article>`, `<header>`, `<footer>`.

### 🔴 DON'T (Prohibido)
1.  **No escribas CSS custom** a menos que sea para una animación específica o un ajuste que Bulma no cubra. Si lo haces, usa `src/bulma/custom`.
2.  **No uses `document.querySelector`**. Usa `x-ref` en Alpine.
3.  **No importes librerías**. No Swiper, no Slick, no jQuery, no Lodash.
4.  **No uses `!important`** para corregir especificidad. Arregla el origen del estilo.
5.  **No copies código de Dawn**. Reescribe la lógica usando Alpine.

---

## 4️⃣ Riesgos y Errores Probables

### ⚠️ Riesgo: PurgeCSS Agresivo
*   **Problema:** Clases generadas dinámicamente en Liquid (ej. `b-is-{{ section.settings.width }}`) pueden ser purgadas.
*   **Solución:** Agregar esas clases a la safelist en `src/purge/extract-b-safelist.js` o usar nombres completos en el Liquid.

### ⚠️ Riesgo: FOUC (Flash of Unstyled Content) con Alpine
*   **Problema:** Elementos ocultos con `x-show` aparecen brevemente antes de que Alpine cargue.
*   **Solución:** Usar `x-cloak` y la regla CSS `[x-cloak] { display: none !important; }` en el CSS crítico.

### ⚠️ Riesgo: SEO & Accesibilidad
*   **Problema:** Al reescribir HTML, se pierden `aria-labels` o estructura de headings (`h1`-`h6`).
*   **Solución:** Validar siempre con Lighthouse después de cada sección migrada.

### ⚠️ Riesgo: Conflictos de Eventos
*   **Problema:** Scripts legacy de apps de Shopify pueden intentar manipular el DOM que Alpine controla.
*   **Solución:** Usar `x-ignore` en contenedores que sean inyectados por apps externas (ej. widgets de reviews).

---

## 5️⃣ Checklist de Validación Final

Antes de marcar una tarea como "Completada", Codex debe verificar:

- [ ] **Mobile View:** ¿Se ve perfecto en 375px de ancho?
- [ ] **Performance:** ¿LCP está optimizado (imagen prioritaria)?
- [ ] **Código:** ¿No hay referencias a `base.css` o clases standard de Dawn?
- [ ] **JS:** ¿No hay `console.error`?
- [ ] **Alpine:** ¿Se usa `x-cloak` donde corresponde?
- [ ] **Imágenes:** ¿Tienen `width`, `height` explícitos y `loading` correcto?
- [ ] **Bulma:** ¿Se usan las columnas y helpers de Bulma en lugar de CSS custom?

---
*Fin del Plan de Arquitectura*
