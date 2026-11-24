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

  // The inverse error is the other scheme's error, the way the inverse primary
  // is the other scheme's primary.
  it("take the other scheme's error as the inverse error", () => {
    expect(light['--kui-color-inverse-error']).toBe(dark['--kui-color-error'])
    expect(dark['--kui-color-inverse-error']).toBe(light['--kui-color-error'])
    expect(light['--kui-color-inverse-error']).toBe('#f2b8b5')
    expect(dark['--kui-color-inverse-error']).toBe('#b3261e')
  })

  // The icon steps are the sizes Material Design's pages draw an icon at, and
  // both libraries and the apps size an icon's slot by name, so a step that
  // moves or disappears is a change to every one of them.
  it("give the icon steps Material Design's sizes", () => {
    expect({
      lg: light['--kui-sizing-icon-lg'],
      md: light['--kui-sizing-icon-md'],
      sm: light['--kui-sizing-icon-sm'],
      xl: light['--kui-sizing-icon-xl'],
      xs: light['--kui-sizing-icon-xs'],
    }).toEqual({ lg: '24px', md: '20px', sm: '18px', xl: '40px', xs: '16px' })
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
