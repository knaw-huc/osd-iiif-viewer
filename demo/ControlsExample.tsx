import {useEffect, useRef, useState, type RefObject} from "react";
import type {Manifest} from "@iiif/presentation-3";
import {getTileSourceFromManifest, fetchJson} from "./utils.ts";
import {useViewerControls, ViewerCanvas, ViewerProvider} from "../src/lib";
import './controls.css'

export function ControlsExample() {
  const manifestUrl = "https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json";
  const documentVijf = 314;

  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [tileSource, setTileSource] = useState<string>();

  useEffect(() => {
    load();

    async function load() {
      const manifest = await fetchJson<Manifest>(manifestUrl);
      setTileSource(getTileSourceFromManifest(manifest, documentVijf));
    }
  }, []);

  if (!tileSource) {
    return <>Loading manifest</>;
  }

  return (
    <ViewerProvider>
      <div
        ref={fullscreenRef}
        style={{position: "relative", width: "100vw", height: "100vh"}}
      >
        <ViewerCanvas tileSource={tileSource} showControls={false}/>
        <Toolbar fullscreenRef={fullscreenRef}/>
      </div>
    </ViewerProvider>
  );
}

type ToolbarProps = { fullscreenRef: RefObject<HTMLDivElement | null> };

function Toolbar({fullscreenRef}: ToolbarProps) {
  const {
    zoomIn,
    zoomOut,
    toggleFullPage,
    isFullPage
  } = useViewerControls(fullscreenRef);

  return (
    <div className="controls">
      <button onClick={zoomIn}>zoom in</button>
      <button onClick={zoomOut}>zoom out</button>
      <button onClick={toggleFullPage}>
        {isFullPage ? "exit fullscreen" : "fullscreen"}
      </button>
    </div>
  );
}
