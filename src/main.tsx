import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ptBR from "antd/es/locale/pt_BR";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "styled-components";
import { theme as antdTheme, ConfigProvider } from "antd";

const { useToken } = antdTheme;


const queryClient = new QueryClient();

export const theme = {
  token: {
    colorPrimary: "#05409A",
    fontFamily: "Roboto, sans-serif",
    borderRadius: 2,
    colorBgContainer: "#FFFFFF",
    colorBgBase: "#FFFFFF",
    colorTextLightSolid: "#ffffff",
    colorError: '#DB001B',
    colorBgLayout:  "#FFFFFF",
    colorTextDescription: "#161718"

 
  },
  components: {
    Layout: {
      headerBg: "#FFFFFF",
      
    },
    Pagination: {
      colorPrimary: "#ffffff",
      itemActiveBg: "#05409A",      
    },
  },
};
  
 
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
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemedApp>
            </ThemedApp>    
          </QueryClientProvider>
        </Provider>
    </ConfigProvider>
  </StrictMode>
);
