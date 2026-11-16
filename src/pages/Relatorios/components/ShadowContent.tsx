import { useEffect, useRef } from "react";

interface ShadowContentProps {
  html: string;
  style?: React.CSSProperties;
}

const ShadowContent: React.FC<ShadowContentProps> = ({ html, style }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: "open" });
    }
    shadow.innerHTML = html;
  }, [html]);

  return <div ref={hostRef} style={style} />;
};

export default ShadowContent;
