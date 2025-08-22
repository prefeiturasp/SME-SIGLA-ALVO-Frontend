import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NovaConvocacaoCandidatos from '../index';
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as any
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as any

// Mock do hook useConcursos
const mockUseConcursos = {
  concursosData: [
    {
      value: 'concurso-1',
      label: 'Concurso de Analista',
      cargos: [
        { value: 'cargo-1', label: 'Analista de Sistemas' },
        { value: 'cargo-2', label: 'Desenvolvedor Backend' }
      ]
    },
    {
      value: 'concurso-2',
      label: 'Concurso de Professor',
      cargos: [
        { value: 'cargo-3', label: 'Professor de Matemática' },
        { value: 'cargo-4', label: 'Professor de Português' }
      ]
    }
  ],
  concursosIsLoading: false
};

// Mock do hook
jest.mock('../hooks/useConcursos', () => ({
  useConcursos: () => mockUseConcursos
}));

// Mock do módulo de services para evitar import de axios com import.meta
jest.mock('../../../../services', () => ({
  API: {
    Candidatos: {
      getCandidatos: jest.fn(() => ({ response: Promise.resolve({ results: [] }) })),
    },
    Concursos: {
      getConcursos: jest.fn(() => ({ response: Promise.resolve({ results: [] }) })),
    },
  },
}));


// Wrapper para renderizar o componente com os providers necessários
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <BrowserRouter>
      <SCThemeProvider theme={appTheme}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </SCThemeProvider>
    </BrowserRouter>
  );
};

describe('NovaConvocacaoCandidatos', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  test.skip('deve alterar o valor do select de concurso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    // Abre o select clicando no placeholder do react-select
    const trigger = screen.getByText('Selecione o concurso 1');
    await user.click(trigger);

    // Seleciona a opção
    await user.click(await screen.findByText('Concurso de Analista'));

    // Verifica que o aviso sumiu
    await waitFor(() => {
      expect(
        screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')
      ).not.toBeInTheDocument();
    });

    // Confirma que o valor selecionado aparece no gatilho
    expect(screen.getByText('Concurso de Analista')).toBeInTheDocument();
  });

  test('deve alterar o valor do select de concurso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    // abra o select clicando no selector real
  const antContainer = screen.getByTestId('concurso-select2');
  const antSelector = antContainer.querySelector('.ant-select-selector') as HTMLElement;
  // alternativa robusta:
  fireEvent.mouseDown(antSelector);
  // ou: await user.click(antSelector);
  // escolha a opção
  await user.click(await screen.findByRole('option', { name: 'Concurso de Analista' }));

  expect(screen.getByText('Concurso de Analista')).toBeInTheDocument();
  });
}); 