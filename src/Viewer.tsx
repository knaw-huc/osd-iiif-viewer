import {Viewer as OsdViewer} from 'openseadragon';
import {useEffect, useRef} from 'react';
import {useViewerStore} from './useViewerStore.tsx';
import {findTileSource} from './manifest/findTileSource.ts';
import {useCanvas} from './manifest/useCanvas.tsx';
import {useManifest} from './manifest/useManifest.tsx';

type ViewerProps = {
  showControls?: boolean;
};

export function Viewer({showControls = true}: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();
  const {vault} = useManifest();
  const {current} = useCanvas();
  const tileSource = current ? findTileSource(vault, current) : null;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const viewer = new OsdViewer({
      element: containerRef.current,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      crossOriginPolicy: 'Anonymous',
      showNavigationControl: showControls,
    });

    const state = store.getState();
    state.setViewer(viewer);

    viewer.addHandler('open', () => {
      const state = store.getState();
      state.setViewerReady(true);
      state.setZoomLevel(viewer.viewport.getZoom());
      state.setZoomMin(viewer.viewport.getMinZoom());
      state.setZoomMax(viewer.viewport.getMaxZoom());
      state.setRotation(viewer.viewport.getRotation());
    });

    const onZoom = () => {
      store.getState().setZoomLevel(viewer.viewport.getZoom());
    };

    const onRotate = () => {
      store.getState().setRotation(viewer.viewport.getRotation());
    };

    viewer.addHandler('animation-start', onZoom);
    viewer.addHandler('animation-finish', onZoom);
    viewer.addHandler('rotate', onRotate);

    return () => {
      viewer.destroy();
      store.getState().resetViewer();
    };
  }, [showControls, store]);

  useEffect(() => {
    const viewer = store.getState().viewer;
    if (!viewer || !tileSource) {
      return;
    }
    viewer.open(tileSource);
  }, [tileSource, store]);

  return <div
    id="viewer"
    ref={containerRef}
    style={{width: '100%', height: '100%'}}
  />;
}