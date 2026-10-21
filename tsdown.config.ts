import { codecovRollupPlugin } from '@codecov/rollup-plugin'
import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  // Neutral rather than Node, because a browser bundle and Metro read this
  // package as much as Node does. It is also what keeps the output `.js`,
  // which every path in the exports map names: under `node`, tsdown writes
  // `.mjs` instead.
  platform: 'neutral',
  plugins: [
    // Codecov's rollup plugin, as in kanso-ui: tsdown drives rolldown, whose
    // plugin API is rollup's.
    //
    // `enableBundleAnalysis` is what keeps a local `npm run build` inert: the
    // token is an organisation secret, so it is unset everywhere but CI and
    // empty in a pull request from a fork, and either way the plugin then
    // neither writes its stats file nor uploads anything.
    codecovRollupPlugin({
      bundleName: 'kanso-ui-core',
      enableBundleAnalysis: Boolean(process.env.CODECOV_TOKEN),
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  sourcemap: true,
  tsconfig: 'tsconfig.lib.json',
})
