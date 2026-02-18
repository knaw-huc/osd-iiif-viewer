import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Examples} from "./Examples.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Examples />
  </StrictMode>
);