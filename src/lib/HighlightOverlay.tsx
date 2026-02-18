import {useViewer} from "./useViewer.tsx";
import {useViewerReady} from "./useViewerReady.tsx";
import {useEffect} from "react";
import type {Id} from "./Id.ts";
import {assertSvgElement} from "./util/assertSvgElement.ts";

export type Fragment = {
  id: Id;
  path: string;
};

type FragmentHighlightOverlayProps = {
  fragments: Fragment[];
  onHover?: (fragment: Id | null, event: MouseEvent) => void;
};

export function HighlightOverlay(
  {fragments, onHover = noop}: FragmentHighlightOverlayProps
) {
  const viewer = useViewer();
  const ready = useViewerReady();

  useEffect(() => {
    if (!viewer || !ready || !fragments.length) {
      return;
    }

    const item = viewer.world.getItemAt(0);
    if (!item) {
      return;
    }

    const size = item.getContentSize();
    const imageRect = item.imageToViewportRectangle(0, 0, size.x, size.y);
    const overlayElements: HTMLElement[] = [];

    for (const fragment of fragments) {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.pointerEvents = "none";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `0 0 ${size.x} ${size.y}`);
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.pointerEvents = "none";

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      g.innerHTML = fragment.path;
      const shape = g.firstElementChild;
      assertSvgElement(shape)

      shape.setAttribute("fill", "transparent");
      shape.style.pointerEvents = "auto";
      shape.style.cursor = "pointer";

      shape.addEventListener("mouseenter", (event) => {
        shape.setAttribute("fill", "rgba(0,0,0,0.1)");
        onHover(fragment.id, event);
      });
      shape.addEventListener("mousemove", (event) => {
        onHover(fragment.id, event);
      });
      shape.addEventListener("mouseleave", (event) => {
        shape.setAttribute("fill", "transparent");
        onHover(null, event);
      });

      svg.appendChild(g);
      container.appendChild(svg);

      viewer.addOverlay({element: container, location: imageRect});
      overlayElements.push(container);
    }

    return () => {
      overlayElements.forEach((el) => viewer.removeOverlay(el));
    };
  }, [viewer, ready, fragments, onHover]);

  return null;
}

const noop = () => {
};
