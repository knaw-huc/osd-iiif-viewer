import type {ViewerCanvas} from './model.ts';

export function extractThumbnail(canvas: ViewerCanvas, height = 120): string {
  return canvas.imageServiceId + `/full/,${height}/0/default.jpg`;
}