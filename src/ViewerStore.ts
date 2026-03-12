import {createStore} from 'zustand/vanilla';
import {Vault} from '@iiif/helpers/vault';
import {createInstanceSlice, type InstanceSlice} from './InstanceSlice.ts';
import {type ControlSlice, createControlSlice} from './ControlSlice.ts';
import {
  createManifestSlice,
  type ManifestSlice,
} from './manifest/ManifestSlice.ts';
import {type CanvasSlice, createCanvasSlice} from './manifest/CanvasSlice.ts';
import type {Resettable} from './Resettable.ts';

export type ViewerStore =
  & InstanceSlice
  & ControlSlice
  & ManifestSlice
  & CanvasSlice
  & Resettable;

export const createViewerStore = () => {
  const vault = new Vault();
  const resets: (() => void)[] = [];

  const withReset = <T extends Resettable>(slice: T): T => {
    resets.push(slice.reset);
    return slice;
  };

  return createStore<ViewerStore>((...a) => ({
    ...withReset(createInstanceSlice(...a)),
    ...withReset(createControlSlice(...a)),
    ...withReset(createManifestSlice(vault)(...a)),
    ...withReset(createCanvasSlice(...a)),
    reset: () => resets.forEach((fn) => fn()),
  }));
};