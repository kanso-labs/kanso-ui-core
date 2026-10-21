import { describe, expect, it } from 'vitest'

import * as glyphs from './glyphs.ts'

const { gridSize, ...paths } = glyphs

describe('the glyphs subpath', () => {
  // The exact names, so a glyph added or dropped is a change this list has to
  // make on purpose: each library draws every one of them by name.
  it('exports exactly the names below', () => {
    expect(Object.keys(glyphs).toSorted()).toEqual([
      'arrowBackPath',
      'arrowDownwardPath',
      'arrowDropDownPath',
      'arrowUpwardPath',
      'calendarPath',
      'checkCirclePath',
      'checkPath',
      'chevronDownPath',
      'chevronEndPath',
      'clockPath',
      'closePath',
      'errorPath',
      'gridSize',
      'keyboardPath',
      'minusPath',
      'personPath',
      'plusPath',
      'searchPath',
    ])
  })

  it('draws on the 24-unit grid of Material Symbols', () => {
    expect(gridSize).toBe(24)
  })

  // An SVG path has to open with a move command, or the renderer draws
  // nothing, on the web and in react-native-svg alike.
  it.each(Object.entries(paths))(
    'holds %s as a path that opens with a move',
    (_, path) => {
      expect(path).toMatch(/^M\d/u)
    },
  )
})
