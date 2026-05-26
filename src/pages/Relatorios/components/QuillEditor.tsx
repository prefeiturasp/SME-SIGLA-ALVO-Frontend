import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type QuillEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number; // altura mínima em pixels
  showToolbar?: boolean;
};

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  height = 240,
  showToolbar = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const isSettingContent = useRef(false);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    // create editor
    quillRef.current = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      readOnly,
      modules: {
        toolbar: showToolbar
          ? [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ align: [] }, { align: false }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ]
          : false,
      },
    });

    // aplicar altura mínima ao editor
    try {
      const root = quillRef.current.root as HTMLElement;
      root.style.minHeight = `${height}px`;
      root.style.position = "relative";
      root.style.zIndex = "0";

      const toolbar = containerRef.current.querySelector(".ql-toolbar") as HTMLElement | null;
      if (toolbar) {
        toolbar.style.position = "relative";
        toolbar.style.zIndex = "0";
      }

      const container = containerRef.current.querySelector(".ql-container") as HTMLElement | null;
      if (container) {
        container.style.minHeight = `${height}px`;
        container.style.position = "relative";
        container.style.zIndex = "0";
      }
    } catch {
      // noop
    }

    // initial content
    if (value) {
      isSettingContent.current = true;
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      isSettingContent.current = false;
    }

    // change listener
    quillRef.current.on("text-change", () => {
      if (!quillRef.current || isSettingContent.current) return;
      const html = quillRef.current.root.innerHTML;
      onChange(html);
    });
  }, [placeholder, readOnly, onChange, value, height, showToolbar]);

  useEffect(() => {
    if (!quillRef.current) return;
    const currentHtml = quillRef.current.root.innerHTML;
    if (value !== currentHtml) {
      isSettingContent.current = true;
      quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
      isSettingContent.current = false;
    }
  }, [value]);

  return <div ref={containerRef} />;
};

export default QuillEditor;


