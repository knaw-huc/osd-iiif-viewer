import type {Vault} from '@iiif/helpers/vault';

export function findCanvasIndex(
  vault: Vault,
  manifestId: string,
  canvasId: string,
): number {
  const manifest = vault.get({id: manifestId, type: 'Manifest'});
  return manifest.items.findIndex((item) => {
    const canvas = vault.get(item);
    return canvas.id === canvasId;
  });
}