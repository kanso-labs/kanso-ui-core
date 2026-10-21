import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { breakpoints, dark, light } from './defaults.ts'
import source from './design.tokens.json' with { type: 'json' }

// The declarations in one block of the generated tokens.css. The formatter
// breaks a long value over lines, so whitespace is folded back to what the
// value says.
function declarations(block: string): Record<string, string> {
  return Object.fromEntries(
    [...block.matchAll(/(--kui-[\w-]+):([^;]+);/gu)].map(([, name, value]) => [
      name,
      value
        .replaceAll(/\s+/gu, ' ')
        .replaceAll('( ', '(')
        .replaceAll(' )', ')')
        .trim(),
    ]),
  )
}

const css = readFileSync(
  new URL('design.tokens.css', import.meta.url),
  'utf8',
).replaceAll(/\/\*[\s\S]*?\*\//gu, '')
const [rootBlock = '', darkBlock = ''] = css.split(
  '@media (prefers-color-scheme: dark)',
)
const root = declarations(rootBlock)
const darkColors = declarations(darkBlock)

// `light` and `dark` are typed `Required<KuiTheme>`, so the type-checker holds
// the type to exactly the keys each map has, and these hold the maps to
// exactly the properties the stylesheet declares. Between them, `KuiTheme`
// names what tokens.css lists and nothing else.
describe('the token defaults', () => {
  it('declare every property tokens.css does, at its light value', () => {
    expect(Object.keys(root).length).toBeGreaterThan(0)
    expect(light).toEqual(root)
  })

  it('take the dark colours tokens.css declares under a dark scheme', () => {
    expect(Object.keys(darkColors).length).toBeGreaterThan(0)
    expect(
      Object.keys(darkColors).every((name) => name.startsWith('--kui-color-')),
    ).toBe(true)
    expect(dark).toEqual({ ...root, ...darkColors })
  })

  it('carry the breakpoints in px, as tokens.json gives them', () => {
    const expected = Object.fromEntries(
      Object.entries(source.layout.breakpoint).flatMap(([key, token]) =>
        typeof token === 'object'
          ? [[key, Number.parseFloat(token.$value)]]
          : [],
      ),
    )

    expect(Object.keys(expected).length).toBeGreaterThan(0)
    expect(breakpoints).toEqual(expected)
  })
})
