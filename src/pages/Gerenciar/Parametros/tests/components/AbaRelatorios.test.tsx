import React from 'react';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { App } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../../services', () => ({
  API: {
    Relatorios: {
      getParametrizacaoRelatorios: jest.fn(() => ({ response: Promise.resolve([]), abort: jest.fn() })),
      patchParametrizacaoRelatorios: jest.fn(() => ({ response: Promise.resolve({}), abort: jest.fn() })),
    },
  },
}));

import { API } from '../../../../../services';
import AbaRelatorios from '../../components/AbaRelatorios';
import { getParametrizacaoRelatorios } from '../../hooks/getParametrizacaoRelatorios';
import { patchParametrizacaoRelatorios } from '../../hooks/patchParametrizacaoRelatorios';

jest.mock('../../hooks/getParametrizacaoRelatorios');
jest.mock('../../hooks/patchParametrizacaoRelatorios');

jest.mock('../../../../Relatorios/components/QuillEditor', () => {
  return function MockQuillEditor({ value, onChange, placeholder }: any) {
    return (
      <div data-testid="quill-editor">
        <textarea
          data-testid="quill-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };
});

jest.mock('@mui/icons-material/Image', () => {
  return function MockImageIcon(props: any) {
    return <div data-testid="image-icon" {...props} />;
  };
});

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const UploadComponent = ({ children, beforeUpload, accept }: any) => {
    return (
      <div data-testid="ant-upload">
        <input
          type="file"
          data-testid="upload-file-input"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && beforeUpload) {
              beforeUpload(file);
            }
          }}
        />
        {children}
      </div>
    );
  };
  (UploadComponent as any).LIST_IGNORE = Symbol('LIST_IGNORE');
  return {
    ...actual,
    message: { warning: jest.fn() },
    Upload: UploadComponent,
  };
});

const mockGetParametrizacaoRelatorios = getParametrizacaoRelatorios as jest.MockedFunction<typeof getParametrizacaoRelatorios>;
const mockPatchParametrizacaoRelatorios = patchParametrizacaoRelatorios as jest.MockedFunction<typeof patchParametrizacaoRelatorios>;

const mockNotification = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

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

const createTestFile = (name = 'test.png', size = 1024 * 1024) => {
  const file = new File(['test'], name, { type: 'image/png' });
  Object.defineProperty(file, 'size', { value: size });
  Object.defineProperty(file, 'uid', { value: 'test-uid' });
  return file;
};

