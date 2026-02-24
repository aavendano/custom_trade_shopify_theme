import html from './navbar.html?raw';
import './navbar.scss';
import bNavbar from './navbar.js';

// Expose bNavbar to window so Alpine can find it
window.bNavbar = bNavbar;

export default {
    title: 'Components/Navbar',
};

export const Default = () => `
  <div x-data="bNavbar()">
    ${html}
  </div>
`;
