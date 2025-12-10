// Example of an Alpine.js component module
// This ensures the component is registered when imported

const registerComponent = () => {
    if (window.Alpine) {
        // Check if already registered to avoid errors during HMR
        // Alpine doesn't have a public API to check registered components easily, 
        // but re-registering usually warns or overwrites.

        window.Alpine.data('cardHorizontal', () => ({
            active: false,
            label: 'Inactive',

            toggle() {
                this.active = !this.active;
                this.label = this.active ? 'Active' : 'Inactive';
                console.log('Card toggled:', this.active);
            }
        }));
    } else {
        console.warn('Alpine not found on window');
    }
};

// Try to register immediately
registerComponent();

// Also listen for alpine:init just in case (though in Storybook it might be too late)
document.addEventListener('alpine:init', registerComponent);
