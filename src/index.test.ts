import { describe, expect, it } from 'vitest'

import * as entry from './index.ts'

// The exact names the main entry exports, so a name added or dropped is a
// change this list has to make on purpose rather than one that slips through.
// A barrel compiles to bindings with no statements, so coverage cannot see it.
describe('the main entry', () => {
  it('exports exactly the names below', () => {
    expect(Object.keys(entry).toSorted()).toEqual([])
  })
})
