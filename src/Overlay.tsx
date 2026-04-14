import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {useViewer} from './useViewer';

type OverlayProps = {
  location: OpenSeadragon.Rect;
  children: React.ReactNode;
};

export function Overlay({ location, children }: OverlayProps) {
  const viewer = useViewer();
  const [overlay] = useState(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    return div;
  });

  useEffect(() => {
    function stopPropagation(event: PointerEvent) {
      if (event.target !== overlay) {
        event.stopPropagation();
      }
    }
    overlay.addEventListener('pointerdown', stopPropagation);
    return () => {
      overlay.removeEventListener('pointerdown', stopPropagation);
    };
  }, [overlay]);

  useEffect(() => {
    if (!viewer) {
      return;
    }
    viewer.addOverlay({ element: overlay, location });
    return () => {
      if (viewer.isOpen()) {
        viewer.removeOverlay(overlay);
      }
    };
  }, [viewer, location, overlay]);

  if (!viewer) {
    return null;
  }
  return createPortal(children, overlay);
}