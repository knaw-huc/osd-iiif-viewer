import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import type {Id} from '../src/Id.ts';

export function getAnnotationPageIds(
  canvas: CanvasNormalized
): Id[] {
  return canvas.annotations
    .filter(ref => ref.type === 'AnnotationPage')
    .map(ref => ref.id);
}