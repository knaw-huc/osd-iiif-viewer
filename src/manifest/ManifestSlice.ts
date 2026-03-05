import type { StateCreator } from 'zustand/vanilla';
import type { Vault } from '@iiif/helpers/vault';
import type { ViewerStore } from '../ViewerStore.ts';

export type ManifestState = {
  url: string | null;
  vault: Vault;
  isLoading: boolean;
  error: string | null;
};

export type ManifestSlice = {
  manifest: ManifestState;
  loadManifest: (url: string) => Promise<void>;
};

const defaultState = { url: null, isLoading: false, error: null };

export const createManifestSlice = (
  vault: Vault
): StateCreator<ViewerStore, [], [], ManifestSlice> => (set, get) => ({
  manifest: { ...defaultState, vault },

  loadManifest: async (url) => {
    const { vault } = get().manifest;
    set({ manifest: { vault, url, isLoading: true, error: null } });

    try {
      await vault.loadManifest(url);
      set({ manifest: { vault, url, isLoading: false, error: null } });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      set({ manifest: { vault, url, isLoading: false, error } });
    }
  },
});