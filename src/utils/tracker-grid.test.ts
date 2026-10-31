import { getGridLayout } from './tracker-grid'

describe('getGridLayout', () => {
  test('returns a harmless layout before the area has been measured', () => {
    expect(getGridLayout(10, 0, 0, 12)).toEqual({
      columns: 1,
      rows: 1,
      cellWidth: 0,
      cellHeight: 0,
      scrolls: false,
    })
  })

  test('uses a single square cell for one runner in a square area', () => {
    const layout = getGridLayout(1, 300, 300, 12)
    expect(layout).toMatchObject({ columns: 1, rows: 1, cellWidth: 300, cellHeight: 300 })
  })

  test('picks the most square arrangement for a tall, narrow area', () => {
    const layout = getGridLayout(10, 360, 560, 12)
    expect(layout).toMatchObject({ columns: 3, rows: 4, scrolls: false })
    expect(layout.cellWidth / layout.cellHeight).toBeGreaterThan(0.7)
    expect(layout.cellWidth / layout.cellHeight).toBeLessThan(1.3)
  })

  test('uses more columns in a wide area', () => {
    expect(getGridLayout(10, 1000, 300, 12).columns).toBeGreaterThan(
      getGridLayout(10, 360, 560, 12).columns,
    )
  })

  test('always fills the available area', () => {
    const { columns, rows, cellWidth, cellHeight } = getGridLayout(7, 400, 500, 10)
    expect(cellWidth * columns + 10 * (columns - 1)).toBeCloseTo(400)
    expect(cellHeight * rows + 10 * (rows - 1)).toBeCloseTo(500)
  })

  test('falls back to scrolling square cells when there are too many runners to fit', () => {
    const layout = getGridLayout(300, 360, 400, 12)
    expect(layout.scrolls).toBe(true)
    expect(layout.cellWidth).toBe(layout.cellHeight)
    expect(layout.cellWidth).toBeGreaterThanOrEqual(48)
    expect(layout.rows).toBe(Math.ceil(300 / layout.columns))
  })
})
