import type {
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../services/resources/relatorios/IExtracaoDados";

export const concursosOptionsMock = [
  { value: "uuid-concurso-1", label: "Concurso Teste 1" },
  { value: "uuid-concurso-2", label: "Concurso Teste 2" },
];

export const extracaoDadosTodosMock: IExtracaoDadosTodosResponse = {
  candidatos: {
    habilitados: { total: 1000, geral: 800, pcd: 100, nna: 100 },
    convocados: 500,
    "nao-convocados": 500,
  },
  escolhas: {
    escolha: 300,
    reconvocacao: 50,
    "nao-escolha": 150,
    dres: [
      {
        nome: "Diretoria Regional de Educação Butantã",
        escolhas: 50,
        vagas: 100,
      },
      {
        nome: "Diretoria Regional de Educação Centro",
        escolhas: 30,
        vagas: 80,
      },
    ],
    dres_concursos: {
      "uuid-concurso-1": [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 10,
          vagas: 20,
          codigo_cargo: 101,
          cargo_descricao: "Professor",
        },
        {
          nome: "Diretoria Regional de Educação Centro",
          escolhas: 5,
          vagas: 15,
          codigo_cargo: 102,
          cargo_descricao: "Coordenador",
        },
      ],
    },
  },
  concurso: {
    "autorizacoes-publicadas": 25,
    cargos: [
      {
        uuid: "cargo-1",
        nome: "Professor",
        codigo: 101,
        autorizacoes: 5,
        data_autorizacao: "2025-06-15",
      },
      {
        uuid: "cargo-2",
        nome: "Coordenador",
        codigo: 102,
        autorizacoes: 3,
        data_autorizacao: "2025-07-20",
      },
    ],
  },
};

export const extracaoDadosFiltradoMock: IExtracaoDadosResponse = {
  candidatos: {
    habilitados: { total: 200, geral: 150, pcd: 30, nna: 20 },
    "2024": { convocados: 80, "nao-convocados": 120 },
  },
  escolhas: {
    "2024": {
      escolha: 60,
      reconvocacao: 10,
      "nao-escolha": 20,
      dres: [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 25,
          vagas: 40,
        },
      ],
    },
    dres_concursos: {
      "uuid-concurso-1": [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 25,
          vagas: 40,
          codigo_cargo: 101,
          cargo_descricao: "Professor",
        },
        {
          nome: "Diretoria Regional de Educação Centro",
          escolhas: 10,
          vagas: 20,
          codigo_cargo: 102,
          cargo_descricao: "Coordenador",
        },
      ],
    },
  },
  concurso: {
    "autorizacoes-publicadas": 8,
    cargos: [
      {
        uuid: "cargo-1",
        nome: "Professor",
        codigo: 101,
        autorizacoes: 5,
        data_autorizacao: "2024-08-10",
      },
      {
        uuid: "cargo-2",
        nome: "Coordenador",
        codigo: 102,
        autorizacoes: 3,
        data_autorizacao: "2024-09-15",
      },
    ],
  },
};
