
document.addEventListener('DOMContentLoaded', function () {
  const articles = document.querySelectorAll('article');

  articles.forEach(article => {
    let content = article.innerHTML;

    // Shortcode for collections
    content = content.replace(/@collection\("([^"]+)"\)/g, (match, handle) => {
      return `
        <div class="collection-carousel-container page-width">
          <shopify-list-context type="collection" handle="${handle}">
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
<div class="featured-product product product--medium grid grid--1-col grid--2-col-tablet">
  <shopify-context type="product" handle="${handle}">
    <template>
      <div class="grid__item product__media-wrapper">
        <shopify-media query="product.featuredImage" class="product-media-container global-media-settings gradient"></shopify-media>
      </div>
      <div class="product__info-wrapper grid__item">
        <div id="ProductInfo-${handle}" class="product__info-container">
          <h2 class="product__title h3">
            <shopify-data query="product.vendor"></shopify-data>
          </h2>
          <h2 class="product__title h2">
            <shopify-data query="product.title"></shopify-data>
          </h2>
          <div class="price price--large">
            <div class="price__container">
              <div class="price-item price-item--regular">
                <shopify-money query="product.priceRange.minVariantPrice"></shopify-money>
              </div>
            </div>
          </div>
          
          <shopify-product-form>
            <form action="/cart/add" method="post" enctype="multipart/form-data">
              <shopify-variant-selector hidden="product.variants.length === 1"></shopify-variant-selector>
              
              <!-- Input oculto para el ID de la variante -->
              <input type="hidden" name="id" query="product.selectedOrFirstAvailableVariant.id">
              
              <br>
              <div class="product-form__buttons">
                <button type="submit" 
                        name="add" 
                        class="product-form__submit button button--full-width button--secondary"
                        disabled="product.selectedOrFirstAvailableVariant.available === false">
                  <span query="product.selectedOrFirstAvailableVariant.available ? 'Add to Cart' : 'Sold Out'"></span>
                </button>
                <shopify-buy-buttons></shopify-buy-buttons>
              </div>
            </form>
          </shopify-product-form>
        </div>
      </div>
    </template>
  </shopify-context>
</div>

      `;
    });

    article.innerHTML = content;
  });
});
