import type Stepper from "@mui/material/Stepper";

 
 
 

export const theme = {
  token: {
    colorPrimary: "#002C8C",
    fontFamily: "Roboto, sans-serif",
    borderRadius: 8, // substitui o borderRadius customizado
    colorBgContainer: "#FFFFFF",
    colorBgBase: "#FAFAFA",
    colorTextLightSolid: "#ffffff",
    colorError: "#DB001B",
    // colorBgLayout: "#FAFAFA",
    colorText: "#1C1D22",
    colorTextSecondary: "#515151",
    colorTextDescription: "rgba(81, 81, 81, 0.80);",
    fontSize: 16,
    fontWeightStrong: 600,
    fontWeight: 400,
    controlHeight: 44,
  },
  components: {
    Form: {
      labelRequiredMarkColor: "#515151",

    },
    Typography: {
      fontWeight: 400,
    },
    Layout: {
      headerBg: "#FFFFFF",
    },
    Table: {
      headerBg: "#EBEBED",
      headerSplitColor: "transparent",
      rowBg: "#FFFFFF",
      rowSelectedBg: "#F6F6F6",
      // footerTextColor:  "#1C1D22",
    },
    Pagination: {
      colorPrimary: "#ffffff",
      itemActiveBg: "#002C8C",
    },
    Button: {
      // Tokens específicos de botão
      controlHeight: 45, // altura
      borderRadius: 8, // borda arredondada
      colorBorder: "#B1B2B7", // cor da borda padrão
      defaultBorderColor: "#B1B2B7",
      defaultColor: "#161718", // cor do texto no botão padrão
      defaultBg: "#FFFFFF",
      paddingInline: 16, // padding horizontal
      paddingBlock: 0, // padding vertical
      fontWeight: 700,
      colorPrimaryHover: "#0650C0", // hover do botão primário
      colorPrimaryActive: "#04357A", // active do botão primário
      colorText: "#838383", // texto padrão
      
    },
    Card: {
      fontWeight: 400,           // peso do texto do conteúdo
      headerFontSize: 18,        // tamanho do título
          // peso do título
      headerColor: "#515151",    // cor do título
      colorText: "#515151",      // cor do texto do conteúdo
      headerLineHeight: 1.2,     // linha do título para melhor leitura
      headerBorderWidth: 0, // remove a borda inferior do header

    },
    
      Steps: {      
      colorPrimary: "#1890FF",      
      
      colorTextDescription: "#00000073", // cor da descrição
      colorText: "#515151", // cor do texto normal
      
       controlItemBgHover: "#F0F7FF", // fundo no hover

       controlItemTextColor: "#00000073",  // 🔹 número do Step inativo
       controlItemBgActive: "transparent", // fundo de etapas ativas transparente


    },
  },
};