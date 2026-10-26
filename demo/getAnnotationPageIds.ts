import type {
  CanvasNormalized
} from '@iiif/parser/presentation-3-normalized/types';
import type {Id} from '../src/Id.ts';

export function getAnnotationPageIds(
  canvas: CanvasNormalized
): Id[] {
  return canvas.annotations
    .filter(ref => ref.type === 'AnnotationPage')
    .map(ref => ref.id);
}