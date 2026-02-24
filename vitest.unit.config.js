import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        include: ['src/tests/**/*.test.js'],
        exclude: ['node_modules', '.storybook'],
    },
});
