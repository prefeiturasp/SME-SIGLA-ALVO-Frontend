export const createMockStyledSelect = () => {
  const React = require("react") as typeof import("react");

  return ({
    value,
    onChange,
    children,
    disabled,
    placeholder,
  }: {
    value?: string;
    onChange?: (value: string | undefined) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
  }) =>
    React.createElement(
      "select",
      {
        "aria-label": placeholder,
        value: value ?? "",
        disabled,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange?.(event.target.value || undefined),
      },
      React.createElement("option", { value: "" }, placeholder),
      React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const option = child.props as { value: string; children: React.ReactNode };
        return React.createElement(
          "option",
          { key: option.value, value: option.value },
          option.children
        );
      })
    );
};

export const createMockBaseTela = () => {
  const React = require("react") as typeof import("react");

  return ({
    children,
    title,
    buttons,
  }: {
    children: React.ReactNode;
    title: string;
    buttons?: React.ReactNode;
  }) =>
    React.createElement(
      "div",
      null,
      React.createElement("h1", null, title),
      buttons,
      children
    );
};

export const createMockGraficoBarrasDre = () => {
  const React = require("react") as typeof import("react");

  return ({ title }: { title: string }) =>
    React.createElement("div", { "data-testid": `grafico-${title}` }, title);
};
