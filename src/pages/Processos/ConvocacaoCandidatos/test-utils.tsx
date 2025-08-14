import React, { type PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider } from "styled-components";
import ptBR from "antd/es/locale/pt_BR";
import { MemoryRouter } from "react-router-dom";

const { useToken } = antdTheme;

function ProvidersWrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

  const { token } = useToken();

  return (
    <ConfigProvider locale={ptBR}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={{ token }}>
           <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ConfigProvider>
  );
}

function renderWithProviders(
  ui: React.ReactElement,
  { ...options } = {}
) {
  return render(ui, {
    wrapper: (props) => <ProvidersWrapper {...props} />,
    ...options,
  });
}

export * from "@testing-library/react";
export { renderWithProviders };