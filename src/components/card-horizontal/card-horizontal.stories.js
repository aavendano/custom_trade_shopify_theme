/**
 * HOW TO ADD NEW COMPONENTS:
 * 
 * 1. Duplicate the `card-horizontal` folder and rename it to your new component name (e.g., `hero-banner`).
 * 2. Rename the files inside:
 *    - `hero-banner.html`
 *    - `hero-banner.scss`
 *    - `hero-banner.js`
 *    - `hero-banner.stories.js`
 * 3. Update the content:
 *    - In `.scss`, write your styles (use b- prefix).
 *    - In `.html`, write your HTML structure.
 *    - In `.js`, register any Alpine components if needed.
 *    - In `.stories.js`:
 *      - Update imports to point to the new files.
 *      - Update `title` to 'Components/Hero Banner'.
 *      - Export your stories.
 */

import './card-horizontal.scss';
import './card-horizontal.js';
import cardHtml from './card-horizontal.html?raw';

export default {
    title: 'Components/Card Horizontal',
    parameters: {
        // Optional: Configure layout or other parameters
        layout: 'centered',
    },
};

export const Default = () => cardHtml;

export const ActiveState = () => {
    // Example of how to modify the HTML or initial state if needed
    // Since it's static HTML + Alpine, we rely on Alpine for state.
    // We could inject a different initial state via x-data if we modified the HTML string.
    return cardHtml.replace('x-data="cardHorizontal"', 'x-data="{ ...cardHorizontal(), active: true, label: \'Active\' }"');
};
