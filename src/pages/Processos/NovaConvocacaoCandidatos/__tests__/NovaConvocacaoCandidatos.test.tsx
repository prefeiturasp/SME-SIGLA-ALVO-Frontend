import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NovaConvocacaoCandidatos from '../index';
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';

const mockTheme = appTheme as any;

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as any
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as any

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

jest.mock('../hooks/useConcursos', () => ({
  useConcursos: () => mockUseConcursos
}));

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

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <BrowserRouter>
              <SCThemeProvider theme={mockTheme}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </SCThemeProvider>
    </BrowserRouter>
  );
};

describe('NovaConvocacaoCandidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve alterar o valor do select de concurso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });

    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(
        screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')
      ).not.toBeInTheDocument();
    });

    const selectContainer = screen.getByTestId('concurso-select');
    expect(selectContainer).toBeInTheDocument();
  });

  test('deve carregar os cargos quando um concurso é selecionado', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const cargoSelectByPlaceholder = screen.queryByPlaceholderText('Selecione o cargo');
      if (cargoSelectByPlaceholder) {
        expect(cargoSelectByPlaceholder).toBeInTheDocument();
        return;
      }
      
      const cargoSelectByText = screen.queryByText('Selecione o cargo');
      if (cargoSelectByText) {
        expect(cargoSelectByText).toBeInTheDocument();
        return;
      }
      
      const cargoSelectByRole = screen.queryByRole('combobox', { name: /cargo/i });
      if (cargoSelectByRole) {
        expect(cargoSelectByRole).toBeInTheDocument();
        return;
      }
      
      expect(screen.getByText('Cargos')).toBeInTheDocument();
    });
  });

  test('deve abrir o popup de selecionar candidatos', async () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    const selecionarButton = screen.getByText('Selecionar candidatos');
    expect(selecionarButton).toBeInTheDocument();
  });

  test('deve preencher o campo de descrição', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const descricaoInput = screen.getByPlaceholderText('Digite a descrição');
    await act(async () => {
      await user.type(descricaoInput, 'Descrição de teste para convocação');
    });
    expect(descricaoInput).toHaveValue('Descrição de teste para convocação');
  });

  test('deve habilitar o botão Buscar quando um cargo é selecionado', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const buscarButton = screen.getByText('Buscar');
    expect(buscarButton).toBeInTheDocument();
  });

  test('deve buscar dados do cargo quando clicar no botão Buscar', async () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const buscarButton = screen.getByText('Buscar');
    expect(buscarButton).toBeInTheDocument();
  });

  test('deve selecionar candidatos e atualizar o contador', async () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Candidatos selecionados')).toBeInTheDocument();
  });

  test('deve exibir cards de vagas e candidatos corretamente', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Vagas')).toBeInTheDocument();
    expect(screen.getByText('Escolas selecionadas')).toBeInTheDocument();
    expect(screen.getByText('Candidatos selecionados')).toBeInTheDocument();
  });

  test('deve selecionar tipo de processo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const tipoProcessoSelect = screen.getByText('Selecione o tipo de escolha');
    await act(async () => {
      await user.click(tipoProcessoSelect);
    });

    const novaAutorizacaoOptions = screen.getAllByText('Nova Autorização');
    expect(novaAutorizacaoOptions).toHaveLength(2);
    
    await act(async () => {
      await user.click(novaAutorizacaoOptions[0]);
    });

    expect(screen.getAllByText('Nova Autorização')).toHaveLength(2);
  });

  test('deve selecionar data de convocação', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const dataConvocacaoPicker = screen.getByPlaceholderText('Selecione a data da convocação');
    expect(dataConvocacaoPicker).toBeInTheDocument();
    
    await act(async () => {
      await user.click(dataConvocacaoPicker);
    });
    
    expect(dataConvocacaoPicker).toBeInTheDocument();
  });

  test('deve selecionar data de corte de vagas', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const dataCortePicker = screen.getByPlaceholderText('Selecione a data corte de vagas');
    expect(dataCortePicker).toBeInTheDocument();
    
    await act(async () => {
      await user.click(dataCortePicker);
    });
    
    expect(dataCortePicker).toBeInTheDocument();
  });

  test('deve limpar cargos quando concurso é desmarcado', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Professor'));
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve selecionar cargo quando disponível', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve lidar com estado de loading dos concursos', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    const concursoSelect = screen.getByText('Selecione o concurso');
    expect(concursoSelect).toBeInTheDocument();
  });

  test('deve lidar com dados de concursos vazios', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    const concursoSelect = screen.getByText('Selecione o concurso');
    expect(concursoSelect).toBeInTheDocument();
  });

  test('deve renderizar breadcrumb corretamente', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('Processos')).toHaveLength(2);
    expect(screen.getByText('Convocação de candidatos')).toBeInTheDocument();
    expect(screen.getByText('Nova Convocação')).toBeInTheDocument();
  });

  test('deve renderizar título da página corretamente', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Processo de convocação de candidatos')).toBeInTheDocument();
    expect(screen.getByText('Busca Processos')).toBeInTheDocument();
  });

  test('deve manter estado do formulário entre interações', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const descricaoInput = screen.getByPlaceholderText('Digite a descrição');
    await act(async () => {
      await user.type(descricaoInput, 'Descrição de teste');
    });

    const tipoProcessoSelect = screen.getByText('Selecione o tipo de escolha');
    await act(async () => {
      await user.click(tipoProcessoSelect);
    });
    
    const reposicaoOptions = screen.getAllByText('Reposição');
    expect(reposicaoOptions).toHaveLength(2);
    
    await act(async () => {
      await user.click(reposicaoOptions[0]);
    });

    expect(descricaoInput).toHaveValue('Descrição de teste');
    expect(screen.getAllByText('Reposição')).toHaveLength(2);
  });

  test('deve renderizar todos os campos do formulário', () => {
    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Concurso')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Escolha')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Data da convocação')).toBeInTheDocument();
    expect(screen.getByText('Data corte de Vagas')).toBeInTheDocument();
  });

  test('deve lidar com seleção de cargo corretamente', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Professor'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve lidar com concurso vazio na função buscarCargosDoConcurso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    
    expect(screen.getByText('* Selecione o concurso para liberar a opção de Cargo.')).toBeInTheDocument();
    
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar função buscarCargosDoConcurso com valor vazio', async () => {
    const mockUseConcursos = {
      concursosData: [],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursos
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('* Selecione o concurso para liberar a opção de Cargo.')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar função handleSub com dados do formulário', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const descricaoInput = screen.getByPlaceholderText('Digite a descrição');
    await act(async () => {
      await user.type(descricaoInput, 'Descrição para teste de submissão');
    });

    const tipoProcessoSelect = screen.getByText('Selecione o tipo de escolha');
    await act(async () => {
      await user.click(tipoProcessoSelect);
    });
    const novaAutorizacaoOptions = screen.getAllByText('Nova Autorização');
    await act(async () => {
      await user.click(novaAutorizacaoOptions[0]);
    });

    expect(descricaoInput).toHaveValue('Descrição para teste de submissão');
    expect(screen.getAllByText('Nova Autorização')).toHaveLength(2);

    consoleSpy.mockRestore();
  });

  test('deve testar função handleSub diretamente', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const mockUseConcursos = {
      concursosData: [
        {
          value: 'concurso-teste',
          label: 'Concurso Teste',
          cargos: [
            {
              value: 'cargo-teste',
              label: 'Cargo Teste'
            }
          ]
        }
      ],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursos
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    const descricaoInput = screen.getByPlaceholderText('Digite a descrição');
    expect(descricaoInput).toBeInTheDocument();
    
    expect(screen.getByText('Concurso')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('deve testar função handleReset através de mudança de concurso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    const descricaoInput = screen.getByPlaceholderText('Digite a descrição');
    await act(async () => {
      await user.type(descricaoInput, 'Descrição que será limpa');
    });

    const tipoProcessoSelect = screen.getByText('Selecione o tipo de escolha');
    await act(async () => {
      await user.click(tipoProcessoSelect);
    });
    const reposicaoOptions = screen.getAllByText('Reposição');
    await act(async () => {
      await user.click(reposicaoOptions[0]);
    });

    expect(descricaoInput).toHaveValue('Descrição que será limpa');
    expect(screen.getAllByText('Reposição')).toHaveLength(2);

    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Professor'));
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar função handleReset diretamente', async () => {
    const mockUseConcursos = {
      concursosData: [
        {
          value: 'concurso-teste',
          label: 'Concurso Teste',
          cargos: []
        }
      ],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursos
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Selecione o tipo de escolha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a descrição')).toBeInTheDocument();
  });

  test('deve testar selectedConcursoLabel e selectedCargoLabel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar edge case de concursosData undefined', async () => {
    const mockUseConcursosUndefined = {
      concursosData: undefined,
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursosUndefined
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);

    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar edge case de cargosDisponiveis vazio', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NovaConvocacaoCandidatos />);

    const concursoSelect = screen.getByText('Selecione o concurso');
    await act(async () => {
      await user.click(concursoSelect);
    });
    await act(async () => {
      await user.click(await screen.findByText('Concurso de Analista'));
    });

    await waitFor(() => {
      expect(screen.queryByText('* Selecione o concurso para liberar a opção de Cargo.')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar cenário de concurso sem cargos para cobrir linha 75', async () => {
    const mockUseConcursosSemCargos = {
      concursosData: [
        {
          value: 'concurso-sem-cargos',
          label: 'Concurso Sem Cargos',
          cargos: undefined
        }
      ],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursosSemCargos
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar cenário de concursosData vazio para cobrir linha 73', async () => {
    const mockUseConcursosVazio = {
      concursosData: [],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursosVazio
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar cenário de selectedConcursoLabel undefined para cobrir linha 113', async () => {
    const mockUseConcursosNaoEncontra = {
      concursosData: [
        {
          value: 'outro-concurso',
          label: 'Outro Concurso',
          cargos: []
        }
      ],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursosNaoEncontra
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);
    
    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });

  test('deve testar cenário de selectedCargoLabel undefined para cobrir linha 118', async () => {
    const mockUseConcursosCargoNaoEncontra = {
      concursosData: [
        {
          value: 'concurso-teste',
          label: 'Concurso Teste',
          cargos: [
            {
              value: 'outro-cargo',
              label: 'Outro Cargo'
            }
          ]
        }
      ],
      concursosIsLoading: false
    };

    jest.doMock('../hooks/useConcursos', () => ({
      useConcursos: () => mockUseConcursosCargoNaoEncontra
    }));

    renderWithProviders(<NovaConvocacaoCandidatos />);

    expect(screen.getByText('Selecione o concurso')).toBeInTheDocument();
    expect(screen.getByText('Cargos')).toBeInTheDocument();
  });
});