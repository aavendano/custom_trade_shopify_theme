# Custom Trade Shopify Theme

This repository contains the source code for the Custom Trade Shopify theme.

## Development

### Running the Test Suite

This project includes a suite of unit and integration tests. To run the tests, use the following command:

```bash
npm test
```

### Visual Regression Testing

This project uses Playwright for visual regression testing. This allows you to capture screenshots of key pages and compare them against a baseline to detect unintended visual changes.

**Setup**

1.  Install the necessary dependencies:

    ```bash
    npm install @playwright/test
    npx playwright install
    ```

**Generating Baseline Screenshots**

1.  Before you can run the tests, you need to generate the baseline screenshots. Run the following command:

    ```bash
    npx playwright test --update-snapshots
    ```

    This will run the tests, and since there are no baseline images to compare against, it will create them in the `tests/visual` directory.

**Running the Tests**

1.  Once the baseline screenshots have been generated, you can run the tests at any time to compare the current version of the site against the baseline:

    ```bash
    npx playwright test
    ```

    If there are any visual differences greater than 1%, the tests will fail, and you will be able to see the differences in the generated test report.

## Comandos clave (Gulp & build)

Aquí tienes los comandos que usarás con más frecuencia para construir y desarrollar el tema.

- Instalar dependencias (raíz del repo):

```bash
npm install
```

- Instalar la dependencia de depuración (opcional, mejora la salida de `gulp`):

```bash
npm install --save-dev gulp-debug
```

- Build completo (genera CSS crítico y asíncrono, PurgeCSS se aplica según entorno/configuración):

```bash
npx gulp build
```

- Ejecutar en modo watcher (recompila al guardar):

```bash
npx gulp watch
```

- Forzar purga de CSS localmente (ignora NODE_ENV):

```bash
BULMA_FORCE_PURGE=1 npx gulp build
```

- Forzar entorno production (activa purga según configuración):

```bash
NODE_ENV=production npx gulp build
```

- Desactivar purga explícitamente:

```bash
BULMA_DISABLE_NAMESPACE_PURGE=1 npx gulp build
```

- Ejecutar sólo la tarea de CSS crítico o async (si están exportadas como tareas separadas):

```bash
npx gulp critical
npx gulp async
```

- Ajuste de límite para inlining del CSS crítico (en bytes). Por defecto el gulpfile usa 220KB:

```bash
BULMA_INLINE_LIMIT=225280 npx gulp build
```

Notas rápidas
- El `gulpfile.js` incluye un fallback seguro para `gulp-debug` (no falla si no está instalado). Aun así recomendamos instalarlo para ver logs de depuración.
- PurgeCSS escanea ficheros Liquid/JS/TS del tema — si tienes clases dinámicas asegúrate de añadirlas a la safelist dentro del `gulpfile.js`.
