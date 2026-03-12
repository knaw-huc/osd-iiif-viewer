import { useViewerStoreSelector } from '../useViewerStoreSelector.tsx';

export function useManifest() {
  const url = useViewerStoreSelector((s) => s.url);
  const isLoading = useViewerStoreSelector((s) => s.isLoading);
  const error = useViewerStoreSelector((s) => s.error);
  const isReady = !!url && !isLoading && !error;
  return { url, isLoading, error, isReady };
}

export function useLoadManifest() {
  return useViewerStoreSelector((s) => s.loadManifest);
}