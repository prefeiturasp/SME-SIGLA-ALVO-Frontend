const jsonServer = require('json-server');
const { faker } = require('@faker-js/faker');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// ===== Gerar dados fake =====
function generateData() {
  const processos = [];

  for (let i = 1; i <= 50; i++) {
    const diasAtras = Math.floor(Math.random() * 30);
    const dataConvocacao = new Date();
    dataConvocacao.setDate(dataConvocacao.getDate() - diasAtras);

    processos.push({
      id: i,
      nome: `Processo ${faker.company.name()}`,
      uuid: faker.string.uuid(),
      data_convocacao: dataConvocacao.toISOString(),
      status: faker.helpers.arrayElement(['Finalizado', 'Em andamento', 'Cancelado'])
    });
  }

  return { processos };
}

// Banco fake em memória
const db = generateData();

server.use(middlewares);

// ===== Rota customizada com filtro + paginação =====
server.get('/api/processos-convocacao', (req, res) => {
  let data = db.processos;

  // Filtro por datas
  const { data_inicial, data_final, pageNumber = 1, pageSize = 10 } = req.query;

  if (data_inicial && data_final) {
    const inicio = new Date(data_inicial);
    const fim = new Date(data_final);

    data = data.filter(item => {
      const dataConv = new Date(item.data_convocacao);
      return dataConv >= inicio && dataConv <= fim;
    });
  }

  // Paginação
  const page = parseInt(pageNumber);
  const size = parseInt(pageSize);
  const startIndex = (page - 1) * size;
  const paginated = data.slice(startIndex, startIndex + size);

  res.jsonp({
    links: {
      next: page * size < data.length ? `/api/processos-convocacao?pageNumber=${page + 1}&pageSize=${size}` : null,
      previous: page > 1 ? `/api/processos-convocacao?pageNumber=${page - 1}&pageSize=${size}` : null
    },
    count: data.length,
    page,
    page_size: size,
    results: paginated
  });
});

// ===== NOVA ROTA: Concursos (options) =====
server.get('/api/concursos', (req, res) => {
  const concursos = Array.from({ length: 10 }).map((_, index) => ({
    value: index + 1,
    label: `Concurso ${faker.company.name()}`
  }));

  res.jsonp(concursos);
});

// ===== Rotas padrão JSON Server (caso precise) =====
server.use(jsonServer.router(db));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server rodando em http://localhost:${PORT}`);
});
