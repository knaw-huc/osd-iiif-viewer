import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import Example from "./Example.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Example />
  </StrictMode>
);