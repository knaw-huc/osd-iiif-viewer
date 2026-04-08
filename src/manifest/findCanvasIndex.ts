import type {Vault} from '@iiif/helpers/vault';

export function findCanvasIndex(
  vault: Vault,
  manifestUrl: string,
  canvasId: string,
): number {
  const manifest = vault.get({id: manifestUrl, type: 'Manifest'});
  return manifest.items.findIndex((item) => {
    const canvas = vault.get(item);
    return canvas.id === canvasId;
  });
}