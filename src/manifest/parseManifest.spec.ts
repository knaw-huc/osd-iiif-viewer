import {describe, it, expect} from 'vitest';
import {parseManifest} from './parseManifest.ts';
import manifestJson from './test/manifest.json';

describe('parseManifest', () => {

  it('parses manifest id and label', () => {
    const result = parseManifest(manifestJson);
    expect(result.id).toBe('https://example.org/manifest.json');
    expect(result.label).toBe('Test Manifest');
  });

  it('parses metadata', () => {
    const result = parseManifest(manifestJson);
    expect(result.metadata.attribution).toBe('Test Project');
    expect(result.metadata.rights).toBe(
      'http://creativecommons.org/publicdomain/zero/1.0/'
    );
    expect(result.metadata.thumbnailUrl).toBe('https://example.org/thumb.jpg');
  });

  it('parses all canvases', () => {
    const result = parseManifest(manifestJson);
    expect(result.canvases).toHaveLength(4);
  });

  it('parses canvas properties', () => {
    const result = parseManifest(manifestJson);
    const canvas = result.canvases[0];
    expect(canvas.id).toBe('https://example.org/canvas/p1');
    expect(canvas.label).toBe('Page 1');
    expect(canvas.width).toBe(3983);
    expect(canvas.height).toBe(5435);
  });

  it('extracts image service id from painting annotation', () => {
    const result = parseManifest(manifestJson);
    expect(result.canvases[0].imageServiceId).toBe(
      'https://example.org/iiif/image1'
    );
    expect(result.canvases[1].imageServiceId).toBe(
      'https://example.org/iiif/image2'
    );
  });

  it('returns annotation page ids when present', () => {
    const result = parseManifest(manifestJson);
    expect(result.canvases[0].annotationPageIds).toEqual([
      'https://example.org/annotations/p1.json'
    ]);
  });

  it('returns empty annotation page ids when absent', () => {
    const result = parseManifest(manifestJson);
    expect(result.canvases[1].annotationPageIds).toEqual([]);
  });

  it('parses top-level structure into ranges', () => {
    const result = parseManifest(manifestJson);
    expect(result.structures).toHaveLength(2);
    expect(result.structures[0].label).toBe('Document 1');
    expect(result.structures[1].label).toBe('Document 2');
  });

  it('parses simple range with canvas ids', () => {
    const result = parseManifest(manifestJson);
    const doc1 = result.structures[0];
    expect(doc1.canvasIds).toEqual([
      'https://example.org/canvas/p1',
      'https://example.org/canvas/p2',
    ]);
    expect(doc1.children).toEqual([]);
  });

  it('parses nested ranges', () => {
    const result = parseManifest(manifestJson);
    const doc2 = result.structures[1];
    expect(doc2.canvasIds).toEqual([]);
    expect(doc2.children).toHaveLength(2);
    expect(doc2.children[0].label).toBe('Subdocument a');
    expect(doc2.children[0].canvasIds).toEqual([
      'https://example.org/canvas/p3'
    ]);
    expect(doc2.children[1].label).toBe('Subdocument b');
    expect(doc2.children[1].canvasIds).toEqual([
      'https://example.org/canvas/p4'
    ]);
  });
});