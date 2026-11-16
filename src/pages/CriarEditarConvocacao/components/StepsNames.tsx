export const steps = [
    {
      title: "Dados do processo",
      content: "First-content",
    },
    {
      title: "Seleção e configuração dos cargos",
      content: "Second-content",
    },
    {
      title: "Agendar",
      content: "Last-content",
    },
    {
      title: "Resumo",
      content: "Last-content",
    },
  ];
  
export const items = steps.map((item) => ({ key: item.title, title: item.title }));