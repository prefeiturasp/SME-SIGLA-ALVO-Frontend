import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { message } from 'antd';
import SelecionarCandidatos from '../index';

const mockUseCandidatos = jest.fn();
jest.mock('../../../hooks/useCandidatos', () => ({
  useCandidatos: (shouldFetch: boolean) => mockUseCandidatos(shouldFetch),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    warning: jest.fn(),
  },
}));

const mockCandidatosData = {
  results: [
    {
      convocado_por: 'Geral',
      nome_candidato: 'João Silva',
      classificacao_geral: '1',
      classificacao_especial: '-',
      classificacao_nna: '-'
    },
    {
      convocado_por: 'Def.',
      nome_candidato: 'Maria Santos',
      classificacao_geral: '2',
      classificacao_especial: '1',
      classificacao_nna: '-'
    }
  ]
};

describe('SelecionarCandidatos', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    concurso: "200803471730 - 200803471730",
    cargo: "PROF.ENS.FUND.II E MED.-BIOL.PROG.SAUDE",
    vagas: 9,
    autorizacoes: 0,
    onCandidatosSelecionados: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseCandidatos.mockImplementation((shouldFetch) => {
      if (shouldFetch) {
        return {
          candidatosData: mockCandidatosData,
          candidatosIsLoading: false
        };
      }
      return {
        candidatosData: null,
        candidatosIsLoading: false
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Testes de digitação nos inputs', () => {
    it('deve permitir apenas números no input de Classificação inicial', async () => {
      const user = userEvent.setup();
      render(<SelecionarCandidatos {...defaultProps} />);

      const classificacaoInput = screen.getByDisplayValue('1');
      
      await act(async () => {
        await user.clear(classificacaoInput);
        await user.type(classificacaoInput, '123');
      });
      expect(classificacaoInput).toHaveValue('123');

      await act(async () => {
        await user.clear(classificacaoInput);
        await user.type(classificacaoInput, 'abc123def');
      });
      expect(classificacaoInput).toHaveValue('123');
    });

    it('deve permitir apenas números no input de Quantidade', async () => {
      const user = userEvent.setup();
      render(<SelecionarCandidatos {...defaultProps} />);

      const allInputs = screen.getAllByRole('textbox');
      const numericInputs = allInputs.filter(input => 
        input.getAttribute('type') === 'text' || 
        input.getAttribute('type') === 'number' ||
        input.getAttribute('inputmode') === 'numeric'
      );
      
      const quantidadeInput = numericInputs[1];
      expect(quantidadeInput).toBeInTheDocument();
      
      await act(async () => {
        await user.clear(quantidadeInput);
        await user.type(quantidadeInput, '456');
      });
      expect(quantidadeInput).toHaveValue('456');

      await act(async () => {
        await user.clear(quantidadeInput);
        await user.type(quantidadeInput, 'xyz789@#$');
      });
      expect(quantidadeInput).toHaveValue('789');
    });

    it('deve permitir apenas números nos inputs de Autorizações digitadas', async () => {
      const user = userEvent.setup();
      render(<SelecionarCandidatos {...defaultProps} />);

      const autorizacaoInputs = screen.getAllByPlaceholderText('Digite apenas números');
      expect(autorizacaoInputs).toHaveLength(3);

      await act(async () => {
        await user.type(autorizacaoInputs[0], '123');
      });
      expect(autorizacaoInputs[0]).toHaveValue('123');

      await act(async () => {
        await user.clear(autorizacaoInputs[0]);
        await user.type(autorizacaoInputs[0], 'abc123def');
      });
      expect(autorizacaoInputs[0]).toHaveValue('123');

      await act(async () => {
        await user.type(autorizacaoInputs[1], '456');
      });
      expect(autorizacaoInputs[1]).toHaveValue('456');

      await act(async () => {
        await user.clear(autorizacaoInputs[1]);
        await user.type(autorizacaoInputs[1], '456xyz');
      });
      expect(autorizacaoInputs[1]).toHaveValue('456');

      await act(async () => {
        await user.type(autorizacaoInputs[2], '789');
      });
      expect(autorizacaoInputs[2]).toHaveValue('789');

      await act(async () => {
        await user.clear(autorizacaoInputs[2]);
        await user.type(autorizacaoInputs[2], '@#$789');
      });
      expect(autorizacaoInputs[2]).toHaveValue('789');
    });

    it('deve mostrar mensagem de aviso ao tentar digitar caracteres não numéricos', async () => {
      render(<SelecionarCandidatos {...defaultProps} />);

      const classificacaoInput = screen.getByDisplayValue('1');
      
      await act(async () => {
        fireEvent.keyDown(classificacaoInput, { key: 'a' });
      });
      
      expect(message.warning).toHaveBeenCalledWith('Digite apenas números');
    });
  });

  describe('Teste do botão Buscar Candidatos por autorizações digitadas', () => {
    it('deve mostrar a tabela ao clicar no botão Buscar candidatos por autorizações digitadas', async () => {
      const user = userEvent.setup();
      
      render(<SelecionarCandidatos {...defaultProps} />);

      expect(screen.queryByText('Convocados por autorizações digitadas')).not.toBeInTheDocument();

      const buscarButton = screen.getByText('Buscar candidatos por autorizações digitadas');
      await act(async () => {
        await user.click(buscarButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Convocados por autorizações digitadas')).toBeInTheDocument();
      });
    });

    it('deve mostrar loading ao buscar candidatos', async () => {
      const user = userEvent.setup();

      mockUseCandidatos.mockImplementation((shouldFetch) => {
        if (shouldFetch) {
          return {
            candidatosData: null,
            candidatosIsLoading: true
          };
        }
        return {
          candidatosData: null,
          candidatosIsLoading: false
        };
      });

      render(<SelecionarCandidatos {...defaultProps} />);

      const buscarButton = screen.getByText('Buscar candidatos por autorizações digitadas');
      await act(async () => {
        await user.click(buscarButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Buscando candidatos...')).toBeInTheDocument();
      });
    });
  });

  describe('Testes dos botões Cancelar e Selecionar', () => {
    it('deve chamar onClose ao clicar no botão Cancelar', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<SelecionarCandidatos {...defaultProps} onClose={mockOnClose} />);

      const cancelarButton = screen.getByText('Cancelar');
      await act(async () => {
        await user.click(cancelarButton);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onCandidatosSelecionados e onClose ao clicar no botão Selecionar', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const mockOnCandidatosSelecionados = jest.fn();
      
      render(
        <SelecionarCandidatos 
          {...defaultProps} 
          onClose={mockOnClose}
          onCandidatosSelecionados={mockOnCandidatosSelecionados}
        />
      );

      const buscarButton = screen.getByText('Buscar candidatos por autorizações digitadas');
      await act(async () => {
        await user.click(buscarButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Convocados por autorizações digitadas')).toBeInTheDocument();
      });

      const selecionarButton = screen.getByText('Selecionar');
      await act(async () => {
        await user.click(selecionarButton);
      });

      expect(mockOnCandidatosSelecionados).toHaveBeenCalledWith(2);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onCandidatosSelecionados com 0 quando não há dados de candidatos', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const mockOnCandidatosSelecionados = jest.fn();
      
      render(
        <SelecionarCandidatos 
          {...defaultProps} 
          onClose={mockOnClose}
          onCandidatosSelecionados={mockOnCandidatosSelecionados}
        />
      );

      const selecionarButton = screen.getByText('Selecionar');
      await act(async () => {
        await user.click(selecionarButton);
      });

      expect(mockOnCandidatosSelecionados).toHaveBeenCalledWith(0);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Testes de renderização inicial', () => {
    it('deve renderizar o modal com as informações corretas', () => {
      render(<SelecionarCandidatos {...defaultProps} />);

      expect(screen.getByText('Convocar candidatos ao cargo')).toBeInTheDocument();

      expect(screen.getByText('200803471730 - 200803471730')).toBeInTheDocument();
      expect(screen.getByText('PROF.ENS.FUND.II E MED.-BIOL.PROG.SAUDE')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();

      expect(screen.getByText('Buscar candidatos por autorizações calculadas')).toBeInTheDocument();
      expect(screen.getByText('Buscar candidatos por autorizações digitadas')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Selecionar')).toBeInTheDocument();
    });

    it('deve inicializar com valores padrão nos inputs', () => {
      render(<SelecionarCandidatos {...defaultProps} />);

      expect(screen.getByDisplayValue('1')).toBeInTheDocument();

      const autorizacaoInputs = screen.getAllByPlaceholderText('Digite apenas números');
      autorizacaoInputs.forEach(input => {
        expect(input).toHaveValue('0');
      });
    });
  });
});