import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgendaTabela from '../components/Agenda/AgendaTabela';

const mockPeriodosList = [
  {
    id: 1,
    cargo: 'Professor',
    convocacao: 'Convocação 001',
    dataEscolha: '2024-01-15',
    sessao: 'Sessão 1',
    horario: '14:00'
  },
  {
    id: 2,
    cargo: 'Coordenador',
    convocacao: 'Convocação 002',
    dataEscolha: '2024-01-16',
    sessao: 'Sessão 2',
    horario: '15:30'
  }
];

const mockHandleRemoverPeriodo = jest.fn();

describe('AgendaTabela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza quando a lista está vazia', () => {
    render(<AgendaTabela periodosList={[]} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renderiza a tabela com dados', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Cargo')).toBeInTheDocument();
    expect(screen.getByText('Convocação')).toBeInTheDocument();
    expect(screen.getByText('Data da Escolha')).toBeInTheDocument();
    expect(screen.getByText('Sessão')).toBeInTheDocument();
    expect(screen.getByText('Horário')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('exibe os dados corretamente na tabela', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('Convocação 001')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('Sessão 1')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    
    expect(screen.getByText('Coordenador')).toBeInTheDocument();
    expect(screen.getByText('Convocação 002')).toBeInTheDocument();
    expect(screen.getByText('2024-01-16')).toBeInTheDocument();
    expect(screen.getByText('Sessão 2')).toBeInTheDocument();
    expect(screen.getByText('15:30')).toBeInTheDocument();
  });

  it('chama handleRemoverPeriodo quando botão de remover é clicado', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockHandleRemoverPeriodo).toHaveBeenCalledWith(1);
  });

  it('chama handleRemoverPeriodo com ID correto para segundo item', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]);
    
    expect(mockHandleRemoverPeriodo).toHaveBeenCalledWith(2);
  });

  it('renderiza botões de ação para cada linha', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    const editButtons = screen.getAllByRole('button');
    expect(editButtons).toHaveLength(4); // 2 edit + 2 delete buttons
  });

  it('aplica estilos corretos na tabela', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('renderiza com lista de um item', () => {
    const singleItem = [mockPeriodosList[0]];
    render(<AgendaTabela periodosList={singleItem} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.queryByText('Coordenador')).not.toBeInTheDocument();
  });

  it('renderiza com lista de múltiplos itens', () => {
    const multipleItems = [
      ...mockPeriodosList,
      {
        id: 3,
        cargo: 'Diretor',
        convocacao: 'Convocação 003',
        dataEscolha: '2024-01-17',
        sessao: 'Sessão 3',
        horario: '16:00'
      }
    ];
    
    render(<AgendaTabela periodosList={multipleItems} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('Coordenador')).toBeInTheDocument();
    expect(screen.getByText('Diretor')).toBeInTheDocument();
  });

  it('chama handleRemoverPeriodo apenas uma vez por clique', () => {
    render(<AgendaTabela periodosList={mockPeriodosList} handleRemoverPeriodo={mockHandleRemoverPeriodo} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockHandleRemoverPeriodo).toHaveBeenCalledTimes(1);
  });
});
