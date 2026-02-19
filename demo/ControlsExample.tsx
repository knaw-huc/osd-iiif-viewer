import {type RefObject, useRef} from 'react';
import {useViewerControls, ViewerCanvas, ViewerProvider} from '../src/lib';
import './controls.css';
import {ManifestLoader} from './ManifestLoader.tsx';

const manifestUrl = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';
const documentVijf = 314;

export function ControlsExample() {
  const fullscreenRef = useRef<HTMLDivElement>(null);

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl} canvas={documentVijf}>
        <div
          ref={fullscreenRef}
          style={{position: 'relative', width: '100vw', height: '100vh'}}
        >
          <ViewerCanvas showControls={false}/>
          <Toolbar fullscreenRef={fullscreenRef}/>
        </div>
      </ManifestLoader>
    </ViewerProvider>
  );
}

type ToolbarProps = { fullscreenRef: RefObject<HTMLDivElement | null> };

function Toolbar({fullscreenRef}: ToolbarProps) {
  const {
    zoomIn,
    zoomOut,
    toggleFullPage,
    isFullPage,
  } = useViewerControls(fullscreenRef);

  return (
    <div className="controls">
      <button onClick={zoomIn}>zoom in</button>
      <button onClick={zoomOut}>zoom out</button>
      <button onClick={toggleFullPage}>
        {isFullPage ? 'exit fullscreen' : 'fullscreen'}
      </button>
    </div>
  );
}