import {useStore} from 'zustand';
import type {ViewerStore} from './ViewerStore.ts';
import {useViewerStore} from './useViewerStore.tsx';

export function useViewerStoreSelector<T>(
  selector: (state: ViewerStore) => T
): T {
  const store = useViewerStore();
  return useStore(store, selector);
}