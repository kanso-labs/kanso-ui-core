// The package's public surface: the design data kanso-ui and
// react-native-kanso-ui both read, and the types that describe it. Nothing here
// renders anything or depends on a platform, so every export is a value or a
// type that a browser, Hermes and Node can all load as it is.
//
// The token defaults are generated from src/tokens/design.tokens.json by
// scripts/build-tokens.mjs, which `build`, `lint` and `test` run first.
export { breakpoints, dark, light } from './tokens/defaults.ts'
export type { KuiTheme } from './tokens/defaults.ts'
