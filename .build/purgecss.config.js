import purgecss from '@fullhuman/postcss-purgecss';


export default {
  plugin: [
    purgecss({
    
      content: [
        'layout/*.liquid',
        'templates/**/*.liquid', // Revisa todos los templates (incluyendo subcarpetas)
        'sections/*.liquid',
        'snippets/*.liquid',
        'blocks/*.liquid'
      ],  
      safelist: {
     
        standard: [
        //  'is-active',
        //  'is-clipped',
        //  'modal-is-open',
        //  'dropdown',
        //  'dropdown-trigger'
        ],     
        //deep: [ /^b-is-.*$/,  /^b-has-.*$/,],
      }
    })  
  ]  
}