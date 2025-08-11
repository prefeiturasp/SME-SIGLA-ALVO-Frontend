// src/test-utils.tsx
import React, { type PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider } from "styled-components";
import ptBR from "antd/es/locale/pt_BR";
import { MemoryRouter } from "react-router-dom";

const { useToken } = antdTheme;

interface ProvidersWrapperProps extends PropsWithChildren {
  withRouter?: boolean;
}

function ProvidersWrapper({ children, withRouter }: ProvidersWrapperProps) {
  const queryClient = new QueryClient();
  const { token } = useToken();

  const content = withRouter ? (
    <MemoryRouter>{children}</MemoryRouter>
  ) : (
    children
  );

  return (
    <ConfigProvider locale={ptBR}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={{ token }}>{content}</ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ConfigProvider>
  );
}

function renderWithProviders(
  ui: React.ReactElement,
  { withRouter = false, ...options } = {}
) {
  return render(ui, {
    wrapper: (props) => <ProvidersWrapper withRouter={withRouter} {...props} />,
    ...options,
  });
}

export * from "@testing-library/react";
export { renderWithProviders };