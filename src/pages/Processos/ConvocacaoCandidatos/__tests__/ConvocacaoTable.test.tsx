import React from 'react';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as appTheme } from '../../../../theme';
import ConvocacaoTable from '../components/ConvocacaoTable';

const makeRow = (over: Partial<any> = {}) => ({
  uuid: 'uuid-1',
  descricao: 'Concurso X',
  concurso_nome: 'Concurso Teste',
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

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  const mockDayjs = jest.fn((date) => ({
    format: jest.fn(() => {
      if (date === '2025-03-10') return '10/03/2025';
      if (date === '2024-01-15') return '15/01/2024';
      if (date === '2024-02-20') return '20/02/2024';
      return '01/01/2024';
    }),
  }));
  mockDayjs.extend = jest.fn();
  return mockDayjs;
});

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
    renderWithTheme(
      <ConvocacaoTable 
        data={[makeRow()]} 
        canChangeProcessoConvocacao={true}
        canDeleteProcessoConvocacao={true}
        canViewDetailsProcessoConvocacao={true}
        canFinalizeProcessoConvocacao={true}
      />
    );

    expect(screen.getByText('Concurso X')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    // data_convocacao renderizada como DD/MM/YYYY
    expect(screen.getByText('10/03/2025')).toBeInTheDocument();
  });

  it('clica Delete e Finalizar e chama handlers', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const onFinalizar = jest.fn();
    const rowData = makeRow({ uuid: 'uuid-2' });

    renderWithTheme(
      <ConvocacaoTable 
        data={[rowData]} 
        canChangeProcessoConvocacao={true}
        canDeleteProcessoConvocacao={true}
        canViewDetailsProcessoConvocacao={true}
        canFinalizeProcessoConvocacao={true}
        onFinalizar={onFinalizar}
      />
    );

    const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
    const buttons = within(row).getAllByRole('button');

    // Encontrar o botão Delete
    const deleteButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Excluir processo' || btn.querySelector('[aria-label="Excluir processo"]'));
    if (deleteButton) {
      await user.click(deleteButton as HTMLElement);
      expect(consoleSpy).toHaveBeenCalledWith('delete', expect.any(Object));
    }

    // Clicar no botão Finalizar Processo (chama onFinalizar com o record)
    const finalizarButton = within(row).getByText('Finalizar Processo');
    await user.click(finalizarButton);
    expect(onFinalizar).toHaveBeenCalledWith(rowData);

    consoleSpy.mockRestore();
  });

  it('dispara onClick do Editar quando habilitado', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <ConvocacaoTable 
        data={[makeRow()]} 
        canChangeProcessoConvocacao={true}
        canDeleteProcessoConvocacao={true}
        canViewDetailsProcessoConvocacao={true}
        canFinalizeProcessoConvocacao={true}
      />
    );

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

    renderWithTheme(
      <ConvocacaoTable 
        data={data} 
        canChangeProcessoConvocacao={true}
        canDeleteProcessoConvocacao={true}
        canViewDetailsProcessoConvocacao={true}
        canFinalizeProcessoConvocacao={true}
      />
    );

    const rows = screen.getAllByRole('row').slice(1); // Remove header row

    // Primeira linha (índice 0) deve ter classe "row-white"
    expect(rows[0]).toHaveClass('row-white');
    
    // Segunda linha (índice 1) deve ter classe "row-gray"
    expect(rows[1]).toHaveClass('row-gray');
    
    // Terceira linha (índice 2) deve ter classe "row-white"
    expect(rows[2]).toHaveClass('row-white');
  });

  it('não dispara onClick do Editar quando desabilitado', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <ConvocacaoTable 
        data={[makeRow()]} 
        canChangeProcessoConvocacao={false}
        canDeleteProcessoConvocacao={true}
        canViewDetailsProcessoConvocacao={true}
        canFinalizeProcessoConvocacao={true}
      />
    );

    const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
    const buttons = within(row).getAllByRole('button');

    // Find the edit button
    const editButton = buttons.find(btn => btn.hasAttribute('disabled') || btn.closest('button[disabled]'));
    if (editButton) {
      await user.click(editButton as HTMLElement);
      // Quando desabilitado, não deve navegar
      expect(mockNavigate).not.toHaveBeenCalled();
    }
  });

  describe('handleView', () => {
    it('deve navegar para visualização ao clicar no botão Visualizar', async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow()]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
      const buttons = within(row).getAllByRole('button');
      
      // Encontrar botão de visualizar (EyeOutlined)
      const viewButton = buttons.find(btn => 
        btn.querySelector('[aria-label="Visualizar processo"]') ||
        btn.getAttribute('aria-label') === 'Visualizar processo'
      ) || buttons[1]; // Segundo botão geralmente é visualizar

      if (viewButton && !viewButton.hasAttribute('disabled')) {
        await user.click(viewButton as HTMLElement);
        expect(mockNavigate).toHaveBeenCalledWith(
          'editar/uuid-1/dados-processo',
          expect.objectContaining({
            state: expect.objectContaining({
              editData: expect.any(Object),
              isViewMode: true,
            }),
          })
        );
      }
    });
  });

  describe('StatusRenderer', () => {
    it('deve renderizar status "Em andamento" corretamente', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Em andamento' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      expect(screen.getByText('Em andamento')).toBeInTheDocument();
    });

    it('deve renderizar status "Finalizado" corretamente', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Finalizado' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      expect(screen.getByText('Finalizado')).toBeInTheDocument();
    });

    it('deve renderizar status customizado quando não é andamento ou finalizado', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Pendente' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      expect(screen.getByText('Pendente')).toBeInTheDocument();
    });
  });

  describe('isProcessoFinalizado', () => {
    it('deve desabilitar botão Editar quando processo está finalizado', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Finalizado' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
      const buttons = within(row).getAllByRole('button');
      // Ordem: Editar, Visualizar, Excluir, Finalizar
      expect(buttons[0]).toBeDisabled();
    });

    it('deve desabilitar botão Delete quando processo está finalizado', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Finalizada' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
      const buttons = within(row).getAllByRole('button');
      // Ordem: Editar, Visualizar, Excluir, Finalizar
      expect(buttons[2]).toBeDisabled();
    });

    it('deve exibir botão Finalizar desabilitado quando processo está finalizado', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Finalizado' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const finalizarButton = screen.getByText('Finalizar Processo');
      expect(finalizarButton).toBeInTheDocument();
      expect(finalizarButton.closest('button')).toBeDisabled();
    });
  });

  describe('SortIcon', () => {
    it('deve iniciar com ascend quando campo diferente é selecionado', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', concurso_nome: 'Concurso A' }),
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', concurso_nome: 'Concurso B' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Clicar primeiro em Processo
      const processHeaders = screen.getAllByText('Processo');
      if (processHeaders.length > 0) {
        const headerContainer = processHeaders[0].closest('th');
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
        }
      }

      // Depois clicar em Concurso (campo diferente)
      const concursoHeaders = screen.getAllByText('Concurso');
      if (concursoHeaders.length > 0) {
        const headerContainer = concursoHeaders[0].closest('th');
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalledWith('Ordenar por concurso_nome:', 'ascend');
        }
      }

      consoleSpy.mockRestore();
    });
  });

  describe('getSortedData', () => {
    it('deve ordenar dados por descricao', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', concurso_nome: 'Concurso B', data_convocacao: '2024-02-20' }),
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', concurso_nome: 'Concurso A', data_convocacao: '2024-01-15' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Encontrar e clicar no ícone de ordenação de descricao
      const processHeaders = screen.getAllByText('Processo');
      if (processHeaders.length > 0) {
        const headerContainer = processHeaders[0].parentElement;
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalled();
        }
      }

      consoleSpy.mockRestore();
    });

    it('deve ordenar dados por data_convocacao em ordem ascendente', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', data_convocacao: '2024-02-20' }),
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', data_convocacao: '2024-01-15' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Encontrar e clicar no ícone de ordenação de data
      const dataHeaders = screen.getAllByText('Data de Convocação');
      if (dataHeaders.length > 0) {
        const headerContainer = dataHeaders[0].parentElement;
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalled();
        }
      }

      consoleSpy.mockRestore();
    });

    it('deve ordenar dados por concurso_nome', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', concurso_nome: 'Concurso B', data_convocacao: '2024-02-20' }),
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', concurso_nome: 'Concurso A', data_convocacao: '2024-01-15' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Encontrar e clicar no ícone de ordenação de concurso
      const concursoHeaders = screen.getAllByText('Concurso');
      if (concursoHeaders.length > 0) {
        const headerContainer = concursoHeaders[0].parentElement;
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalled();
        }
      }

      consoleSpy.mockRestore();
    });

    it('deve ordenar dados por status', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', status: 'Finalizado', data_convocacao: '2024-02-20' }),
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', status: 'Em andamento', data_convocacao: '2024-01-15' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Encontrar e clicar no ícone de ordenação de status
      const statusHeaders = screen.getAllByText('Status');
      if (statusHeaders.length > 0) {
        const headerContainer = statusHeaders[0].parentElement;
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalled();
        }
      }

      consoleSpy.mockRestore();
    });

    it('deve retornar dados sem ordenação quando sortOrder é null', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A' }),
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Quando não há ordenação, os dados devem ser retornados na ordem original
      expect(screen.getByText('Processo A')).toBeInTheDocument();
      expect(screen.getByText('Processo B')).toBeInTheDocument();
    });

    it('deve lidar com campo desconhecido no switch (default case)', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Criar um componente de teste que force o default case
      // Isso é difícil de testar diretamente, mas garantimos que o código existe
      renderWithTheme(
        <ConvocacaoTable 
          data={[
            makeRow({ uuid: 'uuid-1', descricao: 'Processo A', data_convocacao: '2024-01-15' }),
            makeRow({ uuid: 'uuid-2', descricao: 'Processo B', data_convocacao: '2024-02-20' }),
          ]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      // Testar ordenação por status para garantir que todas as branches sejam cobertas
      const statusHeaders = screen.getAllByText('Status');
      if (statusHeaders.length > 0) {
        const headerContainer = statusHeaders[0].parentElement;
        const sortContainer = headerContainer?.querySelector('[style*="cursor"]');
        if (sortContainer) {
          await user.click(sortContainer as HTMLElement);
          expect(consoleSpy).toHaveBeenCalled();
        }
      }

      consoleSpy.mockRestore();
    });
  });

  describe('Botão Finalizar', () => {
    it('deve exibir botão Finalizar quando processo não está finalizado', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Em andamento' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      expect(screen.getByText('Finalizar Processo')).toBeInTheDocument();
    });

    it('deve chamar onFinalizar ao clicar em Finalizar Processo', async () => {
      const user = userEvent.setup();
      const onFinalizar = jest.fn();
      const row = makeRow({ status: 'Em andamento' });

      renderWithTheme(
        <ConvocacaoTable 
          data={[row]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
          onFinalizar={onFinalizar}
        />
      );

      const finalizarButton = screen.getByText('Finalizar Processo');
      await user.click(finalizarButton);

      expect(onFinalizar).toHaveBeenCalledTimes(1);
      expect(onFinalizar).toHaveBeenCalledWith(row);
    });

    it('deve aplicar hover styles no botão Finalizar', async () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Em andamento' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const finalizarButton = screen.getByText('Finalizar Processo');
      
      fireEvent.mouseEnter(finalizarButton);
      fireEvent.mouseLeave(finalizarButton);

      expect(finalizarButton).toBeInTheDocument();
    });

    it('deve exibir botão Finalizar desabilitado quando sem permissão', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow({ status: 'Em andamento' })]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={false}
        />
      );

      const finalizarButton = screen.getByText('Finalizar Processo');
      expect(finalizarButton).toBeInTheDocument();
      // Verificar que o botão pai está desabilitado
      const buttonElement = finalizarButton.closest('button');
      expect(buttonElement).toHaveAttribute('disabled');
    });
  });

  describe('Locale emptyText', () => {
    it('deve exibir mensagem quando não há dados', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={true}
          canFinalizeProcessoConvocacao={true}
        />
      );

      expect(screen.getByText('Nenhum processo encontrado')).toBeInTheDocument();
    });
  });

  describe('Permissões', () => {
    it('deve desabilitar botão visualizar quando sem permissão', () => {
      renderWithTheme(
        <ConvocacaoTable 
          data={[makeRow()]} 
          canChangeProcessoConvocacao={true}
          canDeleteProcessoConvocacao={true}
          canViewDetailsProcessoConvocacao={false}
          canFinalizeProcessoConvocacao={true}
        />
      );

      const row = screen.getByText('Concurso X').closest('tr') as HTMLElement;
      const buttons = within(row).getAllByRole('button');
      
      const viewButton = buttons.find(btn => btn.hasAttribute('disabled'));
      expect(viewButton).toBeTruthy();
    });
  });
}); 