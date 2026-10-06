import type { StateCreator } from 'zustand/vanilla';
import type { Vault } from '@iiif/helpers/vault';
import type { ViewerStore } from '../ViewerStore.ts';
import type { Resettable } from '../Resettable.ts';
import {findCanvasIndex} from './findCanvasIndex.ts';
import {orThrow} from '../util/orThrow.ts';

export type ManifestState = {
  id: string | null,
  url: string | null;
  isLoading: boolean;
  error: string | null;
};

export type LoadManifestOptions = {
  manifest?: unknown;
  canvasId?: string;
};

export type ManifestSlice = Resettable & ManifestState & {
  vault: Vault;
  loadManifest: (url: string, options?: LoadManifestOptions) => Promise<void>;
};

const defaultManifest: ManifestState = {
  id: null,
  url: null,
  isLoading: false,
  error: null,
};

export const createManifestSlice = (
  vault: Vault
): StateCreator<ViewerStore, [], [], ManifestSlice> => (set) => ({
  vault,
  ...defaultManifest,

  loadManifest: async (url, {manifest, canvasId} = {}) => {
    set({url, isLoading: true, error: null});

    try {
      const loaded = await vault.loadManifest(url, manifest);

      const id = loaded?.id || orThrow('No manifest');
      const updates: Partial<ViewerStore> = {
        id: id,
        url: url,
        isLoading: false,
        error: null,
      };

      if (canvasId) {
        const index = findCanvasIndex(vault, id, canvasId);
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