export function assertSvgElement(
  element: unknown
): asserts element is SVGElement {
  if (!(element instanceof SVGElement)) {
    throw new Error('Expected SVGElement');
  }
}