import {useMemo} from 'react';
import type {CanvasNormalized} from '@iiif/presentation-3-normalized';
import {useViewerStoreSelector} from '../useViewerStoreSelector.tsx';
import {orThrow} from '../util/orThrow.ts';

export function useCanvas() {
  const vault = useViewerStoreSelector((s) => s.vault);
  const id = useViewerStoreSelector((s) => s.id);
  const isLoading = useViewerStoreSelector((s) => s.isLoading);
  const currentIndex = useViewerStoreSelector((s) => s.currentIndex);
  const goTo = useViewerStoreSelector((s) => s.goToCanvas);
  const goToById = useViewerStoreSelector((s) => s.goToCanvasById);
  const next = useViewerStoreSelector((s) => s.nextCanvas);
  const prev = useViewerStoreSelector((s) => s.prevCanvas);

  const {current, total} = useMemo((): {
    current: CanvasNormalized | null;
    total: number;
  } => {
    if (!id || isLoading) {
      return {current: null, total: 0};
    }
    const manifest = vault.get({id, type: 'Manifest'});
    const canvasRef = manifest.items[currentIndex]
      ?? orThrow('No canvas ref for ' + currentIndex);
    const current = vault.get(canvasRef);
    const total = manifest.items.length;
    return {current, total};
  }, [vault, id, isLoading, currentIndex]);

  const currentCanvasId = current?.id ?? null;

  return {
    currentIndex,
    currentCanvasId,
    current,
    total,
    goTo,
    goToById,
    next,
    prev
  };
}