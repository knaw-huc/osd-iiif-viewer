import type {StateCreator} from 'zustand/vanilla';
import type {ViewerStore} from '../ViewerStore.ts';
import type {Resettable} from "../Resettable.ts";

export type CanvasState = {
  currentIndex: number;
};

export type CanvasSlice = Resettable & CanvasState & {
  goToCanvas: (index: number) => void;
  nextCanvas: () => void;
  prevCanvas: () => void;
};

const defaultCanvas = {
  currentIndex: 0,
} satisfies Partial<CanvasSlice>;

export const createCanvasSlice: StateCreator<
  ViewerStore,
  [],
  [],
  CanvasSlice
> = (set, get) => ({
  ...defaultCanvas,

  goToCanvas: (index) => {
    const {vault, url} = get();
    if (!url) {
      return;
    }
    const manifest = vault.get({id: url, type: 'Manifest'});
    const clamped = Math.max(0, Math.min(index, manifest.items.length - 1));
    set({currentIndex: clamped});
  },

  nextCanvas: () => {
    const {currentIndex, goToCanvas} = get();
    goToCanvas(currentIndex + 1);
  },

  prevCanvas: () => {
    const {currentIndex, goToCanvas} = get();
    goToCanvas(currentIndex - 1);
  },

  reset: () => set(defaultCanvas),
});