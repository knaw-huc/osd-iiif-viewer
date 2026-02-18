import {type TileSourceOptions, Viewer} from "openseadragon";
import {useEffect, useRef} from "react";
import {useViewerStore} from "./useViewerStore.tsx";

type ViewerCanvasProps = {
  tileSource: string | TileSourceOptions;
  showControls?: boolean;
};

export function ViewerCanvas({tileSource, showControls = true}: ViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const viewer = new Viewer({
      element: containerRef.current,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      crossOriginPolicy: "Anonymous",
      tileSources: tileSource,
      showNavigationControl: showControls,
    });

    const state = store.getState();
    state.setViewer(viewer);

    viewer.addOnceHandler("open", () => {
      const state = store.getState();
      state.setViewerReady(true);
      state.setZoomLevel(viewer.viewport.getZoom());
      state.setZoomMin(viewer.viewport.getMinZoom());
      state.setZoomMax(viewer.viewport.getMaxZoom());
    });

    const onZoom = () => {
      store.getState().setZoomLevel(viewer.viewport.getZoom());
    };

    viewer.addHandler("animation-start", onZoom);
    viewer.addHandler("animation-finish", onZoom);

    return () => {
      viewer.removeHandler("animation-start", onZoom);
      viewer.removeHandler("animation-finish", onZoom);
      viewer.destroy();
      const state = store.getState();
      state.setViewer(null);
      state.setViewerReady(false);
      state.setZoomLevel(null);
      state.setZoomMin(null);
      state.setZoomMax(null);
      state.setIsFullPage(false);
    };
  }, [tileSource, showControls, store]);

  return <div
    id="viewer"
    ref={containerRef}
    style={{width: "100%", height: "100%"}}
  />;
}