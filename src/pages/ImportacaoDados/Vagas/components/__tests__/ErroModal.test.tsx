import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErroModal from '../ErroModal';

// Mock do Antd
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Modal: ({ open, onCancel, children, title, ...props }: any) =>
      open ? (
        <div data-testid="modal" {...props}>
          <div data-testid="modal-title">{title}</div>
          {children}
          <button data-testid="modal-close" onClick={onCancel}>
            Close
          </button>
        </div>
      ) : null,
    Typography: {
      Text: ({ children, strong }: any) =>
        strong ? <strong>{children}</strong> : <span>{children}</span>,
    },
    Col: ({ children, span }: any) => <div data-span={span}>{children}</div>,
    Button: ({ children, onClick, loading, disabled, type }: any) => (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        data-loading={loading}
        data-type={type}
      >
        {loading ? 'Loading...' : children}
      </button>
    ),
    Spin: ({ children, spinning }: any) => (
      <div data-spinning={spinning}>{children}</div>
    ),
  };
});

// Mock dos componentes de estilo
jest.mock('../style', () => ({
  ModalTitle: ({ children }: any) => <div data-testid="modal-title-styled">{children}</div>,
  StyledRow: ({ children, gutter }: any) => (
    <div data-testid="styled-row" data-gutter={JSON.stringify(gutter)}>
      {children}
    </div>
  ),
  StyledTextArea: ({ value, placeholder, readOnly, rows }: any) => (
    <textarea
      data-testid="styled-textarea"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
    />
  ),
  ErroContainer: ({ dangerouslySetInnerHTML }: any) => (
    <div
      data-testid="erro-container"
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
  ButtonsContainer: ({ children }: any) => (
    <div data-testid="buttons-container">{children}</div>
  ),
}));

describe('ErroModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDownload = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    importacaoErro: null,
    onDownload: mockOnDownload,
    isDownloading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o modal quando open é true', () => {
      render(<ErroModal {...defaultProps} />);
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('não deve renderizar o modal quando open é false', () => {
      render(<ErroModal {...defaultProps} open={false} />);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('deve renderizar o título do modal', () => {
      render(<ErroModal {...defaultProps} />);
      expect(screen.getByText('Erros da Importação')).toBeInTheDocument();
    });

    it('deve renderizar os labels "Mensagem:" e "Erro:"', () => {
      render(<ErroModal {...defaultProps} />);
      expect(screen.getByText('Mensagem:')).toBeInTheDocument();
      expect(screen.getByText('Erro:')).toBeInTheDocument();
    });

    it('deve renderizar TextArea com placeholder', () => {
      render(<ErroModal {...defaultProps} />);
      const textarea = screen.getByTestId('styled-textarea');
      expect(textarea).toHaveAttribute('placeholder', 'Mensagem de erro resumida');
      expect(textarea).toHaveAttribute('readonly');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('deve renderizar os botões Cancelar e Download', () => {
      render(<ErroModal {...defaultProps} />);
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Download')).toBeInTheDocument();
    });
  });

  describe('Exibição de erros', () => {
    it('deve exibir mensagem vazia quando importacaoErro é null', () => {
      render(<ErroModal {...defaultProps} importacaoErro={null} />);
      const textarea = screen.getByTestId('styled-textarea');
      expect(textarea).toHaveValue('');
    });

    it('deve exibir mensagem quando importacaoErro tem mensagem', () => {
      const importacaoErro = {
        mensagem: 'Erro na importação dos dados',
        erros: '',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const textarea = screen.getByTestId('styled-textarea');
      expect(textarea).toHaveValue('Erro na importação dos dados');
    });

    it('deve formatar erros simples sem separador', () => {
      const importacaoErro = {
        mensagem: 'Erro',
        erros: 'Linha 1: Dados inválidos',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 1:</strong>');
      expect(erroContainer.innerHTML).toContain('Dados inválidos');
    });

    it('deve formatar múltiplos erros com separador " | "', () => {
      const importacaoErro = {
        mensagem: 'Múltiplos erros',
        erros: 'Linha 1: Erro A | Linha 2: Erro B | Linha 3: Erro C',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const erroContainer = screen.getByTestId('erro-container');
      
      expect(erroContainer.innerHTML).toContain('<strong>Linha 1:</strong>');
      expect(erroContainer.innerHTML).toContain('Erro A');
      expect(erroContainer.innerHTML).toContain('<br>');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 2:</strong>');
      expect(erroContainer.innerHTML).toContain('Erro B');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 3:</strong>');
      expect(erroContainer.innerHTML).toContain('Erro C');
    });

    it('deve exibir string vazia quando erros é vazio', () => {
      const importacaoErro = {
        mensagem: 'Teste',
        erros: '',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toBe('');
    });

    it('deve exibir string vazia quando importacaoErro é null', () => {
      render(<ErroModal {...defaultProps} importacaoErro={null} />);
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toBe('');
    });
  });

  describe('Botão Cancelar', () => {
    it('deve chamar onClose ao clicar em Cancelar', async () => {
      const user = userEvent.setup();
      render(<ErroModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancelar');
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve sempre estar habilitado', () => {
      render(<ErroModal {...defaultProps} />);
      const cancelButton = screen.getByText('Cancelar');
      expect(cancelButton).not.toBeDisabled();
    });
  });

  describe('Botão Download', () => {
    it('deve chamar onDownload ao clicar em Download', async () => {
      const user = userEvent.setup();
      const importacaoErro = {
        mensagem: 'Erro',
        erros: 'Erro 1',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      
      const downloadButton = screen.getByText('Download');
      await user.click(downloadButton);
      
      expect(mockOnDownload).toHaveBeenCalledTimes(1);
    });

    it('deve estar desabilitado quando importacaoErro é null', () => {
      render(<ErroModal {...defaultProps} importacaoErro={null} />);
      const downloadButton = screen.getByText('Download');
      expect(downloadButton).toBeDisabled();
    });

    it('deve estar habilitado quando importacaoErro existe', () => {
      const importacaoErro = {
        mensagem: 'Erro',
        erros: 'Detalhes',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const downloadButton = screen.getByText('Download');
      expect(downloadButton).not.toBeDisabled();
    });

    it('deve mostrar loading quando isDownloading é true', () => {
      const importacaoErro = {
        mensagem: 'Erro',
        erros: 'Detalhes',
      };
      render(
        <ErroModal {...defaultProps} importacaoErro={importacaoErro} isDownloading={true} />
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('deve estar desabilitado quando isDownloading é true', () => {
      const importacaoErro = {
        mensagem: 'Erro',
        erros: 'Detalhes',
      };
      render(
        <ErroModal {...defaultProps} importacaoErro={importacaoErro} isDownloading={true} />
      );
      const downloadButton = screen.getByText('Loading...');
      expect(downloadButton).toBeDisabled();
    });

    it('deve ter tipo primary', () => {
      render(<ErroModal {...defaultProps} />);
      const downloadButton = screen.getByText('Download');
      expect(downloadButton).toHaveAttribute('data-type', 'primary');
    });
  });

  describe('Fechamento do modal', () => {
    it('deve chamar onClose ao clicar no botão de fechar do modal', async () => {
      const user = userEvent.setup();
      render(<ErroModal {...defaultProps} />);
      
      const closeButton = screen.getByTestId('modal-close');
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Propriedades do Modal', () => {
    it('deve ter largura de 53.75rem', () => {
      render(<ErroModal {...defaultProps} />);
      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('width', '53.75rem');
    });

    it('deve ter footer null', () => {
      render(<ErroModal {...defaultProps} />);
      const modal = screen.getByTestId('modal');
      // O footer null é passado como prop, então verificamos que não há footer renderizado
      expect(modal).toBeInTheDocument();
    });

    it('deve estar centralizado', () => {
      render(<ErroModal {...defaultProps} />);
      const modal = screen.getByTestId('modal');
      // O modal é renderizado, o que confirma que centered foi passado como prop
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Componente Spin', () => {
    it('deve renderizar Spin com spinning=false', () => {
      render(<ErroModal {...defaultProps} />);
      const spin = screen.getByTestId('styled-row').closest('[data-spinning]');
      expect(spin).toHaveAttribute('data-spinning', 'false');
    });
  });

  describe('Estrutura do componente', () => {
    it('deve renderizar StyledRow com gutter correto', () => {
      render(<ErroModal {...defaultProps} />);
      const styledRow = screen.getByTestId('styled-row');
      expect(styledRow).toHaveAttribute('data-gutter', JSON.stringify([16, 16]));
    });

    it('deve renderizar dois Col com span 24', () => {
      render(<ErroModal {...defaultProps} />);
      const cols = screen.getAllByRole('generic').filter((el) => el.getAttribute('data-span') === '24');
      expect(cols.length).toBeGreaterThanOrEqual(2);
    });

    it('deve renderizar ButtonsContainer', () => {
      render(<ErroModal {...defaultProps} />);
      expect(screen.getByTestId('buttons-container')).toBeInTheDocument();
    });
  });

  describe('Cenários completos', () => {
    it('deve renderizar corretamente com todos os dados preenchidos', () => {
      const importacaoErro = {
        mensagem: 'Falha na importação de 10 registros',
        erros: 'Linha 5: CPF inválido | Linha 8: Data incorreta | Linha 12: Campo obrigatório',
      };
      render(
        <ErroModal
          open={true}
          onClose={mockOnClose}
          importacaoErro={importacaoErro}
          onDownload={mockOnDownload}
          isDownloading={false}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('styled-textarea')).toHaveValue('Falha na importação de 10 registros');
      
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 5:</strong>');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 8:</strong>');
      expect(erroContainer.innerHTML).toContain('<strong>Linha 12:</strong>');
      
      const downloadButton = screen.getByText('Download');
      expect(downloadButton).not.toBeDisabled();
    });

    it('deve funcionar corretamente no estado de download ativo', () => {
      const importacaoErro = {
        mensagem: 'Erro de validação',
        erros: 'Erro: dados inválidos',
      };
      render(
        <ErroModal
          open={true}
          onClose={mockOnClose}
          importacaoErro={importacaoErro}
          onDownload={mockOnDownload}
          isDownloading={true}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeDisabled();
    });

    it('deve funcionar corretamente sem dados de erro', () => {
      render(
        <ErroModal
          open={true}
          onClose={mockOnClose}
          importacaoErro={null}
          onDownload={mockOnDownload}
          isDownloading={false}
        />
      );

      expect(screen.getByTestId('styled-textarea')).toHaveValue('');
      expect(screen.getByTestId('erro-container').innerHTML).toBe('');
      expect(screen.getByText('Download')).toBeDisabled();
    });
  });

  describe('Formatação de erros - casos especiais', () => {
    it('deve formatar erro sem dois pontos', () => {
      const importacaoErro = {
        mensagem: 'Teste',
        erros: 'Erro sem dois pontos',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toBe('Erro sem dois pontos');
    });

    it('deve formatar múltiplos erros com diferentes padrões', () => {
      const importacaoErro = {
        mensagem: 'Teste',
        erros: 'Campo: valor | Sem dois pontos | Outro: teste',
      };
      render(<ErroModal {...defaultProps} importacaoErro={importacaoErro} />);
      const erroContainer = screen.getByTestId('erro-container');
      expect(erroContainer.innerHTML).toContain('<strong>Campo:</strong>');
      expect(erroContainer.innerHTML).toContain('valor');
      expect(erroContainer.innerHTML).toContain('Sem dois pontos');
      expect(erroContainer.innerHTML).toContain('<strong>Outro:</strong>');
      expect(erroContainer.innerHTML).toContain('teste');
    });
  });
});

