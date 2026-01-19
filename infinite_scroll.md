

Te ayudo a implementar infinite scrolling con Alpine.js. Aquí está el enfoque paso a paso:

Implementación básica
Necesitarás crear un componente Alpine.js que:

Detecte cuando el usuario llega al final de la página usando Intersection Observer
Cargue más productos mediante la Section Rendering API de Shopify
Añada los nuevos productos al DOM sin recargar la página
Código de ejemplo
// Añade esto a tu archivo theme.js o assets/alpine-infinite-scroll.js

document.addEventListener('alpine:init', () => {
  Alpine.data('infiniteScroll', () => ({
    loading: false,
    hasMore: true,
    currentPage: 1,
    
    init() {
      // Configurar Intersection Observer
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.loading && this.hasMore) {
          this.loadMore();
        }
      }, { threshold: 0.1 });
      
      // Observar el elemento trigger
      const trigger = this.$refs.trigger;
      if (trigger) observer.observe(trigger);
    },
    
    async loadMore() {
      this.loading = true;
      this.currentPage++;
      
      try {
        const url = `${window.location.pathname}?page=${this.currentPage}&section_id=product-grid`;
        const response = await fetch(url);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newProducts = doc.querySelector('.product-grid');
        
        if (newProducts && newProducts.children.length > 0) {
          this.$refs.container.insertAdjacentHTML('beforeend', newProducts.innerHTML);
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        this.loading = false;
      }
    }
  }));
});
Markup Liquid
<div x-data="infiniteScroll" class="collection-products">
  <div x-ref="container" class="product-grid">
    {% for product in collection.products %}
      <!-- Tu card de producto aquí -->
    {% endfor %}
  </div>
  
  <!-- Trigger para infinite scroll -->
  <div x-ref="trigger" class="infinite-scroll-trigger"></div>
  
  <!-- Loading indicator -->
  <div x-show="loading" class="loading-spinner">
    Cargando más productos...
  </div>
  
  <!-- Mensaje cuando no hay más productos -->
  <div x-show="!hasMore && !loading" class="no-more-products">
    No hay más productos
  </div>
</div>
Consideraciones importantes
Ajusta el section_id según el nombre de tu sección de productos
Modifica el selector .product-grid para que coincida con tu estructura HTML
Asegúrate de tener Alpine.js cargado en tu tema
Prueba en un tema duplicado antes de aplicar a producción
¿Necesitas ayuda para adaptarlo a tu estructura específica de tema o quieres que te muestre cómo integrarlo con tu configuración actual?



¿Podrías mostrarme cómo integrar este componente con mi sistema de SEO para optimizar los metaheads de cada producto?
Para integrar el infinite scrolling con SEO y optimizar los metaheads, necesitas un enfoque que maneje correctamente la indexación y la experiencia del usuario. Aquí te muestro cómo:

Estrategia SEO para Infinite Scroll
1. Implementar paginación canónica
<!-- En tu template de colección -->
<head>
  {%- if collection.products.size > 0 -%}
    {%- assign current_page = current_page | default: 1 -%}
    
    {%- comment -%} Canonical URL {%- endcomment -%}
    {%- if current_page == 1 -%}
      <link rel="canonical" href="{{ collection.url }}">
    {%- else -%}
      <link rel="canonical" href="{{ collection.url }}?page={{ current_page }}">
    {%- endif -%}
    
    {%- comment -%} Prev/Next para paginación {%- endcomment -%}
    {%- if current_page > 1 -%}
      {%- if current_page == 2 -%}
        <link rel="prev" href="{{ collection.url }}">
      {%- else -%}
        <link rel="prev" href="{{ collection.url }}?page={{ current_page | minus: 1 }}">
      {%- endif -%}
    {%- endif -%}
    
    {%- if paginate.next -%}
      <link rel="next" href="{{ collection.url }}?page={{ current_page | plus: 1 }}">
    {%- endif -%}
  {%- endif -%}
</head>
2. Actualizar dinámicamente los meta tags con Alpine
document.addEventListener('alpine:init', () => {
  Alpine.data('infiniteScrollSEO', () => ({
    loading: false,
    hasMore: true,
    currentPage: 1,
    baseUrl: window.location.pathname,
    
    init() {
      // Configurar estado inicial desde URL
      const urlParams = new URLSearchParams(window.location.search);
      this.currentPage = parseInt(urlParams.get('page')) || 1;
      
      // Intersection Observer
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.loading && this.hasMore) {
          this.loadMore();
        }
      }, { threshold: 0.1 });
      
      const trigger = this.$refs.trigger;
      if (trigger) observer.observe(trigger);
    },
    
    async loadMore() {
      this.loading = true;
      this.currentPage++;
      
      try {
        const url = `${this.baseUrl}?page=${this.currentPage}&section_id=product-grid`;
        const response = await fetch(url);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newProducts = doc.querySelector('.product-grid');
        
        if (newProducts && newProducts.children.length > 0) {
          this.$refs.container.insertAdjacentHTML('beforeend', newProducts.innerHTML);
          
          // Actualizar URL y meta tags
          this.updateSEOMetadata();
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    updateSEOMetadata() {
      // Actualizar URL sin recargar (pushState)
      const newUrl = `${this.baseUrl}?page=${this.currentPage}`;
      window.history.pushState({ page: this.currentPage }, '', newUrl);
      
      // Actualizar canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.href = window.location.href;
      }
      
      // Actualizar prev/next
      this.updatePrevNextLinks();
      
      // Actualizar title dinámicamente
      const baseTitle = document.title.split(' - Página')[0];
      document.title = `${baseTitle} - Página ${this.currentPage}`;
    },
    
    updatePrevNextLinks() {
      // Remover links existentes
      document.querySelectorAll('link[rel="prev"], link[rel="next"]').forEach(el => el.remove());
      
      const head = document.head;
      
      // Agregar rel="prev"
      if (this.currentPage > 1) {
        const prevLink = document.createElement('link');
        prevLink.rel = 'prev';
        prevLink.href = this.currentPage === 2 
          ? this.baseUrl 
          : `${this.baseUrl}?page=${this.currentPage - 1}`;
        head.appendChild(prevLink);
      }
      
      // Agregar rel="next" (asumiendo que hay más)
      if (this.hasMore) {
        const nextLink = document.createElement('link');
        nextLink.rel = 'next';
        nextLink.href = `${this.baseUrl}?page=${this.currentPage + 1}`;
        head.appendChild(nextLink);
      }
    }
  }));
});
3. Structured Data para productos (JSON-LD)
{%- comment -%} En tu product-card snippet {%- endcomment -%}
<div class="product-card" itemscope itemtype="https://schema.org/Product">
  <meta itemprop="name" content="{{ product.title | escape }}">
  <meta itemprop="url" content="{{ product.url | within: collection }}">
  <meta itemprop="image" content="{{ product.featured_image | image_url: width: 1200 }}">
  
  {%- if product.selected_or_first_available_variant.sku != blank -%}
    <meta itemprop="sku" content="{{ product.selected_or_first_available_variant.sku }}">
  {%- endif -%}
  
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <meta itemprop="price" content="{{ product.price | money_without_currency | remove: ',' }}">
    <meta itemprop="priceCurrency" content="{{ cart.currency.iso_code }}">
    <link itemprop="availability" href="https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}">
  </div>
  
  {%- comment -%} Tu markup visual aquí {%- endcomment -%}
