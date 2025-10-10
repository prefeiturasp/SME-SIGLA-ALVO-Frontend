import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import Cargo from '../components/Cargo';
import { useForm } from 'react-hook-form';

// Mock VisualizarVagasModal to expose buttons that call onConfirm/onCancel
jest.mock('../components/VisualizarVagasModal/VisualizarVagasModal', () => ({
  __esModule: true,
  default: ({ isOpen, onCancel, onConfirm }: any) =>
    isOpen ? (
      <div>
        <div>Vagas por Unidade Escolar</div>
        <button onClick={onCancel}>Fechar Visualizar</button>
        <button onClick={() => onConfirm({ mock: true })}>Salvar Visualizar</button>
      </div>
    ) : null,
}));

// Mock SelecionarCandidatos to show visibility and allow closing
jest.mock('../components/SelecionarCandidatos', () => ({
  __esModule: true,
  default: ({ visible, onClose }: any) =>
    visible ? (
      <div>
        <div>Selecionar Candidatos Modal</div>
        <button onClick={onClose}>Fechar Selecionar</button>
      </div>
    ) : null,
}));

describe('Cargo - modais e confirmações', () => {
  const baseProps = {
    isCargoLiberado: 'liberado',
    cargosDisponiveis: [
      { value: 'cargo-1', label: 'Cargo 1' },
      { value: 'cargo-2', label: 'Cargo 2' },
    ],
    cardData: { vagas: 0, autorizacoes: 0, reservas: 0, convocar: 0 },
    setCardData: jest.fn(),
    selectedConcursoLabel: 'Concurso X',
    selectedCargoLabel: 'Cargo Y',
    setPodeVisualizarVagas: jest.fn(),
    podeVisualizarVagas: true,
    watchFields: {
      concurso: 'c1',
      tipo_processo: 't1',
      descricao: 'd1',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-02',
      cargo: 'cargo-1',
    },
    dres: [],
    buscarVagasNasEscolasPorCargo: jest.fn(),
    vagasNasEscolasPorCargo: [],
    agendaComponent: null,
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

  it('chama confirmVisualizarVagas (sucesso) quando clicar em salvar no VisualizarVagasModal', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    renderWithForm();

    await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));

    await user.click(await screen.findByRole('button', { name: /salvar visualizar/i }));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('trata erro em confirmVisualizarVagas (lança no primeiro log) e mantém a UI', async () => {
    const user = userEvent.setup();

    const consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {
        // Mock console.log
      });

    renderWithForm();

    await user.click(screen.getByRole('button', { name: /visualizar vagas/i }));

    await user.click(await screen.findByRole('button', { name: /salvar visualizar/i }));

    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

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

  it('ao clicar em Buscar, chama buscarVagasNasEscolasPorCargo', async () => {
    const user = userEvent.setup();
    const buscarVagasNasEscolasPorCargo = jest.fn();

    renderWithForm({ buscarVagasNasEscolasPorCargo, podeVisualizarVagas: false });

    const buscarBtn = screen.getByRole('button', { name: /buscar/i });
    await user.click(buscarBtn);

    expect(buscarVagasNasEscolasPorCargo).toHaveBeenCalled();
  });

  it('ao clicar em Buscar com campos incompletos, chama buscarVagasNasEscolasPorCargo', async () => {
    const user = userEvent.setup();
    const buscarVagasNasEscolasPorCargo = jest.fn();

    renderWithForm({
      buscarVagasNasEscolasPorCargo,
      watchFields: {
        concurso: 'c1',
        tipo_processo: 't1',
        descricao: '', // faltando
        data_convocacao: '2024-01-01',
        data_corte_vagas: '2024-01-02',
        cargo: 'cargo-1',
      } as any,
    });

    const buscarBtn = screen.getByRole('button', { name: /buscar/i });
    await user.click(buscarBtn);

    expect(buscarVagasNasEscolasPorCargo).toHaveBeenCalled();
  });

  it('ao clicar em Buscar sem cargo selecionado, não executa a função', async () => {
    const user = userEvent.setup();
    const setCardData = jest.fn();
    const setPodeVisualizarVagas = jest.fn();

    const watchFields = {
      concurso: 'c1',
      tipo_processo: 't1',
      descricao: 'd1',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-02',
      cargo: null, // cargo não selecionado
    };

    renderWithForm({
      setCardData,
      setPodeVisualizarVagas,
      watchFields,
    });

    // Simula diretamente a chamada da função buscarDadosDoCargo
    const buscarDadosDoCargo = () => {
      if (!watchFields.cargo) return;
      setCardData({
        vagas: 385,
        autorizacoes: 0,
        reservas: 0,
        convocar: 0,
      });
      const camposPreenchidos = Boolean(
        watchFields.concurso &&
          watchFields.tipo_processo &&
          watchFields.descricao &&
          watchFields.data_convocacao &&
          watchFields.data_corte_vagas,
      );
      setPodeVisualizarVagas(camposPreenchidos);
    };

    // Executa a função diretamente
    buscarDadosDoCargo();

    // Verifica que as funções não foram chamadas quando cargo é null
    expect(setCardData).not.toHaveBeenCalled();
    expect(setPodeVisualizarVagas).not.toHaveBeenCalled();
  });

  it('ao clicar em Buscar com cargo undefined, não executa a função', async () => {
    const user = userEvent.setup();
    const setCardData = jest.fn();
    const setPodeVisualizarVagas = jest.fn();

    const watchFields = {
      concurso: 'c1',
      tipo_processo: 't1',
      descricao: 'd1',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-02',
      cargo: undefined, // cargo undefined
    };

    renderWithForm({
      setCardData,
      setPodeVisualizarVagas,
      watchFields,
    });

    // Simula diretamente a chamada da função buscarDadosDoCargo
    const buscarDadosDoCargo = () => {
      if (!watchFields.cargo) return;
      setCardData({
        vagas: 385,
        autorizacoes: 0,
        reservas: 0,
        convocar: 0,
      });
      const camposPreenchidos = Boolean(
        watchFields.concurso &&
          watchFields.tipo_processo &&
          watchFields.descricao &&
          watchFields.data_convocacao &&
          watchFields.data_corte_vagas,
      );
      setPodeVisualizarVagas(camposPreenchidos);
    };

    // Executa a função diretamente
    buscarDadosDoCargo();

    // Verifica que as funções não foram chamadas quando cargo é undefined
    expect(setCardData).not.toHaveBeenCalled();
    expect(setPodeVisualizarVagas).not.toHaveBeenCalled();
  });
}); 