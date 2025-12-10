const a=()=>{window.Alpine?window.Alpine.data("cardHorizontal",()=>({active:!1,label:"Inactive",toggle(){this.active=!this.active,this.label=this.active?"Active":"Inactive",console.log("Card toggled:",this.active)}})):console.warn("Alpine not found on window")};a();document.addEventListener("alpine:init",a);const i=`<div class="b-card b-is-horizontal" x-data="cardHorizontal">
  <div class="b-card-image">
    <figure class="b-image b-is-4by3">
      <img src="https://bulma.io/assets/images/placeholders/1280x960.png" alt="Placeholder image">
    </figure>
  </div>
  <div class="b-card-content">
    <div class="b-media">
      <div class="b-media-content">
        <p class="b-title b-is-4">John Smith</p>
        <p class="b-subtitle b-is-6">@johnsmith</p>
      </div>
    </div>

    <div class="b-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Phasellus nec iaculis mauris. <a>@bulmaio</a>.
      <a href="#">#css</a> <a href="#">#responsive</a>
      <br>
      <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
      <button class="b-button b-is-primary" @click="toggle()" x-text="label"></button>
    </div>
  </div>
</div>
`,n={title:"Components/Card Horizontal",parameters:{layout:"centered"}},e=()=>i,t=()=>i.replace('x-data="cardHorizontal"',`x-data="{ ...cardHorizontal(), active: true, label: 'Active' }"`);e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"() => cardHtml",...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  // Example of how to modify the HTML or initial state if needed
  // Since it's static HTML + Alpine, we rely on Alpine for state.
  // We could inject a different initial state via x-data if we modified the HTML string.
  return cardHtml.replace('x-data="cardHorizontal"', 'x-data="{ ...cardHorizontal(), active: true, label: \\'Active\\' }"');
}`,...t.parameters?.docs?.source}}};const s=["Default","ActiveState"];export{t as ActiveState,e as Default,s as __namedExportsOrder,n as default};
