import type {Vault} from '@iiif/helpers/vault';
import type {CanvasNormalized} from '@iiif/presentation-3-normalized';
import type {
  IIIFExternalWebResource,
  SpecificResource
} from '@iiif/presentation-3';
import {
  createPaintingAnnotationsHelper
} from '@iiif/helpers/painting-annotations';
import {getImageServices, getId} from '@iiif/parser/image-3';
import type {Id} from '../Id.ts';

export function getImageServiceId(
  vault: Vault,
  canvas: CanvasNormalized
): Id | null {
  const helper = createPaintingAnnotationsHelper(vault);
  const paintables = helper.getPaintables(canvas.id);
  if (!paintables.items.length) {
    return null;
  }
  const resource = paintables.items[0].resource;
  if (!isExternalWebResource(resource)) {
    return null;
  }
  const services = getImageServices(resource);
  if (!services.length) {
    return null;
  }
  return getId(services[0]) ?? null;
}

function isExternalWebResource(
  resource: IIIFExternalWebResource | SpecificResource
): resource is IIIFExternalWebResource {
  return resource.type !== 'SpecificResource';
}
