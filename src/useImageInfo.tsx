import { useViewer } from './useViewer';
import { useViewerReady } from './useViewerReady';
import { useMemo } from 'react';

export type ImageInfo = {
  location: OpenSeadragon.Rect;
  size: OpenSeadragon.Point;
};

export function useImageInfo(): ImageInfo | null {
  const viewer = useViewer();
  const ready = useViewerReady();

  return useMemo(() => {
    if (!viewer || !ready) {
      return null;
    }
    const item = viewer.world.getItemAt(0);
    if (!item) {
      return null;
    }
    const size = item.getContentSize();
    const rect = item.imageToViewportRectangle(0, 0, size.x, size.y);
    return { location: rect, size };
  }, [viewer, ready]);
}