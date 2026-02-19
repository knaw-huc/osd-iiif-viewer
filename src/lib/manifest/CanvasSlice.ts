import type {StateCreator} from 'zustand/vanilla';
import type {ViewerStore} from '../ViewerStore.ts';

export type CanvasState = {
  currentIndex: number;
};

export interface CanvasSlice {
  canvas: CanvasState;
  goToCanvas: (index: number) => void;
  nextCanvas: () => void;
  prevCanvas: () => void;
}

export const createCanvasSlice: StateCreator<
ViewerStore,
  [],
  [],
  CanvasSlice
  > = (set, get) => ({
    canvas: {
      currentIndex: 0,
    },

    goToCanvas: (index) => {
      const canvases = get().manifest.data?.canvases;
      if (!canvases?.length) { return; }
      const clamped = Math.max(0, Math.min(index, canvases.length - 1));
      set({canvas: {currentIndex: clamped}});
    },

    nextCanvas: () => {
      const {canvas, goToCanvas} = get();
      goToCanvas(canvas.currentIndex + 1);
    },

    prevCanvas: () => {
      const {canvas, goToCanvas} = get();
      goToCanvas(canvas.currentIndex - 1);
    },
  });