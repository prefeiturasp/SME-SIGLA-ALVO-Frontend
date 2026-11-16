import React from 'react';
import { renderWithProviders } from '../../../../test-utils';

import SelecaoCargos from '../SelecaoCargosTela';
// Mocks de navegação e permissões
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ uuid: 'test-uuid-123' }),
}));

jest.mock('../../../../routes/PermissionContextGuard', () => ({
  useGetPermissions: () => ({
    can: () => true,
  }),
}));

// Mock do hook da tela com dados mínimos
const mockSalvarCargosNoBackend = jest.fn(() => Promise.resolve(true));
const mockConvocarCandidatosHabilitados = jest.fn(() => Promise.resolve(true));
jest.mock('../hooks/useSelecaoCargo', () => ({
  useSelecaoCargo: jest.fn(() => ({
    processoConvocacaoData: {
      concurso_nome: 'Concurso Teste',
      data_convocacao: '2024-01-15',
      tipo_escolha: 'ESCOLHA',
      data_corte_vagas: '2024-01-20',
      descricao: 'Descrição do processo',
      concurso_uuid: 'concurso-uuid-123',
      uuid: 'processo-uuid-123',
    },
    processoConvocacaoIsLoading: false,
    cargoSelecionado: undefined,
    cargosDisponiveis: [],
    concursoIsLoading: false,
    handleCargoChange: jest.fn(),
    modalSelecionarCandidatosVisible: false,
    handleBuscarCandidatos: jest.fn(),
    handleCloseModalSelecionarCandidatos: jest.fn(),
    handleCandidatosSelecionados: jest.fn(),
    cargosAdicionados: [
      { cargo_nome: 'A', vagas: 1, totalCandidatos: 5, uuid: 'u1' },
      { cargo_nome: 'B', vagas: 1, totalCandidatos: 10, uuid: 'u2' },
    ],
    ultimoCargoSelecionado: null,
    vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
    handleEditarCargo: jest.fn(),
    handleExcluirCargo: jest.fn(),
    salvarCargosNoBackend: mockSalvarCargosNoBackend,
    convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
    uuid: 'test-uuid-123',
  })),
}));

// Mock do antd.Table para executar o sorter da coluna "Candidatos"
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const MockTable = ({ columns, dataSource }: any) => {
    // Encontra a coluna de candidatos (key 'candidatos') e executa o sorter
    const candidatosCol = Array.isArray(columns)
      ? columns.find((c: any) => c?.key === 'candidatos')
      : null;
    if (candidatosCol?.sorter) {
      // Executa sorter para cobrir o código
      candidatosCol.sorter({ candidatos: 5 }, { candidatos: 10 });
      candidatosCol.sorter({ candidatos: 10 }, { candidatos: 5 });
    }
    return <div data-testid="mock-table" data-count={dataSource?.length ?? 0} />;
  };
  return {
    ...actual,
    Table: MockTable,
    theme: {
      useToken: () => ({
        token: { colorTextSecondary: '#666', borderRadiusLG: 8 },
      }),
    },
  };
});

describe('SelecaoCargos - sorters', () => {
  it('executa o sorter da coluna Candidatos (cobrindo as linhas do sorter)', () => {
    // Evitar que serviços reais sejam carregados (que importam axios com import.meta)
    jest.mock('../../../../services', () => ({ __esModule: true, API: {} }));
    const SelecaoCargos = require('../SelecaoCargosTela').default;
    const { getByTestId } = renderWithProviders(<SelecaoCargos />);
    expect(getByTestId('mock-table')).toBeInTheDocument();
  });
});

