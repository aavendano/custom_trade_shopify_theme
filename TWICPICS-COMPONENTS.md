# TwicPics Components Integration

## 🚀 Instalación Completada

Se ha instalado y configurado `@twicpics/components` v0.33.0 en el tema de Shopify.

## 📁 Archivos Creados/Modificados

```
├── build-twicpics.js                    # Script de construcción
├── assets/
│   ├── twicpics-components.js          # Bundle de componentes
│   └── twicpics-components.css         # Estilos para componentes
├── snippets/
│   └── twicpics-component.liquid       # Snippet para usar componentes
├── sections/
│   └── twicpics-demo.liquid           # Sección de demostración
└── layout/
    └── theme.liquid                    # Actualizado con scripts
```

## 🔧 Comandos Disponibles

```bash
# Construir componentes TwicPics
npm run build:twicpics

# Construir Tailwind CSS
npm run build:tailwind

# Construir Tailwind CSS optimizado
npm run build:tailwind:purged
```

## 💡 Uso de Componentes

### Snippet Principal: `twicpics-component.liquid`

```liquid
{% render 'twicpics-component',
  image: product.featured_image,
  component: 'twic-img',
  class: 'product-image',
  alt: product.title
%}
```

### Parámetros Disponibles

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `image` | Image | - | Imagen de Shopify |
| `component` | String | 'twic-img' | Tipo de componente |
| `class` | String | '' | Clases CSS |
| `eager` | Boolean | false | Carga inmediata |
| `focus` | String | 'auto' | Punto de enfoque |
| `mode` | String | 'cover' | Modo de ajuste |
| `ratio` | String | '1' | Relación de aspecto |
| `transform` | String | '' | Transformaciones |
| `alt` | String | '' | Texto alternativo |

## 🎯 Componentes Disponibles

### 1. `twic-img` - Imagen Optimizada

```liquid
{% render 'twicpics-component',
  image: product.featured_image,
  component: 'twic-img',
  class: 'tw-w-full tw-rounded-lg',
  ratio: '1',
  mode: 'cover',
  alt: product.title
%}
```

**Características:**
- Carga lazy automática
- Optimización de formato (WebP, AVIF)
- Responsive automático
- Placeholder mientras carga

### 2. `twic-picture` - Picture Responsivo

```liquid
{% render 'twicpics-component',
  image: collection.featured_image,
  component: 'twic-picture',
  class: 'hero-image',
  ratio: '16/9',
  eager: true,
  alt: collection.title
%}
```

**Características:**
- Múltiples breakpoints automáticos
- Formatos optimizados por dispositivo
- Art direction automática
- SEO optimizado

### 3. `twic-video` - Video Optimizado

```liquid
{% render 'twicpics-component',
  image: section.settings.video_url,
  component: 'twic-video',
  class: 'video-player',
  ratio: '16/9'
%}
```

**Características:**
- Poster automático
- Compresión adaptativa
- Controles nativos
- Streaming optimizado

## 🎨 Integración con Tailwind CSS

### Clases Predefinidas

```css
/* Contenedores responsivos */
.tw-twic-img twic-img { @apply tw-w-full tw-h-auto; }
.tw-twic-picture twic-picture { @apply tw-w-full tw-h-auto; }
.tw-twic-video twic-video { @apply tw-w-full tw-h-auto; }

/* Ratios comunes */
.twic-ratio-1-1 { padding-bottom: 100%; }
.twic-ratio-4-3 { padding-bottom: 75%; }
.twic-ratio-16-9 { padding-bottom: 56.25%; }
```

### Ejemplo con Tailwind

```liquid
<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
  {% for product in collection.products limit: 6 %}
    <div class="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
      {% render 'twicpics-component',
        image: product.featured_image,
        component: 'twic-img',
        class: 'tw-w-full tw-h-64 tw-object-cover',
        ratio: '4/3',
        alt: product.title
      %}
      <div class="tw-p-4">
        <h3 class="tw-font-semibold tw-text-lg">{{ product.title }}</h3>
        <p class="tw-text-gray-600">{{ product.price | money }}</p>
      </div>
    </div>
  {% endfor %}
</div>
```

## 🔄 Transformaciones Avanzadas

