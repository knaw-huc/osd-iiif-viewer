import {
  fetchManifest,
  useViewerReady,
  ViewerCanvas,
  ViewerProvider
} from "../src/lib";
import {useEffect, useState} from "react";
import type {Manifest} from "@iiif/presentation-3";
import {orThrow} from "../src/lib/util/orThrow.ts";

export default function Example() {

  const url = "https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json";
  const [tileSource, setTileSource] = useState<string>()

  useEffect(() => {
    loadTileSource()

    async function loadTileSource() {
      const manifest = await fetchManifest(url);
      setTileSource(getTileSourceFromManifest(manifest))
    }
  }, []);

  if (!tileSource) {
    return <>Loading manifest</>;
  }
  return (
    <ViewerProvider>
      <div style={{width: "100%", height: "100vh"}}>
        <ViewerCanvas
          tileSource={tileSource}
        />
        <Status/>
      </div>
    </ViewerProvider>
  );
}

function Status() {
  const ready = useViewerReady();
  return (
    <>{ready ? "Ready" : "Loading sources"}</>
  );
}

function getTileSourceFromManifest(manifest: Manifest): string {
  const canvas = manifest.items
      .find(a => a.type === 'Canvas')
    ?? orThrow('No canvas')
  const page = canvas.items
      ?.find(a => a.type === 'AnnotationPage')
    ?? orThrow('No page item')
  const painting = page.items
      ?.find(a => a.motivation === 'painting')
    ?? orThrow('No painting item');
  if (!painting?.body) {
    throw new Error('No painting body')
  }
  const body = Array.isArray(painting.body)
    ? painting.body[0]
    : painting.body
    ?? orThrow('No body');
  if (typeof body === 'string' || !("service" in body && body.service)) {
    throw new Error("No image service found on canvas");
  }
  const service = body.service[0];
  const id = "@id" in service ? service["@id"] : orThrow('No id');
  return id + "/info.json";
}