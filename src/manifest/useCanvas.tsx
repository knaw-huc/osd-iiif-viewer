import { useMemo } from 'react';
import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { useViewerStoreSelector } from '../useViewerStoreSelector.tsx';
import {orThrow} from '../util/orThrow.ts';

export function useCanvas() {
  const { vault, url, isLoading } = useViewerStoreSelector((s) => s.manifest);
  const currentIndex = useViewerStoreSelector((s) => s.canvas.currentIndex);
  const goTo = useViewerStoreSelector((s) => s.goToCanvas);
  const next = useViewerStoreSelector((s) => s.nextCanvas);
  const prev = useViewerStoreSelector((s) => s.prevCanvas);

  const { current, total } = useMemo((): {
    current: CanvasNormalized | null;
    total: number;
  } => {
    if (!url || isLoading) {
      return { current: null, total: 0 };
    }
    const manifest = vault.get({ id: url, type: 'Manifest' });
    const canvasRef = manifest.items[currentIndex]
      ?? orThrow('No canvas ref for ' + currentIndex);
    const current = vault.get(canvasRef);
    const total = manifest.items.length;
    return {current, total};
  }, [vault, url, isLoading, currentIndex]);

  return { currentIndex, current, total, goTo, next, prev };
}