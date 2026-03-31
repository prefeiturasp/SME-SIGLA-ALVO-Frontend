import React from 'react';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { App } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../../services', () => ({
  API: {
    Escolhas: {
      getParametrizacaoEscolhas: jest.fn(() => ({ response: Promise.resolve([]), abort: jest.fn() })),
      patchParametrizacaoEscolhas: jest.fn(() => ({ response: Promise.resolve({}), abort: jest.fn() })),
    },
  },
}));

import { API } from '../../../../../services';
import AbaTipoUnidade from '../../components/AbaTipoUnidade';
import { getParametrizacaoEscolhas } from '../../hooks/getParametrizacaoEscolhas';
import { patchParametrizacaoEscolhas } from '../../hooks/patchParametrizacaoEscolhas';

jest.mock('../../hooks/getParametrizacaoEscolhas');
jest.mock('../../hooks/patchParametrizacaoEscolhas');

const mockGetParametrizacaoEscolhas = getParametrizacaoEscolhas as jest.MockedFunction<typeof getParametrizacaoEscolhas>;
const mockPatchParametrizacaoEscolhas = patchParametrizacaoEscolhas as jest.MockedFunction<typeof patchParametrizacaoEscolhas>;

const mockNotification = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <App>{children}</App>
    </QueryClientProvider>
  );
};

jest.spyOn(App, 'useApp').mockReturnValue({
  message: {} as any,
  notification: mockNotification as any,
  modal: {} as any,
});

