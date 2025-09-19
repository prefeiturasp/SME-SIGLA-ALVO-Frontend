import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import VisualizarVagasModal from '../components/VisualizarVagasModal/VisualizarVagasModal';

describe('VisualizarVagasModal', () => {
  const baseProps = {
    isOpen: true,
    loading: false,
    concurso: 'Concurso X',
    cargo: 'Cargo Y',
  };

  it('renderiza concurso e cargo e permite cancelar', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    expect(await screen.findByText('Vagas por Unidade Escolar')).toBeInTheDocument();
    expect(screen.getByText('Concurso:')).toBeInTheDocument();
    expect(screen.getByText('Cargo:')).toBeInTheDocument();
    expect(screen.getByText(baseProps.concurso)).toBeInTheDocument();
    expect(screen.getByText(baseProps.cargo)).toBeInTheDocument();

    const cancelar = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelar);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('abre e fecha o modal aninhado de Adicionar Nova Escola', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    const incluirBtn = await screen.findByRole('button', { name: /incluir escola/i });
    await user.click(incluirBtn);

    expect(await screen.findByText('Nova escola')).toBeInTheDocument();

    const voltar = screen.getByRole('button', { name: /voltar/i });
    await user.click(voltar);

    expect(await screen.findByText('Vagas por Unidade Escolar')).toBeInTheDocument();
  });

  it('aciona botões de ação (Atualizar vagas e Filtrar)', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    const atualizarBtn = await screen.findByRole('button', { name: /atualizar vagas/i });
    await user.click(atualizarBtn);

    const filtrarBtn = await screen.findByRole('button', { name: /filtrar/i });
    await user.click(filtrarBtn);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('chama onConfirm ao clicar em Salvar', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    const salvarBtn = await screen.findByRole('button', { name: /salvar/i });
    await user.click(salvarBtn);

    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
  });

  it('captura erro de onConfirm ao clicar em Salvar e mantém a UI', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const error = new Error('Falha ao salvar');
    const onConfirm = jest.fn().mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    const salvarBtn = await screen.findByRole('button', { name: /salvar/i });
    await user.click(salvarBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.getByText('Vagas por Unidade Escolar')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('trata erro dentro de confirmAdicionarNovaEscola e mantém a UI', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    let call = 0;
    const consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((..._args: any[]) => {
        call += 1;
        if (call === 1) {
          throw new Error('mock failure');
        }
      });

    render(
      <SCThemeProvider theme={appTheme as any}>
        <VisualizarVagasModal {...baseProps} onCancel={onCancel} onConfirm={onConfirm} />
      </SCThemeProvider>
    );

    const incluirBtn = await screen.findByRole('button', { name: /incluir escola/i });
    await user.click(incluirBtn);

    expect(await screen.findByText('Nova escola')).toBeInTheDocument();

    const adicionarBtn = await screen.findByRole('button', { name: /adicionar escola/i });
    await user.click(adicionarBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.getByText('Vagas por Unidade Escolar')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
}); 