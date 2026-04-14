import type {StateCreator} from 'zustand/vanilla';
import type {ViewerStore} from '../ViewerStore.ts';
import type {Resettable} from '../Resettable.ts';
import {findCanvasIndex} from './findCanvasIndex.ts';

export type CanvasState = {
  currentIndex: number;
};

export type CanvasSlice = Resettable & CanvasState & {
  goToCanvas: (index: number) => void;
  goToCanvasById: (id: string) => void;
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
    const {vault, id: manifestId, currentIndex} = get();
    if (!manifestId) {
      return;
    }
    const manifest = vault.get({id: manifestId, type: 'Manifest'});
    const newIndex = Math.max(0, Math.min(index, manifest.items.length - 1));
    if (newIndex !== currentIndex) {
      set({
        currentIndex: newIndex,
        viewerReady: false
      });
    }
  },

  goToCanvasById: (id) => {
    const {vault, id: manifestId, goToCanvas} = get();
    if (!manifestId) {
      return;
    }
    const index = findCanvasIndex(vault, manifestId, id);
    if (index === -1) {
      console.warn(`Canvas not found: ${id}`);
      return;
    }
    goToCanvas(index);
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