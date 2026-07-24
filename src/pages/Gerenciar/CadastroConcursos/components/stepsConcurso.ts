export const steps = [
  {
    title: "Identificação do concurso",
    content: "First-content",
  },
  {
    title: "Publicações e resultados",
    content: "Second-content",
  },
  {
    title: "Vigência",
    content: "Last-content",
  },
];

export const items = steps.map((item) => ({ key: item.title, title: item.title }));
