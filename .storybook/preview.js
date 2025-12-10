import '../src/bulma/bulma.scss';
import '../src/alpine-bundle.js';

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  decorators: [
    (Story) => {
      const story = Story();
      // Wait for the DOM to be updated
      setTimeout(() => {
        // If Alpine is available, rescan the DOM or specific root
        if (window.Alpine) {
          // Alpine usually observes the DOM, but sometimes we need to be explicit
          // window.Alpine.initTree(document.body);
        }
      }, 0);
      return story;
    }
  ]
};

export default preview;