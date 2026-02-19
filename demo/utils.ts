import type {AnnotationBody, Body} from '@iiif/presentation-3';

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch: ${response.status}`);
  }
  return await response.json();
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isResourceBody(b: AnnotationBody): b is Exclude<Body, string> {
  return typeof b !== 'string';
}