</div>
4. Optimización de metafields para SEO
// Extender el componente para cargar metafields SEO
async loadMore() {
  this.loading = true;
  this.currentPage++;
  
  try {
    // Cargar productos con metafields
    const url = `${this.baseUrl}?page=${this.currentPage}&section_id=product-grid&view=ajax`;
    const response = await fetch(url);
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newProducts = doc.querySelector('.product-grid');
    
    if (newProducts && newProducts.children.length > 0) {
      this.$refs.container.insertAdjacentHTML('beforeend', newProducts.innerHTML);
      
      // Cargar metafields SEO de productos nuevos
      await this.loadProductMetafields(doc);
      
      this.updateSEOMetadata();
    } else {
      this.hasMore = false;
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    this.loading = false;
  }
},

async loadProductMetafields(doc) {
  // Extraer product IDs de los nuevos productos
  const productCards = doc.querySelectorAll('[data-product-id]');
  const productIds = Array.from(productCards).map(card => card.dataset.productId);
  
  // Aquí podrías hacer una llamada a tu API para obtener metafields
  // o ya incluirlos en el HTML renderizado desde Liquid
}
5. Template Liquid optimizado
{%- comment -%} sections/collection-template.liquid {%- endcomment -%}
<div x-data="infiniteScrollSEO" class="collection-wrapper">
  
  {%- comment -%} SEO Headers {%- endcomment -%}
  <header class="collection-header">
    <h1>{{ collection.title }}</h1>
    {%- if collection.description != blank -%}
      <div class="collection-description rte">
        {{ collection.description }}
      </div>
    {%- endif -%}
  </header>
  
  {%- comment -%} Product Grid {%- endcomment -%}
  <div x-ref="container" class="product-grid" id="product-grid-{{ section.id }}">
    {%- for product in collection.products -%}
      {%- render 'product-card-seo', 
          product: product, 
          collection: collection,
          loading: 'lazy',
          fetchpriority: forloop.index <= 4 ? 'high' : 'auto'
      -%}
    {%- endfor -%}
  </div>
  
  {%- comment -%} Infinite Scroll Trigger {%- endcomment -%}
  <div x-ref="trigger" class="infinite-scroll-trigger" style="height: 1px;"></div>
  
  {%- comment -%} Loading State {%- endcomment -%}
  <div x-show="loading" x-cloak class="loading-state">
    <div class="spinner" role="status" aria-live="polite">
      <span class="sr-only">Cargando más productos...</span>
    </div>
  </div>
  
  {%- comment -%} Fallback: Paginación tradicional para SEO {%- endcomment -%}
  <noscript>
    {%- if paginate.pages > 1 -%}
      <nav class="pagination" role="navigation" aria-label="Paginación">
        {%- if paginate.previous -%}
          <a href="{{ paginate.previous.url }}" rel="prev">← Anterior</a>
        {%- endif -%}
        
        <span>Página {{ paginate.current_page }} de {{ paginate.pages }}</span>
        
        {%- if paginate.next -%}
          <a href="{{ paginate.next.url }}" rel="next">Siguiente →</a>
        {%- endif -%}
      </nav>
    {%- endif -%}
  </noscript>
  
</div>
6. Mejores prácticas adicionales
// Agregar al componente Alpine
init() {
  // ... código existente ...
  
  // Manejar botón "atrás" del navegador
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
      this.currentPage = event.state.page;
      // Opcionalmente recargar contenido
    }
  });
  
  // Lazy loading de imágenes
  this.setupLazyLoading();
},

setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    this.$refs.container.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}
Puntos clave para SEO:
URLs indexables
Cada página tiene su propia URL con ?page=X
Canonical tags
Evitan contenido duplicado
Prev/Next links
Ayudan a Google a entender la paginación
Structured data
Mejora la visibilidad en resultados de búsqueda
Fallback <noscript>
Asegura accesibilidad para crawlers sin JS
History API
Permite navegación con botones del navegador
¿Quieres que te ayude a implementar alguna parte específica o necesitas integrarlo con metafields personalizados de tus productos?