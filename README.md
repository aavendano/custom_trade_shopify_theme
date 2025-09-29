# Tailwind CSS Configuration

## 🚀 Setup

Tailwind CSS v4.1.13 configurado con prefijo `tw-` para evitar conflictos con las clases existentes del tema.

## 📁 Archivos

```
├── tailwind.config.js          # Configuración con prefijo tw-
├── build-tailwind.js           # Script compilación completa
├── build-tailwind-purged.js    # Script compilación purged
└── assets/
    ├── tailwind-output.css     # CSS compilado
    └── tailwind-input.css      # Archivo fuente (no usado)
```

## 🔧 Comandos

```bash
# CSS completo (~3MB - todas las clases)
npm run build:tailwind

# CSS purged (solo clases en uso)
npm run build:tailwind:purged
```

## 💡 Uso

### Clases con Prefijo `tw-`

```liquid
<!-- Flexbox -->
<div class="tw-flex tw-items-center tw-justify-between">
  <h2 class="tw-text-xl tw-font-bold">Título</h2>
  <button class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded">
    Botón
  </button>
</div>

<!-- Grid -->
<div class="tw-grid tw-grid-cols-3 tw-gap-4">
  <div class="tw-p-4 tw-bg-gray-100">Item 1</div>
  <div class="tw-p-4 tw-bg-gray-100">Item 2</div>
  <div class="tw-p-4 tw-bg-gray-100">Item 3</div>
</div>

<!-- Responsive -->
<div class="tw-text-sm md:tw-text-lg lg:tw-text-xl">
  Texto responsive
</div>
```

### Coexistencia con Clases del Tema

```liquid
<!-- Mezclar clases del tema con Tailwind -->
<div class="grid page-width tw-gap-4">
  <div class="grid__item tw-flex tw-items-center">
    <button class="button button--primary tw-mr-4">
      Botón del tema
    </button>
    <span class="tw-text-gray-600">Con Tailwind</span>
  </div>
</div>
```

## 🎯 Clases Disponibles

### Display
- `tw-block`, `tw-flex`, `tw-grid`, `tw-hidden`
- `tw-inline`, `tw-inline-block`, `tw-inline-flex`

### Flexbox
- `tw-flex-col`, `tw-flex-row`
- `tw-items-center`, `tw-items-start`, `tw-items-end`
- `tw-justify-center`, `tw-justify-between`, `tw-justify-around`

### Spacing
- `tw-p-{0-8}`, `tw-px-{0-6}`, `tw-py-{0-4}`
- `tw-m-{0-4}`, `tw-mx-auto`, `tw-my-4`

### Typography
- `tw-text-{sm,base,lg,xl,2xl}`
- `tw-font-{normal,medium,semibold,bold}`
- `tw-text-{left,center,right}`

### Colors
- `tw-text-{white,black,gray-500,blue-500,red-500}`
- `tw-bg-{white,black,gray-100,blue-500,red-500}`

### Responsive
- `sm:tw-*` (640px+)
- `md:tw-*` (768px+)
- `lg:tw-*` (1024px+)

## ⚡ Optimización

### Desarrollo
```bash
npm run build:tailwind
```
- CSS completo para desarrollo
- Todas las clases disponibles

### Producción
```bash
npm run build:tailwind:purged
```
- Solo clases en uso
- CSS mínimo optimizado
- Escanea archivos `.liquid`

## 🔄 Workflow

1. **Desarrollar** con `npm run build:tailwind`
2. **Usar clases** `tw-*` en templates
3. **Compilar para producción** con `npm run build:tailwind:purged`
4. **Verificar** que el CSS se incluye en `layout/theme.liquid`

## 🚨 Importante

- **Siempre usar prefijo** `tw-` para clases Tailwind
- **No modificar** `assets/tailwind-output.css` manualmente
- **Recompilar** después de cambios en templates
- **Usar purged** para producción

## 🖼️ TwicPics Components

### Instalación Completada ✅

```bash
npm install @twicpics/components
npm run build:twicpics
```

### Uso Básico

```liquid
{% render 'twicpics-component',
  image: product.featured_image,
  component: 'twic-img',
  class: 'tw-w-full tw-rounded-lg',
  alt: product.title
%}
```

### Componentes Disponibles

- `twic-img` - Imagen optimizada
- `twic-picture` - Picture responsivo  
- `twic-video` - Video optimizado

### Documentación Completa

Ver [TWICPICS-COMPONENTS.md](./TWICPICS-COMPONENTS.md) para documentación detallada.

## 📝 Ejemplo Completo

```liquid
<!-- sections/hero-banner.liquid -->
<section class="tw-bg-gray-100 tw-py-16">
  <div class="page-width tw-mx-auto">
    <div class="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-8">
      <div class="tw-flex-1">
        <h1 class="tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-4">
          {{ section.settings.title }}
        </h1>
        <p class="tw-text-lg tw-text-gray-600 tw-mb-6">
          {{ section.settings.description }}
        </p>
        <a href="{{ section.settings.button_url }}" 
           class="button button--primary tw-inline-block">
          {{ section.settings.button_text }}
        </a>
      </div>
      <div class="tw-flex-1">
        <img src="{{ section.settings.image | image_url }}" 
             class="tw-w-full tw-h-auto tw-rounded-lg">
      </div>
    </div>
  </div>
</section>
```
