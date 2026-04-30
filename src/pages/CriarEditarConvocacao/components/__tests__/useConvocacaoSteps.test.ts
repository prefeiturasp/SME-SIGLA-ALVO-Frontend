import { renderHook, act } from '@testing-library/react';
import { useConvocacaoSteps } from '../useConvocacaoSteps';

const mockUseStepVisualProgress = jest.fn();
const mockMarkStepCompleted = jest.fn();

jest.mock('../useStepVisualProgress', () => ({
  useStepVisualProgress: (...args: unknown[]) => mockUseStepVisualProgress(...args),
}));

jest.mock('../StepsNames', () => ({
  items: [
    { title: 'Dados do processo' },
    { title: 'Seleção de cargos' },
    { title: 'Agenda' },
    { title: 'Resumo' },
  ],
}));

describe('useConvocacaoSteps', () => {
  const onNavigate = jest.fn();
  const onUnsavedChangesWarning = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStepVisualProgress.mockReturnValue({
      passoVisual: 2,
      completedStep: 1,
      markStepCompleted: mockMarkStepCompleted,
    });
  });

  it('retorna passoAtual e marca status/className dos steps', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        uuid: 'proc-1',
        currentStepIndex: 1,
        passoAtualBackend: 2,
        onNavigate,
      })
    );

    expect(result.current.passoAtual).toBe(2);
    expect(result.current.stepItems[0]).toEqual(
      expect.objectContaining({ status: 'finish', className: 'step-visited', disabled: false })
    );
    expect(result.current.stepItems[3]).toEqual(
      expect.objectContaining({ disabled: true, className: 'step-locked' })
    );
    expect(result.current.markStepCompleted).toBe(mockMarkStepCompleted);
  });

  it('bloqueia avanço de step acima do permitido por progresso', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        uuid: 'proc-1',
        currentStepIndex: 1,
        passoAtualBackend: 1,
        onNavigate,
      })
    );

    act(() => result.current.handleStepChange(3));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('bloqueia steps futuros sem uuid quando lockFutureStepsWithoutUuid estiver ativo', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        currentStepIndex: 0,
        passoAtualBackend: 1,
        lockFutureStepsWithoutUuid: true,
        onNavigate,
      })
    );

    act(() => result.current.handleStepChange(1));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(result.current.stepItems[1].disabled).toBe(true);
  });

  it('bloqueia navegação quando loading', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        uuid: 'proc-1',
        currentStepIndex: 1,
        passoAtualBackend: 2,
        isLoading: true,
        onNavigate,
      })
    );

    act(() => result.current.handleStepChange(2));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('dispara warning e não navega quando há edições pendentes', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        uuid: 'proc-1',
        currentStepIndex: 1,
        passoAtualBackend: 2,
        hasEdits: true,
        onUnsavedChangesWarning,
        onNavigate,
      })
    );

    act(() => result.current.handleStepChange(2));
    expect(onUnsavedChangesWarning).toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('navega para caminhos corretos por step index', () => {
    const { result } = renderHook(() =>
      useConvocacaoSteps({
        uuid: 'proc-1',
        currentStepIndex: 2,
        passoAtualBackend: 3,
        onNavigate,
      })
    );

    act(() => result.current.handleStepChange(0));
    expect(onNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/proc-1/dados-processo');

    act(() => result.current.handleStepChange(1));
    expect(onNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/proc-1/selecao-cargos');

    act(() => result.current.handleStepChange(2));
    expect(onNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/proc-1/agenda');

    act(() => result.current.handleStepChange(3));
    expect(onNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/proc-1/resumo');
  });
});
