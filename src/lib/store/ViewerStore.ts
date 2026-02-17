import {createStore} from "zustand/vanilla";
import type OpenSeadragon from "openseadragon";

export type ViewerStore = ViewerState & ViewerActions;

export interface ViewerState {
  viewer: OpenSeadragon.Viewer | null;
  viewerReady: boolean;
}

export interface ViewerActions {
  setViewer: (viewer: OpenSeadragon.Viewer | null) => void;
  setViewerReady: (viewerReady: boolean) => void;
}

export const createViewerStore = () => createStore<ViewerStore>((set) => ({
  viewer: null,
  viewerReady: false,
  setViewer: (viewer) => set({viewer}),
  setViewerReady: (viewerReady) => set({viewerReady}),
}));