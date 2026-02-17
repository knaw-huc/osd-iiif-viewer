import {useState} from "react";
import type {StoreApi} from "zustand/index";
import {createViewerStore, type ViewerStore} from "./ViewerStore.ts";
import {ViewerContext} from "./ViewerContext.tsx";

export function ViewerProvider({children}: { children: React.ReactNode }) {
  const [store] = useState<StoreApi<ViewerStore>>(() => createViewerStore());
  return (
    <ViewerContext.Provider value={store}>
      {children}
    </ViewerContext.Provider>
  );
}