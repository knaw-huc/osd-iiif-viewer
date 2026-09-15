import {
  Point,
  Rect,
  TiledImage,
  Viewer as OsdViewer,
  Viewer
} from 'openseadragon';
import type {PropsWithChildren, ReactNode, RefObject} from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  getImageServiceId,
  useLoadManifest,
  useManifest,
  useViewer,
  useViewerReady,
  useViewerStore,
  ViewerProvider,
} from '@knaw-huc/osd-iiif-viewer';
import {getValue} from '@iiif/helpers/i18n';
import type {Vault} from '@iiif/helpers/vault';

import './LazyCollectionViewerExample.css';

const manifestUrl =
  'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

export function LazyCollectionViewerExample() {
  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl}>
        <div className="lazy-view">
          <LazyViewer
            initialCanvas={314}
            heightViewportFraction={0.25}
          >
            <CollectionNavigationBar/>
          </LazyViewer>
        </div>
      </ManifestLoader>
    </ViewerProvider>
  );
}

function ManifestLoader(props: {
  url: string;
  children: ReactNode;
}) {
  const loadManifest = useLoadManifest();
  const {isReady, isLoading, error} = useManifest();

  useEffect(() => {
    loadManifest(props.url);
  }, [props.url, loadManifest]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading manifest...</div>;
  }
  return <>{props.children}</>;
}

type CanvasId = string;

type LazyTiledImage = {
  canvasId: CanvasId;
  y: number;
  height: number;
  imageServiceUrl: string;
};

type LazyViewerProps = PropsWithChildren<{
  gap?: number;
  heightViewportFraction?: number;
  initialCanvas?: number;
  preloadScreens?: number;
}>;

function LazyViewer(
  {
    children,
    gap = 0.02,
    heightViewportFraction = 0.5,
    initialCanvas = 0,
    preloadScreens = 2,
  }: LazyViewerProps
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();
  const viewer = useViewer();
  const {vault, id: manifestId, isReady} = useManifest();
  const loaderRef = useRef<LazyCanvasTileLoader | null>(null);
  const [lazyImages, setLazyImages] = useState<LazyTiledImage[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const size = useContainerSize(containerRef);
  const isContainerReady = size.width && size.height;

  useEffect(createViewer, [isContainerReady, store]);

  function createViewer() {
    if (!containerRef.current || !isContainerReady) {
      return;
    }

    const viewer = new OsdViewer({
      element: containerRef.current,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      crossOriginPolicy: 'Anonymous',
      showNavigationControl: true,
      constrainDuringPan: false,
      visibilityRatio: 0,
      minZoomLevel: 0.001,
      preserveViewport: true,
      gestureSettingsMouse: {
        scrollToZoom: false,
      },
    });

    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const deltaPoints = viewer.viewport
        .deltaPointsFromPixels(new Point(0, e.deltaY));
      viewer.viewport.panBy(deltaPoints);
    };

    container.addEventListener('wheel', handleWheel, {passive: false});

    store.getState().setViewer(viewer);
    store.getState().setViewerReady(true);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      loaderRef.current?.destroy();
      loaderRef.current = null;
      viewer.destroy();
      store.getState().resetViewer();
    };
  }

  useEffect(startLazyLoader, [
    vault,
    manifestId,
    isReady,
    store,
    viewer,
    gap,
    heightViewportFraction,
    initialCanvas,
    preloadScreens
  ]);

  function startLazyLoader() {
    if (!viewer || !manifestId || !isReady) {
      return;
    }

    const lazyImages = createLazyImages(vault, manifestId, gap);
    setLazyImages(lazyImages);

    const loader = new LazyCanvasTileLoader(viewer, lazyImages, preloadScreens);
    loaderRef.current = loader;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const onViewportChangeThrottled = () => {
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        timer = null;
        loader.update();
        setVisibleIndex(
          findCenterScan(viewer, lazyImages),
        );
      }, 150);
    };

    viewer.addHandler('viewport-change', onViewportChangeThrottled);
    viewer.addHandler('animation', onViewportChangeThrottled);

    if (lazyImages.length) {
      const startIndex = initialCanvas < lazyImages.length ? initialCanvas : 0;
      fitLayout(viewer, lazyImages[startIndex], heightViewportFraction);
    }

    loader.update();

    return () => {
      viewer.removeHandler('viewport-change', onViewportChangeThrottled);
      viewer.removeHandler('animation', onViewportChangeThrottled);
      if (timer) {
        clearTimeout(timer);
      }
      loader.destroy();
      loaderRef.current = null;
    };
  }

  useEffect(handleResize, [store]);

  function handleResize() {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    return observeResize(container, () => {
      const {viewer, viewerReady} = store.getState();
      if (viewer && viewerReady) {
        viewer.forceResize();
      }
    });
  }

  return (
    <LazyViewContext.Provider value={{
      lazyImages: {current: lazyImages},
      visibleIndex,
      setVisibleIndex,
    }}>
      <div
        ref={containerRef}
        style={{width: '100%', height: '100%'}}
      />
      {children}
    </LazyViewContext.Provider>
  );
}

