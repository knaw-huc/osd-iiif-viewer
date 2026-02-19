import type {ViewerCanvas, ViewerManifest, ViewerRange} from './model.ts';
import {findLanguage} from './findLanguage.ts';
import {orThrow} from '../util/orThrow.ts';

export function parseManifest(json: unknown): ViewerManifest {
  assertManifest(json);

  return {
    id: json.id,
    label: findLanguage(json.label),
    canvases: json.items.map(parseCanvas),
    structures: parseStructures(json.structures),
    metadata: {
      attribution: parseAttribution(json.requiredStatement),
      rights: json.rights ?? null,
      thumbnailUrl: parseThumbnailUrl(json.thumbnail),
    },
  };
}

function parseCanvas(canvas: ManifestCanvas): ViewerCanvas {
  const page = canvas.items
      ?.find(isAnnotationPage)
    ?? orThrow('No annotation page');
  const painting = page.items
      ?.find(isPaintingAnnotation)
    ?? orThrow('No painting annotation');
  const body = toBody(painting.body);
  const service = body.service
      ?.find(isImageService2)
    ?? orThrow('No ImageService2');
  const serviceId = service['@id']
    ?? orThrow('No @id');

  const annotationPageIds = (canvas.annotations ?? [])
    .filter(isAnnotationPage)
    .map((a) => a.id)
    .filter(isString);

  return {
    id: canvas.id,
    label: findLanguage(canvas.label),
    width: canvas.width,
    height: canvas.height,
    imageServiceId: serviceId,
    annotationPageIds,
  };
}

function parseStructures(ranges: ManifestRange[] | undefined): ViewerRange[] {
  if (!ranges?.length) {
    return [];
  }

  const top = ranges[0];
  if (!top.items?.length) {
    return [];
  }

  return top.items.filter(isRange).map(parseRange);
}

function parseRange(range: ManifestRange): ViewerRange {
  const items = range.items ?? [];

  return {
    id: range.id,
    label: findLanguage(range.label),
    canvasIds: items.filter(isCanvasRef).map((c) => c.id),
    children: items.filter(isRange).map(parseRange),
  };
}

function parseAttribution(
  statement?: ManifestRequiredStatement
): string | null {
  if (!statement) {
    return null;
  }
  return findLanguage(statement.value);
}

function parseThumbnailUrl(
  thumbnails?: ManifestThumbnail[]
): string | null {
  if (!thumbnails?.length) {
    return null;
  }
  return thumbnails[0].id;
}

function toBody(
  body: ManifestAnnotationBody | ManifestAnnotationBody[]
): ManifestAnnotationBody {
  if (Array.isArray(body)) {
    return body[0] ?? orThrow('Empty body array');
  }
  return body;
}

type Manifest = {
  id: string;
  type: 'Manifest';
  label: ManifestLanguageMap;
  items: ManifestCanvas[];
  structures?: ManifestRange[];
  requiredStatement?: ManifestRequiredStatement;
  rights?: string;
  thumbnail?: ManifestThumbnail[];
};

function assertManifest(json: unknown): asserts json is Manifest {
  if (!json || typeof json !== 'object') {
    throw new Error('No manifest found');
  }
  if (!('type' in json) || json.type !== 'Manifest') {
    throw new Error('No manifest type found');
  }
}

type ManifestCanvas = {
  id: string;
  type: 'Canvas';
  label: ManifestLanguageMap;
  width: number;
  height: number;
  items?: ManifestAnnotationPage[];
  annotations?: ManifestAnnotationPage[];
};

type ManifestAnnotationPage = {
  id?: string;
  type: 'AnnotationPage';
  items?: ManifestAnnotation[];
};

function isAnnotationPage(item: unknown): item is ManifestAnnotationPage {
  return typeof item === 'object' && item !== null
    && 'type' in item && item.type === 'AnnotationPage';
}

type ManifestAnnotation = {
  type: 'Annotation';
  motivation: string;
  body: ManifestAnnotationBody | ManifestAnnotationBody[];
  target: string;
};

function isPaintingAnnotation(item: unknown): item is ManifestAnnotation {
  return typeof item === 'object' && item !== null
    && 'motivation' in item && item.motivation === 'painting';
}

type ManifestAnnotationBody = {
  type: string;
  service?: ManifestService[];
};

type ManifestService = {
  '@id'?: string;
  '@type'?: string;
  id?: string;
  type?: string;
};

function isImageService2(service: ManifestService): boolean {
  return service['@type'] === 'ImageService2';
}

type ManifestRange = {
  id: string;
  type: 'Range';
  label?: ManifestLanguageMap;
  items?: (ManifestRange | ManifestCanvasRef)[];
};

function isRange(
  item: ManifestRange | ManifestCanvasRef
): item is ManifestRange {
  return item.type === 'Range';
}

type ManifestCanvasRef = {
  id: string;
  type: 'Canvas';
};

function isCanvasRef(
  item: ManifestRange | ManifestCanvasRef
): item is ManifestCanvasRef {
  return item.type === 'Canvas';
}

type ManifestRequiredStatement = {
  label: ManifestLanguageMap;
  value: ManifestLanguageMap;
};

type ManifestThumbnail = {
  id: string;
  type: string;
};

type ManifestLanguageMap = Record<string, string[]>;

function isString(value: unknown): value is string {
  return typeof value === 'string';
}