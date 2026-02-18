import {useEffect, useState} from "react";
import {HighlightOverlayExample} from "./HighlightOverlayExample.tsx";
import {ControlsExample} from "./ControlsExample.tsx";

export function Examples() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash === "#highlight") {
    return <HighlightOverlayExample/>;
  }

  if (hash === "#controls") {
    return <ControlsExample/>;
  }

  return (
    <ul>
      <li><a href="#highlight">Highlight Overlay</a></li>
      <li><a href="#controls">Custom Controls</a></li>
    </ul>
  );
}