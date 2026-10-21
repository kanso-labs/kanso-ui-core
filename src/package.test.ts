import { describe, expect, it } from 'vitest'

import manifest from '../package.json' with { type: 'json' }

describe('package.json', () => {
  // Under `default`, Node resolves the ESM file for a `require()` as well,
  // through `require(esm)`. Under `import` alone the same call fails with
  // ERR_PACKAGE_PATH_NOT_EXPORTED, so renaming the condition, which reads like
  // a tidy-up beside `type: module`, would drop every CommonJS consumer.
  it('publishes every entry under a default condition', () => {
    expect(manifest.exports['.']).toEqual({
      default: './dist/index.js',
      types: './dist/index.d.ts',
    })
  })

  // The stylesheet and the DTCG source both libraries have published as
  // `./tokens.css` and `./tokens.json`, under the same names here.
  it('publishes the tokens as files', () => {
    expect(manifest.exports['./tokens.css']).toEqual({
      default: './dist/tokens.css',
      types: './dist/stylesheet.d.ts',
    })
    expect(manifest.exports['./tokens.json']).toBe('./dist/tokens.json')
  })

  // Both libraries take this package as a devDependency and bundle what they
  // read from it, so an app installing either of them installs nothing of this
  // package's. A dependency here would reach neither app, and a peer would ask
  // every app for one.
  it('takes no runtime dependency', () => {
    expect(manifest).not.toHaveProperty('dependencies')
    expect(manifest).not.toHaveProperty('peerDependencies')
    expect(manifest).not.toHaveProperty('optionalDependencies')
  })

  // A bundler drops a module nothing imports from only when the package says
  // loading it does nothing, and data has nothing to do on load. A stylesheet
  // is imported for nothing but its effect, so it is the one exception, or a
  // bundler would drop `import '@kanso-labs/kanso-ui-core/tokens.css'`.
  it('declares nothing but its stylesheet to have side effects', () => {
    expect(manifest.sideEffects).toEqual(['**/*.css'])
  })
})
