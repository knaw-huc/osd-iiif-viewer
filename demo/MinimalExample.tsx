import {useEffect} from 'react';
import {
  Viewer,
  ViewerProvider,
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';

const manifestUrl = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

export function MinimalExample() {
  return <ViewerProvider>
    <View/>
  </ViewerProvider>
}

function View() {
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
      <Viewer/>
    </div>
  );
}
