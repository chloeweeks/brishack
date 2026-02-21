export interface Point {
  x: number,
  y: number,
}

export function douglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points

  // Find point with max distance from line between first and last
  let maxDist = 0
  let maxIdx = 0

  const start = points[0]
  const end = points[points.length - 1]

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], start, end)
    if (dist > maxDist) {
      maxDist = dist
      maxIdx = i
    }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon)
    const right = douglasPeucker(points.slice(maxIdx), epsilon)
    return [...left.slice(0, -1), ...right]
  }

  return [start, end]
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const lineLenSq = dx * dx + dy * dy

  if (lineLenSq === 0) {
    const pdx = point.x - lineStart.x
    const pdy = point.y - lineStart.y
    return Math.sqrt(pdx * pdx + pdy * pdy)
  }

  const t = Math.max(0, Math.min(1,
    ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLenSq
  ))

  const projX = lineStart.x + t * dx
  const projY = lineStart.y + t * dy
  const pdx = point.x - projX
  const pdy = point.y - projY

  return Math.sqrt(pdx * pdx + pdy * pdy)
}