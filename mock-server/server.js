const jsonServer = require('json-server');
const { faker } = require('@faker-js/faker');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// ===== Gerar dados fake =====
function generateData() {
  // Concursos no formato { value, label, cargos[] }
  const concursos = Array.from({ length: 10 }).map(() => {
    const concursoUuid = faker.string.uuid();

    const cargos = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map((_, i) => ({
      value: i + 1,
      label: `Cargo ${faker.person.jobTitle()}`
    }));

    return {
      value: concursoUuid,
      label: `Concurso ${faker.person.fullName()}`,
      cargos
    };
  });

  // Processos vinculados a concursos (usando value como ID)
  const processos = Array.from({ length: 50 }).map((_, i) => {
    const diasAtras = Math.floor(Math.random() * 30);
    const dataConvocacao = new Date();
    dataConvocacao.setDate(dataConvocacao.getDate() - diasAtras);

    const concurso = faker.helpers.arrayElement(concursos);

    return {
      id: i + 1,
      nome: `Processo ${faker.company.name()}`,
      uuid: faker.string.uuid(),
      data_convocacao: dataConvocacao.toISOString(),
      status: faker.helpers.arrayElement(['Finalizado', 'Em andamento', 'Cancelado']),
      concursoValue: concurso.value
    };
  });

  return { processos, concursos };
}

// Banco fake em memória
const db = generateData();

server.use(middlewares);

// ===== Rota processos-convocacao com filtro =====
server.get('/api/processos-convocacao', (req, res) => {
  let data = db.processos;

  const { data_convocacao_inicio, data_convocacao_fim, concursoValue, pageNumber = 1, pageSize = 10 } = req.query;

  // Filtro por datas
  if (data_convocacao_inicio && data_convocacao_fim) {
    const inicio = new Date(data_convocacao_inicio);
    const fim = new Date(data_convocacao_fim);

    data = data.filter(item => {
      const dataConv = new Date(item.data_convocacao);
      return dataConv >= inicio && dataConv <= fim;
    });
  }

  // Filtro por concurso
  if (concursoValue) {
    data = data.filter(item => String(item.concursoValue) === String(concursoValue));
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

// ===== Rota concursos no formato { value, label, cargos[] } =====
server.get('/api/concursos', (req, res) => {
  res.jsonp(db.concursos);
});

// ===== Rotas padrão JSON Server =====
server.use(jsonServer.router(db));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server rodando em http://localhost:${PORT}`);
});
