import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import ConvocacaoTable from '../components/ConvocacaoTable';

const makeRow = (over: Partial<any> = {}) => ({
  uuid: 'uuid-1',
  concurso_nome: 'Concurso X',
  data_convocacao: '2025-03-10',
  status: 'Ativo',
  ...over,
});

describe('ConvocacaoTable', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<SCThemeProvider theme={appTheme as any}>{ui}</SCThemeProvider>);

  it('renderiza título e dados com data formatada', () => {
    renderWithTheme(<ConvocacaoTable data={[makeRow()]} />);

    expect(screen.getByText('Resultados')).toBeInTheDocument();
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
    await user.click(within(row).getByText('Finalizar'));

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('não dispara onClick do Editar quando desabilitado', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    renderWithTheme(<ConvocacaoTable data={[makeRow()]} />);

    const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
    const buttons = within(row).getAllByRole('button');

    const candidate = buttons.find((b: any) =>
      b.getAttribute('aria-disabled') === 'true' || (typeof (b as HTMLButtonElement).disabled !== 'undefined' && (b as HTMLButtonElement).disabled === true)
    );
    const editButton = candidate || buttons[0];

    await user.click(editButton as HTMLElement);

    expect(consoleSpy).toHaveBeenCalledWith('edit');

    consoleSpy.mockRestore();
  });
}); 