type Point = {x: number, y: number};

export function hasMoved(from: Point, to: Point, threshold: number) {
  return Math.hypot(to.x - from.x, to.y - from.y) > threshold;
}
