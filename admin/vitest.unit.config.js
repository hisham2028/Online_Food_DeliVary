import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
    include: ['src/**/*.unit.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage/unit',
      include: [
        'src/models/index.js',
        'src/factories/FoodFormFactory.js',
        'src/strategies/OrderFilterStrategy.js',
        'src/events/EventBus.js',
        'src/utils/adminAuth.js',
      ],
      thresholds: {
        lines: 97,
        functions: 97,
        branches: 97,
        statements: 97,
      },
    },
  },
});
