import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@knaw-huc/osd-iiif-viewer': resolve(__dirname, 'src/index.ts'),
    },
  },
});