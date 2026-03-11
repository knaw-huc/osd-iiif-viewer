import { useEffect } from 'react';
import {
  Viewer,
  ViewerProvider,
  useLoadManifest,
  useManifest
} from '@knaw-huc/osd-iiif-viewer';

const manifestUrl = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

export function MinimalExample() {
  return <ViewerProvider>
    <MyOsdIiifView/>
  </ViewerProvider>;
}

function MyOsdIiifView() {
  const loadManifest = useLoadManifest();
  const {isReady} = useManifest()

  useEffect(() => {
    loadManifest(manifestUrl);
  }, [loadManifest]);

  if (!isReady) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Viewer/>
    </div>
  );
}