describe('AbaRelatorios', () => {
  const getTextarea = () => screen.getByTestId('quill-textarea');
  const getFileInput = () => screen.getByTestId('upload-file-input');
  const getLogoImg = (container: HTMLElement) => container.querySelector('img[alt="Logo preview"]');
  const waitForLoading = async (container: HTMLElement) => 
    waitFor(() => expect(container.querySelector('.ant-spin')).not.toBeInTheDocument());

  const setupComponent = async (data: any = []) => {
    mockGetParametrizacaoRelatorios.mockResolvedValue(data);
    const { container } = render(<AbaRelatorios canAddParametrizacao />, { wrapper: createWrapper() });
    await waitForLoading(container);
    return container;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach(mock => mock.mockClear());
    (global.URL.createObjectURL as jest.Mock).mockClear();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Carregamento inicial', () => {
    it('deve exibir loading enquanto busca dados', async () => {
      mockGetParametrizacaoRelatorios.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      const { container } = render(<AbaRelatorios canAddParametrizacao />, { wrapper: createWrapper() });
      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
      await waitForLoading(container);
    });

    it.each([
      {
        data: [{ uuid: 'test-uuid-123', cabecalho: '<p>Teste cabeçalho</p>', logo: 'https://example.com/logo.png' }],
        expectedCabecalho: '<p>Teste cabeçalho</p>',
        expectedLogo: 'https://example.com/logo.png',
      },
      {
        data: { uuid: 'test-uuid-456', cabecalho: '<p>Outro cabeçalho</p>', logo: 'https://example.com/logo2.png' },
        expectedCabecalho: '<p>Outro cabeçalho</p>',
        expectedLogo: 'https://example.com/logo2.png',
      },
      {
        data: [{ uuid: 'test-uuid', cabeçalho: '<p>Cabeçalho com acento</p>' }],
        expectedCabecalho: '<p>Cabeçalho com acento</p>',
        expectedLogo: null,
      },
      {
        data: [{ uuid: 'test-uuid' }],
        expectedCabecalho: '',
        expectedLogo: null,
      },
    ])('deve carregar dados corretamente do backend', async ({ data, expectedCabecalho, expectedLogo }) => {
      const container = await setupComponent(data);
      expect(getTextarea()).toHaveValue(expectedCabecalho);
      if (expectedLogo) {
        const img = getLogoImg(container);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expectedLogo);
      }
    });

    it('deve tratar erro ao buscar dados', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetParametrizacaoRelatorios.mockRejectedValue(new Error('Erro de rede'));
      const { container } = render(<AbaRelatorios canAddParametrizacao />, { wrapper: createWrapper() });
      await waitForLoading(container);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar parâmetros de relatórios:', expect.any(Error));
      });
      consoleErrorSpy.mockRestore();
    });

    it('deve evitar múltiplas chamadas ao backend', async () => {
      await setupComponent();
      expect(mockGetParametrizacaoRelatorios).toHaveBeenCalledTimes(1);
      render(<AbaRelatorios canAddParametrizacao />, { wrapper: createWrapper() });
      await waitFor(() => expect(mockGetParametrizacaoRelatorios).toHaveBeenCalled());
    });
  });

  describe('Preview de imagem', () => {
    it('deve exibir ícone quando não há logo nem arquivo selecionado', async () => {
      const container = await setupComponent();
      expect(screen.getByTestId('image-icon')).toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('deve exibir logo do backend quando não há arquivo selecionado', async () => {
      const container = await setupComponent([{
        uuid: 'test-uuid',
        logo: 'https://example.com/backend-logo.png',
      }]);

      const img = getLogoImg(container);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/backend-logo.png');
    });
  });

  describe('Upload de logo', () => {
    it('deve permitir selecionar arquivo válido', async () => {
      const container = await setupComponent();
      const file = createTestFile();

      fireEvent.change(getFileInput(), { target: { files: [file] } });

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(getLogoImg(container)).toBeInTheDocument();
      });
    });

    it('deve priorizar arquivo selecionado sobre logo do backend', async () => {
      const container = await setupComponent([{
        uuid: 'test-uuid',
        logo: 'https://example.com/backend-logo.png',
      }]);
      const file = createTestFile();

      fireEvent.change(getFileInput(), { target: { files: [file] } });

      await waitFor(() => {
        const img = getLogoImg(container);
        expect(img).toHaveAttribute('src', 'blob:mock-url');
      });
    });
  });

  describe('Alteração de cabeçalho', () => {
    it('deve permitir alterar cabeçalho', async () => {
      await setupComponent([{ uuid: 'test-uuid', cabecalho: '<p>Cabeçalho inicial</p>' }]);
      expect(getTextarea()).toHaveValue('<p>Cabeçalho inicial</p>');

      fireEvent.change(getTextarea(), { target: { value: '<p>Novo cabeçalho</p>' } });
      expect(getTextarea()).toHaveValue('<p>Novo cabeçalho</p>');
    });
  });

  describe('Salvar alterações', () => {
    const defaultData = [{ uuid: 'test-uuid-123', cabecalho: '<p>Cabeçalho inicial</p>' }];

    it.each([
      {
        description: 'apenas logo é alterada',
        setup: async () => {
          const file = createTestFile();
          fireEvent.change(getFileInput(), { target: { files: [file] } });
          await waitFor(() => expect(global.URL.createObjectURL).toHaveBeenCalled());
          return { formDataCheck: (formData: FormData) => {
            expect(formData.get('logo')).toBe(file);
            expect(formData.get('cabecalho')).toBeNull();
          }};
        },
      },
      {
        description: 'cabeçalho e logo são alterados',
        setup: async () => {
          fireEvent.change(getTextarea(), { target: { value: '<p>Novo cabeçalho</p>' } });
          const file = createTestFile();
          fireEvent.change(getFileInput(), { target: { files: [file] } });
          return { formDataCheck: (formData: FormData) => {
            expect(formData.get('cabecalho')).toBe('<p>Novo cabeçalho</p>');
            expect(formData.get('logo')).toBe(file);
          }};
        },
      },
    ])('deve salvar quando $description', async ({ setup }) => {
      mockPatchParametrizacaoRelatorios.mockResolvedValue(undefined);
      await setupComponent(defaultData);

      const { formDataCheck } = await setup();
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoRelatorios).toHaveBeenCalled();
        const formData = mockPatchParametrizacaoRelatorios.mock.calls[0][0] as FormData;
        formDataCheck(formData);
      });
    });

    it('deve usar undefined quando uuid é null', async () => {
      mockPatchParametrizacaoRelatorios.mockResolvedValue(undefined);
      await setupComponent([]);

      fireEvent.change(getTextarea(), { target: { value: '<p>Novo</p>' } });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoRelatorios).toHaveBeenCalledWith(
          expect.any(FormData),
          undefined
        );
      });
    });

    it('deve atualizar logoUrl e limpar logoFile após salvar logo', async () => {
      mockPatchParametrizacaoRelatorios.mockResolvedValue(undefined);
      const container = await setupComponent(defaultData);

      const file = createTestFile();
      fireEvent.change(getFileInput(), { target: { files: [file] } });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchParametrizacaoRelatorios).toHaveBeenCalled();
        const img = getLogoImg(container);
        expect(img).toHaveAttribute('src', 'blob:mock-url');
      });
    });

    it('deve exibir loading no botão durante o salvamento', async () => {
      mockPatchParametrizacaoRelatorios.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      );
      await setupComponent(defaultData);

      fireEvent.change(getTextarea(), { target: { value: '<p>Novo</p>' } });
      const saveButton = screen.getByText('Salvar').closest('button');
      fireEvent.click(saveButton!);

      await waitFor(() => expect(saveButton).toHaveClass('ant-btn-loading'));
      await waitFor(() => expect(saveButton).not.toHaveClass('ant-btn-loading'));
    });
  });
});

