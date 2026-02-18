import type {AnnotationBody, Body, Manifest} from "@iiif/presentation-3";
import {orThrow} from "../src/lib/util/orThrow.ts";

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch: ${response.status}`);
  }
  return await response.json();
}

export function getTileSourceFromManifest(
  manifest: Manifest,
  index: number
): string {
  const canvas = manifest.items[index]
    ?? orThrow(`No canvas at index ${index}`);
  const page = canvas.items
      ?.find(a => a.type === 'AnnotationPage')
    ?? orThrow('No page item');
  const painting = page.items
      ?.find(a => a.motivation === 'painting')
    ?? orThrow('No painting item');

  const bodies = toArray(painting.body
    ?? orThrow('No painting body'));
  const body = bodies
      .filter(isResourceBody)
      .find(isImageResource)
    ?? orThrow('No image service found on canvas');

  const service = body.service[0];
  const id = "@id" in service
    ? service["@id"]
    : orThrow('No id');
  return id + "/info.json";
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isResourceBody(b: AnnotationBody): b is Exclude<Body, string> {
  return typeof b !== "string";
}

type ImageResource = Exclude<Body, string> & {
  service: Array<Record<string, unknown>>;
};

function isImageResource(b: Exclude<Body, string>): b is ImageResource {
  return "service" in b && Array.isArray(b.service) && !!b.service.length;
}