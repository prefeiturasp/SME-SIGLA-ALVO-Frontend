import React from 'react';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { App } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../../services', () => ({
  API: {
    Candidatos: {
      getParametrizacaoCandidatos: jest.fn(() => ({ response: Promise.resolve([]) })),
      patchParametrizacaoCandidatos: jest.fn(() => ({ response: Promise.resolve({}) })),
    },
  },
}));

import { API } from '../../../../../services';
import AbaConvocacao from '../../components/AbaConvocacao';
import { getParametrizacaoCandidatos } from '../../hooks/getParametrizacaoCandidatos';
import { patchParametrizacaoCandidatos } from '../../hooks/patchParametrizacaoCandidatos';

jest.mock('../../hooks/getParametrizacaoCandidatos');
jest.mock('../../hooks/patchParametrizacaoCandidatos');

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return { ...actual, message: { warning: jest.fn() } };
});

const mockGetParametrizacaoCandidatos = getParametrizacaoCandidatos as jest.MockedFunction<typeof getParametrizacaoCandidatos>;
const mockPatchParametrizacaoCandidatos = patchParametrizacaoCandidatos as jest.MockedFunction<typeof patchParametrizacaoCandidatos>;

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

describe('AbaConvocacao', () => {
  const getInputs = (container: HTMLElement) => container.querySelectorAll('.ant-input-number-input');
  const getInput = (container: HTMLElement, index: number) => getInputs(container)[index];
  const waitForLoading = async (container: HTMLElement) => 
    waitFor(() => expect(container.querySelector('.ant-spin')).not.toBeInTheDocument());

  const setupComponent = async (data: any = []) => {
    mockGetParametrizacaoCandidatos.mockResolvedValue(data);
    const { container } = render(<AbaConvocacao canAddParametrizacao />, { wrapper: createWrapper() });
    await waitForLoading(container);
    return container;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach(mock => mock.mockClear());
  });

  describe('Carregamento inicial', () => {
    it('deve exibir loading enquanto busca dados', async () => {
      mockGetParametrizacaoCandidatos.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      const { container } = render(<AbaConvocacao canAddParametrizacao />, { wrapper: createWrapper() });
      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
      await waitForLoading(container);
    });

    it.each([
      { data: [{ uuid: 'test-uuid-123', porcentagem_pcd: 0.1, porcentagem_nna: 0.15 }], expected: ['0.10', '0.15'] },
      { data: { uuid: 'test-uuid-456', porcentagem_pcd: 0.08, porcentagem_nna: 0.12 }, expected: ['0.08', '0.12'] },
      { data: null, expected: ['0.05', '0.20'] },
      { data: [], expected: ['0.05', '0.20'] },
      { data: [{ uuid: 'test-uuid', porcentagem_pcd: null, porcentagem_nna: 0.15 }], expected: ['0.05', '0.15'] },
      { data: [{ uuid: 'test-uuid', porcentagem_pcd: 0.1, porcentagem_nna: null }], expected: ['0.10', '0.20'] },
    ])('deve carregar dados corretamente quando backend retorna $data', async ({ data, expected }) => {
      const container = await setupComponent(data);
      const inputs = getInputs(container);
      expect(inputs[0]).toHaveValue(expected[0]);
      expect(inputs[1]).toHaveValue(expected[1]);
    });

    it('deve tratar erro ao buscar dados e usar valores padrão', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetParametrizacaoCandidatos.mockRejectedValue(new Error('Erro de rede'));
      const { container } = render(<AbaConvocacao canAddParametrizacao />, { wrapper: createWrapper() });
      await waitForLoading(container);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar parâmetros de convocação:', expect.any(Error));
      });
      const inputs = getInputs(container);
      expect(inputs[0]).toHaveValue('0.05');
      expect(inputs[1]).toHaveValue('0.20');
      consoleErrorSpy.mockRestore();
    });

    it('deve evitar múltiplas chamadas ao backend', async () => {
      await setupComponent();
      expect(mockGetParametrizacaoCandidatos).toHaveBeenCalledTimes(1);
      render(<AbaConvocacao canAddParametrizacao />, { wrapper: createWrapper() });
      await waitFor(() => expect(mockGetParametrizacaoCandidatos).toHaveBeenCalled());
    });
  });

  describe('Interação com campos', () => {
    it.each([
      { fieldIndex: 0, value: '0.1', expected: '0.10', fieldName: 'DEF' },
      { fieldIndex: 1, value: '0.3', expected: '0.30', fieldName: 'NNA' },
    ])('deve permitir alterar porcentagem $fieldName', async ({ fieldIndex, value, expected }) => {
      const container = await setupComponent();
      fireEvent.change(getInput(container, fieldIndex), { target: { value } });
      await waitFor(() => expect(getInput(container, fieldIndex)).toHaveValue(expected));
    });
  });

  describe('Validação de soma', () => {
    it('deve exibir erro e desabilitar botão quando soma é maior que 1', async () => {
      const container = await setupComponent();
      fireEvent.change(getInput(container, 0), { target: { value: '0.6' } });
      fireEvent.change(getInput(container, 1), { target: { value: '0.5' } });

      await waitFor(() => {
        expect(screen.getByText(/A soma das porcentagens DEF e NNA não pode ser maior que 1/i)).toBeInTheDocument();
        expect(screen.getByText('Salvar').closest('button')).toBeDisabled();
      });
    });

    it.each([
      { def: '0.5', nna: '0.5', description: 'igual a 1' },
      { def: '0.3', nna: '0.4', description: 'menor que 1' },
      { def: '', nna: '0.4', description: 'com valor null' },
    ])('não deve exibir erro quando soma é $description', async ({ def, nna }) => {
      const container = await setupComponent();
      fireEvent.change(getInput(container, 0), { target: { value: def } });
      if (nna) fireEvent.change(getInput(container, 1), { target: { value: nna } });
      await waitFor(() => {
        expect(screen.queryByText(/A soma das porcentagens DEF e NNA não pode ser maior que 1/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Salvar alterações', () => {
    const defaultData = [{ uuid: 'test-uuid-123', porcentagem_pcd: 0.05, porcentagem_nna: 0.2 }];

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
      expect(mockPatchParametrizacaoCandidatos).not.toHaveBeenCalled();
    });

    it.each([
      { changes: { def: '0.1' }, expectedPayload: { porcentagem_pcd: 0.1, porcentagem_nna: 0.2 } },
      { changes: { nna: '0.3' }, expectedPayload: { porcentagem_pcd: 0.05, porcentagem_nna: 0.3 } },
      { changes: { def: '0.08', nna: '0.25' }, expectedPayload: { porcentagem_pcd: 0.08, porcentagem_nna: 0.25 } },
    ])('deve salvar alterações corretamente', async ({ changes, expectedPayload }) => {
      mockPatchParametrizacaoCandidatos.mockResolvedValue(undefined);
      const container = await setupComponent(defaultData);

      if (changes.def) {
        fireEvent.change(getInput(container, 0), { target: { value: changes.def } });
        await waitFor(() => expect(getInput(container, 0)).toHaveValue(parseFloat(changes.def).toFixed(2)));
      }
      if (changes.nna) {
        fireEvent.change(getInput(container, 1), { target: { value: changes.nna } });
        await waitFor(() => expect(getInput(container, 1)).toHaveValue(parseFloat(changes.nna).toFixed(2)));
      }

      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoCandidatos).toHaveBeenCalledWith(expectedPayload, 'test-uuid-123');
        expect(mockNotification.success).toHaveBeenCalledWith({
          message: 'Parâmetros de Convocação atualizados com sucesso!',
          placement: 'top',
          duration: 2,
        });
      });
    });

    it('deve usar 0 quando valor é null no payload', async () => {
      mockPatchParametrizacaoCandidatos.mockResolvedValue(undefined);
      const container = await setupComponent(defaultData);

      fireEvent.change(getInput(container, 0), { target: { value: '' } });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoCandidatos).toHaveBeenCalledWith(
          { porcentagem_pcd: 0, porcentagem_nna: 0.2 },
          'test-uuid-123'
        );
      });
    });

    it('deve usar undefined quando uuid é null', async () => {
      mockPatchParametrizacaoCandidatos.mockResolvedValue(undefined);
      const container = await setupComponent([]);

      fireEvent.change(getInput(container, 0), { target: { value: '0.1' } });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoCandidatos).toHaveBeenCalledWith(
          { porcentagem_pcd: 0.1, porcentagem_nna: 0.2 },
          undefined
        );
      });
    });

    it('deve exibir erro quando falha ao salvar', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockPatchParametrizacaoCandidatos.mockRejectedValue(new Error('Erro ao salvar'));
      const container = await setupComponent(defaultData);

      fireEvent.change(getInput(container, 0), { target: { value: '0.1' } });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao salvar parâmetros de convocação:', expect.any(Error));
        expect(mockNotification.error).toHaveBeenCalledWith({
          message: 'Erro na atualização dos Parâmetros de Convocação',
          placement: 'top',
          duration: 3.5,
        });
      });
      consoleErrorSpy.mockRestore();
    });

    it('deve atualizar valores iniciais após salvar com sucesso', async () => {
      mockPatchParametrizacaoCandidatos.mockResolvedValue(undefined);
      const container = await setupComponent(defaultData);

      fireEvent.change(getInput(container, 0), { target: { value: '0.1' } });
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
      await waitFor(() => expect(mockPatchParametrizacaoCandidatos).toHaveBeenCalled());

      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(mockNotification.info).toHaveBeenCalledWith({
          message: 'Nenhuma alteração realizada!',
          placement: 'top',
          duration: 2,
        });
      });
    });

    it('deve exibir loading no botão durante o salvamento', async () => {
      mockPatchParametrizacaoCandidatos.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      );
      const container = await setupComponent(defaultData);

      fireEvent.change(getInput(container, 0), { target: { value: '0.1' } });
      const saveButton = screen.getByText('Salvar').closest('button');
      fireEvent.click(saveButton!);

      await waitFor(() => expect(saveButton).toHaveClass('ant-btn-loading'));
      await waitFor(() => expect(saveButton).not.toHaveClass('ant-btn-loading'));
    });
  });
});

