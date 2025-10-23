export const theme = {
  token: {
    colorBgLayout:'#FAFAFA',
    
    colorPrimary: "#002C8C",
    fontFamily: "Open Sans, sans-serif",
    borderRadius: 8, // substitui o borderRadius customizado
    colorBgContainer: "#FFFFFF",
    colorBgBase: "#FFFFFF",
    colorTextLightSolid: "#ffffff",
    colorError: "#DB001B",  
    colorText: "#1C1D22",
    colorTextSecondary: "#515151",
    colorTextDescription: "rgba(81, 81, 81, 0.80);",
    fontSize: 16,
    fontWeightStrong: 600,
    fontWeight: 400,
   },
  components: {
    Typography: {
      fontWeight: 700,
    },
    Layout: {
      headerBg: "#FFFFFF",
    },
    Table: {
      headerBg: "#EBEBED",
      headerSplitColor: "transparent",
      rowBg: "#FFFFFF",
      rowSelectedBg: "#F6F6F6",
    },
    Pagination: {
      colorPrimary: "#ffffff",
      itemActiveBg: "#05409A",
    },
    Button: {
    
      // // Tokens específicos de botão
      
      
      controlHeightLG: 45,
      controlHeightMD: 40,
      controlHeightSM: 35,
      controlHeight: 40,


      fontSizeLG: 16,
      fontSizeSM: 14,
      fontSize: 16,

      

      borderRadius: 8, // borda arredondada
      colorBorder: "#B1B2B7", // cor da borda padrão
      defaultBorderColor: "#B1B2B7",
      defaultColor: "#161718", // cor do texto no botão padrão
      defaultBg: "#FFFFFF",
      paddingInline: 16, // padding horizontal
      paddingBlock: 0, // padding vertical
      fontWeight: 600,
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
    
  },
};
