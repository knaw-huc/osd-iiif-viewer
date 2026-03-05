import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import type {Id} from '../Id.ts';

export function getAnnotationPageIds(
  canvas: CanvasNormalized
): Id[] {
  return canvas.annotations
    .map((ref) => ref.id)
    .filter(id => !!id);
}