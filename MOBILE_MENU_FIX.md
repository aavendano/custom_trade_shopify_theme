# Fix para Menú Móvil Sticky Header

## Problema Identificado

El menú de navegación móvil perdía la propiedad "sticky" cuando se abría desde una posición baja en la página, haciendo que el menú no fuera visible para el usuario ya que se quedaba en la parte superior de la página fuera del viewport.

## Solución Implementada

Se han creado dos archivos para solucionar este problema:

### 1. `mobile-menu-fix.js`
- **Funcionalidad**: Detecta cuando el menú móvil se abre/cierra
- **Características**:
  - Fuerza el header a mantenerse visible y fijo en la parte superior cuando el menú está abierto
  - Previene el scroll del body para evitar problemas de posicionamiento
  - Maneja cambios de tamaño de ventana (resize)
  - Restaura el comportamiento sticky normal al cerrar el menú
  - Solo se aplica en dispositivos móviles (max-width: 990px)

### 2. `mobile-menu-fix.css`
- **Funcionalidad**: Proporciona los estilos necesarios para el comportamiento correcto
- **Características**:
  - Estilos específicos para cuando el menú móvil está abierto
  - Prevención de scroll del body
  - Mejoras de accesibilidad
  - Compatibilidad con Safari iOS
  - Responsive design para diferentes tamaños de pantalla

## Archivos Modificados

### `layout/theme.liquid`
Se agregaron las referencias a los nuevos archivos:
```liquid
{{ 'mobile-menu-fix.css' | asset_url | stylesheet_tag }}
<script src="{{ 'mobile-menu-fix.js' | asset_url }}" defer="defer"></script>
```

## Cómo Funciona

1. **Detección**: El JavaScript detecta cuando se abre el menú móvil mediante:
   - Event listeners en el elemento `toggle`
   - MutationObserver para cambios en el atributo `open`
   - Click handlers en el botón del menú

2. **Activación**: Cuando el menú se abre:
   - Se agrega la clase `mobile-menu-open` al header
   - Se fuerza el posicionamiento `fixed` con `top: 0`
   - Se previene el scroll del body
   - Se ajusta el viewport height para móviles

3. **Restauración**: Cuando el menú se cierra:
   - Se remueven todas las clases y estilos forzados
   - Se restaura el comportamiento sticky normal
   - Se permite el scroll del body nuevamente

## Compatibilidad

- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ✅ Samsung Internet
- ✅ Tablets (750px - 990px)
- ✅ Desktop (automáticamente deshabilitado)

## Características de Accesibilidad

- Mantiene el focus management del menú original
- Preserva la navegación por teclado
- Incluye indicadores visuales apropiados
- Compatible con lectores de pantalla

## Testing

Para probar la funcionalidad:

1. Abrir el sitio en un dispositivo móvil o usar DevTools en modo móvil
2. Hacer scroll hacia abajo en la página
3. Abrir el menú de navegación móvil
4. Verificar que el menú sea visible y el header esté en la parte superior
5. Cerrar el menú y verificar que el comportamiento sticky se restaure

## Notas Técnicas

- El fix solo se aplica en resoluciones móviles (max-width: 990px)
- Se usa `!important` en CSS solo donde es necesario para sobrescribir estilos existentes
- El JavaScript es defensivo y maneja casos edge como cambios de tamaño de ventana
- Compatible con el sistema de sticky header existente del tema

## Mantenimiento

Este fix es independiente del código base del tema y puede ser removido fácilmente si es necesario:

1. Eliminar las referencias en `theme.liquid`
2. Eliminar los archivos `mobile-menu-fix.js` y `mobile-menu-fix.css`

No requiere modificaciones en el código existente del tema.