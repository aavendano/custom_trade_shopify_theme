import html from './button.html?raw';
import './button.scss';
import bButton from './button.js';

export default {
    title: 'Components/Button',
};

export const Default = () => {
    // Register Alpine component for this story
    if (window.Alpine) {
        window.Alpine.data('bButton', bButton);
    } else {
        document.addEventListener('alpine:init', () => {
            window.Alpine.data('bButton', bButton);
        });
    }

    return `
  <button class="b-button" x-data="bButton()" @click="handleClick" x-text="clicked ? 'Clicked!' : 'Default Button'">
  </button>
`;
};

export const Primary = () => `
  <button class="b-button" style="background:#4c3aff">
    Primary Button
  </button>
`;

export const Light = () => `
  <button class="b-button" style="background:#f5f5f5; color:#222;">
    Light Button
  </button>
`;

export const WithIcon = () => `
  <button class="b-button">
    <span style="margin-right:0.5rem;">⭐</span>
    With Icon
  </button>
`;
