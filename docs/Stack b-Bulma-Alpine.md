PlayLoveToys — Shopify Theme
Stack b-Bulma-Alpine

Este repositorio contiene el theme oficial de PlayLoveToys, migrado y mantenido bajo un stack tecnológico mobile-first, performance-driven y minimalista, basado en Bulma CSS y Alpine.js.

El objetivo principal de este proyecto es maximizar velocidad, claridad visual y mantenibilidad, evitando dependencias innecesarias y código muerto.

🎯 Objetivo del Proyecto

Migrar y mantener un theme estándar de Shopify hacia un stack propio:

Más liviano

Más rápido

Más coherente visualmente

Más fácil de escalar

Optimizado para mobile (principal fuente de tráfico)

Este theme no busca ser genérico.
Está diseñado específicamente para PlayLoveToys.

🧱 Stack Tecnológico
CSS

Bulma CSS como framework base

Custom SCSS con prefijo b-

Compilación + PurgeCSS

CSS final esperado: ~14–16 KB minificado

Sin Tailwind

Sin Bootstrap

JavaScript

Alpine.js exclusivamente

Interactividad mínima

JS inline cuando sea posible

Sin frameworks JS pesados

Sin sliders externos (Swiper, Slick, etc.)

Templates

Shopify Liquid

Componentes modulares

HTML semántico

Clases Bulma primero, custom solo cuando es necesario

🧠 Filosofía de Diseño (PlayLoveToys)
Mobile-First Real

Todo se diseña primero para mobile

Desktop es una expansión, no otra versión

UX optimizada para scroll y uso táctil

Estética tipo Social Feed

Inspiración:

Instagram

TikTok

Facebook

Características:

Cards claras

Ritmo vertical

Jerarquía visual simple

Imágenes cuadradas (1:1)

Lectura rápida y natural

🧩 Reglas de UI
Cards

Altura consistente

Tipografía fluida (clamp() cuando aporta valor)

Skeleton loaders con Bulma + Alpine

Cards horizontales en mobile cuando mejora UX

Grids

Flexbox o CSS Grid

Layouts simples y previsibles

Grids irregulares solo cuando aportan valor visual real

Carousels

Scroll horizontal nativo

scroll-snap

Alpine solo para control mínimo

Nada de librerías externas

🖼️ Imágenes

Siempre formato 1:1

Livianas

Lazy loading en mobile

Prioridad alta solo para imágenes LCP

Evitar imágenes decorativas innecesarias

⚡ Performance (Prioridad Absoluta)

Este theme se optimiza explícitamente para:

LCP < 2.5s

CLS ≈ 0

FCP rápido

JS mínimo

CSS purgado

Cero código muerto

Cada decisión debe responder a:

“¿Esto mejora la experiencia real del usuario o la velocidad?”

🧹 Limpieza de Código (Obligatoria)

Durante cualquier migración o refactor:

Eliminar clases no usadas

Eliminar JS legado

Eliminar CSS del theme original

Consolidar componentes duplicados

Simplificar lógica Liquid innecesaria

Nada se conserva “por si acaso”.

🧪 Control de Calidad

Para cada sección migrada:

Comparar antes vs después

Validar:

Render correcto

Responsive

Sin saltos visuales

Sin dependencias ocultas

Confirmar:

Uso correcto de Bulma

Prefijo b- consistente

Coherencia visual con PlayLoveToys

🧱 Reglas de Oro del Código

Código mínimo > código elegante

Reutilizable > específico

Bulma antes que CSS custom

Alpine antes que JS vanilla

Performance antes que animaciones

Claridad antes que abstracción

🚫 Prohibiciones

No introducir frameworks nuevos

No romper el stack definido

No justificar decisiones con “best practices” genéricas

No sacrificar performance por estética

No reinventar Bulma

🏁 Estado Esperado del Theme

Al finalizar una migración o feature:

El theme debe sentirse hecho a medida

No debe parecer un theme genérico

El código debe ser entendible en minutos

La UI debe ser rápida, limpia y moderna

El proyecto debe estar listo para escalar

📌 Nota Final

Este repositorio no es solo código.
Es una disciplina de diseño y performance.

Si una decisión no mejora claridad, velocidad o experiencia, no pertenece aquí.