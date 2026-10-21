import { describe, expect, it } from 'vitest'

import { demoThemes } from './themes.ts'
import { light } from './tokens/defaults.ts'

// `light` is held to exactly the properties tokens.css declares by
// src/tokens/defaults.test.ts, so it stands for the stylesheet here.
const COLORS = Object.keys(light).filter((property) =>
  property.startsWith('--kui-color-'),
)

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

  // A property tokens.css does not declare is read by nothing, so a misspelt
  // key would leave its role at the default with nothing on screen to say so.
  it('sets only properties tokens.css declares', () => {
    expect(
      Object.keys(theme).filter((property) => !(property in light)),
    ).toEqual([])
  })
})