describe('Hooks - getParametrizacaoCandidatos e patchParametrizacaoCandidatos', () => {
  // Usar implementação real dos hooks para testar
  jest.unmock('../../hooks/getParametrizacaoCandidatos');
  jest.unmock('../../hooks/patchParametrizacaoCandidatos');
  
  const realGetParametrizacaoCandidatos = jest.requireActual('../../hooks/getParametrizacaoCandidatos').getParametrizacaoCandidatos;
  const realPatchParametrizacaoCandidatos = jest.requireActual('../../hooks/patchParametrizacaoCandidatos').patchParametrizacaoCandidatos;

  const mockAPIGetParametrizacaoCandidatos = API.Candidatos.getParametrizacaoCandidatos as jest.MockedFunction<
    typeof API.Candidatos.getParametrizacaoCandidatos
  >;
  const mockAPIPatchParametrizacaoCandidatos = API.Candidatos.patchParametrizacaoCandidatos as jest.MockedFunction<
    typeof API.Candidatos.patchParametrizacaoCandidatos
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParametrizacaoCandidatos', () => {
    it('deve chamar a API e retornar a resposta corretamente', async () => {
      const mockData = [{ uuid: 'test-uuid', porcentagem_pcd: 0.1, porcentagem_nna: 0.2 }];
      mockAPIGetParametrizacaoCandidatos.mockReturnValue({
        response: Promise.resolve(mockData),
      });

      const result = await realGetParametrizacaoCandidatos();

      expect(mockAPIGetParametrizacaoCandidatos).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('deve tratar erro quando a API falha', async () => {
      const mockError = new Error('Erro de rede');
      mockAPIGetParametrizacaoCandidatos.mockReturnValue({
        response: Promise.reject(mockError),
      });

      await expect(realGetParametrizacaoCandidatos()).rejects.toThrow('Erro de rede');
      expect(mockAPIGetParametrizacaoCandidatos).toHaveBeenCalledTimes(1);
    });
  });

  describe('patchParametrizacaoCandidatos', () => {
    it('deve chamar a API com payload e uuid e retornar a resposta', async () => {
      const payload = { porcentagem_pcd: 0.1, porcentagem_nna: 0.2 };
      const uuid = 'test-uuid-123';
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoCandidatos.mockReturnValue({
        response: Promise.resolve(mockResponse),
      });

      const result = await realPatchParametrizacaoCandidatos(payload, uuid);

      expect(mockAPIPatchParametrizacaoCandidatos).toHaveBeenCalledWith(payload, uuid);
      expect(result).toEqual(mockResponse);
    });

    it('deve chamar a API com uuid undefined quando não fornecido', async () => {
      const payload = { porcentagem_pcd: 0.1, porcentagem_nna: 0.2 };
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoCandidatos.mockReturnValue({
        response: Promise.resolve(mockResponse),
      });

      const result = await realPatchParametrizacaoCandidatos(payload);

      expect(mockAPIPatchParametrizacaoCandidatos).toHaveBeenCalledWith(payload, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('deve tratar erro quando a API falha', async () => {
      const payload = { porcentagem_pcd: 0.1, porcentagem_nna: 0.2 };
      const uuid = 'test-uuid';
      const mockError = new Error('Erro ao salvar');
      mockAPIPatchParametrizacaoCandidatos.mockReturnValue({
        response: Promise.reject(mockError),
      });

      await expect(realPatchParametrizacaoCandidatos(payload, uuid)).rejects.toThrow('Erro ao salvar');
      expect(mockAPIPatchParametrizacaoCandidatos).toHaveBeenCalledWith(payload, uuid);
    });
  });
});
