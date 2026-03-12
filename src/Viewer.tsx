import {Viewer as OsdViewer} from 'openseadragon';
import {type RefObject, useEffect, useRef, useState} from 'react';
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
  const size = useContainerSize(containerRef);
  const isContainerReady = size.width > 0 && size.height > 0;

  useEffect(createOsdViewer, [isContainerReady, showControls, store]);
  function createOsdViewer() {
    if (!containerRef.current || !isContainerReady) {
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
  }

  useEffect(openTileSource, [tileSource, store, isContainerReady]);
  function openTileSource() {
    const state = store.getState();
    const viewer = state.viewer;
    if (!viewer || !tileSource) {
      return;
    }
    state.setViewerReady(false);
    viewer.open(tileSource);
  }

  useEffect(resizeViewerOnContainerResize, [store]);
  function resizeViewerOnContainerResize() {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    return observeResize(container, () => {
      const {viewer, viewerReady} = store.getState();
      if (viewer && viewerReady) {
        viewer.forceResize();
      }
    });
  }

  return <div
    id="viewer"
    ref={containerRef}
    style={{width: '100%', height: '100%'}}
  />;
}

function observeResize(
  element: HTMLElement,
  callback: (rect: DOMRect) => void
) {
  const ro = new ResizeObserver((entries) => {
    callback(entries[0].contentRect);
  });
  ro.observe(element);
  return () => ro.disconnect();
}

function useContainerSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    setSize({width: rect.width, height: rect.height});

    return observeResize(element, (rect) => {
      setSize({width: rect.width, height: rect.height});
    });
  }, [ref]);

  return size;
}