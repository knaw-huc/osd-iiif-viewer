import {useViewerStoreSelector} from './useViewerStoreSelector.tsx';

export function useViewerReady() {
  return useViewerStoreSelector((s) => s.viewerReady);
}