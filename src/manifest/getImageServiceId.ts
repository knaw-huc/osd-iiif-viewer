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
  if (services.length) {
    return getId(services[0]) ?? null;
  }

  return getImageServiceIdWithoutProfileCheck(resource);
}

/**
 * Fallback when {@link getImageServices} fails to match the service profile.
 * E.g.: when manifest uses full profile URL instead of short form ("level1")
 */
function getImageServiceIdWithoutProfileCheck(
  resource: IIIFExternalWebResource
): Id | null {
  const service = resource.service;
  if (!Array.isArray(service) || !service.length) {
    return null;
  }
  const first = service[0];
  if (typeof first === 'object' && first && 'id' in first) {
    return first.id as string
  }
  return null;
}

function isExternalWebResource(
  resource: IIIFExternalWebResource | SpecificResource
): resource is IIIFExternalWebResource {
  return resource.type !== 'SpecificResource';
}
