import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import UnidadeEscolarTable from '../../../GerenciamentoVagas/components/UnidadeEscolarTable';

const originData = [
  {
    uuid: 'row-1',
    escola: {
      codigo_eol: '123456',
      dre: { nome: 'DRE Leste' },
      tipo: 'EMEF',
      nome_oficial: 'Escola Teste 1',
    },
    vagas_definitivas: 1,
    vagas_precarias: 2,
    checked: false,
  },
  {
    uuid: 'row-2',
    escola: {
      codigo_eol: '654321',
      dre: { nome: 'DRE Sul' },
      tipo: 'EMEI',
      nome_oficial: 'Escola Teste 2',
    },
    vagas_definitivas: 3,
    vagas_precarias: 4,
    checked: false,
  },
];

describe('UnidadeEscolarTable', () => {
  it('renderiza, entra em modo edição e salva alterações', async () => {
    const user = userEvent.setup();
    const mockSetEditableData = jest.fn();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <UnidadeEscolarTable originData={originData} filteredData={originData} setEditableData={mockSetEditableData} loading={false} />
      </SCThemeProvider>
    );

    const rowText = await screen.findByText('Escola Teste 1');
    const row = rowText.closest('tr') as HTMLElement;
    expect(row).toBeInTheDocument();

    const actionButtonsBefore = within(row).getAllByRole('button');
    await user.click(actionButtonsBefore[0]);

    const spinboxes = within(row).getAllByRole('spinbutton');
    expect(spinboxes.length).toBeGreaterThanOrEqual(1);

    await user.clear(spinboxes[0]);
    await user.type(spinboxes[0], '5');

    const actionButtonsEditing = within(row).getAllByRole('button');
    await user.click(actionButtonsEditing[0]);

    // Check that setEditableData was called to update the data
    expect(mockSetEditableData).toHaveBeenCalled();
  });

  it('cancela edição e mantém valores originais', async () => {
    const user = userEvent.setup();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <UnidadeEscolarTable originData={originData} filteredData={originData} setEditableData={jest.fn()} loading={false} />
      </SCThemeProvider>
    );

    const rowText = await screen.findByText('Escola Teste 2');
    const row = rowText.closest('tr') as HTMLElement;

    const editBtn = within(row).getAllByRole('button')[0];
    await user.click(editBtn);

    const spinboxes = within(row).getAllByRole('spinbutton');
    await user.clear(spinboxes[0]);
    await user.type(spinboxes[0], '9');

    const buttons = within(row).getAllByRole('button');
    const cancelBtn = buttons[1];
    await user.click(cancelBtn);

    expect(within(row).getByText('3')).toBeInTheDocument();
  });

  it('seleciona uma linha via checkbox', async () => {
    const user = userEvent.setup();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <UnidadeEscolarTable originData={originData} filteredData={originData} setEditableData={jest.fn()} loading={false} />
      </SCThemeProvider>
    );

    const rowText = await screen.findByText('Escola Teste 1');
    const row = rowText.closest('tr') as HTMLElement;

    const rowCheckbox = within(row).getByRole('checkbox');
    expect(rowCheckbox).not.toBeChecked();

    await user.click(rowCheckbox);

    expect(rowCheckbox).toBeChecked();
  });
}); 