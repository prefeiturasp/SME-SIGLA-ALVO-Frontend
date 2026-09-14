import React from "react";

/** Stub para imports `*.svg?react` (vite-plugin-svgr) nos testes. */
export default function SvgReactMock(props) {
  return React.createElement("svg", { "data-testid": "svg-mock", ...props });
}
