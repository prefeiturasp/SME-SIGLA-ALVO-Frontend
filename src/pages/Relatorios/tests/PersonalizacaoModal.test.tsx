import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { App } from 'antd';

jest.mock('../../../services', () => ({
  API: {
    Relatorios: {
      getPersonalizacaoRelatorio: jest.fn(() => ({ response: Promise.resolve({}), abort: jest.fn() })),
      patchPersonalizacaoRelatorio: jest.fn(() => ({ response: Promise.resolve({}), abort: jest.fn() })),
    },
  },
}));

import { API } from '../../../services';

jest.mock('../hooks/useGetPersonalizacaoRelatorio');
jest.mock('../hooks/usePatchPersonalizacaoRelatorio');

import PersonalizacaoModal from '../components/PersonalizacaoModal';
import { getPersonalizacaoRelatorio } from '../hooks/useGetPersonalizacaoRelatorio';
import { patchPersonalizacaoRelatorio } from '../hooks/usePatchPersonalizacaoRelatorio';

jest.mock('../components/QuillEditor', () => {
  return function MockQuillEditor({ value, onChange, placeholder, showToolbar }: any) {
    const testId = placeholder?.includes('texto final')
      ? 'texto-final'
      : showToolbar === false
        ? 'cabecalho'
        : 'cabecalho-gabarito';

    return (
      <div data-testid="quill-editor">
        <textarea
          data-testid={`quill-textarea-${testId}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };
});

jest.mock('../../EscolhaCandidatos/styles', () => ({
  ModalInfoCard: ({ children }: any) => <div data-testid="modal-info-card">{children}</div>,
  ModalInfoItem: ({ children }: any) => <div data-testid="modal-info-item">{children}</div>,
  ModalInfoLabel: ({ children, ...props }: any) => <label data-testid="modal-info-label" {...props}>{children}</label>,
  ModalInfoValue: ({ children, ...props }: any) => <span data-testid="modal-info-value" {...props}>{children}</span>,
}));

const mockGetPersonalizacaoRelatorio = getPersonalizacaoRelatorio as jest.MockedFunction<typeof getPersonalizacaoRelatorio>;
const mockPatchPersonalizacaoRelatorio = patchPersonalizacaoRelatorio as jest.MockedFunction<typeof patchPersonalizacaoRelatorio>;

const mockNotification = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};

jest.spyOn(App, 'useApp').mockReturnValue({
  message: {} as any,
  notification: mockNotification as any,
  modal: {} as any,
});

const defaultProps = {
  open: true,
  onCancel: jest.fn(),
  selectedRelatorio: { key: 'LAUDA_VAGAS', tipo: 'Lauda de vagas' },
  processoNome: 'Processo Teste',
  processoUuid: 'processo-uuid-123',
};

const createMockData = (overrides = {}) => ({
  uuid: 'uuid-123',
  usar_logotipo: true,
  cabecalho_gabarito: '',
  cabecalho: '',
  texto_final: '',
  cabecalho_capa_ata: '',
  ...overrides,
});

const setupComponent = (props = {}) => render(<PersonalizacaoModal {...defaultProps} {...props} />);

describe('PersonalizacaoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach(fn => fn.mockClear());
  });

  describe('Renderização inicial', () => {
    it('deve renderizar todos os elementos principais', () => {
      setupComponent();
      expect(screen.getByText('Personalizar Lauda de vagas')).toBeInTheDocument();
      expect(screen.getByText('Processo Teste')).toBeInTheDocument();
      expect(screen.getByText('Usar logotipo?')).toBeInTheDocument();
      expect(screen.getByText('Cabeçalho gabarito:')).toBeInTheDocument();
      expect(screen.getByText('Cabeçalho:')).toBeInTheDocument();
      expect(screen.getByText('Copiar cabeçalho gabarito')).toBeInTheDocument();
      expect(screen.getByText('Texto final:')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('deve ocultar campo de cabeçalho gabarito e botão copiar para relatórios sem essa funcionalidade', () => {
      setupComponent({
        selectedRelatorio: { key: 'RELACAO_VAGAS', tipo: 'Relação de Vagas' },
      });

      expect(screen.queryByText('Cabeçalho gabarito:')).not.toBeInTheDocument();
      expect(screen.queryByText('Copiar cabeçalho gabarito')).not.toBeInTheDocument();
      expect(screen.getByText('Cabeçalho:')).toBeInTheDocument();
    });

    it.each([
      { props: { selectedRelatorio: null }, expected: 'Personalização' },
      { props: { processoNome: '' }, expected: '—' },
    ])('deve exibir valores padrão quando necessário', ({ props, expected }) => {
      setupComponent(props);
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe('Carregamento de dados', () => {
    it('deve buscar personalização quando modal abre com dados válidos', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData());
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalledWith('LAUDA_VAGAS'));
    });

    it.each([
      { open: false },
      { processoUuid: '' },
      { selectedRelatorio: null },
      { selectedRelatorio: { key: undefined as any, tipo: 'Teste' } },
    ])('deve não buscar quando condições não são atendidas', (props) => {
      setupComponent(props);
      expect(mockGetPersonalizacaoRelatorio).not.toHaveBeenCalled();
    });

    it('deve não buscar novamente se já foi buscado (hasFetchedRef)', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData());
      const { rerender } = setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      rerender(<PersonalizacaoModal {...defaultProps} />);
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalledTimes(1));
    });

    it('deve atualizar estados com dados retornados', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData({
        usar_logotipo: false,
        cabecalho_gabarito: '<p>Cabeçalho gabarito carregado</p>',
        cabecalho: '<p>Cabeçalho carregado</p>',
        texto_final: '<p>Texto final carregado</p>',
      }));
      setupComponent();
      await waitFor(() => {
        expect(screen.getByTestId('quill-textarea-cabecalho-gabarito')).toHaveValue('<p>Cabeçalho gabarito carregado</p>');
        expect(screen.getByTestId('quill-textarea-cabecalho')).toHaveValue('<p>Cabeçalho carregado</p>');
        expect(screen.getByTestId('quill-textarea-texto-final')).toHaveValue('<p>Texto final carregado</p>');
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(1);
        expect(checkboxes[0]).not.toBeChecked();
      });
    });

    it('deve usar valores padrão quando dados são null ou undefined', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(null as any);
      setupComponent();
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(1);
        expect(checkboxes[0]).toBeChecked();
      });
    });

    it('deve tratar erro ao buscar personalização', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetPersonalizacaoRelatorio.mockRejectedValue(new Error('Erro de rede'));
      setupComponent();
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar personalização do relatório:', expect.any(Error));
      });
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Reset quando modal fecha', () => {
    it('deve resetar estados quando open muda para false', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData({ usar_logotipo: false }));
      const { rerender } = setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      rerender(<PersonalizacaoModal {...defaultProps} open={false} />);
      await waitFor(() => {
        const checkboxes = screen.queryAllByRole('checkbox');
        if (checkboxes.length > 0) {
          expect(checkboxes[0]).toBeChecked();
        }
      });
    });
  });

  describe('Interações e salvamento', () => {
    beforeEach(() => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData());
    });

    it('deve não salvar quando não há mudanças', async () => {
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(1);
        expect(checkboxes[0]).toBeChecked();
      });
      fireEvent.click(screen.getByText('Salvar'));
      await waitFor(() => {
        expect(mockNotification.info).toHaveBeenCalledWith({
          message: 'Nenhuma Personalização realizada.',
          placement: 'top',
          duration: 2,
        });
        expect(mockPatchPersonalizacaoRelatorio).not.toHaveBeenCalled();
      });
    });

    it.each([
      { selectedRelatorio: null },
      { selectedRelatorio: { key: undefined as any, tipo: 'Teste' } },
      { processoUuid: '' },
    ])('deve não salvar quando dados inválidos', (props) => {
      setupComponent(props);
      fireEvent.click(screen.getByText('Salvar'));
      expect(mockPatchPersonalizacaoRelatorio).not.toHaveBeenCalled();
    });

    it.each([
      {
        name: 'usarLogotipo',
        change: (screen: any) => fireEvent.click(screen.getAllByRole('checkbox')[0]),
        expected: { usar_logotipo: false },
      },
      {
        name: 'cabecalhoGabaritoHtml',
        change: (screen: any) => fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), { target: { value: '<p>Novo cabeçalho gabarito</p>' } }),
        expected: { cabecalho_gabarito: '<p>Novo cabeçalho gabarito</p>', usar_logotipo: true },
      },
      {
        name: 'cabecalhoHtml',
        change: (screen: any) => fireEvent.change(screen.getByTestId('quill-textarea-cabecalho'), { target: { value: '<p>Novo cabeçalho</p>' } }),
        expected: { cabecalho: '<p>Novo cabeçalho</p>', usar_logotipo: true },
      },
      {
        name: 'textoPadraoFinalHtml',
        change: (screen: any) => fireEvent.change(screen.getByTestId('quill-textarea-texto-final'), { target: { value: '<p>Novo texto final</p>' } }),
        expected: { texto_final: '<p>Novo texto final</p>', usar_logotipo: true },
      },
    ])('deve atualizar e salvar quando há mudanças em $name', async ({ change, expected }) => {
      mockPatchPersonalizacaoRelatorio.mockResolvedValue(undefined);
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      change(screen);
      fireEvent.click(screen.getByText('Salvar'));
      await waitFor(() => {
        expect(mockPatchPersonalizacaoRelatorio).toHaveBeenCalledWith({
          tipoRelatorio: 'LAUDA_VAGAS',
          cabecalho_gabarito: expected.cabecalho_gabarito ?? '',
          cabecalho: expected.cabecalho ?? '',
          texto_final: expected.texto_final ?? '',
          usar_logotipo: expected.usar_logotipo ?? true,
          uuid: 'uuid-123',
        });
        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
    });

    it('deve copiar cabeçalho gabarito para o campo cabeçalho ao clicar no botão de copiar', async () => {
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());

      fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), {
        target: { value: '<p>Texto gabarito</p>' },
      });
      fireEvent.click(screen.getByText('Copiar cabeçalho gabarito'));

      expect(screen.getByTestId('quill-textarea-cabecalho')).toHaveValue('<p>Texto gabarito</p>');
      expect(mockPatchPersonalizacaoRelatorio).not.toHaveBeenCalled();
    });

    it('deve salvar sem cabecalho_gabarito para relatórios fora da lista de gabarito', async () => {
      mockPatchPersonalizacaoRelatorio.mockResolvedValue(undefined);
      setupComponent({
        selectedRelatorio: { key: 'RELACAO_VAGAS', tipo: 'Relação de Vagas' },
      });

      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalledWith('RELACAO_VAGAS'));
      const cabecalhoTextarea = screen.getAllByTestId(/quill-textarea-/)
        .find((el) => el.getAttribute('data-testid') !== 'quill-textarea-texto-final');
      expect(cabecalhoTextarea).toBeTruthy();
      fireEvent.change(cabecalhoTextarea as HTMLTextAreaElement, {
        target: { value: '<p>Cabeçalho sem gabarito</p>' },
      });
      fireEvent.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockPatchPersonalizacaoRelatorio).toHaveBeenCalledWith({
          tipoRelatorio: 'RELACAO_VAGAS',
          usar_logotipo: true,
          cabecalho: '<p>Cabeçalho sem gabarito</p>',
          texto_final: '',
          uuid: 'uuid-123',
        });
      });
    });

    it('deve salvar quando há múltiplas mudanças simultâneas', async () => {
      mockPatchPersonalizacaoRelatorio.mockResolvedValue(undefined);
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), { target: { value: '<p>Cabeçalho gabarito</p>' } });
      fireEvent.change(screen.getByTestId('quill-textarea-cabecalho'), { target: { value: '<p>Cabeçalho</p>' } });
      fireEvent.change(screen.getByTestId('quill-textarea-texto-final'), { target: { value: '<p>Texto final</p>' } });
      fireEvent.click(screen.getByText('Salvar'));
      await waitFor(() => {
        expect(mockPatchPersonalizacaoRelatorio).toHaveBeenCalledWith({
          tipoRelatorio: 'LAUDA_VAGAS',
          usar_logotipo: false,
          cabecalho_gabarito: '<p>Cabeçalho gabarito</p>',
          cabecalho: '<p>Cabeçalho</p>',
          texto_final: '<p>Texto final</p>',
          uuid: 'uuid-123',
        });
        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
    });

    it('deve usar null quando personalizacaoUuid é null', async () => {
      mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData({ uuid: null }));
      mockPatchPersonalizacaoRelatorio.mockResolvedValue(undefined);
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), { target: { value: '<p>Novo</p>' } });
      fireEvent.click(screen.getByText('Salvar'));
      await waitFor(() => {
        expect(mockPatchPersonalizacaoRelatorio).toHaveBeenCalledWith(expect.objectContaining({ uuid: null }));
      });
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('deve tratar erro ao salvar', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockPatchPersonalizacaoRelatorio.mockRejectedValue(new Error('Erro ao salvar'));
      setupComponent();
      await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
      fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), { target: { value: '<p>Novo</p>' } });
      fireEvent.click(screen.getByText('Salvar'));
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao salvar personalização do relatório:', expect.any(Error));
        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Cancelamento e estados de loading', () => {
    it('deve chamar onCancel quando botão cancelar é clicado', () => {
      setupComponent();
      fireEvent.click(screen.getByText('Cancelar'));
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it.each([
      { 
        name: 'carregamento', 
        setup: () => mockGetPersonalizacaoRelatorio.mockImplementation(
          () => new Promise(resolve => setTimeout(() => resolve(createMockData()), 100))
        ),
        trigger: async () => {},
      },
      { 
        name: 'salvamento', 
        setup: () => {
          mockGetPersonalizacaoRelatorio.mockResolvedValue(createMockData());
          mockPatchPersonalizacaoRelatorio.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(undefined), 100))
          );
        },
        trigger: async () => {
          await waitFor(() => expect(mockGetPersonalizacaoRelatorio).toHaveBeenCalled());
          fireEvent.change(screen.getByTestId('quill-textarea-cabecalho-gabarito'), { target: { value: '<p>Novo</p>' } });
          fireEvent.click(screen.getByText('Salvar').closest('button')!);
        },
      },
    ])('deve desabilitar botão salvar durante $name', async ({ setup, trigger }) => {
      setup();
      setupComponent();
      const saveButton = screen.getByText('Salvar').closest('button');
      await trigger();
      expect(saveButton).toBeDisabled();
      await waitFor(() => expect(saveButton).not.toBeDisabled());
    });
  });
});

describe('Hooks - getPersonalizacaoRelatorio e patchPersonalizacaoRelatorio', () => {
  jest.unmock('../hooks/useGetPersonalizacaoRelatorio');
  jest.unmock('../hooks/usePatchPersonalizacaoRelatorio');
  
  const realGetPersonalizacaoRelatorio = jest.requireActual('../hooks/useGetPersonalizacaoRelatorio').getPersonalizacaoRelatorio;
  const realPatchPersonalizacaoRelatorio = jest.requireActual('../hooks/usePatchPersonalizacaoRelatorio').patchPersonalizacaoRelatorio;

  const mockAPIGetPersonalizacaoRelatorio = API.Relatorios.getPersonalizacaoRelatorio as jest.MockedFunction<
    typeof API.Relatorios.getPersonalizacaoRelatorio
  >;
  const mockAPIPatchPersonalizacaoRelatorio = API.Relatorios.patchPersonalizacaoRelatorio as jest.MockedFunction<
    typeof API.Relatorios.patchPersonalizacaoRelatorio
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPersonalizacaoRelatorio', () => {
    it('deve chamar a API e retornar a resposta corretamente', async () => {
      const mockData = createMockData({ uuid: 'test-uuid-123' });
      mockAPIGetPersonalizacaoRelatorio.mockReturnValue({
        response: Promise.resolve(mockData),
        abort: jest.fn(),
      });

      const result = await realGetPersonalizacaoRelatorio('tipo-relatorio-1');

      expect(mockAPIGetPersonalizacaoRelatorio).toHaveBeenCalledWith('tipo-relatorio-1');
      expect(result).toEqual(mockData);
    });

    it('deve tratar erro quando a API falha', async () => {
      const mockError = new Error('Erro de rede');
      mockAPIGetPersonalizacaoRelatorio.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realGetPersonalizacaoRelatorio('tipo-relatorio-1')).rejects.toThrow('Erro de rede');
      expect(mockAPIGetPersonalizacaoRelatorio).toHaveBeenCalledWith('tipo-relatorio-1');
    });
  });

  describe('patchPersonalizacaoRelatorio', () => {
    const basePayload = {
      tipoRelatorio: 'LAUDA_VAGAS',
      usar_logotipo: false,
      cabecalho_gabarito: '<p>Cabeçalho gabarito</p>',
      cabecalho: '<p>Cabeçalho</p>',
      texto_final: '<p>Texto final</p>',
    };

    it('deve chamar a API com payload completo e uuid definido', async () => {
      const mockResponse = { success: true };
      mockAPIPatchPersonalizacaoRelatorio.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchPersonalizacaoRelatorio({ ...basePayload, uuid: 'personalizacao-uuid-123' });

      expect(mockAPIPatchPersonalizacaoRelatorio).toHaveBeenCalledWith(
        'LAUDA_VAGAS',
        expect.objectContaining({
          usar_logotipo: false,
          cabecalho_gabarito: '<p>Cabeçalho gabarito</p>',
          cabecalho: '<p>Cabeçalho</p>',
          texto_final: '<p>Texto final</p>',
          uuid: 'personalizacao-uuid-123',
        }),
        'personalizacao-uuid-123'
      );
      expect(result).toEqual(mockResponse);
    });

    it.each([
      { uuid: null },
      { uuid: undefined },
    ])('deve chamar a API com uuid null/undefined convertido corretamente', async ({ uuid }) => {
      const mockResponse = { success: true };
      mockAPIPatchPersonalizacaoRelatorio.mockReturnValue({
        response: Promise.resolve(mockResponse),
        abort: jest.fn(),
      });

      const result = await realPatchPersonalizacaoRelatorio({
        ...basePayload,
        usar_logotipo: true,
        cabecalho_gabarito: '',
        cabecalho: '',
        texto_final: '',
        uuid,
      });

      expect(mockAPIPatchPersonalizacaoRelatorio).toHaveBeenCalledWith(
        'LAUDA_VAGAS',
        expect.objectContaining({ uuid: null }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve tratar erro quando a API falha', async () => {
      const mockError = new Error('Erro ao salvar');
      mockAPIPatchPersonalizacaoRelatorio.mockReturnValue({
        response: Promise.reject(mockError),
        abort: jest.fn(),
      });

      await expect(realPatchPersonalizacaoRelatorio({ ...basePayload, uuid: 'uuid-123' })).rejects.toThrow('Erro ao salvar');
      expect(mockAPIPatchPersonalizacaoRelatorio).toHaveBeenCalled();
    });
  });
});
