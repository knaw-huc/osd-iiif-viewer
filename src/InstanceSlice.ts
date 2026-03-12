import type {StateCreator} from 'zustand/vanilla';
import type OpenSeadragon from 'openseadragon';
import type {ViewerStore} from './ViewerStore.ts';
import type {Resettable} from './Resettable.ts';


export type InstanceState = {
  viewer: OpenSeadragon.Viewer | null;
  viewerReady: boolean;
}

export type InstanceSlice = Resettable & InstanceState & {
  setViewer: (viewer: OpenSeadragon.Viewer | null) => void;
  setViewerReady: (viewerReady: boolean) => void;
};

const defaultState = {
  viewer: null,
  viewerReady: false,
} satisfies InstanceState;

export const createInstanceSlice: StateCreator<
  ViewerStore,
  [],
  [],
  InstanceSlice
> = (set) => ({
  ...defaultState,
  setViewer: (viewer) => set({viewer}),
  setViewerReady: (viewerReady) => set({viewerReady}),
  reset: () => set(defaultState),
});