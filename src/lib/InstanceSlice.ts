import type {StateCreator} from "zustand/vanilla";
import type OpenSeadragon from "openseadragon";
import type {ViewerStore} from "./ViewerStore.ts";

export interface InstanceSlice {
  viewer: OpenSeadragon.Viewer | null;
  viewerReady: boolean;
  setViewer: (viewer: OpenSeadragon.Viewer | null) => void;
  setViewerReady: (viewerReady: boolean) => void;
}

export const createInstanceSlice: StateCreator<ViewerStore, [], [], InstanceSlice> = (set) => ({
  viewer: null,
  viewerReady: false,
  setViewer: (viewer) => set({viewer}),
  setViewerReady: (viewerReady) => set({viewerReady}),
});