import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'

import App from "./App.tsx";
import ptBR from "antd/es/locale/pt_BR";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "styled-components";
import { theme as antdTheme, ConfigProvider, App as AntdApp } from "antd";
import { theme } from "./theme.tsx";

const { useToken } = antdTheme;

const queryClient = new QueryClient();

 

function ThemedApp() {
  const { token } = useToken();

  return (
    <ThemeProvider theme={{ token }}>
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={ptBR} theme={theme}>
      <AntdApp>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemedApp></ThemedApp>
          </QueryClientProvider>
        </Provider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
