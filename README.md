# @knaw-huc/osd-iiif-viewer

React wrapper around OpenSeadragon to display and browse image sources from IIIF manifests.

Features:
- Canvas navigation
- Highlight overlay
- Zoom and fullscreen controls
- IIIF manifest loading

## Example
```tsx
import { useEffect } from 'react';
import {
  Viewer,
  ViewerProvider,
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';

export function Example() {
  return <ViewerProvider>
    <View/>
  </ViewerProvider>
}

function View() {
  const loadManifest = useLoadManifest();
  const { isReady } = useManifest();

  useEffect(() => {
    loadManifest('/manifest.json');
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
```

For more examples, run `npm i && npm start` and open http://localhost:5173