import {useViewerReady, ViewerCanvas, ViewerProvider} from '../src/lib';
import {useCanvas} from '../src/lib/manifest/useCanvas.tsx';
import {ManifestLoader} from './ManifestLoader.tsx';

import './navigation.css'

const manifestUrl = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';
const documentVijf = 314;

export function CanvasNavigationExample() {
  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl} canvas={documentVijf}>
        <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
          <ViewerCanvas showControls={false}/>
          <NavigationBar/>
        </div>
      </ManifestLoader>
    </ViewerProvider>
  );
}

function NavigationBar() {
  const ready = useViewerReady();
  const {currentIndex, current, total, goTo, next, prev} = useCanvas();

  const handleLuck = () => {
    goTo(Math.floor(Math.random() * total));
  };

  if (!ready) {
    return null
  }

  return (
    <div className="navigation">
      <span className="info">
        {ready ? current?.label : 'loading...'}
        &nbsp;
        ({currentIndex + 1}/{total})
      </span>
      <div className="buttons">
        <button
          onClick={prev}
          disabled={!currentIndex}
        >
          prev
        </button>
        <button
          onClick={handleLuck}
        >
          I'm Feeling Lucky
        </button>
        <button
          onClick={next}
          disabled={currentIndex === total - 1}
        >
          next
        </button>
      </div>
    </div>
  );
}