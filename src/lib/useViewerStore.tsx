import {useContext} from "react";
import {ViewerContext} from "./ViewerContext.tsx";
import {orThrow} from "./util/orThrow.ts";

export function useViewerStore() {
  return useContext(ViewerContext)
    ?? orThrow("viewer hook must be used within viewer provider");
}