import '../testHelpers/useAgendaMocks';

describe('useAgendaMocks', () => {
  it('deve expor mocks compartilhados para os testes da Agenda', () => {
    const { useParams } = require('react-router-dom');
    expect(useParams()).toEqual({ uuid: 'test-uuid' });

    const { useGetProcessosConvocacaoPorUUID } = require('../../SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID.tsx');
    expect(useGetProcessosConvocacaoPorUUID()).toEqual({ data: undefined, isLoading: false });

    const { useGetConcursoByUuid } = require('../../SelecaoCargos/hooks/useGetConcursosPorUuid.tsx');
    expect(useGetConcursoByUuid()).toEqual({ data: undefined });

    const { usePostAgenda } = require('../hooks/usePostAgenda');
    expect(usePostAgenda()).toEqual({ mutateAsync: expect.any(Function) });

    const { useDeleteAgenda } = require('../hooks/useDeleteAgenda');
    expect(useDeleteAgenda()).toEqual({ mutateAsync: expect.any(Function) });

    const { useGetAgendas } = require('../hooks/useGetAgendas');
    expect(useGetAgendas()).toEqual({ data: undefined });

    const { getCargosProcesso } = require('../../../../services/resources/convocacao');
    expect(getCargosProcesso).toBeDefined();

    const { yupResolver } = require('@hookform/resolvers/yup');
    expect(yupResolver).toBeDefined();

    const useAgendaSchema = require('../hooks/useAgendaSchema').default;
    expect(useAgendaSchema()).toEqual({});
  });
});
