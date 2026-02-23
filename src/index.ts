export {HighlightOverlay, type Highlight} from './HighlightOverlay.tsx';

export {ViewerCanvas} from './ViewerCanvas';
export {ViewerProvider} from './ViewerProvider';
export {useViewer} from './useViewer';
export {useViewerControls} from './useViewerControls';
export {useViewerReady} from './useViewerReady';
export {useViewerStore} from './useViewerStore';
export {useManifest, useLoadManifest} from './manifest/useManifest';
export {useCanvas} from './manifest/useCanvas';
export type {
  ViewerManifest,
  ViewerCanvas as ViewerCanvasModel,
  ViewerRange,
  ViewerMetadata
} from './manifest/model';