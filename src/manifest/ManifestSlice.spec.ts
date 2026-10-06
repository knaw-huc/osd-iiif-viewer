import {afterEach, describe, expect, it, vi} from 'vitest';
import {createViewerStore} from '../ViewerStore.ts';
import manifest from './test/manifest.json';

describe('loadManifest', () => {
  const url = 'https://example.org/manifest.json';
  const canvasId = (name: string) => `https://example.org/canvas/${name}`;

  afterEach(() => vi.unstubAllGlobals());

  it('does not fetch when the manifest is provided', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const store = createViewerStore();

    await store.getState().loadManifest(url, {manifest});

    expect(fetch).not.toHaveBeenCalled();
    expect(store.getState()).toMatchObject({
      id: manifest.id,
      url,
      isLoading: false,
      error: null,
    });
  });

  it('opens the canvas at canvasId', async () => {
    const store = createViewerStore();

    await store.getState().loadManifest(url, {
      manifest,
      canvasId: canvasId('p3'),
    });

    expect(store.getState().currentIndex).toBe(2);
  });

  it('opens the first canvas when no canvasId', async () => {
    const store = createViewerStore();

    await store.getState().loadManifest(url, {
      manifest,
      canvasId: canvasId('unknown'),
    });

    expect(store.getState().currentIndex).toBe(0);
  });
});
