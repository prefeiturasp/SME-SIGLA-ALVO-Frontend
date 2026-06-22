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
          ultima_escolha_em: "2025-06-15T10:30:00",
        },
        {
          nome: "Diretoria Regional de Educação Centro",
          escolhas: 5,
          vagas: 15,
          codigo_cargo: 102,
          cargo_descricao: "Coordenador",
          ultima_escolha_em: "2025-07-20T09:42:00",
        },
      ],
    },
    ultima_escolha_em: "2025-07-20T09:42:00",
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
  concurso_uuid: "uuid-concurso-1",
  filtros: [
    {
      ano: 2024,
      processo_uuids: ["proc-2024-a"],
    },
  ],
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
          ultima_escolha_em: "2024-08-10T14:30:00",
        },
        {
          nome: "Diretoria Regional de Educação Centro",
          escolhas: 10,
          vagas: 20,
          codigo_cargo: 102,
          cargo_descricao: "Coordenador",
          ultima_escolha_em: "2024-09-15T11:15:00",
        },
      ],
    },
    ultima_escolha_em: "2024-09-15T11:15:00",
  },
  concurso: {
    "2024": {
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
  },
};

export const extracaoDadosComparativoMock: IExtracaoDadosResponse = {
  concurso_uuid: "uuid-concurso-1",
  filtros: [
    {
      ano: 2024,
      processo_uuids: ["proc-2024-a"],
    },
    {
      ano: 2025,
      processo_uuids: ["proc-2025-a"],
    },
  ],
  candidatos: {
    habilitados: { total: 200, geral: 150, pcd: 30, nna: 20 },
    "2024": {
      convocados: 80,
      "nao-convocados": 120,
      habilitados: { total: 180, geral: 130, pcd: 30, nna: 20 },
    },
    "2025": {
      convocados: 100,
      "nao-convocados": 100,
      habilitados: { total: 220, geral: 160, pcd: 35, nna: 25 },
    },
  },
  escolhas: {
    "2024": {
      escolha: 60,
      reconvocacao: 10,
      "nao-escolha": 20,
      dres: [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 20,
          vagas: 40,
        },
      ],
    },
    "2025": {
      escolha: 75,
      reconvocacao: 5,
      "nao-escolha": 10,
      dres: [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 30,
          vagas: 40,
        },
      ],
    },
    dres_concursos: {
      "uuid-concurso-1": [
        {
          nome: "Diretoria Regional de Educação Butantã",
          escolhas: 50,
          vagas: 80,
          codigo_cargo: 101,
          cargo_descricao: "Professor",
          ultima_escolha_em: "2025-06-15T16:45:00",
        },
      ],
    },
    ultima_escolha_em: "2025-06-15T16:45:00",
  },
  concurso: {
    "2024": {
      "autorizacoes-publicadas": 8,
      cargos: [
        {
          uuid: "cargo-1",
          nome: "Professor",
          codigo: 101,
          autorizacoes: 5,
          data_autorizacao: "2024-08-10",
        },
      ],
    },
    "2025": {
      "autorizacoes-publicadas": 10,
      cargos: [
        {
          uuid: "cargo-1",
          nome: "Professor",
          codigo: 101,
          autorizacoes: 6,
          data_autorizacao: "2025-08-10",
        },
      ],
    },
  },
  comparativo: {
    anos: [2024, 2025],
    indicadores: {
      convocados: 20.0,
      naoConvocados: -20.0,
      escolhasRealizadas: 15.0,
      reconvocacoes: -5.0,
      semEscolha: -10.0,
      autorizacoes: 2.0,
    },
    dres: {
      Butantã: {
        escolhas: 10.0,
        vagas: 0.0,
        percentualPreenchimento: 25.0,
      },
    },
  },
};
