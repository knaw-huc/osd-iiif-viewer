import {createContext} from 'react';
import {type StoreApi} from 'zustand';
import {type ViewerStore} from './ViewerStore.ts';

export const ViewerContext = createContext<StoreApi<ViewerStore> | null>(null);


