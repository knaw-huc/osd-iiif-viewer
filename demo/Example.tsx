import {
  useViewerReady,
  ViewerCanvas,
  ViewerProvider
} from "../src/lib";
import {useEffect, useState} from "react";
import type {
  Annotation,
  AnnotationBody,
  AnnotationPage,
  AnnotationTarget,
  Body,
  Manifest,
  Selector,
  SpecificResource,
  Target
} from "@iiif/presentation-3";
import {orThrow} from "../src/lib/util/orThrow.ts";
import {
  type Highlight,
  HighlightOverlay
} from "../src/lib/HighlightOverlay.tsx";
import type {Id} from "../src/lib/Id.ts";
import "./tooltip.css"

export default function Example() {

  const manifestUrl = "https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json";
  const documentVijf = 314;

  const [tileSource, setTileSource] = useState<string>();
  const [fragments, setFragments] = useState<Highlight[]>([]);
  const [fragmentTexts, setFragmentTexts] = useState<Record<Id, string>>({});
  const [tooltip, setTooltip] = useState<TooltipProps | null>();

  useEffect(() => {
    load();

    async function load() {
      const manifest = await fetchJson<Manifest>(manifestUrl);
      setTileSource(getTileSourceFromManifest(manifest, documentVijf));

      const annotationUrl = getAnnotationUrl(manifest, documentVijf)
        ?? orThrow('No annotation url');
      const annotationPage = await fetchJson<AnnotationPage>(annotationUrl);
      const {fragments, texts} = getFragmentsFromAnnotationPage(annotationPage);
      setFragments(fragments);
      setFragmentTexts(texts);
    }
  }, []);

  if (!tileSource) {
    return <>Loading manifest</>;
  }

  return (
    <ViewerProvider>
      <div style={{width: "100%", height: "100vh"}}>
        <ViewerCanvas tileSource={tileSource}/>
        <HighlightOverlay
          highlights={fragments}
          onHover={(fragment, event) => {
            if (!fragment) {
              setTooltip(null);
            } else {
              setTooltip({
                text: fragmentTexts[fragment],
                x: event.clientX,
                y: event.clientY
              });
            }
          }}
        />
        <Status/>
      </div>
      {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </ViewerProvider>
  );
}

type TooltipProps = { text: string; x: number; y: number };

function Tooltip({x, y, text}: TooltipProps) {
  return (
    <div className="tooltip" style={{
      left: x + 10,
      top: y - 30,
    }}>
      {text}
    </div>
  )
}

function Status() {
  const ready = useViewerReady();
  return (
    <>{ready ? "Ready" : "Loading sources"}</>
  );
}

function getAnnotationUrl(manifest: Manifest, index: number): string | null {
  const canvas = manifest.items[index];
  if (!canvas?.annotations?.[0]) {
    return null;
  }
  const ref = canvas.annotations[0];
  return typeof ref === "string" ? ref : ref.id;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch annotation page: ${response.status}`);
  }
  return await response.json();
}

function getFragmentsFromAnnotationPage(annotationPage: AnnotationPage) {
  const texts: Record<Id, string> = {};
  const fragments: Highlight[] = [];

  const items = annotationPage.items
    ?? orThrow('No annotation items')
  const annotations = items
    .filter((a: Annotation) =>
      a.motivation === "supplementing" &&
      a.textGranularity === "line"
    )
    .filter(hasBodyAndTarget);

  for (const a of annotations) {
    const id = a.id;

    const bodies = toArray(a.body);
    const textBody = bodies
        .filter(isResourceBody)
        .find(isTextualBody)
      ?? orThrow('No text body');
    texts[id] = textBody.value;

    const targets = toArray(a.target);
    const specific = targets
        .filter(isResourceTarget)
        .find(isSpecificResource)
      ?? orThrow('No specific resource');

    const selectors = toArray(specific.selector ?? orThrow('No selector'));
    const svgSelector = selectors
        .find(isSvgSelector)
      ?? orThrow('No svg selector');

    if (!svgSelector.value) {
      continue;
    }
    fragments.push({id, path: svgSelector.value});
  }

  return {texts, fragments};
}

function getTileSourceFromManifest(
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

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

type AnnotationWithBodyAndTarget = Annotation & {
  body: NonNullable<Annotation['body']>;
  target: NonNullable<Annotation['target']>;
};

function hasBodyAndTarget(a: Annotation): a is AnnotationWithBodyAndTarget {
  return a.body !== undefined && a.target !== undefined;
}

function isResourceBody(b: AnnotationBody): b is Exclude<Body, string> {
  return typeof b !== "string";
}

function isResourceTarget(t: AnnotationTarget): t is Exclude<Target, string> {
  return typeof t !== "string";
}

function isSpecificResource(t: Exclude<Target, string>): t is SpecificResource {
  return t.type === "SpecificResource";
}

function isSvgSelector(s: Selector): s is Selector & {
  type: "SvgSelector";
  value: string
} {
  return typeof s === "object" && s.type === "SvgSelector";
}

type TextualBody = { type: "TextualBody"; value: string };

function isTextualBody(b: Exclude<Body, string>): b is TextualBody {
  return b.type === "TextualBody";
}

type ImageResource = Exclude<Body, string> & {
  service: Array<Record<string, unknown>>;
};

function isImageResource(b: Exclude<Body, string>): b is ImageResource {
  return "service" in b && Array.isArray(b.service) && !!b.service.length;
}