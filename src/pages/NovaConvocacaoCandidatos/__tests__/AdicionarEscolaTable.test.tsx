import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdicionarEscolaTable from '../components/AdicionarEscolaTable';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../theme';

describe('AdicionarEscolaTable', () => {
  it('renderiza, entra em modo edição e salva alterações', async () => {
    const user = userEvent.setup();
    render(
      <SCThemeProvider theme={appTheme}>
        <AdicionarEscolaTable />
      </SCThemeProvider>
    );

    // Garante que a primeira linha renderizou
    const rowText = await screen.findByText('Escola Guaianases');
    const row = rowText.closest('tr') as HTMLElement;
    expect(row).toBeInTheDocument();

    // Clica no lápis (primeiro botão visível na linha)
    const actionButtonsBefore = within(row).getAllByRole('button');
    await user.click(actionButtonsBefore[0]);

    // Agora devem aparecer dois ícones (check e X) e inputs editáveis
    const spinboxes = within(row).getAllByRole('spinbutton');
    expect(spinboxes.length).toBeGreaterThanOrEqual(1);

    // Edita o primeiro valor (vagas_definitivas) para 5
    await user.clear(spinboxes[0]);
    await user.type(spinboxes[0], '5');

    // Salva clicando no primeiro botão (check)
    const actionButtonsEditing = within(row).getAllByRole('button');
    await user.click(actionButtonsEditing[0]);

    // Verifica que o valor salvo aparece na célula
    expect(within(row).getByText('5')).toBeInTheDocument();
  });
}); 