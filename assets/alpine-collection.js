document.addEventListener('alpine:init', () => {
    Alpine.data('collectionHandler', () => ({
        loading: false,

        init() {
            // Listen for popstate (browser back/forward)
            window.addEventListener('popstate', (event) => {
                if(event.state) {
                    this.fetchSection(window.location.search);
                }
            });

            // Listen for custom events dispatched from facets
            this.$el.addEventListener('filter-updated', (e) => {
                this.updateURL(e.detail.searchParams);
            });
        },

        async fetchSection(queryString) {
            this.loading = true;
            const sectionId = this.$el.dataset.sectionId;
            // Append section_id to the query string
            const url = `${window.location.pathname}${queryString}${queryString.includes('?') ? '&' : '?'}section_id=${sectionId}`;

            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const html = parser.parseFromString(text, 'text/html');

                // 1. Update Product Grid
                const newGrid = html.querySelector('#product-grid');
                const currentGrid = document.getElementById('product-grid');
                if (newGrid && currentGrid) {
                    currentGrid.innerHTML = newGrid.innerHTML;
                }

                // 2. Update Facets (Counts update)
                const newFacets = html.querySelector('#facets-wrapper');
                const currentFacets = document.getElementById('facets-wrapper');
                if (newFacets && currentFacets) {
                    currentFacets.innerHTML = newFacets.innerHTML;
                }

                // Re-initialize any new Alpine components in the injected HTML if necessary
                // Alpine usually handles this automatically if x-data is on the elements,
                // but since we are replacing innerHTML, the new elements are fresh.

            } catch (error) {
                console.error('Error fetching collection:', error);
            } finally {
                this.loading = false;
            }
        },

        updateURL(queryString) {
            const url = `${window.location.pathname}${queryString}`;
            window.history.pushState({ path: url }, '', url);
            this.fetchSection(queryString);
        }
    }));
});
