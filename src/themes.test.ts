import { describe, expect, it } from 'vitest'

import { demoThemes } from './themes.ts'
import { dark, light } from './tokens/defaults.ts'

// The bar for text and for a glyph that carries meaning, such as the warning
// a failed action's snackbar leads with.
const AA = 4.5

// `light` is held to exactly the properties tokens.css declares by
// src/tokens/defaults.test.ts, so it stands for the stylesheet here.
const COLORS = Object.keys(light).filter((property) =>
  property.startsWith('--kui-color-'),
)

// The spacing steps in the order of the scale, which a scheme stating them
// keeps: a step named for more room than the one before it never gives less.
const SPACING = [
  'xxs',
  'xs',
  'xs-plus',
  'sm',
  'md',
  'lg',
  'lg-plus',
  'xl',
  'xxl',
  'xxxl',
].map((step) => `--kui-spacing-${step}`)

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

describe('contrast', () => {
  it('reads 21:1 for black on white and 1:1 for a colour on itself', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21)
    expect(contrast('#b3261e', '#b3261e')).toBe(1)
  })
})

// A scheme's own error is drawn for its own surface, so on the inverse surface
// it falls to 2:1 or below. The inverse error is the colour that clears AA
// there, as the inverse primary is for the primary. The defaults are held
// here too, since every scheme is measured against the same bar.
describe.each([
  ['light', light],
  ['dark', dark],
])('the %s default', (_, theme) => {
  it('draws its inverse error at AA on its inverse surface', () => {
    expect(
      contrast(
        theme['--kui-color-inverse-error'],
        theme['--kui-color-inverse-surface'],
      ),
    ).toBeGreaterThanOrEqual(AA)
  })
})

// The values a theme gives the spacing steps, in pixels, in the scale's order.
function spacingOf(theme: Partial<Record<string, string>>): number[] {
  return SPACING.map((property) => Number.parseFloat(theme[property] ?? ''))
}

describe('the demo schemes', () => {
  it('are the seven both Storybooks render', () => {
    expect(Object.values(demoThemes).map(({ label }) => label)).toEqual([
      'Editorial',
      'Graphite',
      'Marquee',
      'Neon',
      'Nordic',
      'Poster',
      'Terminal',
    ])
  })
})

describe.each(Object.entries(demoThemes))('the %s scheme', (_, { theme }) => {
  // A colour a scheme leaves out falls back to the library's default in the
  // scheme around it, so the page would draw that role in its light value on
  // a light device and its dark value on a dark one.
  it('states every colour', () => {
    expect(COLORS.length).toBeGreaterThan(0)
    expect(COLORS.filter((property) => !(property in theme))).toEqual([])
  })

  it('draws its inverse error at AA on its inverse surface', () => {
    const error = theme['--kui-color-inverse-error']
    const surface = theme['--kui-color-inverse-surface']

    expect(error).toMatch(/^#[\da-f]{6}$/u)
    expect(surface).toMatch(/^#[\da-f]{6}$/u)
    expect(contrast(error ?? '', surface ?? '')).toBeGreaterThanOrEqual(AA)
  })

  // A scheme restates the spacing scale at its own sizes, so it states the
  // steps between steps too, and keeps them in order: left out, 6px and
  // 20px would sit inside a scale whose steps either side had moved.
  it('states every spacing step, each larger than the last', () => {
    const steps = spacingOf(theme)

    expect(steps.every((step) => Number.isFinite(step))).toBe(true)
    expect(
      steps.every(
        (step, index) => index === 0 || step > (steps[index - 1] ?? 0),
      ),
    ).toBe(true)
  })

  // A property tokens.css does not declare is read by nothing, so a misspelt
  // key would leave its role at the default with nothing on screen to say so.
  it('sets only properties tokens.css declares', () => {
    expect(
      Object.keys(theme).filter((property) => !(property in light)),
    ).toEqual([])
  })
})