### Filtros y Efectos

```liquid
<!-- Blur y calidad -->
{% render 'twicpics-component',
  image: product.featured_image,
  transform: 'blur=5/quality=80',
  component: 'twic-img'
%}

<!-- Escala de grises -->
{% render 'twicpics-component',
  image: article.image,
  transform: 'grayscale',
  component: 'twic-img'
%}

<!-- Sharpen y contraste -->
{% render 'twicpics-component',
  image: collection.featured_image,
  transform: 'sharpen=medium/contrast=1.2',
  component: 'twic-img'
%}
```

### Focus Personalizado

```liquid
<!-- Diferentes puntos de enfoque -->
{% render 'twicpics-component',
  image: product.featured_image,
  focus: 'top-left',
  component: 'twic-img'
%}

{% render 'twicpics-component',
  image: product.featured_image,
  focus: 'center',
  component: 'twic-img'
%}

{% render 'twicpics-component',
  image: product.featured_image,
  focus: 'bottom-right',
  component: 'twic-img'
%}
```

## 📱 Casos de Uso Comunes

### 1. Galería de Productos

```liquid
<div class="product-gallery tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
  {% for image in product.images %}
    {% render 'twicpics-component',
      image: image,
      component: 'twic-img',
      class: 'tw-w-full tw-rounded-lg tw-cursor-pointer hover:tw-scale-105 tw-transition-transform',
      ratio: '1',
      alt: product.title
    %}
  {% endfor %}
</div>
```

### 2. Hero Banner

```liquid
<section class="hero-banner tw-relative tw-h-screen tw-flex tw-items-center tw-justify-center">
  {% render 'twicpics-component',
    image: section.settings.hero_image,
    component: 'twic-picture',
    class: 'tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover',
    eager: true,
    ratio: '16/9',
    alt: section.settings.hero_title
  %}
  <div class="tw-relative tw-z-10 tw-text-center tw-text-white">
    <h1 class="tw-text-5xl tw-font-bold">{{ section.settings.hero_title }}</h1>
  </div>
</section>
```

### 3. Blog Cards

```liquid
<div class="blog-grid tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
  {% for article in blog.articles %}
    <article class="blog-card tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
      {% render 'twicpics-component',
        image: article.image,
        component: 'twic-img',
        class: 'tw-w-full tw-h-48 tw-object-cover',
        ratio: '16/9',
        alt: article.title
      %}
      <div class="tw-p-6">
        <h2 class="tw-text-xl tw-font-semibold tw-mb-2">{{ article.title }}</h2>
        <p class="tw-text-gray-600">{{ article.excerpt | truncate: 120 }}</p>
      </div>
    </article>
  {% endfor %}
</div>
```

## ⚡ Optimización y Performance

### Carga Eager para Above-the-Fold

```liquid
<!-- Para imágenes visibles inmediatamente -->
{% render 'twicpics-component',
  image: section.settings.hero_image,
  component: 'twic-img',
  eager: true,
  alt: 'Hero image'
%}
```

### Lazy Loading Automático

```liquid
<!-- Para imágenes below-the-fold (default) -->
{% render 'twicpics-component',
  image: product.featured_image,
  component: 'twic-img',
  alt: product.title
%}
```

## 🚨 Notas Importantes

1. **Dominio Configurado**: `https://playlovetoys.twic.pics`
2. **Componentes Cargados**: Se cargan automáticamente en `theme.liquid`
3. **Fallback**: Si falla, muestra imagen regular
4. **SEO**: Mantiene todos los atributos necesarios
5. **Accesibilidad**: Preserva `alt` y otros atributos

## 🔧 Troubleshooting

### Problema: Componentes no se cargan
**Solución**: Verificar que `twicpics-components.js` esté en assets

### Problema: Imágenes no se optimizan
**Solución**: Verificar dominio TwicPics en la configuración

### Problema: Estilos no se aplican
**Solución**: Asegurar que `twicpics-components.css` esté incluido

## 📚 Recursos Adicionales

- [Documentación TwicPics](https://www.twicpics.com/docs)
- [Componentes Web](https://www.twicpics.com/docs/components)
- [Transformaciones](https://www.twicpics.com/docs/reference/transformations)