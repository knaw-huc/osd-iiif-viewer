import type {StateCreator} from 'zustand/vanilla';
import type {ViewerStore} from '../ViewerStore.ts';

export type CanvasState = {
  currentIndex: number;
};

export type CanvasSlice = {
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
    const {vault, url} = get().manifest;
    if (!url) {
      return;
    }
    const manifest = vault.get({id: url, type: 'Manifest'});
    const clamped = Math.max(0, Math.min(index, manifest.items.length - 1));
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