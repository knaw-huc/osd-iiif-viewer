import {useCallback, useEffect, type RefObject} from "react";
import {useViewerStoreSelector} from "./useViewerStoreSelector.tsx";
import {useViewer} from "./useViewer.tsx";
import {useViewerStore} from "./useViewerStore.tsx";

/**
 * Expose zoom and full-screen controls and state
 *
 * Note: Fullscreen is handled via the native Fullscreen API,
 * skipping setFullScreen/setFullPage which moves
 * the viewer to <body> and destroys the React component tree.
 * @see https://github.com/openseadragon/openseadragon/issues/449
 */
export function useViewerControls(
  fullscreenRef: RefObject<HTMLElement | null>
) {
  const viewer = useViewer();
  const store = useViewerStore();
  const zoomLevel = useViewerStoreSelector((s) => s.zoomLevel);
  const zoomMin = useViewerStoreSelector((s) => s.zoomMin);
  const zoomMax = useViewerStoreSelector((s) => s.zoomMax);
  const isFullPage = useViewerStoreSelector((s) => s.isFullPage);

  useEffect(() => {
    const onFullscreenChange = () => {
      store.getState().setIsFullPage(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener(
      "fullscreenchange",
      onFullscreenChange
    );
  }, [store]);

  const zoomIn = useCallback(() => {
    viewer?.viewport.zoomBy(1.5);
  }, [viewer]);

  const zoomOut = useCallback(() => {
    viewer?.viewport.zoomBy(0.667);
  }, [viewer]);

  const home = useCallback(() => {
    viewer?.viewport.goHome();
  }, [viewer]);

  const toggleFullPage = useCallback(() => {
    const container = fullscreenRef?.current;
    if (!container) {
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [fullscreenRef]);

  return {
    zoomIn,
    zoomOut,
    home,
    toggleFullPage,
    zoomLevel,
    zoomMin,
    zoomMax,
    isFullPage
  };
}