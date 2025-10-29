export const theme = {
  token: {
    colorBgLayout:'#FAFAFA',
    colorPrimary: "#002C8C",
    fontFamily: "Open Sans, sans-serif",
    borderRadius: 8, // substitui o borderRadius customizado
    colorBgContainer: "#FFFFFF",
    colorBgBase: "#FAFAFA",
    colorTextLightSolid: "#ffffff",
    colorError: "#DB001B",  
    colorText: "#1C1D22",
    colorTextSecondary: "#515151",
    colorTextDescription: "#515151",
    fontSize: 16,
    fontWeightStrong: 700,
    fontWeight: 400,
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
      controlHeightLG: 45,
      controlHeightSM: 35,
      controlHeight: 40,
      fontSizeLG: 18,
      fontSizeSM: 14,
      fontSize: 16,

      paddingInlineSM: 12,
      paddingBlockSM: 4,
     
     
     controlLineWidth: 1,
     controlOutlineWidth: 1,

     
     
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

      // Secondary Button
      colorSecondaryHover: "#0650C0", // hover do botão secundário
      colorSecondaryActive: "#04357A", // active do botão secundário
      colorSecondary: "#838383", // texto do botão secundário
      colorSecondaryBg: "#FFFFFF", // fundo do botão secundário
      colorSecondaryBorder: "#B1B2B7", // borda do botão secundário
      colorSecondaryText: "#838383", // texto do botão secundário
      colorSecondaryBgHover: "#F0F0F0", // fundo do botão secundário no hover
      colorSecondaryBgActive: "#E0E0E0", // fundo do botão secundário no active
      colorSecondaryBgDisabled: "#F0F0F0", // fundo do botão secundário no disabled
      colorSecondaryBgLoading: "#F0F0F0", // fundo do botão secundário no loading
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
    Tabs:{
  
      
    colorPrimary: "#0F59C8",
      
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