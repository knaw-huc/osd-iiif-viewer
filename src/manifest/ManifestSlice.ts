import type { StateCreator } from 'zustand/vanilla';
import type { Vault } from '@iiif/helpers/vault';
import type { ViewerStore } from '../ViewerStore.ts';
import type { Resettable } from '../Resettable.ts';
import {findCanvasIndex} from "./findCanvasIndex.ts";

export type ManifestState = {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
};

export type ManifestSlice = Resettable & ManifestState & {
  vault: Vault;
  loadManifest: (url: string, initialCanvasId?: string) => Promise<void>;
};

const defaultManifest: ManifestState = {
  url: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export const createManifestSlice = (
  vault: Vault
): StateCreator<ViewerStore, [], [], ManifestSlice> => (set) => ({
  vault,
  ...defaultManifest,

  loadManifest: async (url, initialCanvasId) => {
    set({url, isLoading: true, error: null});

    try {
      await vault.loadManifest(url);

      const updates: Partial<ViewerStore> = {isLoading: false, error: null};
      if (initialCanvasId) {
        const index = findCanvasIndex(vault, url, initialCanvasId);
        if (index !== -1) {
          updates.currentIndex = index;
        }
      }
      set(updates);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      set({isLoading: false, error});
    }
  },

  reset: () => set(defaultManifest),
});