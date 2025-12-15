import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import intersect from '@alpinejs/intersect'
import ajax from '@imacrayon/alpine-ajax'
import carousel from './bulma/scripts/custom/carousel.js'

// Registrar plugins
Alpine.plugin(collapse)
Alpine.plugin(intersect)
Alpine.plugin(ajax)
Alpine.plugin(carousel);

Alpine.data('priceRange', () => ({
    min: 0,
    max: 0,
    init() {
        console.log('Price range initialized');
    }
}))

// Exponer Alpine global (Shopify lo necesita en window)
window.Alpine = Alpine

// Iniciar
Alpine.start()
