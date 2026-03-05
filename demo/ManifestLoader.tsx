import {
  useLoadManifest,
  useCanvas,
  useManifest
} from '@knaw-huc/osd-iiif-viewer';
import {useEffect} from 'react';

type ManifestLoaderProps = {
  children: React.ReactNode;
  url: string;
  canvas: number;
};

export function ManifestLoader(
  {children, url, canvas}: ManifestLoaderProps
) {
  const loadManifest = useLoadManifest();
  const {goTo} = useCanvas();
  const {isLoading, isReady, error} = useManifest();

  useEffect(() => {
    loadManifest(url);
  }, [loadManifest, url]);

  useEffect(() => {
    if (isReady) {
      goTo(canvas);
    }
  }, [isReady, goTo, canvas]);

  if (isLoading) {
    return <>Loading manifest...</>;
  }
  if (error) {
    return <>Error: {error}</>;
  }
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}