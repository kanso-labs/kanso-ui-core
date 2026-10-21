// The glyphs both libraries draw inside their own controls, as path data: the
// check and the dash a checkbox shows, the plus and minus a stepper shows, the
// magnifier and the cross a search field shows, and the rest below. Each is a
// Material Symbols path on its 24-unit grid, and neither library writes one of
// its own.
//
// Only the data is published. Each library draws the paths its own way, an
// inline SVG on the web and react-native-svg on native, and decides there
// whether a glyph mirrors in a right-to-left layout, since that is how a glyph
// is drawn rather than what it is. A glyph a call site wants for itself is an
// icon, which both libraries take as a node; nothing here is offered for that.

/** The side of the square grid every path below is drawn on. */
const gridSize = 24

/** An arrow pointing back, at the page a view returns to. */
const arrowBackPath =
  'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'

/** An arrow pointing down, for a column sorted in descending order. */
const arrowDownwardPath =
  'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z'

/** A small solid triangle pointing down, at the list a menu button opens. */
const arrowDropDownPath = 'M7 10l5 5 5-5z'

/** An arrow pointing up, for a column sorted in ascending order. */
const arrowUpwardPath =
  'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'

/** A calendar, which a date is picked from. */
const calendarPath =
  'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z'

/**
 * A check in a filled circle. It shares its outline with `errorPath`, so the
 * two differ by the mark inside rather than by their colour alone.
 */
const checkCirclePath =
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'

/** A check mark, as a selected checkbox shows. */
const checkPath = 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'

/** A chevron pointing down, at the menu a button opens. */
const chevronDownPath = 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z'

/**
 * A chevron pointing onward, at what an item opens, such as a submenu. It is
 * drawn pointing right, the onward direction in a left-to-right layout.
 */
const chevronEndPath = 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'

/** A clock face, which a time is picked from. */
const clockPath =
  'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'

/** A cross, which closes or clears. */
const closePath =
  'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

/** An exclamation mark in a filled circle; see `checkCirclePath`. */
const errorPath =
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'

/** A keyboard, which switches a picker to typed entry. */
const keyboardPath =
  'M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H4V7h16v10zm-9-9h2v2h-2zm0 3h2v2h-2zM8 8h2v2H8zm0 3h2v2H8zm-3 0h2v2H5zm0-3h2v2H5zm3 6h8v2H8zm6-3h2v2h-2zm0-3h2v2h-2zm3 3h2v2h-2zm0-3h2v2h-2z'

/**
 * A horizontal rule, which stands both for a partly selected checkbox and for
 * a stepper's decrement.
 */
const minusPath = 'M19 13H5v-2h14v2z'

/** Material Design's anonymous person, a head over shoulders. */
const personPath =
  'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'

/** A plus, as a stepper's increment shows. */
const plusPath = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'

/** A magnifier, as a search field shows. */
const searchPath =
  'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'

export {
  arrowBackPath,
  arrowDownwardPath,
  arrowDropDownPath,
  arrowUpwardPath,
  calendarPath,
  checkCirclePath,
  checkPath,
  chevronDownPath,
  chevronEndPath,
  clockPath,
  closePath,
  errorPath,
  gridSize,
  keyboardPath,
  minusPath,
  personPath,
  plusPath,
  searchPath,
}
