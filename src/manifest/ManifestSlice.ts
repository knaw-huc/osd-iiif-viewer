import type { StateCreator } from 'zustand/vanilla';
import type { Vault } from '@iiif/helpers/vault';
import type { ViewerStore } from '../ViewerStore.ts';
import type { Resettable } from '../Resettable.ts';

export type ManifestState = {
  url: string | null;
  isLoading: boolean;
  error: string | null;
};

export type ManifestSlice = Resettable & ManifestState & {
  vault: Vault;
  loadManifest: (url: string) => Promise<void>;
};

const defaultManifest: ManifestState = {
  url: null,
  isLoading: false,
  error: null,
};

export const createManifestSlice = (
  vault: Vault
): StateCreator<ViewerStore, [], [], ManifestSlice> => (set) => ({
  vault,
  ...defaultManifest,

  loadManifest: async (url) => {
    set({ url, isLoading: true, error: null });

    try {
      await vault.loadManifest(url);
      set({ isLoading: false, error: null });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      set({ isLoading: false, error });
    }
  },

  reset: () => set(defaultManifest),
});