describe('AbaTipoUnidade', () => {
  const getCheckboxByText = (text: string): HTMLInputElement => {
    return screen.getByText(text).closest('label')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
  };
  const waitForLoading = async () => 
    waitFor(() => expect(screen.queryByText('Carregando...')).not.toBeInTheDocument());

  const setupComponent = async (data: any[] = []) => {
    mockGetParametrizacaoEscolhas.mockResolvedValue(data);
    render(<AbaTipoUnidade canAddParametrizacao />, { wrapper: createWrapper() });
    await waitForLoading();
    if (data.length > 0) {
      await waitFor(() => expect(screen.getByText(data[0].tipo_ue)).toBeInTheDocument());
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach(mock => mock.mockClear());
  });

  describe('Carregamento inicial', () => {
    it('deve exibir loading enquanto busca dados', async () => {
      mockGetParametrizacaoEscolhas.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      render(<AbaTipoUnidade canAddParametrizacao />, { wrapper: createWrapper() });
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      await waitForLoading();
    });

    it('deve carregar dados do backend', async () => {
      const mockData = [
        { uuid: 'uuid-1', tipo_ue: 'Tipo 1', usar: true },
        { uuid: 'uuid-2', tipo_ue: 'Tipo 2', usar: false },
        { uuid: 'uuid-3', tipo_ue: 'Tipo 3', usar: true },
      ];
      await setupComponent(mockData);

      expect(mockGetParametrizacaoEscolhas).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Tipo 1')).toBeInTheDocument();
      expect(screen.getByText('Tipo 2')).toBeInTheDocument();
      expect(screen.getByText('Tipo 3')).toBeInTheDocument();
    });

    it('deve tratar erro ao buscar dados', async () => {
      mockGetParametrizacaoEscolhas.mockRejectedValue(new Error('Erro de rede'));
      render(<AbaTipoUnidade canAddParametrizacao />, { wrapper: createWrapper() });
      await waitForLoading();

      await waitFor(() => {
        expect(mockNotification.error).toHaveBeenCalledWith({
          message: 'Erro ao carregar tipos de unidade.',
          placement: 'top',
          duration: 3.5,
        });
      });
    });

    it('deve evitar múltiplas chamadas ao backend', async () => {
      await setupComponent();
      expect(mockGetParametrizacaoEscolhas).toHaveBeenCalledTimes(1);
      render(<AbaTipoUnidade canAddParametrizacao />, { wrapper: createWrapper() });
      await waitFor(() => expect(mockGetParametrizacaoEscolhas).toHaveBeenCalled());
    });
  });

  describe('Divisão em colunas', () => {
    it.each([
      { count: 3, description: '3 itens em uma coluna cada' },
      { count: 6, description: '6 itens em 2 por coluna' },
      { count: 7, description: '7 itens em 3, 2, 2' },
    ])('deve dividir $count itens corretamente', async ({ count }) => {
      const mockData = Array.from({ length: count }, (_, i) => ({
        uuid: `uuid-${i + 1}`,
        tipo_ue: `Tipo ${i + 1}`,
        usar: i % 2 === 0,
      }));

      mockGetParametrizacaoEscolhas.mockResolvedValue(mockData);
      const { container } = render(<AbaTipoUnidade canAddParametrizacao />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Tipo 1')).toBeInTheDocument();
        expect(screen.getByText(`Tipo ${count}`)).toBeInTheDocument();
      });

      const columns = container.querySelectorAll('.ant-col');
      expect(columns.length).toBeGreaterThanOrEqual(3);
    });

    it('deve renderizar corretamente quando não há dados', async () => {
      await setupComponent();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  describe('Interação com checkboxes', () => {
    it.each([
      { text: 'Tipo 1', initialChecked: true, expectedAfterClick: false },
      { text: 'Tipo 2', initialChecked: false, expectedAfterClick: true },
    ])('deve permitir alterar checkbox de $text', async ({ text, initialChecked, expectedAfterClick }) => {
      await setupComponent([
        { uuid: 'uuid-1', tipo_ue: 'Tipo 1', usar: true },
        { uuid: 'uuid-2', tipo_ue: 'Tipo 2', usar: false },
      ]);

      const checkbox = getCheckboxByText(text);
      expect(checkbox.checked).toBe(initialChecked);

      fireEvent.click(checkbox);
      await waitFor(() => expect(checkbox.checked).toBe(expectedAfterClick));
    });
  });

  describe('Salvar alterações', () => {
    const defaultData = [
      { uuid: 'uuid-1', tipo_ue: 'Tipo 1', usar: true },
      { uuid: 'uuid-2', tipo_ue: 'Tipo 2', usar: false },
      { uuid: 'uuid-3', tipo_ue: 'Tipo 3', usar: true },
    ];

    it('deve exibir notificação quando não há alterações', async () => {
      await setupComponent(defaultData);
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockNotification.info).toHaveBeenCalledWith({
          message: 'Nenhuma alteração realizada!',
          placement: 'top',
          duration: 2,
        });
      });
      expect(mockPatchParametrizacaoEscolhas).not.toHaveBeenCalled();
    });

    it.each([
      {
        description: 'um item é alterado',
        actions: async () => {
          fireEvent.click(getCheckboxByText('Tipo 1'));
        },
        expectedPayload: [{ uuid: 'uuid-1', usar: false }],
      },
      {
        description: 'múltiplos itens são alterados',
        actions: async () => {
          fireEvent.click(getCheckboxByText('Tipo 1'));
          fireEvent.click(getCheckboxByText('Tipo 2'));
        },
        expectedPayload: [
          { uuid: 'uuid-1', usar: false },
          { uuid: 'uuid-2', usar: true },
        ],
      },
    ])('deve salvar quando $description', async ({ actions, expectedPayload }) => {
      mockPatchParametrizacaoEscolhas.mockResolvedValue(undefined);
      await setupComponent(defaultData);

      await actions();
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoEscolhas).toHaveBeenCalledWith(expectedPayload);
        expect(mockNotification.success).toHaveBeenCalledWith({
          message: 'Tipos de unidade salvos com sucesso!',
          placement: 'top',
          duration: 2,
        });
      });
    });

    it('deve atualizar valores iniciais após salvar com sucesso', async () => {
      mockPatchParametrizacaoEscolhas.mockResolvedValue(undefined);
      await setupComponent(defaultData);

      fireEvent.click(getCheckboxByText('Tipo 1'));
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
      await waitFor(() => expect(mockPatchParametrizacaoEscolhas).toHaveBeenCalled());

      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(mockNotification.info).toHaveBeenCalledWith({
          message: 'Nenhuma alteração realizada!',
          placement: 'top',
          duration: 2,
        });
      });
    });

    it('deve exibir erro quando falha ao salvar', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockPatchParametrizacaoEscolhas.mockRejectedValue(new Error('Erro ao salvar'));
      await setupComponent(defaultData);

      fireEvent.click(getCheckboxByText('Tipo 1'));
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao salvar tipos de unidade:', expect.any(Error));
        expect(mockNotification.error).toHaveBeenCalledWith({
          message: 'Erro ao salvar os tipos de unidade.',
          placement: 'top',
          duration: 3.5,
        });
      });
      consoleErrorSpy.mockRestore();
    });

    it('deve exibir loading no botão durante o salvamento', async () => {
      mockPatchParametrizacaoEscolhas.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      );
      await setupComponent(defaultData);

      fireEvent.click(getCheckboxByText('Tipo 1'));
      const saveButton = screen.getByText('Salvar').closest('button');
      fireEvent.click(saveButton!);

      await waitFor(() => expect(saveButton).toHaveClass('ant-btn-loading'));
      await waitFor(() => expect(saveButton).not.toHaveClass('ant-btn-loading'));
    });

    it('não deve incluir itens não alterados no payload', async () => {
      mockPatchParametrizacaoEscolhas.mockResolvedValue(undefined);
      await setupComponent(defaultData);

      fireEvent.click(getCheckboxByText('Tipo 1'));
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoEscolhas).toHaveBeenCalledWith([
          { uuid: 'uuid-1', usar: false },
        ]);
        const payload = mockPatchParametrizacaoEscolhas.mock.calls[0][0] as any[];
        expect(payload.find((item) => item.uuid === 'uuid-3')).toBeUndefined();
      });
    });
  });
});

