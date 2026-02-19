import {useViewerStoreSelector} from "../useViewerStoreSelector.tsx";

export function useManifest() {
  return useViewerStoreSelector((s) => s.manifest);
}

export function useLoadManifest() {
  return useViewerStoreSelector((s) => s.loadManifest);
}