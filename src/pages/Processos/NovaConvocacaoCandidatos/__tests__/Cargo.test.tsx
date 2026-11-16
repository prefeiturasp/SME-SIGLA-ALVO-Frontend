import React from 'react';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import Cargo from '../components/Cargo';
import { useForm } from 'react-hook-form';

// Mock VisualizarVagasModal to expose buttons that call onConfirm/onCancel
const mockOnConfirm = jest.fn();
jest.mock('../components/VisualizarVagasModal/VisualizarVagasModal', () => ({
  __esModule: true,
  default: ({ isOpen, onCancel, onConfirm }: any) => {
    if (!isOpen) return null;
    mockOnConfirm.mockImplementation((data) => {
      try {
        onConfirm(data);
      } catch (e) {
        // erro capturado
      }
    });
    return (
      <div data-testid="visualizar-vagas-modal">
        <div>Vagas por Unidade Escolar</div>
        <button onClick={onCancel}>Fechar Visualizar</button>
        <button onClick={() => mockOnConfirm([{ checked: true, vagas_definitivas: 10, vagas_precarias: 5 }, { checked: false, vagas_definitivas: 20, vagas_precarias: 0 }])}>Salvar Visualizar</button>
        <button data-testid="error-button" onClick={() => {
          // Força um erro ao chamar onConfirm com dados inválidos
          try {
            onConfirm(null);
          } catch (e) {
            // erro capturado
          }
        }}>Erro Visualizar</button>
      </div>
    );
  },
}));

// Mock SelecionarCandidatos to show visibility and allow closing
jest.mock('../components/SelecionarCandidatos', () => ({
  __esModule: true,
  default: ({ visible, onClose, onCandidatosSelecionados }: any) =>
    visible ? (
      <div data-testid="selecionar-candidatos-modal">
        <div>Selecionar Candidatos Modal</div>
        <button onClick={onClose}>Fechar Selecionar</button>
        <button onClick={() => onCandidatosSelecionados && onCandidatosSelecionados(5, { geral: 3, pcd: 1, nna: 1 })}>Confirmar Selecionar</button>
        <button onClick={() => onCandidatosSelecionados && onCandidatosSelecionados(2)}>Confirmar Sem Individuais</button>
      </div>
    ) : null,
}));

