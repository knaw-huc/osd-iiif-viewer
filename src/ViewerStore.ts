import {createStore} from 'zustand/vanilla';
import {createInstanceSlice, type InstanceSlice} from './InstanceSlice.ts';
import {createControlSlice, type ControlSlice} from './ControlSlice.ts';
import {
  createManifestSlice,
  type ManifestSlice
} from './manifest/ManifestSlice.ts';
import {type CanvasSlice, createCanvasSlice} from './manifest/CanvasSlice.ts';

export type ViewerStore =
  & InstanceSlice
  & ControlSlice
  & ManifestSlice
  & CanvasSlice;

export const createViewerStore = () => createStore<ViewerStore>((...a) => ({
  ...createInstanceSlice(...a),
  ...createControlSlice(...a),
  ...createManifestSlice(...a),
  ...createCanvasSlice(...a),
}));