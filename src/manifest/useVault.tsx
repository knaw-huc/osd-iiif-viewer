import {useViewerStoreSelector} from '../useViewerStoreSelector.tsx';

export function useVault() {
  return useViewerStoreSelector((s) => s.manifest.vault);
}