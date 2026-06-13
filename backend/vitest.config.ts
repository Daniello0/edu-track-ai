import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    root: './',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
