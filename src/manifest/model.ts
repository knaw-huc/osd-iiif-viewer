/**
 * Internal model of parsed iiif manifests
 */

export type ViewerManifest = {
  id: string;
  label: string;
  canvases: ViewerCanvas[];
  structures: ViewerRange[];
  metadata: ViewerMetadata;
};

export type ViewerCanvas = {
  id: string;
  label: string;
  width: number;
  height: number;
  imageServiceId: string;
  annotationPageIds: string[];
};

export type ViewerRange = {
  id: string;
  label: string;
  canvasIds: string[];
  children: ViewerRange[];
};

export type ViewerMetadata = {
  attribution: string | null;
  rights: string | null;
  thumbnailUrl: string | null;
};