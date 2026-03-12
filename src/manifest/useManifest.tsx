import {useViewerStoreSelector} from '../useViewerStoreSelector.tsx';

export function useManifest() {
  const vault = useViewerStoreSelector((s) => s.vault);
  const url = useViewerStoreSelector((s) => s.url);
  const isLoading = useViewerStoreSelector((s) => s.isLoading);
  const error = useViewerStoreSelector((s) => s.error);
  const loadManifest = useViewerStoreSelector((s) => s.loadManifest);
  const isReady = !!url && !isLoading && !error;
  return { vault, url, isLoading, error, isReady, loadManifest };
}

export function useLoadManifest() {
  return useViewerStoreSelector((s) => s.loadManifest);
}