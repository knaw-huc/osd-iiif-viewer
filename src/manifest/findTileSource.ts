import type { Vault } from '@iiif/helpers/vault';
import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { getImageServiceId } from './getImageServiceId.ts';

export function findTileSource(
  vault: Vault,
  canvas: CanvasNormalized
): string | null {
  const id = getImageServiceId(vault, canvas);
  if (!id) {
    return null;
  }
  return id + '/info.json';
}