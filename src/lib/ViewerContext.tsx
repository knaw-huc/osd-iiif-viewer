import { createContext, useContext, useRef } from "react";
import { useStore, type StoreApi } from "zustand";
import { createViewerStore, type ViewerStore } from "./store/ViewerStore.ts";

const ViewerContext = createContext<StoreApi<ViewerStore> | null>(null);

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<StoreApi<ViewerStore>>(null);
  if (!storeRef.current) {
    storeRef.current = createViewerStore();
  }
  return (
    <ViewerContext.Provider value={storeRef.current}>
      {children}
    </ViewerContext.Provider>
  );
}


export function useViewer() {
  return useViewerStore((s) => s.viewer);
}

export function useViewerReady() {
  return useViewerStore((s) => s.viewerReady);
}

// Escape hatch for advanced consumers
export function useViewerStoreApi() {
  const store = useContext(ViewerContext);
  if (!store) {
    throw new Error("useViewerStoreApi must be used within a <ViewerProvider>");
  }
  return store;
}


function useViewerStore<T>(selector: (state: ViewerStore) => T): T {
  const store = useContext(ViewerContext);
  if (!store) {
    throw new Error("useViewerStore must be used within a <ViewerProvider>");
  }
  return useStore(store, selector);
}