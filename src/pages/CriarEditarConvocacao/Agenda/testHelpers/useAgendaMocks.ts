jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ uuid: 'test-uuid' }),
}));

jest.mock('../../SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID.tsx', () => ({
  useGetProcessosConvocacaoPorUUID: () => ({ data: undefined, isLoading: false }),
}));

jest.mock('../../SelecaoCargos/hooks/useGetConcursosPorUuid.tsx', () => ({
  useGetConcursoByUuid: () => ({ data: undefined }),
}));

jest.mock('../hooks/usePostAgenda', () => ({
  usePostAgenda: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('../hooks/useDeleteAgenda', () => ({
  useDeleteAgenda: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('../hooks/useGetAgendas', () => ({
  useGetAgendas: () => ({ data: undefined }),
}));

jest.mock('../../../../services/resources/convocacao', () => ({
  getCargosProcesso: jest.fn(),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(),
}));

jest.mock('../hooks/useAgendaSchema', () => ({
  __esModule: true,
  default: () => ({}),
}));

export {};
