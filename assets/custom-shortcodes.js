
document.addEventListener('DOMContentLoaded', function () {
  const articles = document.querySelectorAll('article');

  articles.forEach(article => {
    let content = article.innerHTML;

    // Shortcode for collections
    content = content.replace(/@collection\("([^"]+)"\)/g, (match, handle) => {
      return `
        <div class="collection-carousel-container page-width">
          <shopify-list-context type="collection" handle="${handle}" first="10" query="collection.products">
            <template>
              <h2 class="collection__title title-wrapper-with-link title--primary">
                <shopify-data query="collection.title"></shopify-data>
              </h2>
              <div class="carousel-wrapper grid product-grid grid--2-col-tablet-down grid--3-col-desktop">
                <shopify-list-context type="product" query="collection.products" first="10">
                  <template>
                    <div class="carousel-slide grid__item">
                      <div class="card-wrapper product-card-wrapper underline-links-hover">
                        <div class="card card--standard card--media color-background-1 gradient">
                          <div class="card__inner">
                            <div class="card__media">
                              <shopify-media query="product.featuredImage" class="media media--transparent media--hover-effect"></shopify-media>
                            </div>
                            <div class="card__content">
                              <h3 class="card__heading h5">
                                <shopify-data query="product.title"></shopify-data>
                              </h3>
                              <div class="card-information">
                                <div class="price">
                                  <shopify-money query="product.priceRange.minVariantPrice"></shopify-money>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="card__content" style="padding: 2rem;">                            
                            <button class="button button--full-width" onclick="document.getElementById('cart').addLine(event)">Add to Cart</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </shopify-list-context>
              </div>
            </template>
          </shopify-list-context>
        </div>
      `;
    });

    // Shortcode for single products
    content = content.replace(/@product\("([^"]+)"\)/g, (match, handle) => {
      return `
<div class="in-article-product-layout">
  <div class="in-article-product-card">
    <!-- Set product you want to display -->
    <shopify-context type="product" handle="${handle}">
      <template>
        <div class="in-article-product-card__container">
          <div class="in-article-product-card__media">
            <div class="in-article-product-card__main-image">
              <shopify-media width="250" height="250" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
            </div>
          </div>
          <div class="in-article-product-card__details">
            <div class="in-article-product-card__info">
              <h2 class="in-article-product-card__vendor">
                <shopify-data query="product.vendor"></shopify-data>
              </h2>
              <h2 class="in-article-product-card__title">
                <shopify-data query="product.title"></shopify-data>
              </h2>
              <div class="in-article-product-card__price">
                <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
              </div>
            </div>
            <!-- Add View to Product Button -->
            <a shopify-attr--href="product.onlineStoreUrl" class="in-article-product__link" target="_blank">
              <div class="in-article-product-card__product-link">View product</div>
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
