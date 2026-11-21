import { describe, expect, it } from 'vitest'

import { demoThemes } from './themes.ts'
import { dark, light } from './tokens/defaults.ts'

// WCAG 2's contrast ratio between two `#rrggbb` colours, 1 to 21.
function contrast(first: string, second: string): number {
  const [lighter = 0, darker = 0] = [
    luminance(first),
    luminance(second),
  ].toSorted((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG 2's relative luminance of a `#rrggbb` colour.
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255
    return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const [red = 0, green = 0, blue = 0] = channels
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

// The bar for text and for a glyph that carries meaning, such as the warning
// a failed action's snackbar leads with.
const AA = 4.5

describe('contrast', () => {
  it('reads 21:1 for black on white and 1:1 for a colour on itself', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21)
    expect(contrast('#b3261e', '#b3261e')).toBe(1)
  })
})

// The inverse error is the other scheme's error, the way the inverse primary
// is the other scheme's primary: a scheme's own error sits on its own surface,
// so on the inverse surface it falls to about 2:1.
describe('the inverse error', () => {
  it("defaults to the other scheme's error", () => {
    expect(light['--kui-color-inverse-error']).toBe(dark['--kui-color-error'])
    expect(dark['--kui-color-inverse-error']).toBe(light['--kui-color-error'])
    expect(light['--kui-color-inverse-error']).toBe('#f2b8b5')
    expect(dark['--kui-color-inverse-error']).toBe('#b3261e')
  })

  it.each([
    ['light', light],
    ['dark', dark],
  ])('clears AA on the inverse surface by default in %s', (_, theme) => {
    expect(
      contrast(
        theme['--kui-color-inverse-error'],
        theme['--kui-color-inverse-surface'],
      ),
    ).toBeGreaterThanOrEqual(AA)
  })

  it.each(Object.values(demoThemes).map(({ label, theme }) => [label, theme]))(
    'clears AA on the inverse surface in the %s scheme',
    (_, theme) => {
      const error = theme['--kui-color-inverse-error']
      const surface = theme['--kui-color-inverse-surface']

      expect(error).toMatch(/^#[\da-f]{6}$/u)
      expect(surface).toMatch(/^#[\da-f]{6}$/u)
      expect(contrast(error ?? '', surface ?? '')).toBeGreaterThanOrEqual(AA)
    },
  )
})
