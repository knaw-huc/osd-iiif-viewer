import type {ViewerCanvas} from './model.ts';

export function extractTileSource(canvas: ViewerCanvas): string {
  return canvas.imageServiceId + '/info.json';
}