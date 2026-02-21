import { douglasPeucker, Point } from "./douglas-peucker";

export function calcVertices(points: Point[]) {
    if (points.length === 0) return [];

    return resamplePoints(douglasPeucker(points, 0.02), Math.min(30, points.length));
}

function resamplePoints(points: Point[], n: number): Point[] {
  if (points.length === 0) return []
  if (points.length === 1 || n === 1) return [points[0]]
  if (n >= points.length) return points

  // Calculate total length
  let totalLen = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    totalLen += Math.sqrt(dx * dx + dy * dy)
  }

  const segLen = totalLen / (n - 1)
  const result: Point[] = [points[0]]
  let accumulated = 0
  let j = 1

  for (let i = 1; i < n - 1; i++) {
    const target = i * segLen
    while (j < points.length) {
      const dx = points[j].x - points[j - 1].x
      const dy = points[j].y - points[j - 1].y
      const d = Math.sqrt(dx * dx + dy * dy)

      if (accumulated + d >= target) {
        const ratio = (target - accumulated) / d
        result.push({
          x: points[j - 1].x + ratio * dx,
          y: points[j - 1].y + ratio * dy,
        })
        break
      }
      accumulated += d
      j++
    }
  }

  result.push(points[points.length - 1])
  return result
}

