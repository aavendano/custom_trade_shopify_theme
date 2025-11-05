// Fix simple para menú móvil sticky
(function() {
  function fixMobileMenu() {
    const menuToggle = document.querySelector('#Details-menu-drawer-container');
    const header = document.querySelector('.section-header');
    
    if (!menuToggle || !header) return;
    
    const observer = new MutationObserver(function() {
      if (window.innerWidth <= 990 && menuToggle.hasAttribute('open')) {
        // Menú abierto en móvil - forzar header visible
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.zIndex = '4';
        header.style.width = '100%';
        header.style.left = '0';
        header.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        // Menú cerrado - limpiar estilos
        header.style.position = '';
        header.style.top = '';
        header.style.zIndex = '';
        header.style.width = '';
        header.style.left = '';
        header.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      }
    });
    
    observer.observe(menuToggle, { attributes: true, attributeFilter: ['open'] });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMobileMenu);
  } else {
    fixMobileMenu();
  }
})();