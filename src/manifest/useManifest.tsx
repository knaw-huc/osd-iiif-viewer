import { useViewerStoreSelector } from '../useViewerStoreSelector.tsx';

export function useManifest() {
  const manifest = useViewerStoreSelector((s) => s.manifest);
  const isReady = !!manifest.url && !manifest.isLoading && !manifest.error;
  return { ...manifest, isReady };
}

export function useLoadManifest() {
  return useViewerStoreSelector((s) => s.loadManifest);
}