import type {StateCreator} from 'zustand/vanilla';
import type {ViewerStore} from './ViewerStore.ts';

export type ControlSlice = {
  zoomLevel: number | null;
  zoomMin: number | null;
  zoomMax: number | null;
  isFullPage: boolean;
  setZoomLevel: (zoomLevel: number | null) => void;
  setZoomMin: (zoomMin: number | null) => void;
  setZoomMax: (zoomMax: number | null) => void;
  setIsFullPage: (isFullPage: boolean) => void;
}

export const createControlSlice: StateCreator<
  ViewerStore,
  [],
  [],
  ControlSlice
> = (set) => ({
  zoomLevel: null,
  zoomMin: null,
  zoomMax: null,
  isFullPage: false,
  setZoomLevel: (zoomLevel) => set({zoomLevel}),
  setZoomMin: (zoomMin) => set({zoomMin}),
  setZoomMax: (zoomMax) => set({zoomMax}),
  setIsFullPage: (isFullPage) => set({isFullPage}),
});