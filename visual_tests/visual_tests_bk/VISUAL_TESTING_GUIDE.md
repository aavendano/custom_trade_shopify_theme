# Guía de Pruebas de Regresión Visual (Migration vs Production)

Este documento detalla el procedimiento para ejecutar pruebas visuales comparando la rama `migration` (en desarrollo local) contra `master` (en producción).

## Contexto
El objetivo es asegurar que la refactorización en `migration` no rompa el diseño visual existente en `playlovetoys.ca`.

*   **Fuente de la Verdad (Baseline):** `https://playlovetoys.ca` (Rama `master`).
*   **Candidato (Target):** `https://monkey-tight-lab.ngrok-free.app/` (Rama `migration` servida localmente).

## Requisitos Previos
1.  Node.js instalado (`v18+`).
2.  Playwright instalado en el proyecto (`npm install`).
3.  El servidor local de desarrollo debe estar corriendo y expuesto en la URL de ngrok.

## Instrucciones de Ejecución

### Paso 1: Generar la Línea Base (Golden Master)
Primero, debemos capturar cómo se ve el sitio en Producción. Estas capturas servirán como la referencia "correcta".

Ejecuta el siguiente comando en tu terminal:

```bash
# Apunta el test a Producción y actualiza las capturas base
TEST_TARGET_URL=https://playlovetoys.ca npx playwright test visual_tests/visual-regression.spec.js -c visual_tests/playwright.config.js --update-snapshots
```

Esto generará imágenes `.png` en la carpeta `visual_tests/visual-regression.spec.js-snapshots/`. **Revisa estas imágenes manualmente** para asegurar que se ven bien.

### Paso 2: Ejecutar la Comparación (Migration)
Ahora, ejecutamos el test contra tu entorno local (ngrok). Playwright comparará lo que ve en ngrok contra las capturas base generadas en el Paso 1.

```bash
# Apunta el test a tu entorno local (por defecto usa la URL de ngrok configurada en el script)
TEST_TARGET_URL=https://monkey-tight-lab.ngrok-free.app npx playwright test visual_tests/visual-regression.spec.js -c visual_tests/playwright.config.js
```

### Paso 3: Analizar Resultados
*   ✅ **Pass:** Si el test pasa, significa que tu versión local es visualmente idéntica a producción (dentro de la tolerancia configurada).
*   ❌ **Fail:** Si falla, Playwright generará un reporte HTML.
    *   Ejecuta: `npx playwright show-report visual-tests/visual-report`
    *   Verás un "slider" comparando la imagen de Producción vs Local, resaltando las diferencias en rojo.

## Notas Técnicas
*   **Elementos Dinámicos:** El test oculta automáticamente elementos como el contador del carrito (`.aa-header__cart-count`), popups y videos para evitar falsos positivos.
*   **Configuración:** Puedes ajustar la tolerancia de píxeles (`maxDiffPixels`) en `visual_tests/visual-regression.spec.js` si los tests son demasiado estrictos.
