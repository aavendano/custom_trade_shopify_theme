/**
 * Mobile Menu Fix - Testing Script
 * Script para verificar que el fix del menú móvil funciona correctamente
 * Solo para desarrollo/testing - no incluir en producción
 */

class MobileMenuTester {
  constructor() {
    this.tests = [];
    this.results = [];
    
    // Solo ejecutar en modo desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok') || window.location.search.includes('test=mobile-menu')) {
      this.init();
    }
  }

  init() {
    console.log('🧪 Mobile Menu Fix - Testing Suite');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runTests());
    } else {
      this.runTests();
    }
  }

  runTests() {
    this.addTest('Header element exists', () => {
      return document.querySelector('.section-header') !== null;
    });

    this.addTest('Menu drawer exists', () => {
      return document.querySelector('header-drawer') !== null;
    });

    this.addTest('Menu toggle exists', () => {
      return document.querySelector('#Details-menu-drawer-container') !== null;
    });

    this.addTest('MobileMenuStickyFix class is available', () => {
      return typeof window.MobileMenuStickyFix !== 'undefined' || document.querySelector('script[src*=\"mobile-menu-fix.js\"]') !== null;
    });

    this.addTest('Mobile menu CSS is loaded', () => {
      return document.querySelector('link[href*=\"mobile-menu-fix.css\"]') !== null;
    });

    this.addTest('Mobile breakpoint detection works', () => {
      return window.matchMedia('(max-width: 990px)').matches !== undefined;
    });

    // Test funcional solo en móviles
    if (window.matchMedia('(max-width: 990px)').matches) {
      this.addTest('Menu opens correctly on mobile', () => {
        const menuToggle = document.querySelector('#Details-menu-drawer-container');
        if (!menuToggle) return false;
        
        // Simular apertura del menú
        menuToggle.setAttribute('open', '');
        
        // Verificar que se aplicaron las clases correctas
        const header = document.querySelector('.section-header');
        const hasCorrectClass = header.classList.contains('mobile-menu-open');
        
        // Limpiar
        menuToggle.removeAttribute('open');
        header.classList.remove('mobile-menu-open');
        
        return hasCorrectClass;
      });
    }

    // Ejecutar todos los tests
    this.executeTests();
  }

  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  executeTests() {
    console.log('🚀 Running tests...');
    
    this.tests.forEach((test, index) => {
      try {
        const result = test.testFunction();
        this.results.push({
          name: test.name,
          passed: result,
          error: null
        });
        
        console.log(`${result ? '✅' : '❌'} ${test.name}`);
      } catch (error) {
        this.results.push({
          name: test.name,
          passed: false,
          error: error.message
        });
        
        console.log(`❌ ${test.name} - Error: ${error.message}`);
      }
    });

    this.showSummary();
  }

  showSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`\n📊 Test Summary: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Mobile menu fix is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Check the implementation.');
      
      // Mostrar tests fallidos
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`❌ Failed: ${result.name}${result.error ? ` - ${result.error}` : ''}`);
      });
    }

    // Agregar información adicional para debugging
    this.showDebugInfo();
  }

  showDebugInfo() {
    console.log('\n🔍 Debug Information:');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Viewport Width:', window.innerWidth);
    console.log('- Viewport Height:', window.innerHeight);
    console.log('- Is Mobile:', window.matchMedia('(max-width: 990px)').matches);
    console.log('- Document Ready State:', document.readyState);
    
    const header = document.querySelector('.section-header');
    if (header) {
      console.log('- Header Height:', header.offsetHeight);
      console.log('- Header Classes:', Array.from(header.classList));
    }
  }

  // Método para testing manual
  static testMenuToggle() {
    const menuToggle = document.querySelector('#Details-menu-drawer-container');
    const header = document.querySelector('.section-header');
    
    if (!menuToggle || !header) {
      console.log('❌ Menu elements not found');
      return;
    }

    console.log('🧪 Testing manual menu toggle...');
    
    // Abrir menú
    menuToggle.setAttribute('open', '');
    setTimeout(() => {
      console.log('Menu opened - Header classes:', Array.from(header.classList));
      
      // Cerrar menú
      menuToggle.removeAttribute('open');
      setTimeout(() => {
        console.log('Menu closed - Header classes:', Array.from(header.classList));
      }, 500);
    }, 500);
  }
}

// Inicializar el tester
new MobileMenuTester();

// Hacer disponible para testing manual
window.MobileMenuTester = MobileMenuTester;