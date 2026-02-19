import {useEffect} from 'react';
import {
  ViewerProvider,
  ViewerCanvas,
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';

const manifestUrl = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

export function MinimalExample() {
  return <ViewerProvider>
    <Viewer/>
  </ViewerProvider>
}

function Viewer() {
  const loadManifest = useLoadManifest();
  const manifest = useManifest();

  useEffect(() => {
    loadManifest(manifestUrl);
  }, [loadManifest]);

  if (!manifest.data) {
    return null;
  }

  return (
    <div style={{width: '100%', height: '100vh'}}>
      <ViewerCanvas/>
    </div>
  );
}
