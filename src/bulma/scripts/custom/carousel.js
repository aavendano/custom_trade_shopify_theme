export default function (Alpine) {
    Alpine.data('bCarousel', (options = {}) => ({
        // Estado
        current: 0,
        total: 0,

        // Opciones (con defaults)
        loop: options.loop ?? true,

        init() {
            // Contar items al inicio
            this.total = this.$refs.track
                ? this.$refs.track.querySelectorAll('.b-carousel-item').length
                : 0;

            // Recalcular por si se inyectan bloques dinámicos
            this.$nextTick(() => {
                this.total = this.$refs.track
                    ? this.$refs.track.querySelectorAll('.b-carousel-item').length
                    : 0;
            });
        },

        next() {
            if (this.total === 0) return;

            if (this.current < this.total - 1) {
                this.current++;
            } else if (this.loop) {
                this.current = 0;
            }

            this.scrollToCurrent();
        },

        prev() {
            if (this.total === 0) return;

            if (this.current > 0) {
                this.current--;
            } else if (this.loop) {
                this.current = this.total - 1;
            }

            this.scrollToCurrent();
        },

        goTo(index) {
            if (index < 0 || index >= this.total) return;
            this.current = index;
            this.scrollToCurrent();
        },

        scrollToCurrent() {
            // Todos los items del carrusel
            const items = this.$refs.track.querySelectorAll('.b-carousel-item');
            const el = items[this.current];

            if (el) {
                // Respeta el scroll-snap, no calculamos ancho a mano
                el.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'start',
                    block: 'nearest'
                });
            }
        },

        isActive(index) {
            return this.current === index;
        }
    }));
}