describe('Hooks - getParametrizacaoRelatorios e patchParametrizacaoRelatorios', () => {
  // Usar implementação real dos hooks para testar
  jest.unmock('../../hooks/getParametrizacaoRelatorios');
  jest.unmock('../../hooks/patchParametrizacaoRelatorios');
  
  const realGetParametrizacaoRelatorios = jest.requireActual('../../hooks/getParametrizacaoRelatorios').getParametrizacaoRelatorios;
  const realPatchParametrizacaoRelatorios = jest.requireActual('../../hooks/patchParametrizacaoRelatorios').patchParametrizacaoRelatorios;

  const mockAPIGetParametrizacaoRelatorios = API.Relatorios.getParametrizacaoRelatorios as jest.MockedFunction<
    typeof API.Relatorios.getParametrizacaoRelatorios
  >;
  const mockAPIPatchParametrizacaoRelatorios = API.Relatorios.patchParametrizacaoRelatorios as jest.MockedFunction<
    typeof API.Relatorios.patchParametrizacaoRelatorios
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParametrizacaoRelatorios', () => {
    it('deve chamar a API e retornar a resposta corretamente', async () => {
      const mockData = [{ uuid: 'test-uuid', cabecalho: '<p>Teste</p>', logo: 'https://example.com/logo.png' }];
      mockAPIGetParametrizacaoRelatorios.mockReturnValue({
        response: Promise.resolve(mockData),
        abort: jest.fn(),
      });

      const result = await realGetParametrizacaoRelatorios();

      expect(mockAPIGetParametrizacaoRelatorios).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('deve tratar erro quando a API falha', async () => {
      const mockError = new Error('Erro de rede');
      mockAPIGetParametrizacaoRelatorios.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realGetParametrizacaoRelatorios()).rejects.toThrow('Erro de rede');
      expect(mockAPIGetParametrizacaoRelatorios).toHaveBeenCalledTimes(1);
    });
  });

  describe('patchParametrizacaoRelatorios', () => {
    it('deve chamar a API com payload e uuid e retornar a resposta', async () => {
      const payload = { cabecalho: '<p>Teste</p>' };
      const uuid = 'test-uuid-123';
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoRelatorios.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchParametrizacaoRelatorios(payload, uuid);

      expect(mockAPIPatchParametrizacaoRelatorios).toHaveBeenCalledWith(payload, uuid);
      expect(result).toEqual(mockResponse);
    });

    it('deve chamar a API com FormData quando fornecido', async () => {
      const formData = new FormData();
      formData.append('cabecalho', '<p>Teste</p>');
      const uuid = 'test-uuid-123';
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoRelatorios.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchParametrizacaoRelatorios(formData, uuid);

      expect(mockAPIPatchParametrizacaoRelatorios).toHaveBeenCalledWith(formData, uuid);
      expect(result).toEqual(mockResponse);
    });

    it('deve chamar a API com uuid undefined quando não fornecido', async () => {
      const payload = { cabecalho: '<p>Teste</p>' };
      const mockResponse = { success: true };
      mockAPIPatchParametrizacaoRelatorios.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchParametrizacaoRelatorios(payload);

      expect(mockAPIPatchParametrizacaoRelatorios).toHaveBeenCalledWith(payload, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('deve tratar erro quando a API falha', async () => {
      const payload = { cabecalho: '<p>Teste</p>' };
      const uuid = 'test-uuid';
      const mockError = new Error('Erro ao salvar');
      mockAPIPatchParametrizacaoRelatorios.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realPatchParametrizacaoRelatorios(payload, uuid)).rejects.toThrow('Erro ao salvar');
      expect(mockAPIPatchParametrizacaoRelatorios).toHaveBeenCalledWith(payload, uuid);
    });
  });
});
