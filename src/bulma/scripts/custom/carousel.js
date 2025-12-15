export default function (Alpine) {
    Alpine.data('carousel', (data = {
        slides: [],
        intervalTime: 0,
    },) => ({
        slides: data.slides,
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
            console.log('Alpine init');
            console.log('Current index:', this.currentSlideIndex);
            console.log('Current slide:', this.currentSlide);
        },

        previous() {
            if (this.currentSlideIndex > 0) {
                this.currentSlideIndex = this.currentSlideIndex - 1
            } else {
                // If it's the first slide, go to the last slide           
                this.currentSlideIndex = this.slides.length - 1
            }
        },
        next() {
            if (this.currentSlideIndex < this.slides.length - 1) {
                this.currentSlideIndex = this.currentSlideIndex + 1
            } else {
                // If it's the last slide, go to the first slide    
                this.currentSlideIndex = 0
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
        },
        resume() {
            this.isPaused = false
            this.autoplay()
        },
    }))
}

