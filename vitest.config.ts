import { defineConfig } from 'vitest/config'

// The suite runs in Node, which is all it needs: the package is data and
// types, so there is nothing to render and no browser to start.
export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/**/*.test.ts'],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'cobertura'],
    },
    environment: 'node',
    // The file `Upload test results to Codecov` hands over, read for which
    // tests failed and which are flaky rather than for a percentage.
    outputFile: { junit: '.vitest/test-results.junit.xml' },
    // `default` stays in the list so the run still reads the same in a
    // terminal: a `junit` reporter on its own replaces that output rather than
    // adding to it.
    reporters: ['default', 'junit'],
  },
})
