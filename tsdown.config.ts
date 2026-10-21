import { codecovRollupPlugin } from '@codecov/rollup-plugin'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
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
    // The token build writes the stylesheet beside its source rather than
    // through rolldown's module graph, so nothing else carries either file
    // into the package. `./tokens.css` is the override contract both
    // libraries publish, and `./tokens.json` the DTCG source itself, for a
    // build that reads the tokens in a shape the main entry does not give.
    //
    // A stylesheet subpath also takes a `types` condition, pointing at an empty
    // declaration written beside it, as kanso-ui's does. Without one, a
    // TypeScript consumer's side-effect import of it fails under
    // `noUncheckedSideEffectImports`, and attw reports the subpath unresolved.
    {
      name: 'copy-tokens',
      writeBundle() {
        mkdirSync('dist', { recursive: true })
        copyFileSync('src/tokens/design.tokens.css', 'dist/tokens.css')
        copyFileSync('src/tokens/design.tokens.json', 'dist/tokens.json')
        writeFileSync(
          'dist/stylesheet.d.ts',
          '// The declaration behind the ./tokens.css subpath, which a\n// side-effect import resolves to. A stylesheet exports nothing.\nexport {}\n',
        )
      },
    },
  ],
  sourcemap: true,
  tsconfig: 'tsconfig.lib.json',
})
