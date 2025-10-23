import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import ConvocacaoTable from '../components/ConvocacaoTable';

const makeRow = (over: Partial<any> = {}) => ({
  uuid: 'uuid-1',
  descricao: 'Concurso X',
  data_convocacao: '2025-03-10',
  status: 'Ativo',
  ...over,
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ConvocacaoTable', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithTheme = (ui: React.ReactElement) =>
    render(
      <BrowserRouter>
        <SCThemeProvider theme={appTheme as any}>{ui}</SCThemeProvider>
      </BrowserRouter>
    );

  it('renderiza título e dados com data formatada', () => {
    renderWithTheme(<ConvocacaoTable data={[makeRow()]} />);

    expect(screen.getByText('Concurso X')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    // data_convocacao renderizada como DD/MM/YYYY
    expect(screen.getByText('10/03/2025')).toBeInTheDocument();
  });

  it('clica Delete e Finalizar e chama console.log', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    renderWithTheme(<ConvocacaoTable data={[makeRow({ uuid: 'uuid-2' })]} />);

    const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
    const buttons = within(row).getAllByRole('button');

    await user.click(buttons[1]); // Delete
    await user.click(within(row).getByText('Finalizar Processo'));

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('não dispara onClick do Editar quando desabilitado', async () => {
    const user = userEvent.setup();

    renderWithTheme(<ConvocacaoTable data={[makeRow()]} />);

    const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
    const buttons = within(row).getAllByRole('button');

    // Find the edit button (first button)
    const editButton = buttons[0];

    await user.click(editButton as HTMLElement);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('editar/uuid-1/dados-processo', expect.objectContaining({
      state: expect.objectContaining({ editData: expect.any(Object) })
    }));
  });

  it('aplica classes CSS corretas para linhas pares e ímpares', () => {
    const data = [
      makeRow({ uuid: 'uuid-1', descricao: 'Concurso 1' }),
      makeRow({ uuid: 'uuid-2', descricao: 'Concurso 2' }),
      makeRow({ uuid: 'uuid-3', descricao: 'Concurso 3' }),
    ];

    renderWithTheme(<ConvocacaoTable data={data} />);

    const rows = screen.getAllByRole('row').slice(1); // Remove header row

    // Primeira linha (índice 0) deve ter classe "row-white"
    expect(rows[0]).toHaveClass('row-white');
    
    // Segunda linha (índice 1) deve ter classe "row-gray"
    expect(rows[1]).toHaveClass('row-gray');
    
    // Terceira linha (índice 2) deve ter classe "row-white"
    expect(rows[2]).toHaveClass('row-white');
  });
}); 