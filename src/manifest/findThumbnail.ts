import type { Vault } from '@iiif/helpers/vault';
import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { getImageServiceId } from './getImageServiceId.ts';

export function findThumbnail(
  vault: Vault,
  canvas: CanvasNormalized,
  height = 120
): string | null {
  const id = getImageServiceId(vault, canvas);
  if(!id) {
    return null
  }
  return `/full/,${height}/0/default.jpg`;
}