import {type TileSourceOptions, Viewer} from "openseadragon";
import {useEffect, useRef} from "react";
import {useViewerStore} from "./useViewerStore.tsx";

type ViewerCanvasProps = {
  tileSource: string | TileSourceOptions;
};

export function ViewerCanvas({tileSource}: ViewerCanvasProps) {
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
    });

    store.getState().setViewer(viewer);
    viewer.addOnceHandler("open", () => {
      store.getState().setViewerReady(true);
    });

    return () => {
      viewer.destroy();
      store.getState().setViewer(null);
      store.getState().setViewerReady(false);
    };
  }, [tileSource, store]);

  return <div
    id="viewer"
    ref={containerRef}
    style={{width: "100%", height: "100%"}}
  />;
}