import {useViewerStoreSelector} from "./useViewerStoreSelector.tsx";

export function useViewer() {
  return useViewerStoreSelector((s) => s.viewer);
}