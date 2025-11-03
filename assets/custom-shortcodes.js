
document.addEventListener('DOMContentLoaded', function () {
  const articles = document.querySelectorAll('article');

  articles.forEach(article => {
    let content = article.innerHTML;

    // Shortcode for collections
    content = content.replace(/@collection\("([^"]+)"\)/g, (match, handle) => {
      return `
        <div class="shortcode-collection-carousel-container">
    <shopify-context type="collection" handle="${handle}">
        <template>
            <div class="shortcode-carousel-wrapper">
                <shopify-context type="collection" handle="${handle}">
                    <template>
                        <div class="shortcode-collection">
                            <div class="shortcode-product-grid keen-slider" id="my-keen-slider">
                                <!-- Define a new context for the products within the collection -->
                                <shopify-list-context type="product" query="collection.products" first="3">
                                    <!-- This template is repeated for each product in the collection -->
                                    <template>
                                        <button shopify-attr--disabled="!product.availableForSale" class="product-card"
                                            onclick="getElementById('product-modal').showModal(); getElementById('product-modal-context').update(event);">
                                            <div class="product-card__image-container">
                                                <shopify-media max-images="1" width="280" height="280"
                                                    query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                                            </div>
                                            <div class="product-card__details">
                                                <div class="product-card__info">
                                                <h2 class="shortcode-product-card__vendor">
                                                    <shopify-data
                                                        query="product.selectedOrFirstAvailableVariant.product.vendor"></shopify-data>
                                                </h2>
                                                    <h3 class="shortcode-product-card__title">
                                                        <span>
                                                            <!-- This span makes the entire card clickable -->
                                                            <span aria-hidden="true" class="product-card__link"></span>
                                                            <shopify-data query="product.title"></shopify-data>
                                                        </span>
                                                    </h3>
                                                    <p class="shortcode-product-card__price">
                                                        <shopify-money
                                                            query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </template>
                                </shopify-list-context>
                            </div>
                        </div>
                        <shopify-cart id="cart"></shopify-cart>
                    </template>
                </shopify-context>
            </div>
        </template>
    </shopify-context>
</div>
      `;
    });

    // Shortcode for single products
    content = content.replace(/@product\("([^"]+)"\)/g, (match, handle) => {
      return `
<div class="shortcode-product-layout">
  <div class="shortcode-product-card">
    <!-- Set product you want to display -->
    <shopify-context type="product" handle="${handle}">
      <template>
        <div class="shortcode-product-card__container">
          <div class="shortcode-product-card__media">
            <div class="shortcode-product-card__main-image">
              <shopify-media width="250" height="250" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
            </div>
          </div>
          <div class="shortcode-product-card__details">
            <div class="shortcode-product-card__info">
            <h2 class="shortcode-product-card__vendor">
              <shopify-data query="product.vendor"></shopify-data>
            </h2>
            <h2 class="shortcode-product-card__title">
            <shopify-data query="product.title"></shopify-data>
            </h2>
            <div class="shortcode-product-card__price">
            <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
            </div>
            </div>
            <!-- Add View to Product Button -->
            <a shopify-attr--href="product.onlineStoreUrl" class="shortcode-product__link" target="_blank">
              <div class="shortcode-product-card__product-link">View product</div>
            </a>
          </div>
        </div>
      </template>
    </shopify-context>
  </div>
</div>

      `;
    });

    article.innerHTML = content;
  });
});

function getCollectionProducts(collectionHandle) {
  return fetch(`/collections/${collectionHandle}/products.json?limit=12`)
    .then(response => response.json())
    .then(data => {
      return data.products;
    })
    .catch(error => {
      console.error('Error fetching collection products:', error);
      return [];
    });
}

document.addEventListener('alpine:init', () => {
        Alpine.data('carrusel', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            }
        }))
    })