import {createStore} from "zustand/vanilla";
import {createInstanceSlice, type InstanceSlice} from "./InstanceSlice.ts";
import {createControlSlice, type ControlSlice} from "./ControlSlice.ts";

export type ViewerStore = InstanceSlice & ControlSlice;

export const createViewerStore = () => createStore<ViewerStore>((...a) => ({
  ...createInstanceSlice(...a),
  ...createControlSlice(...a),
}));