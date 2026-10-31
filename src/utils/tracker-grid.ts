export interface GridLayout {
  columns: number
  rows: number
  cellWidth: number
  cellHeight: number
  /** True when the cells would be too small to fit without scrolling, so they keep a minimum size instead */
  scrolls: boolean
}

const MIN_CELL_SIZE = 48

/**
 * The tracker is limited to 40 runners, which fits at the minimum size on phones from about 360x640 up,
 * so the scrolling fallback below only applies to unusually small or short viewports.
 *
 * Picks the column count whose cells, stretched to fill the whole area, are closest to square.
 * If that would make the cells smaller than `minCellSize`, falls back to square cells that scroll.
 */
export function getGridLayout(
  count: number,
  width: number,
  height: number,
  gap: number,
  minCellSize = MIN_CELL_SIZE,
): GridLayout {
  if (count <= 0 || width <= 0 || height <= 0) {
    return { columns: 1, rows: 1, cellWidth: 0, cellHeight: 0, scrolls: false }
  }

  let best: GridLayout | undefined
  let bestSkew = Infinity

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns)
    const cellWidth = (width - gap * (columns - 1)) / columns
    const cellHeight = (height - gap * (rows - 1)) / rows
    if (cellWidth <= 0 || cellHeight <= 0) continue

    const skew = Math.abs(Math.log(cellWidth / cellHeight))
    if (skew < bestSkew) {
      bestSkew = skew
      best = { columns, rows, cellWidth, cellHeight, scrolls: false }
    }
  }

  if (best && Math.min(best.cellWidth, best.cellHeight) >= minCellSize) return best

  const columns = Math.min(count, Math.max(1, Math.floor((width + gap) / (minCellSize + gap))))
  const cellSize = (width - gap * (columns - 1)) / columns
  return {
    columns,
    rows: Math.ceil(count / columns),
    cellWidth: cellSize,
    cellHeight: cellSize,
    scrolls: true,
  }
}
