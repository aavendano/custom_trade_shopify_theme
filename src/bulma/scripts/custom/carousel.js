export default function (Alpine) {
    Alpine.data('carousel', (data = {
        slides: [],
        intervalTime: 0,
    },) => ({
        slidesSelector: data.slides,
        slides: [],
        autoplayIntervalTime: data.intervalTime,
        isPaused: false,
        autoplayInterval: null,
        currentSlideIndex: 0,
        touchStartX: null,
        touchEndX: null,
        swipeThreshold: 50,

        get currentSlide() {
            return this.slides[this.currentSlideIndex] || {};
        },

        init() {
            // Si slidesSelector es un string (selector CSS), hacer querySelectorAll
            if (typeof this.slidesSelector === 'string') {
                this.slides = Array.from(document.querySelectorAll(this.slidesSelector));
            } else if (Array.isArray(this.slidesSelector)) {
                this.slides = this.slidesSelector;
            }

            console.log('Carousel init - slides:', this.slides.length);

            // Configurar IntersectionObserver para pausar/reanudar autoplay según visibilidad
            if (this.autoplayIntervalTime > 0) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        console.log('Carousel visibility:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
                        if (entry.isIntersecting) {
                            // El carousel es visible - iniciar/reanudar autoplay
                            if (!this.autoplayInterval) {
                                console.log('Starting autoplay - carousel visible');
                                this.isPaused = false;
                                this.autoplay();
                            }
                        } else {
                            // El carousel no es visible - pausar autoplay
                            console.log('Pausing autoplay - carousel not visible');
                            this.pause();
                        }
                    });
                }, { threshold: 0.1 }); // 10% visible para activar

                // Observar el elemento del carousel (this.$el es el elemento con x-data)
                observer.observe(this.$el);
            }
        },

        previous() {
            if (this.currentSlideIndex > 0) {
                this.currentSlideIndex = this.currentSlideIndex - 1
            } else {
                // If it's the first slide, go to the last slide
                this.currentSlideIndex = this.slides.length - 1
            }
            this.scrollToSlide();
        },
        next() {
            if (this.currentSlideIndex < this.slides.length - 1) {
                this.currentSlideIndex = this.currentSlideIndex + 1
            } else {
                // If it's the last slide, go to the first slide
                this.currentSlideIndex = 0
            }
            this.scrollToSlide();
        },
        scrollToSlide() {
            const slide = this.slides[this.currentSlideIndex];
            if (slide) {
                slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            }
        },
        handleTouchStart(event) {
            this.pause();
            this.touchStartX = event.touches[0].clientX
        },
        handleTouchMove(event) {
            this.touchEndX = event.touches[0].clientX
        },
        handleTouchEnd() {
            if (this.touchEndX) {
                if (this.touchStartX - this.touchEndX > this.swipeThreshold) {
                    this.next()
                }
                if (this.touchStartX - this.touchEndX < -this.swipeThreshold) {
                    this.previous()
                }
                this.touchStartX = null
                this.touchEndX = null
            }
            this.resume();
            console.log('Autoplay resumed');
        },

        autoplay() {
            this.autoplayInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.next()
                }
            }, this.autoplayIntervalTime);
            console.log('Autoplay started with interval time:', this.autoplayIntervalTime)
        },
        // Updates interval time
        setAutoplayIntervalTime(newIntervalTime) {
            clearInterval(this.autoplayInterval)
            this.autoplayIntervalTime = newIntervalTime
            this.autoplay()
        },
        pause() {
            this.isPaused = true
            clearInterval(this.autoplayInterval)
            this.autoplayInterval = null
        },
        resume() {
            this.isPaused = false
            this.autoplay()
        },
    }))
}
