const jsonServer = require("json-server");
const { faker } = require("@faker-js/faker");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// ===== Gerar dados fake =====
function generateData() {
  // Concursos no formato { value, label, cargos[] }
  const concursos = Array.from({ length: 10 }).map(() => {
    const concursoUuid = faker.string.uuid();

    const cargos = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map((_, i) => ({
      value: i + 1,
      label: `Cargo ${faker.person.jobTitle()}`,
    }));

    return {
      value: concursoUuid,
      label: `Concurso ${faker.person.fullName()}`,
      cargos,
    };
  });

  // Processos vinculados a concursos
  const processos = Array.from({ length: 2 }).map((_, i) => {
    const diasAtras = Math.floor(Math.random() * 30);
    const dataConvocacao = new Date();
    dataConvocacao.setDate(dataConvocacao.getDate() - diasAtras);

    const concurso = faker.helpers.arrayElement(concursos);

    return {
      id: i + 1,
      nome: `Processo ${faker.company.name()}`,
      uuid: faker.string.uuid(),
      data_convocacao: dataConvocacao.toISOString(),
      status: faker.helpers.arrayElement(["Finalizado", "Em andamento", "Cancelado"]),
      concursoValue: concurso.value,
    };
  });

  // Agendas (mo
  // ck fixo + faker para complementar)
  const agendas = [
    {
      
      cargo_nome: "PROF. FUND. II E MÉDIO - BIOLOGIA",
      candidatos_classificados: [
        {
          uuid: "1",
          qtd_candidatos: 2,
          classificacao: "1a até 2a",
          data_escolha: "07/10/2025",
          sessao: "2",
          horario: "03:00 às 21:00",
        },
        {
          uuid: "2",
          qtd_candidatos: 1,
          classificacao: "9a",
          data_escolha: "07/10/2025",
          sessao: "4",
          horario: "03:00 às 21:00",
        },
      ]
    },
    {
      
      cargo_nome: "PROF. FUND. II E MÉDIO - QUÍMICA",
      candidatos_classificados: [
        {
          uuid: "1",
          qtd_candidatos: 2,
          classificacao: "1a até 2a",
          data_escolha: "07/10/2025",
          sessao: "2",
          horario: "03:00 às 21:00",
        },
        {
          uuid: "2",
          qtd_candidatos: 1,
          classificacao: "9a",
          data_escolha: "07/10/2025",
          sessao: "4",
          horario: "03:00 às 21:00",
        },
    ]
  }
    
    

    // // gera mais registros fake só para testar paginação ou filtros
    // ...Array.from({ length: 5 }).map(() => ({
    //   uuid: faker.string.uuid(),
    //   qtd_candidatos: faker.number.int({ min: 1, max: 10 }),
    //   classificacao: `${faker.number.int({ min: 1, max: 50 })}a`,
    //   data_escolha: faker.date.future().toISOString().slice(0, 10),
    //   sessao: faker.number.int({ min: 1, max: 5 }).toString(),
    //   horario: `${faker.number.int({ min: 8, max: 18 })}:00 às ${faker.number.int({ min: 19, max: 22 })}:00`,
    //   cargo_nome: faker.person.jobTitle(),
    //   cargo_uuid: faker.string.uuid(),
    //   processo_uuid: "1941651f-106d-4935-a57f-3666be255fff",
    // })),
  ];

  return { concursos, processos, agendas };
}

// Banco fake em memória
const db = generateData();

server.use(middlewares);

// ===== Rota processos-convocacao com filtro =====
server.get("/api/processos-convocacao", (req, res) => {
  let data = db.processos;

  const { data_convocacao_inicio, data_convocacao_fim, concursoValue, pageNumber = 1, pageSize = 10 } = req.query;

  if (data_convocacao_inicio && data_convocacao_fim) {
    const inicio = new Date(data_convocacao_inicio);
    const fim = new Date(data_convocacao_fim);
    data = data.filter((item) => {
      const dataConv = new Date(item.data_convocacao);
      return dataConv >= inicio && dataConv <= fim;
    });
  }

  if (concursoValue) {
    data = data.filter((item) => String(item.concursoValue) === String(concursoValue));
  }

  const page = parseInt(pageNumber);
  const size = parseInt(pageSize);
  const startIndex = (page - 1) * size;
  const paginated = data.slice(startIndex, startIndex + size);

  res.jsonp({
    links: {
      next: page * size < data.length ? `/api/processos-convocacao?pageNumber=${page + 1}&pageSize=${size}` : null,
      previous: page > 1 ? `/api/processos-convocacao?pageNumber=${page - 1}&pageSize=${size}` : null,
    },
    count: data.length,
    page,
    page_size: size,
    results: paginated,
  });
});

// ===== Rota concursos =====
server.get("/api/concursos", (req, res) => {
  res.jsonp(db.concursos);
});

// ===== Rota agendas =====
server.get("/api/v1/agendas", (req, res) => {
  const { processo_uuid } = req.query;

  if (!processo_uuid) {
    return res.status(400).jsonp({ error: "processo_uuid é obrigatório" });
  }

  const filtered = db.agendas

  return res.jsonp(filtered);
});

// ===== Rotas padrão JSON Server =====
server.use(jsonServer.router(db));

const PORT = 8006;
server.listen(PORT, () => {
  console.log(`✅ JSON Server rodando em http://localhost:${PORT}`);
});
