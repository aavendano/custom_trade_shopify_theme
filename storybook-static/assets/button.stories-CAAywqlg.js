const n=()=>({clicked:!1,handleClick(){this.clicked=!0,console.log("Button clicked!")}}),e={title:"Components/Button"},t=()=>(window.Alpine?window.Alpine.data("bButton",n):document.addEventListener("alpine:init",()=>{window.Alpine.data("bButton",n)}),`
  <button class="b-button" x-data="bButton()" @click="handleClick" x-text="clicked ? 'Clicked!' : 'Default Button'">
  </button>
`);t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  // Register Alpine component for this story
  if (window.Alpine) {
    window.Alpine.data('bButton', bButton);
  } else {
    document.addEventListener('alpine:init', () => {
      window.Alpine.data('bButton', bButton);
    });
  }
  return \`
  <button class="b-button" x-data="bButton()" @click="handleClick" x-text="clicked ? 'Clicked!' : 'Default Button'">
  </button>
\`;
}`,...t.parameters?.docs?.source}}};const o=["Default"];export{t as Default,o as __namedExportsOrder,e as default};
