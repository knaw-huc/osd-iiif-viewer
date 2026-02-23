# @knaw-huc/osd-iiif-viewer

React wrapper around OpenSeadragon to display and browse image sources from iiif manifests.

Current features (WIP):
- Canvas navigation
- Highlight overlay
- Zoom and fullscreen controls
- Manifest parsing (iiif manifests v3, ImageService2)

## Minimal example
```tsx
import {useEffect} from 'react';
import {
  ViewerProvider,
  ViewerCanvas,
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';

export function Example() {
  return <ViewerProvider>
    <Viewer/>
  </ViewerProvider>
}

function Viewer() {
  const loadManifest = useLoadManifest();
  const manifest = useManifest();

  useEffect(() => {
    loadManifest('/manifest.json');
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
```

