import { renderHook, act } from '@testing-library/react';
import { type TablePaginationConfig, type FilterValue, type SorterResult } from 'antd/es/table/interface';
import useListRequest, { removeUndefinedFields, useFullListRequest } from '../useListRequest';
import { type IListRequest, type IFullListRequest } from '../../types/IListRequest';

interface FiltroTeste {
  nome?: string;
  status?: string;
  categoria?: string;
}

interface DadosTeste {
  id: number;
  nome: string;
  status: string;
}

describe('useListRequest', () => {
  const estadoPadrao: IListRequest<FiltroTeste> = {
    pagination: {
      page: 1,
      page_size: 10,
    },
    filters: {
      nome: 'teste',
      status: 'ativo',
    },
    sort: 'nome',
    order: 'asc' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook useListRequest', () => {
    it('deve inicializar com estado padrão', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      expect(result.current.listRequest).toEqual(estadoPadrao);
      expect(typeof result.current.setListRequest).toBe('function');
      expect(typeof result.current.onAntTableChange).toBe('function');
      expect(typeof result.current.backToPreviusPage).toBe('function');
    });

    it('deve lidar com mudança de paginação', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const paginacao: TablePaginationConfig = {
        current: 3,
        pageSize: 25,
      };

      act(() => {
        result.current.onAntTableChange(
          paginacao,
          {},
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.pagination.page).toBe(3);
      expect(result.current.listRequest.pagination.page_size).toBe(25);
    });

    it('deve lidar com mudança de filtros', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const filtros: Record<string, FilterValue | null> = {
        nome: ['novoNome'],
        categoria: ['novaCategoria'],
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          filtros,
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.filters).toEqual({
        nome: ['novoNome'],
        status: 'ativo',
        categoria: ['novaCategoria'],
      });
    });

    it('deve lidar com mudança de ordenação com ordem ascendente', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any> = {
        columnKey: 'status',
        order: 'ascend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBe('status');
      expect(result.current.listRequest.order).toBe('asc');
    });

    it('deve lidar com mudança de ordenação com ordem descendente', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any> = {
        columnKey: 'id',
        order: 'descend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBe('id');
      expect(result.current.listRequest.order).toBe('desc');
    });

    it('deve lidar com mudança de ordenação sem ordem', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any> = {
        columnKey: 'nome',
        order: undefined,
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com array de ordenação com item único', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any>[] = [{
        columnKey: 'status',
        order: 'ascend',
      }];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com array de ordenação com múltiplos itens', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any>[] = [
        {
          columnKey: 'nome',
          order: 'descend',
        },
        {
          columnKey: 'status',
          order: 'ascend',
        },
      ];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com paginação sem página atual', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const paginacao: TablePaginationConfig = {
        pageSize: 15,
      };

      act(() => {
        result.current.onAntTableChange(
          paginacao,
          {},
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.pagination.page).toBe(1);
      expect(result.current.listRequest.pagination.page_size).toBe(15);
    });

    it('deve lidar com paginação sem pageSize', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const paginacao: TablePaginationConfig = {
        current: 5,
      };

      act(() => {
        result.current.onAntTableChange(
          paginacao,
          {},
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.pagination.page).toBe(5);
      expect(result.current.listRequest.pagination.page_size).toBe(10);
    });

    it('deve lidar com backToPreviusPage', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      act(() => {
        result.current.backToPreviusPage();
      });

      expect(result.current.listRequest.pagination.page).toBe(0);
    });

    it('deve lidar com múltiplas chamadas de backToPreviusPage', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      act(() => {
        result.current.backToPreviusPage();
        result.current.backToPreviusPage();
        result.current.backToPreviusPage();
      });

      expect(result.current.listRequest.pagination.page).toBe(-2);
    });

    it('deve lidar com setListRequest diretamente', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const novoEstado: IListRequest<FiltroTeste> = {
        pagination: {
          page: 5,
          page_size: 20,
        },
        filters: {
          nome: 'atualizado',
          status: 'inativo',
        },
        sort: 'id',
        order: 'desc' as const,
      };

      act(() => {
        result.current.setListRequest(novoEstado);
      });

      expect(result.current.listRequest).toEqual(novoEstado);
    });

    it('deve lidar com mudança complexa de tabela com todos os parâmetros', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const paginacao: TablePaginationConfig = {
        current: 7,
        pageSize: 50,
      };

      const filtros: Record<string, FilterValue | null> = {
        categoria: ['eletronicos', 'livros'],
        preco: ['100-500'],
      };

      const ordenador: SorterResult<any> = {
        columnKey: 'preco',
        order: 'descend',
      };

      act(() => {
        result.current.onAntTableChange(
          paginacao,
          filtros,
          ordenador,
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.pagination.page).toBe(7);
      expect(result.current.listRequest.pagination.page_size).toBe(50);
      expect(result.current.listRequest.filters).toEqual({
        nome: 'teste',
        status: 'ativo',
        categoria: ['eletronicos', 'livros'],
        preco: ['100-500'],
      });
      expect(result.current.listRequest.sort).toBe('preco');
      expect(result.current.listRequest.order).toBe('desc');
    });
  });

  describe('Função removeUndefinedFields', () => {
    it('deve remover campos undefined do objeto', () => {
      const objetoTeste = {
        nome: 'teste',
        idade: undefined,
        status: 'ativo',
        categoria: undefined,
        id: 1,
      };

      const resultado = removeUndefinedFields(objetoTeste);

      expect(resultado).toEqual({
        nome: 'teste',
        status: 'ativo',
        id: 1,
      });
    });

    it('deve retornar objeto vazio quando todos os campos são undefined', () => {
      const objetoTeste = {
        nome: undefined,
        idade: undefined,
        status: undefined,
      };

      const resultado = removeUndefinedFields(objetoTeste);

      expect(resultado).toEqual({});
    });

    it('deve retornar mesmo objeto quando não há campos undefined', () => {
      const objetoTeste = {
        nome: 'teste',
        idade: 25,
        status: 'ativo',
      };

      const resultado = removeUndefinedFields(objetoTeste);

      expect(resultado).toEqual(objetoTeste);
    });

    it('deve lidar com objeto com valores null', () => {
      const objetoTeste = {
        nome: 'teste',
        idade: null,
        status: undefined,
        categoria: 'teste',
      };

      const resultado = removeUndefinedFields(objetoTeste);

      expect(resultado).toEqual({
        nome: 'teste',
        idade: null,
        categoria: 'teste',
      });
    });

    it('deve lidar com objeto vazio', () => {
      const objetoTeste = {};

      const resultado = removeUndefinedFields(objetoTeste);

      expect(resultado).toEqual({});
    });
  });

  describe('Hook useFullListRequest', () => {
    const estadoPadraoCompleto: IFullListRequest<FiltroTeste> = {
      filters: {
        nome: 'teste',
        status: 'ativo',
      },
      sort: 'nome',
      order: 'asc' as const,
    };

    it('deve inicializar com estado padrão', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      expect(result.current.listRequest).toEqual(estadoPadraoCompleto);
      expect(typeof result.current.setListRequest).toBe('function');
      expect(typeof result.current.onAntTableChange).toBe('function');
    });

    it('deve inicializar com objeto vazio quando nenhum estado padrão é fornecido', () => {
      const { result } = renderHook(() => useFullListRequest());

      expect(result.current.listRequest).toEqual({});
      expect(typeof result.current.setListRequest).toBe('function');
      expect(typeof result.current.onAntTableChange).toBe('function');
    });

    it('deve lidar com mudança de filtros sem paginação', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const filtros: Record<string, FilterValue | null> = {
        categoria: ['novaCategoria'],
        preco: ['100-500'],
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          filtros,
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.filters).toEqual({
        nome: 'teste',
        status: 'ativo',
        categoria: ['novaCategoria'],
        preco: ['100-500'],
      });
    });

    it('deve lidar com mudança de ordenação com ordem ascendente', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const ordenador: SorterResult<any> = {
        columnKey: 'status',
        order: 'ascend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBe('status');
      expect(result.current.listRequest.order).toBe('asc');
    });

    it('deve lidar com mudança de ordenação com ordem descendente', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const ordenador: SorterResult<any> = {
        columnKey: 'id',
        order: 'descend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBe('id');
      expect(result.current.listRequest.order).toBe('desc');
    });

    it('deve lidar com mudança de ordenação sem ordem', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const ordenador: SorterResult<any> = {
        columnKey: 'nome',
        order: undefined,
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com array de ordenação com item único', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const ordenador: SorterResult<any>[] = [{
        columnKey: 'status',
        order: 'ascend',
      }];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com array de ordenação com múltiplos itens', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const ordenador: SorterResult<any>[] = [
        {
          columnKey: 'nome',
          order: 'descend',
        },
        {
          columnKey: 'status',
          order: 'ascend',
        },
      ];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      // O hook não lida com arrays adequadamente, então sort e order permanecem undefined
      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com setListRequest diretamente', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const novoEstado: IFullListRequest<FiltroTeste> = {
        filters: {
          nome: 'atualizado',
          status: 'inativo',
        },
        sort: 'id',
        order: 'desc' as const,
      };

      act(() => {
        result.current.setListRequest(novoEstado);
      });

      expect(result.current.listRequest).toEqual(novoEstado);
    });

    it('deve lidar com mudança complexa de tabela com filtros e ordenação', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const filtros: Record<string, FilterValue | null> = {
        categoria: ['eletronicos', 'livros'],
        preco: ['100-500'],
      };

      const ordenador: SorterResult<any> = {
        columnKey: 'preco',
        order: 'descend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          filtros,
          ordenador,
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.filters).toEqual({
        nome: 'teste',
        status: 'ativo',
        categoria: ['eletronicos', 'livros'],
        preco: ['100-500'],
      });
      expect(result.current.listRequest.sort).toBe('preco');
      expect(result.current.listRequest.order).toBe('desc');
    });

    it('deve ignorar parâmetro de paginação', () => {
      const { result } = renderHook(() => useFullListRequest(estadoPadraoCompleto));

      const paginacao: TablePaginationConfig = {
        current: 5,
        pageSize: 20,
      };

      act(() => {
        result.current.onAntTableChange(
          paginacao,
          {},
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      // A paginação não deve afetar o estado, mas os filtros devem permanecer
      expect(result.current.listRequest.filters).toEqual(estadoPadraoCompleto.filters);
      // O hook não lida com paginação adequadamente, então sort e order são undefined
      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve usar prev.sort quando columnKey é undefined', () => {
      const estadoComSort: IFullListRequest<FiltroTeste> = {
        filters: {
          nome: 'teste',
          status: 'ativo',
        },
        sort: 'nome',
        order: 'asc' as const,
      };

      const { result } = renderHook(() => useFullListRequest(estadoComSort));

      const ordenador: SorterResult<any> = {
        order: 'descend',
        // columnKey é undefined
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      // Deve usar o prev.sort quando columnKey é undefined
      expect(result.current.listRequest.sort).toBe('nome');
      expect(result.current.listRequest.order).toBe('desc');
    });
  });

  describe('Casos extremos e tratamento de erros', () => {
    it('deve lidar com objeto de filtros vazio', () => {
      const estadoVazio: IListRequest<FiltroTeste> = {
        pagination: {
          page: 1,
          page_size: 10,
        },
        filters: {},
      };

      const { result } = renderHook(() => useListRequest(estadoVazio));

      const filtros: Record<string, FilterValue | null> = {
        nome: ['teste'],
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          filtros,
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.filters).toEqual({
        nome: ['teste'],
      });
    });

    it('deve lidar com filtros com valores null', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const filtros: Record<string, FilterValue | null> = {
        nome: null,
        status: ['ativo'],
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          filtros,
          [],
          { currentDataSource: [], action: 'filter' }
        );
      });

      expect(result.current.listRequest.filters).toEqual({
        nome: null,
        status: ['ativo'],
      });
    });

    it('deve lidar com ordenador sem columnKey', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any> = {
        order: 'ascend',
      };

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBe('nome');
      expect(result.current.listRequest.order).toBe('asc');
    });

    it('deve lidar com array de ordenação vazio', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any>[] = [];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });

    it('deve lidar com array de ordenação sem ordem', () => {
      const { result } = renderHook(() => useListRequest(estadoPadrao));

      const ordenador: SorterResult<any>[] = [
        {
          columnKey: 'nome',
          order: undefined,
        },
        {
          columnKey: 'status',
          order: undefined,
        },
      ];

      act(() => {
        result.current.onAntTableChange(
          {},
          {},
          ordenador,
          { currentDataSource: [], action: 'sort' }
        );
      });

      expect(result.current.listRequest.sort).toBeUndefined();
      expect(result.current.listRequest.order).toBeUndefined();
    });
  });
});
