  (function() {
    class BlogLayout{{ ai_gen_id }} extends HTMLElement {
      constructor() {
        super();
        this.currentlyVisible = 10;
        this.articlesPerLoad = 10;
      }

      connectedCallback() {
        this.loadMoreBtn = this.querySelector('[data-load-more]');
        this.articlesContainer = this.querySelector('[data-articles-container]');
        this.articles = this.querySelectorAll('[data-article-item]');

        if (this.loadMoreBtn) {
          this.loadMoreBtn.addEventListener('click', this.loadMoreArticles.bind(this));
          this.updateLoadMoreButton();
        }
      }

      loadMoreArticles() {
        const hiddenArticles = Array.from(this.articles).slice(this.currentlyVisible, this.currentlyVisible + this.articlesPerLoad);

        hiddenArticles.forEach(article => {
          article.style.display = 'flex';
        });

        this.currentlyVisible += this.articlesPerLoad;
        this.updateLoadMoreButton();
      }

      updateLoadMoreButton() {
        if (this.currentlyVisible >= this.articles.length) {
          this.loadMoreBtn.style.display = 'none';
        }
      }
    }

    customElements.define('blog-layout-{{ ai_gen_id }}', BlogLayout{{ ai_gen_id }});
  })();
