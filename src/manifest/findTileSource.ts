import type {ViewerCanvas} from './model.ts';

export function findTileSource(canvas: ViewerCanvas): string {
  return canvas.imageServiceId + '/info.json';
}