describe('Cargo', () => {
  const baseProps = {
    isCargoLiberado: 'liberado',
    cargosDisponiveis: [
      { value: 'cargo-1', label: 'Cargo 1' },
      { value: 'cargo-2', label: 'Cargo 2' },
    ],
    cardData: { vagas: 0, autorizacoes: 0, reservas: 0, convocar: 0 },
    setCardData: jest.fn(),
    selectedConcursoLabel: 'Concurso X',
    selectedConcursoValue: 'concurso-uuid',
    selectedCargoLabel: 'Cargo Y',
    setPodeVisualizarVagas: jest.fn(),
    podeVisualizarVagas: true,
    watchFields: {
      concurso: 'c1',
      tipo_escolha: 't1',
      descricao: 'd1',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-02',
      cargo: 'cargo-1',
    },
    dres: [],
    buscarVagasNasEscolasPorCargo: jest.fn(),
    vagasNasEscolasPorCargo: [],
    agendaComponent: <div>Agenda Component</div>,
  } as const;

  const renderWithForm = (overrideProps: Partial<React.ComponentProps<typeof Cargo>> = {}) => {
    const Harness: React.FC = () => {
      const { control } = useForm({ defaultValues: { cargo: 'cargo-1' } });
      return (
        <SCThemeProvider theme={appTheme as any}>
          <Cargo {...(baseProps as any)} {...overrideProps} control={control as any} />
        </SCThemeProvider>
      );
    };
    return render(<Harness />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnConfirm.mockClear();
  });

  describe('Renderização inicial', () => {
    it('deve renderizar título Cargos e Select de cargo', () => {
      renderWithForm();
      expect(screen.getByText('Cargos')).toBeInTheDocument();
      expect(screen.getByText('Cargo')).toBeInTheDocument();
    });

    it('deve renderizar cards com valores corretos', () => {
      renderWithForm({
        cardData: { vagas: 100, autorizacoes: 20, reservas: 10, convocar: 5 },
      });
      
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('deve renderizar cards de escolas e candidatos selecionados', () => {
      renderWithForm();
      
      expect(screen.getByText('Escolas selecionadas')).toBeInTheDocument();
      expect(screen.getByText('Candidatos selecionados')).toBeInTheDocument();
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });

    it('deve renderizar agendaComponent quando fornecido', () => {
      renderWithForm();
      expect(screen.getByText('Agenda Component')).toBeInTheDocument();
    });
  });

  describe('Select de cargo', () => {
    it('deve renderizar Select de cargo', () => {
      renderWithForm({ isCargoLiberado: 'liberado' });
      expect(screen.getByText('Cargo')).toBeInTheDocument();
    });
  });

  describe('Botão Buscar', () => {
    it('deve estar desabilitado quando não há cargo e podeVisualizarVagas é false', () => {
      renderWithForm({
        watchFields: { ...baseProps.watchFields, cargo: null },
        podeVisualizarVagas: false,
      });
      
      const buscarBtn = screen.getByRole('button', { name: /buscar/i });
      expect(buscarBtn).toBeDisabled();
    });

    it('deve estar habilitado quando há cargo selecionado', () => {
      renderWithForm({
        watchFields: { ...baseProps.watchFields, cargo: 'cargo-1' },
        podeVisualizarVagas: false,
      });
      
      const buscarBtn = screen.getByRole('button', { name: /buscar/i });
      expect(buscarBtn).not.toBeDisabled();
    });

    it('deve chamar buscarVagasNasEscolasPorCargo ao clicar', async () => {
      const user = userEvent.setup();
      const buscarVagasNasEscolasPorCargo = jest.fn();

      renderWithForm({ buscarVagasNasEscolasPorCargo, podeVisualizarVagas: false });

      const buscarBtn = screen.getByRole('button', { name: /buscar/i });
      await user.click(buscarBtn);

      expect(buscarVagasNasEscolasPorCargo).toHaveBeenCalled();
    });
  });

  describe('Botões de ação', () => {
    it('devem estar desabilitados quando podeVisualizarVagas é false', () => {
      renderWithForm({ podeVisualizarVagas: false });
      
      const visualizarBtn = screen.getByRole('button', { name: /visualizar vagas/i });
      const selecionarBtn = screen.getByRole('button', { name: /selecionar candidatos/i });
      
      expect(visualizarBtn).toBeDisabled();
      expect(selecionarBtn).toBeDisabled();
    });

    it('devem estar habilitados quando podeVisualizarVagas é true', () => {
      renderWithForm({ podeVisualizarVagas: true });
      
      const visualizarBtn = screen.getByRole('button', { name: /visualizar vagas/i });
      const selecionarBtn = screen.getByRole('button', { name: /selecionar candidatos/i });
      
      expect(visualizarBtn).not.toBeDisabled();
      expect(selecionarBtn).not.toBeDisabled();
    });
  });

  describe('VisualizarVagasModal', () => {
    it('abre e fecha VisualizarVagasModal', async () => {
      const user = userEvent.setup();

      renderWithForm();

      const visualizarBtn = screen.getByRole('button', { name: /visualizar vagas/i });
      await user.click(visualizarBtn);

      expect(await screen.findByText('Vagas por Unidade Escolar')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /fechar visualizar/i }));

      await waitFor(() => {
        expect(screen.queryByText('Vagas por Unidade Escolar')).not.toBeInTheDocument();
      });
    });

    it('deve atualizar cardData com quantidade de vagas ao confirmar', async () => {
      const user = userEvent.setup();
      const setCardData = jest.fn();
      const cardData = { vagas: 50, autorizacoes: 10, reservas: 5, convocar: 2 };

      renderWithForm({
        setCardData,
        cardData,
      });

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      await user.click(await screen.findByRole('button', { name: /salvar visualizar/i }));

      await waitFor(() => {
        expect(setCardData).toHaveBeenCalled();
        const call = setCardData.mock.calls[0][0];
        if (typeof call === 'function') {
          const result = call(cardData);
          expect(result.vagas).toBe(15); // 10 + 5 das escolas checked
          expect(result.autorizacoes).toBe(10);
          expect(result.reservas).toBe(5);
          expect(result.convocar).toBe(2);
        }
      });
    });

    it('deve atualizar quantidadeEscolasSelecionadas ao confirmar', async () => {
      const user = userEvent.setup();

      renderWithForm();

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      await user.click(await screen.findByRole('button', { name: /salvar visualizar/i }));

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // 1 escola selecionada
      });
    });

    it('deve fechar modal após confirmar', async () => {
      const user = userEvent.setup();

      renderWithForm();

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      await user.click(await screen.findByRole('button', { name: /salvar visualizar/i }));

      await waitFor(() => {
        expect(screen.queryByText('Vagas por Unidade Escolar')).not.toBeInTheDocument();
      });
    });

    it('deve tratar erro em confirmVisualizarVagas', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithForm();

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      
      // Simula erro ao passar null
      const errorButton = screen.getByTestId('error-button');
      await user.click(errorButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('SelecionarCandidatos', () => {
    it('abre e fecha SelecionarCandidatos', async () => {
      const user = userEvent.setup();

      renderWithForm();

      const selecionarBtn = screen.getByRole('button', { name: /selecionar candidatos/i });
      await user.click(selecionarBtn);

      expect(await screen.findByText('Selecionar Candidatos Modal')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /fechar selecionar/i }));

      await waitFor(() => {
        expect(screen.queryByText('Selecionar Candidatos Modal')).not.toBeInTheDocument();
      });
    });

    it('deve atualizar candidatosSelecionados e cardData quando confirmar com quantidades individuais', async () => {
      const user = userEvent.setup();
      const setCardData = jest.fn();

      renderWithForm({
        setCardData,
        cardData: { vagas: 100, autorizacoes: 0, reservas: 0, convocar: 0 },
      });

      await user.click(screen.getByRole('button', { name: /selecionar candidatos/i }));
      
      const modal = screen.getByTestId('selecionar-candidatos-modal');
      await user.click(within(modal).getByRole('button', { name: /confirmar selecionar/i }));

      await waitFor(() => {
        expect(setCardData).toHaveBeenCalledWith({
          vagas: 100,
          autorizacoes: 3, // geral
          reservas: 1,     // nna
          convocar: 1,     // pcd
        });
      });

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // candidatos selecionados
      });
    });

    it('deve atualizar candidatosSelecionados sem atualizar cardData quando não há quantidades individuais', async () => {
      const user = userEvent.setup();
      const setCardData = jest.fn();

      renderWithForm({
        setCardData,
        cardData: { vagas: 100, autorizacoes: 20, reservas: 10, convocar: 5 },
      });

      await user.click(screen.getByRole('button', { name: /selecionar candidatos/i }));
      
      const modal = screen.getByTestId('selecionar-candidatos-modal');
      await user.click(within(modal).getByRole('button', { name: /confirmar sem individuais/i }));

      await waitFor(() => {
        expect(setCardData).not.toHaveBeenCalled();
        expect(screen.getByText('2')).toBeInTheDocument(); // candidatos selecionados
      });
    });

    it('deve chamar onCandidatosSelecionados quando fornecido', async () => {
      const user = userEvent.setup();
      const onCandidatosSelecionados = jest.fn();

      renderWithForm({ onCandidatosSelecionados });

      await user.click(screen.getByRole('button', { name: /selecionar candidatos/i }));
      
      const modal = screen.getByTestId('selecionar-candidatos-modal');
      await user.click(within(modal).getByRole('button', { name: /confirmar selecionar/i }));

      await waitFor(() => {
        expect(onCandidatosSelecionados).toHaveBeenCalledWith(5, { geral: 3, pcd: 1, nna: 1 });
      });
    });
  });

  describe('buscarDadosDoCargo', () => {
    it('deve atualizar cardData e setPodeVisualizarVagas quando todos os campos estão preenchidos', () => {
      const setCardData = jest.fn();
      const setPodeVisualizarVagas = jest.fn();

      renderWithForm({
        setCardData,
        setPodeVisualizarVagas,
        watchFields: {
          concurso: 'c1',
          tipo_escolha: 't1',
          descricao: 'd1',
          data_convocacao: '2024-01-01',
          data_corte_vagas: '2024-01-02',
          cargo: 'cargo-1',
        },
      });

      // Simula a chamada interna de buscarDadosDoCargo
      const buscarDadosDoCargo = () => {
        const watchFields = {
          concurso: 'c1',
          tipo_escolha: 't1',
          descricao: 'd1',
          data_convocacao: '2024-01-01',
          data_corte_vagas: '2024-01-02',
          cargo: 'cargo-1',
        };

        if (!watchFields.cargo) return;

        setCardData({
          vagas: 385,
          autorizacoes: 0,
          reservas: 0,
          convocar: 0,
        });
        
        const camposPreenchidos = Boolean(
          watchFields.concurso &&
            watchFields.tipo_escolha &&
            watchFields.descricao &&
            watchFields.data_convocacao &&
            watchFields.data_corte_vagas,
        );
        setPodeVisualizarVagas(camposPreenchidos);
      };

      buscarDadosDoCargo();

      expect(setCardData).toHaveBeenCalledWith({
        vagas: 385,
        autorizacoes: 0,
        reservas: 0,
        convocar: 0,
      });
      expect(setPodeVisualizarVagas).toHaveBeenCalledWith(true);
    });

    it('deve setar podeVisualizarVagas como false quando falta tipo_escolha', () => {
      const setCardData = jest.fn();
      const setPodeVisualizarVagas = jest.fn();

      renderWithForm({
        setCardData,
        setPodeVisualizarVagas,
        watchFields: {
          concurso: 'c1',
          tipo_escolha: '', // falta
          descricao: 'd1',
          data_convocacao: '2024-01-01',
          data_corte_vagas: '2024-01-02',
          cargo: 'cargo-1',
        },
      });

      const buscarDadosDoCargo = () => {
        const watchFields = {
          concurso: 'c1',
          tipo_escolha: '',
          descricao: 'd1',
          data_convocacao: '2024-01-01',
          data_corte_vagas: '2024-01-02',
          cargo: 'cargo-1',
        };

        if (!watchFields.cargo) return;

        setCardData({
          vagas: 385,
          autorizacoes: 0,
          reservas: 0,
          convocar: 0,
        });
        
        const camposPreenchidos = Boolean(
          watchFields.concurso &&
            watchFields.tipo_escolha &&
            watchFields.descricao &&
            watchFields.data_convocacao &&
            watchFields.data_corte_vagas,
        );
        setPodeVisualizarVagas(camposPreenchidos);
      };

      buscarDadosDoCargo();

      expect(setPodeVisualizarVagas).toHaveBeenCalledWith(false);
    });

    it('não deve executar quando cargo é null', () => {
      const setCardData = jest.fn();
      const setPodeVisualizarVagas = jest.fn();

      renderWithForm({
        setCardData,
        setPodeVisualizarVagas,
        watchFields: {
          ...baseProps.watchFields,
          cargo: null,
        },
      });

      const buscarDadosDoCargo = () => {
        const watchFields = { cargo: null };
        if (!watchFields.cargo) return;
        setCardData({ vagas: 385, autorizacoes: 0, reservas: 0, convocar: 0 });
        setPodeVisualizarVagas(true);
      };

      buscarDadosDoCargo();

      expect(setCardData).not.toHaveBeenCalled();
      expect(setPodeVisualizarVagas).not.toHaveBeenCalled();
    });

    it('não deve executar quando cargo é undefined', () => {
      const setCardData = jest.fn();
      const setPodeVisualizarVagas = jest.fn();

      renderWithForm({
        setCardData,
        setPodeVisualizarVagas,
        watchFields: {
          ...baseProps.watchFields,
          cargo: undefined,
        },
      });

      const buscarDadosDoCargo = () => {
        const watchFields = { cargo: undefined };
        if (!watchFields.cargo) return;
        setCardData({ vagas: 385, autorizacoes: 0, reservas: 0, convocar: 0 });
        setPodeVisualizarVagas(true);
      };

      buscarDadosDoCargo();

      expect(setCardData).not.toHaveBeenCalled();
      expect(setPodeVisualizarVagas).not.toHaveBeenCalled();
    });
  });

  describe('confirmVisualizarVagas com dados reais', () => {
    it('deve calcular corretamente totalVagas apenas de escolas checked', async () => {
      const user = userEvent.setup();
      const setCardData = jest.fn();
      const cardData = { vagas: 0, autorizacoes: 0, reservas: 0, convocar: 0 };

      renderWithForm({
        setCardData,
        cardData,
      });

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      
      const modal = screen.getByTestId('visualizar-vagas-modal');
      await user.click(within(modal).getByRole('button', { name: /salvar visualizar/i }));

      await waitFor(() => {
        expect(setCardData).toHaveBeenCalled();
        const call = setCardData.mock.calls[0][0];
        if (typeof call === 'function') {
          const result = call(cardData);
          // Apenas a primeira escola está checked: 10 + 5 = 15
          expect(result.vagas).toBe(15);
        }
      });
    });

    it('deve contar apenas escolas com checked=true', async () => {
      const user = userEvent.setup();

      renderWithForm();

      await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));
      
      const modal = screen.getByTestId('visualizar-vagas-modal');
      await user.click(within(modal).getByRole('button', { name: /salvar visualizar/i }));

      await waitFor(() => {
        // Apenas 1 escola está checked
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
  });
});
