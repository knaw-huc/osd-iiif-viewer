import {
  Overlay,
  useCanvas,
  useImageInfo,
  useViewerReady,
  ViewerCanvas,
  ViewerProvider,
} from '../src';
import {useEffect, useState} from 'react';
import type {
  Annotation,
  AnnotationPage,
  AnnotationTarget,
  Body,
  Selector,
  SpecificResource,
  Target,
} from '@iiif/presentation-3';
import {orThrow} from '../src/util/orThrow';
import type {Id} from '../src/Id';
import {fetchJson, isResourceBody, toArray} from './utils';
import {ManifestLoader} from './ManifestLoader';

import './tooltip.css';

const manifestUrl =
  'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';
const documentVijf = 314;

export function HighlightOverlayExample() {
  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl} canvas={documentVijf}>
        <HighlightViewer/>
      </ManifestLoader>
    </ViewerProvider>
  );
}

type Fragment = {
  id: Id;
  text: string;
  path: string;
};

function HighlightViewer() {
  const {current} = useCanvas();
  const imageInfo = useImageInfo();
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

  useEffect(() => {
    if (!current?.annotationPageIds.length) {
      return;
    }

    load(current.annotationPageIds[0]);

    async function load(url: string) {
      const annotationPage = await fetchJson<AnnotationPage>(url);
      setFragments(getFragmentsFromAnnotationPage(annotationPage));
    }
  }, [current]);

  return (
    <div style={{width: '100%', height: '100vh'}}>
      <ViewerCanvas/>
      {imageInfo && fragments.map((fragment) => (
        <Overlay key={fragment.id} location={imageInfo.location}>
          <Highlight
            path={fragment.path}
            size={imageInfo.size}
            onHover={(hovering, e) => {
              if (!hovering) {
                setTooltip(null)
                return;
              }
              setTooltip({text: fragment.text, x: e.clientX, y: e.clientY});
            }}
          />
        </Overlay>
      ))}
      <Status/>
      {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </div>
  );
}

type HighlightProps = {
  path: string;
  size: OpenSeadragon.Point;
  onHover: (hovering: boolean, event: React.MouseEvent) => void;
};

function Highlight({path, size, onHover}: HighlightProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <svg
      viewBox={`0 0 ${size.x} ${size.y}`}
      style={{width: '100%', height: '100%', pointerEvents: 'none'}}
    >
      <g
        dangerouslySetInnerHTML={{__html: path}}
        fill={hovered ? 'rgba(0,0,0,0.1)' : 'transparent'}
        style={{pointerEvents: 'auto', cursor: 'pointer'}}
        onMouseEnter={(e) => {
          setHovered(true);
          onHover(true, e);
        }}
        onMouseMove={(e) => onHover(true, e)}
        onMouseLeave={(e) => {
          setHovered(false);
          onHover(false, e);
        }}
      />
    </svg>
  );
}

type TooltipProps = { text: string; x: number; y: number };

function Tooltip({x, y, text}: TooltipProps) {
  return (
    <div className='tooltip' style={{left: x + 10, top: y - 30}}>
      {text}
    </div>
  );
}

function Status() {
  const ready = useViewerReady();
  return <>{ready ? 'Ready' : 'Loading sources'}</>;
}

function getFragmentsFromAnnotationPage(annotationPage: AnnotationPage) {
  const fragments: Fragment[] = [];

  const items = annotationPage.items
    ?? orThrow('No annotation items');

  const isSupplementingLine = (a: Annotation) =>
    a.motivation === 'supplementing' &&
    a.textGranularity === 'line';
  const annotations = items
    .filter(isSupplementingLine)
    .filter(hasBodyAndTarget);

  for (const a of annotations) {
    const id = a.id;

    const bodies = toArray(a.body);
    const textBody = bodies
        .filter(isResourceBody)
        .find(isTextualBody)
      ?? orThrow('No text body');

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
    fragments.push({ id, path: svgSelector.value, text: textBody.value });
  }
  return fragments;
}

type AnnotationWithBodyAndTarget = Annotation & {
  body: NonNullable<Annotation['body']>;
  target: NonNullable<Annotation['target']>;
};

function hasBodyAndTarget(a: Annotation): a is AnnotationWithBodyAndTarget {
  return a.body !== undefined && a.target !== undefined;
}

function isResourceTarget(t: AnnotationTarget): t is Exclude<Target, string> {
  return typeof t !== 'string';
}

function isSpecificResource(t: Exclude<Target, string>): t is SpecificResource {
  return t.type === 'SpecificResource';
}

function isSvgSelector(
  s: Selector
): s is Selector & { type: 'SvgSelector'; value: string } {
  return typeof s === 'object' && s.type === 'SvgSelector';
}

type TextualBody = { type: 'TextualBody'; value: string };

function isTextualBody(b: Exclude<Body, string>): b is TextualBody {
  return b.type === 'TextualBody';
}