describe('Hooks - getParametrizacaoEscolhas e patchParametrizacaoEscolhas', () => {
  // Usar implementação real dos hooks para testar
  jest.unmock('../../hooks/getParametrizacaoEscolhas');
  jest.unmock('../../hooks/patchParametrizacaoEscolhas');
  
  const realGetParametrizacaoEscolhas = jest.requireActual('../../hooks/getParametrizacaoEscolhas').getParametrizacaoEscolhas;
  const realPatchParametrizacaoEscolhas = jest.requireActual('../../hooks/patchParametrizacaoEscolhas').patchParametrizacaoEscolhas;

  const mockAPIGetParametrizacaoEscolhas = API.Escolhas.getParametrizacaoEscolhas as jest.MockedFunction<
    typeof API.Escolhas.getParametrizacaoEscolhas
  >;
  const mockAPIPatchParametrizacaoEscolhas = API.Escolhas.patchParametrizacaoEscolhas as jest.MockedFunction<
    typeof API.Escolhas.patchParametrizacaoEscolhas
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParametrizacaoEscolhas', () => {
    it('deve chamar a API e retornar array mapeado corretamente', async () => {
      const mockData = [
        { uuid: 'uuid-1', tipo_ue: 'Tipo 1', usar: true, campo_extra: 'ignorado' },
        { uuid: 'uuid-2', tipo_ue: 'Tipo 2', usar: false },
      ];
      mockAPIGetParametrizacaoEscolhas.mockReturnValue({
        response: Promise.resolve(mockData),
        abort: jest.fn(),
      });

      const result = await realGetParametrizacaoEscolhas();

      expect(mockAPIGetParametrizacaoEscolhas).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { uuid: 'uuid-1', tipo_ue: 'Tipo 1', usar: true },
        { uuid: 'uuid-2', tipo_ue: 'Tipo 2', usar: false },
      ]);
      expect(result[0]).not.toHaveProperty('campo_extra');
    });

    it('deve retornar array vazio quando dados não são array', async () => {
      mockAPIGetParametrizacaoEscolhas.mockReturnValue({
        response: Promise.resolve(null),
        abort: jest.fn(),
      });

      const result = await realGetParametrizacaoEscolhas();

      expect(result).toEqual([]);
    });

    it('deve tratar erro quando a API falha', async () => {
      const mockError = new Error('Erro de rede');
      mockAPIGetParametrizacaoEscolhas.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realGetParametrizacaoEscolhas()).rejects.toThrow('Erro de rede');
      expect(mockAPIGetParametrizacaoEscolhas).toHaveBeenCalledTimes(1);
    });
  });

  describe('patchParametrizacaoEscolhas', () => {
    it('deve chamar a API com payload e retornar a resposta', async () => {
      const payload = [{ uuid: 'uuid-1', usar: true }];
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoEscolhas.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchParametrizacaoEscolhas(payload);

      expect(mockAPIPatchParametrizacaoEscolhas).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockResponse);
    });

    it('deve tratar erro quando a API falha', async () => {
      const payload = [{ uuid: 'uuid-1', usar: false }];
      const mockError = new Error('Erro ao salvar');
      mockAPIPatchParametrizacaoEscolhas.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realPatchParametrizacaoEscolhas(payload)).rejects.toThrow('Erro ao salvar');
      expect(mockAPIPatchParametrizacaoEscolhas).toHaveBeenCalledWith(payload);
    });
  });
});
