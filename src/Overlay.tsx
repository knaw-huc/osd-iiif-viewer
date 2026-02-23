import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {useViewer} from './useViewer';

type OverlayProps = {
  location: OpenSeadragon.Rect;
  children: React.ReactNode;
};

export function Overlay({ location, children }: OverlayProps) {
  const viewer = useViewer();
  const [container] = useState(() => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    return el;
  });


  useEffect(() => {
    if (!viewer) {
      return;
    }
    viewer.addOverlay({ element: container, location });
    return () => {
      viewer.removeOverlay(container);
    };
  }, [viewer, location, container]);

  if (!viewer) {
    return null;
  }
  return createPortal(children, container);
}