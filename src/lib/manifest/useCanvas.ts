import {useViewerStoreSelector} from "../useViewerStoreSelector.tsx";

export function useCanvas() {
  const {currentIndex} = useViewerStoreSelector((s) => s.canvas);
  const goTo = useViewerStoreSelector((s) => s.goToCanvas);
  const next = useViewerStoreSelector((s) => s.nextCanvas);
  const prev = useViewerStoreSelector((s) => s.prevCanvas);
  return {currentIndex, goTo, next, prev};
}
