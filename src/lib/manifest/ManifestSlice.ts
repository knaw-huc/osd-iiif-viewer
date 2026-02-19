import type {StateCreator} from 'zustand/vanilla';
import type {ViewerManifest} from './model.ts';
import {parseManifest} from './parseManifest.ts';
import type {ViewerStore} from '../ViewerStore.ts';

export type ManifestState = {
  isLoading: boolean;
  data: ViewerManifest | null;
  url: string | null;
  error: string | null;
};

export interface ManifestSlice {
  manifest: ManifestState;
  loadManifest: (url: string) => Promise<void>;
}

const defaultManifest = {data: null, url: '', isLoading: false, error: null};

export const createManifestSlice: StateCreator<
  ViewerStore,
  [],
  [],
  ManifestSlice
> = (set) => ({
  manifest: {...defaultManifest},

  loadManifest: async (url) => {
    const loading = {...defaultManifest, url, loading: true};
    set({manifest: loading});

    const done = {...loading, loading: false};
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = `Failed to fetch manifest: ${response.status}`;
        set({manifest: {...done, error}});
        return;
      }
      const json = await response.json();
      const data = parseManifest(json);
      set({manifest: {...done, data}});
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      set({manifest: {...done, error}});
    }
  }
});