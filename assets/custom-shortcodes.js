console.log('Depurando shortcodes: El script se inició.'); // <-- AÑADE ESTA LÍNEA

document.addEventListener('DOMContentLoaded', () => {
    console.log('Depurando shortcodes: DOM cargado.'); // <-- AÑADE ESTA LÍNEA TAMBIÉN
    // ... el resto del código ...
});

document.addEventListener('DOMContentLoaded', () => {
  const articleContent = document.querySelector('article');

  if (articleContent && window.allProducts) {
    // Regex to capture content between double brackets, e.g., [[some-product-handle]]
    const shortcodeRegex = /\[\[(.+?)\]\]/g;

    articleContent.innerHTML = articleContent.innerHTML.replace(shortcodeRegex, (match, capturedContent) => {
      
      // --- CAMBIO 2: Limpiar el handle de cualquier etiqueta HTML y espacios en blanco ---
      const handle = capturedContent.replace(/<[^>]+>|\s/g, '');
      
      const productData = window.allProducts[handle];

      if (productData) {
        const productCardHTML = `
          <div class="embedded-product">
            <a href="${productData.url}" class="embedded-product__image-link">
              <img src="${productData.image}" alt="${productData.title}" class="embedded-product__image">
            </a>
            <div class="embedded-product__info">
              <h3 class="embedded-product__title">
                <a href="${productData.url}">${productData.title}</a>
              </h3>
              <p class="embedded-product__price">${productData.price}</p>
              <a href="${productData.url}" class="embedded-product__button">
                Ver Producto
              </a>
            </div>
          </div>
        `;




        return productCardHTML;
      }
      
      return '';
    });
  }
});