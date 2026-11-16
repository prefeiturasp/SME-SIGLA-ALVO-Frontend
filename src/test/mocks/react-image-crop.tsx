import React from "react";

const MockReactCrop = ({
  children,
  onComplete,
  aspect,
  circularCrop,
}: {
  children?: React.ReactNode;
  onComplete?: (crop: { unit: string; x: number; y: number; width: number; height: number }) => void;
  aspect?: number;
  circularCrop?: boolean;
}) => (
  <div
    data-testid="react-crop"
    data-aspect={aspect ?? "livre"}
    data-circular={circularCrop ? "true" : "false"}
  >
    {children}
    <button
      type="button"
      data-testid="simular-recorte"
      onClick={() =>
        onComplete?.({ unit: "px", x: 10, y: 10, width: 100, height: 80 })
      }
    >
      simular recorte
    </button>
  </div>
);

export const centerCrop = (crop: unknown) => crop;
export const makeAspectCrop = (crop: unknown) => crop;
export const convertToPixelCrop = (crop: unknown) => crop;

export default MockReactCrop;
