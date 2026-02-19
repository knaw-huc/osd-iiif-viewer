import {useViewerStoreSelector} from '../useViewerStoreSelector.tsx';

export function useCanvas() {
  const {currentIndex} = useViewerStoreSelector((s) => s.canvas);
  const goTo = useViewerStoreSelector((s) => s.goToCanvas);
  const next = useViewerStoreSelector((s) => s.nextCanvas);
  const prev = useViewerStoreSelector((s) => s.prevCanvas);
  const current = useViewerStoreSelector(
    (s) => s.manifest.data?.canvases[s.canvas.currentIndex] ?? null
  );
  const total = useViewerStoreSelector(
    (s) => s.manifest.data?.canvases.length ?? 0
  );
  return {currentIndex, goTo, next, prev, current, total};
}
