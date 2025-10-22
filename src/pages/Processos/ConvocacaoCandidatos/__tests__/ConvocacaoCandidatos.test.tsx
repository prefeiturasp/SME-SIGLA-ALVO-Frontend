import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import { renderWithProviders } from '../../../../test-utils';
import ConvocacaoCandidatos from '../index';

// Mock Controller para evitar necessidade de control real
jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  const reactActual = jest.requireActual('react');
  return {
    __esModule: true,
    ...actual,
    Controller: ({ render }: any) => {
      const [value, setValue] = reactActual.useState('');
      return render({ field: { value, onChange: setValue } });
    },
  };
});

// Mocks do hook e de suas funções expostas para assert
jest.mock('../hooks/useProcessosConvocacao', () => {
  const hookMocks = {
    handleReset: jest.fn(),
    handleSub: jest.fn(),
    onAntTableChange: jest.fn(),
  };
  const concursosOptions = {
    concursos: [{ value: 'c1', label: 'Concurso 1' }],
    cargos: [{ value: 'cg1', label: 'Cargo 1' }],
  };
  const dayjs = require('dayjs');
  const retorno = {
    control: {} as any,
    handleSubmit: (fn: any) => fn,
    formErrors: {},
    concursosOptions,
    concursosOptionsIsLoading: false,
    processosConvocacaoData: { results: [{ id: 1 }], count: 1 },
    processosConvocacaoIsLoading: false,
    listRequest: { pagination: { page: 1 } },
    dayjs: (v?: any) => dayjs(v),
    ...hookMocks,
  };
  return {
    __esModule: true,
    useProcessosConvocacao: () => retorno,
    hookMocks,
    concursosOptions,
  };
});

// Mock da tabela para evitar dependência de AntD Table
jest.mock('../components/ConvocacaoTable', () => ({
  __esModule: true,
  default: ({ data, pagination }: any) => (
    <div>
      ConvocacaoTable Mock - {data.length} itens - página {pagination.current}
      {pagination?.showTotal && (
        <div data-testid="pagination-total">{pagination.showTotal()}</div>
      )}
    </div>
  ),
}));

// Mock do useNavigate dentro do factory e exporta o mock para assert
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigate = jest.fn();
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
    mockNavigate,
  };
});

describe('ConvocacaoCandidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    renderWithProviders(
      <SCThemeProvider theme={appTheme as any}>
        <ConvocacaoCandidatos />
      </SCThemeProvider>
    );

  it('renderiza formulário básico e tabela mockada', () => {
    renderComponent();

    expect(screen.getByText('Convocação de candidatos')).toBeInTheDocument();
    expect(screen.getByText('Busca processos')).toBeInTheDocument();
    expect(screen.getByText('Concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargo')).toBeInTheDocument();
    expect(screen.getByText('ConvocacaoTable Mock - 1 itens - página 1')).toBeInTheDocument();
  });

  it('navega para Nova convocação ao clicar no botão', async () => {
    const user = userEvent.setup();
    const { concursosOptions } = require('../hooks/useProcessosConvocacao');
    const { mockNavigate } = require('react-router-dom');

    renderComponent();

    const novaBtn = screen.getByRole('button', { name: /criar convocação/i });
    await user.click(novaBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/criar', { state: concursosOptions });
  });

  it('chama handleSub ao clicar em Pesquisar', async () => {
    const user = userEvent.setup();
    const { hookMocks } = require('../hooks/useProcessosConvocacao');

    renderComponent();

    const pesquisarBtn = screen.getByRole('button', { name: /pesquisar/i });
    await user.click(pesquisarBtn);

    expect(hookMocks.handleSub).toHaveBeenCalled();
  });

  it('chama handleReset ao clicar em Limpar filtros', async () => {
    const user = userEvent.setup();
    const { hookMocks } = require('../hooks/useProcessosConvocacao');

    renderComponent();

    const limparBtn = screen.getByRole('button', { name: /limpar filtros/i });
    await user.click(limparBtn);

    expect(hookMocks.handleReset).toHaveBeenCalled();
  });

  it('altera o valor do campo Data de Convocação (inicio)', async () => {
    const user = userEvent.setup();
    renderComponent();

    const inicioInput = screen.getByPlaceholderText('inicio') as HTMLInputElement;
    expect(inicioInput).toBeInTheDocument();

    const prev = inicioInput.value;

    await act(async () => {
      await user.click(inicioInput);
    });
    const dayCells = document.querySelectorAll('.ant-picker-cell-in-view .ant-picker-cell-inner');
    expect(dayCells.length).toBeGreaterThan(0);
    await act(async () => {
      await user.click(dayCells[0] as HTMLElement);
    });

    await waitFor(() => {
      expect(inicioInput.value).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(inicioInput.value).not.toBe(prev);
    });
  });

  it('altera o valor do campo Data de Convocação (Fim)', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fimInput = screen.getByPlaceholderText('Fim') as HTMLInputElement;
    expect(fimInput).toBeInTheDocument();

    const prev = fimInput.value;

    await act(async () => {
      await user.click(fimInput);
    });
    const dayCells = document.querySelectorAll('.ant-picker-cell-in-view .ant-picker-cell-inner');
    expect(dayCells.length).toBeGreaterThan(0);
    await act(async () => {
      const target = dayCells[dayCells.length - 1] as HTMLElement;
      await user.click(target);
    });

    await waitFor(() => {
      expect(fimInput.value).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(fimInput.value).not.toBe(prev);
    });
  });

  it('renderiza campos de formulário com validação', () => {
    renderComponent();
    
    // Verifica se os campos estão renderizados
    expect(screen.getByText('Concurso')).toBeInTheDocument();
    expect(screen.getByText('Data de Convocação')).toBeInTheDocument();
    expect(screen.getByText('Cargo')).toBeInTheDocument();
    
    // Verifica se os campos de data estão presentes
    expect(screen.getByPlaceholderText('inicio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Fim')).toBeInTheDocument();
  });

  it('renderiza botões de ação corretamente', () => {
    renderComponent();
    
    // Verifica se os botões estão presentes
    expect(screen.getByRole('button', { name: /criar convocação/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pesquisar/i })).toBeInTheDocument();
  });

  it('renderiza tabela com dados mockados', () => {
    renderComponent();
    
    // Verifica se a tabela está renderizada com os dados mockados
    expect(screen.getByText('ConvocacaoTable Mock - 1 itens - página 1')).toBeInTheDocument();
  });

  it('renderiza paginação com função showTotal', () => {
    renderComponent();
    
    // Verifica se a função showTotal está sendo chamada
    expect(screen.getByTestId('pagination-total')).toBeInTheDocument();
  });

}); 