export const createMockStyledSelect = () => {
  const React = require("react") as typeof import("react");

  return ({
    value,
    onChange,
    children,
    disabled,
    placeholder,
    mode,
    options,
  }: {
    value?: string | string[];
    onChange?: (value: string | string[] | undefined) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
    mode?: "multiple" | "tags";
    options?: Array<{ value: string; label: string }>;
  }) => {
    const optionList =
      options ??
      React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const option = child.props as { value: string; children: React.ReactNode };
        return { value: option.value, label: option.children };
      })?.filter(Boolean) ??
      [];

    if (mode === "multiple") {
      const selectedValues = Array.isArray(value) ? value : [];

      return React.createElement(
        "select",
        {
          "aria-label": placeholder,
          multiple: true,
          value: selectedValues,
          disabled,
          onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selected = Array.from(event.target.selectedOptions).map(
              (option) => option.value
            );
            onChange?.(selected);
          },
        },
        optionList.map((option) =>
          React.createElement(
            "option",
            { key: option.value, value: option.value },
            option.label
          )
        )
      );
    }

    return React.createElement(
      "select",
      {
        "aria-label": placeholder,
        value: Array.isArray(value) ? "" : (value ?? ""),
        disabled,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange?.(event.target.value || undefined),
      },
      React.createElement("option", { value: "" }, placeholder),
      optionList.map((option) =>
        React.createElement(
          "option",
          { key: option.value, value: option.value },
          option.label
        )
      )
    );
  };
};

export const createMockBaseTela = () => {
  const React = require("react") as typeof import("react");

  return ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) =>
    React.createElement(
      "div",
      null,
      React.createElement("h1", null, title),
      children
    );
};

export const createMockGraficoBarrasDre = () => {
  const React = require("react") as typeof import("react");

  return ({ title }: { title: string }) =>
    React.createElement("div", { "data-testid": `grafico-${title}` }, title);
};

export const createMockGraficoBarrasDreComparativo = () => {
  const React = require("react") as typeof import("react");

  return ({ title }: { title: string }) =>
    React.createElement("div", { "data-testid": `grafico-comparativo-${title}` }, title);
};