export function CollectionNavigationBar() {
  const ready = useViewerReady();
  const viewer = useViewer();
  const {vault} = useManifest();
  const context = useScrollViewerContext();

  const images = context?.lazyImages.current ?? [];
  const visibleIndex = context?.visibleIndex ?? 0;

  const getCanvasLabel = () => {
    if (!vault || !context) {
      return '';
    }
    const scan = images[visibleIndex];
    if (!scan) {
      return '';
    }
    const canvas = vault.get({id: scan.canvasId, type: 'Canvas'});
    return getValue(canvas.label) || `Scan ${visibleIndex + 1}`;
  };

  const canvasLabel = getCanvasLabel();

  const scrollTo = useCallback((index: number) => {
    if (!viewer || !context) {
      return;
    }
    const scan = context.lazyImages.current[index];
    if (!scan) {
      return;
    }
    fitLayout(viewer, scan);
  }, [viewer, context]);

  const handlePrev = () => scrollTo(visibleIndex - 1);
  const handleNext = () => scrollTo(visibleIndex + 1);
  const handleLuck = () => scrollTo(Math.floor(Math.random() * images.length));

  if (!ready || !images.length) {
    return null;
  }

  return (
    <div className="scroll-navigation">
      <span className="scroll-info">
        {canvasLabel}
        &nbsp;
        ({visibleIndex + 1}/{images.length})
      </span>
      <div className="scroll-buttons">
        <button
          onClick={handlePrev}
          disabled={visibleIndex === 0}
        >
          Prev
        </button>
        <button onClick={handleLuck}>
          I'm Feeling Lucky
        </button>
        <button
          onClick={handleNext}
          disabled={visibleIndex >= images.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

type LazyViewContextState = {
  lazyImages: RefObject<LazyTiledImage[]>;
  visibleIndex: number;
  setVisibleIndex: (index: number) => void;
};

const LazyViewContext = createContext<LazyViewContextState | null>(null)

function useScrollViewerContext() {
  return useContext(LazyViewContext);
}

function createLazyImages(
  vault: Vault,
  manifestId: string,
  gap = 0.02,
): LazyTiledImage[] {
  const manifest = vault.get({id: manifestId, type: 'Manifest'});
  const images: LazyTiledImage[] = [];
  let y = 0;

  for (const item of manifest.items) {
    const canvas = vault.get(item);
    const imageServiceUrl = getImageServiceId(vault, canvas);
    if (!imageServiceUrl) {
      continue;
    }

    const height = canvas.height / canvas.width;
    images.push({
      y,
      height,
      canvasId: canvas.id,
      imageServiceUrl
    });
    y += height + gap;
  }

  return images;
}

function findCenterScan(
  viewer: Viewer,
  images: LazyTiledImage[],
): number {
  const bounds = viewer.viewport.getBounds(true);
  const center = bounds.y + bounds.height / 2;

  let closest = 0;
  let closestDist = Infinity;
  for (let i = 0; i < images.length; i++) {
    const dist = Math.abs(images[i].y + images[i].height / 2 - center);
    if (dist < closestDist) {
      closestDist = dist;
      closest = i;
    }
  }
  return closest;
}

function fitLayout(
  viewer: Viewer,
  scan: LazyTiledImage,
  heightViewportFraction?: number,
) {
  const aspect = viewer.viewport.getAspectRatio();
  const viewportHeight = heightViewportFraction
    ? scan.height / heightViewportFraction
    : scan.height;
  const viewportWidth = viewportHeight * aspect;
  const rect = new Rect(
    0.5 - viewportWidth / 2,
    scan.y - (viewportHeight - scan.height) / 2,
    viewportWidth,
    viewportHeight,
  );
  viewer.viewport.fitBounds(rect, !!heightViewportFraction);
}

class LazyCanvasTileLoader {
  private viewer: Viewer;
  private images: LazyTiledImage[];
  private preloadScreens: number;
  private loaded = new Map<CanvasId, TiledImage>();
  private pending = new Set<CanvasId>();
  private urlInfoMap = new Map<string, object>();

  constructor(
    viewer: Viewer,
    images: LazyTiledImage[],
    preloadScreens = 2
  ) {
    this.viewer = viewer;
    this.images = images;
    this.preloadScreens = preloadScreens;
  }

  update(): void {
    if (!this.viewer.viewport) {
      return;
    }

    const bounds = this.viewer.viewport.getBounds(true);
    const buffer = bounds.height * this.preloadScreens;
    const top = bounds.y - buffer;
    const bottom = bounds.y + bounds.height + buffer;

    const shouldBeVisible = new Set<string>();

    for (const image of this.images) {
      if (image.y + image.height > top && image.y < bottom) {
        const canvasId = image.canvasId;
        shouldBeVisible.add(canvasId);
        if (!this.loaded.has(canvasId) && !this.pending.has(canvasId)) {
          this.addScan(image);
        }
      }
    }

    for (const [canvasId, item] of this.loaded) {
      if (!shouldBeVisible.has(canvasId)) {
        this.viewer.world.removeItem(item);
        this.loaded.delete(canvasId);
      }
    }
  }

  destroy(): void {
    this.viewer.world.removeAll();
    this.loaded.clear();
    this.pending.clear();
  }

  private async addScan(image: LazyTiledImage): Promise<void> {
    this.pending.add(image.canvasId);

    try {
      const tileSource = await this.fetchInfo(image.imageServiceUrl);
      if (!this.pending.has(image.canvasId)) {
        return;
      }

      this.viewer.addTiledImage({
        tileSource,
        x: 0,
        y: image.y,
        width: 1,
        // @ts-expect-error type mismatch
        success: ((event: { item: TiledImage }) => {
          this.pending.delete(image.canvasId);
          this.loaded.set(image.canvasId, event.item);
        }),
        error: () => {
          this.pending.delete(image.canvasId);
        },
      });
    } catch {
      this.pending.delete(image.canvasId);
    }
  }

  private async fetchInfo(imageServiceUrl: string): Promise<object> {
    const url = imageServiceUrl + '/info.json';
    const cached = this.urlInfoMap.get(url);
    if (cached) {
      return cached;
    }
    const resp = await fetch(url);
    const info = await resp.json();
    this.urlInfoMap.set(url, info);
    return info;
  }
}

function observeResize(
  element: HTMLElement,
  callback: (rect: DOMRect) => void,
) {
  const observer = new ResizeObserver((entries) => {
    callback(entries[0].contentRect);
  });
  observer.observe(element);
  return () => observer.disconnect();
}

function useContainerSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    setSize({width: rect.width, height: rect.height});

    return observeResize(container, (rect) => {
      setSize({width: rect.width, height: rect.height});
    });
  }, [ref]);

  return size;
}
