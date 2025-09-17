import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../theme';
import AdicionarNovaEscolaModal from '../components/AdicionarNovaEscolaModal/AdicionarNovaEscolaModal';

describe('AdicionarNovaEscolaModal', () => {
  it('renderiza e chama onCancel ao clicar em Voltar', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ThemeProvider theme={appTheme as any}>
        <AdicionarNovaEscolaModal
          isOpen={true}
          loading={false}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </ThemeProvider>
    );

    expect(await screen.findByText('Nova escola')).toBeInTheDocument();

    const escolaInput = screen.getByRole('textbox');
    await user.type(escolaInput, 'Minha Escola');
    expect(escolaInput).toHaveValue('Minha Escola');

    const voltarBtn = screen.getByRole('button', { name: /voltar/i });
    await user.click(voltarBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('chama onConfirm ao clicar em Adicionar escola', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ThemeProvider theme={appTheme as any}>
        <AdicionarNovaEscolaModal
          isOpen={true}
          loading={false}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </ThemeProvider>
    );

    const adicionarBtn = await screen.findByRole('button', { name: /adicionar escola/i });
    await user.click(adicionarBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('captura erro de onConfirm e não quebra a UI', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const error = new Error('Falha ao salvar');
    const onConfirm = jest.fn().mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <ThemeProvider theme={appTheme as any}>
        <AdicionarNovaEscolaModal
          isOpen={true}
          loading={false}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </ThemeProvider>
    );

    const adicionarBtn = await screen.findByRole('button', { name: /adicionar escola/i });
    await user.click(adicionarBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalled();
    });

    // UI ainda presente
    expect(screen.getByText('Nova escola')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
}); 