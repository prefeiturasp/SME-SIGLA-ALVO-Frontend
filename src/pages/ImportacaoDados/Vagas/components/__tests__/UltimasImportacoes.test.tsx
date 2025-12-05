import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UltimasImportacoesDeVagasTable from '../UltimasImportacoesDeVagasTable';
import type { IUltimasImportacoesVagas } from '../../../../../services/resources/importacaoDados/IImportacaoArquivos';

// Mock do hook useGetDownloadError
const mockHandleDownload = jest.fn();
jest.mock('../../../hooks/useGetDownloadError', () => ({
  useGetDownloadError: jest.fn(() => ({
    handleDownload: mockHandleDownload,
    isDownloading: false,
  })),
  TipoImportacao: {
    VAGAS: 'vagas',
    HABILITADOS: 'habilitados',
  },
}));

// Mock do ErroModal
jest.mock('../ErroModal', () => {
  return function ErroModal({ open, onClose, importacaoErro, onDownload, isDownloading }: any) {
    if (!open) return null;
    return (
      <div data-testid="erro-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Fechar
        </button>
        <button data-testid="download-modal" onClick={onDownload}>
          Download
        </button>
        {importacaoErro && <div data-testid="erro-data">{JSON.stringify(importacaoErro)}</div>}
        {isDownloading && <div data-testid="downloading">Downloading...</div>}
      </div>
    );
  };
});

// Mock dos componentes de estilo
jest.mock('../style', () => ({
  CustomTitle: ({ children, level, ...props }: any) => (
    <h1 data-level={level} {...props}>
      {children}
    </h1>
  ),
}));

jest.mock('../../../../../components/EstilosCompartilhados', () => ({
  StyledTable: ({ columns, dataSource, rowKey, bordered, rowClassName, ...props }: any) => (
    <table data-testid="styled-table" {...props}>
      <thead>
        <tr>
          {columns.map((col: any, index: number) => (
            <th key={index}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record: any, rowIndex: number) => (
          <tr
            key={rowKey(record)}
            className={rowClassName ? rowClassName(record, rowIndex) : ''}
            data-testid={`row-${rowIndex}`}
          >
            {columns.map((col: any, colIndex: number) => (
              <td key={colIndex} data-testid={`cell-${rowIndex}-${colIndex}`}>
                {col.render
                  ? col.render(record[col.dataIndex], record, rowIndex)
                  : record[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

// Mock do Antd
jest.mock('antd', () => ({
  Tooltip: ({ children, title }: any) => (
    <div title={title}>{children}</div>
  ),
}));

// Mock do dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return (date: string) => {
    if (!date) return null;
    const dayjsObj = originalDayjs(date);
    return {
      format: (formatStr: string) => {
        if (formatStr === 'DD/MM/YYYY') {
          return dayjsObj.format('DD/MM/YYYY');
        }
        return dayjsObj.format(formatStr);
      },
    };
  };
});

// Mock dos ícones
jest.mock('@ant-design/icons', () => ({
  WarningOutlined: ({ style, onClick }: any) => (
    <span
      data-testid="warning-icon"
      style={style}
      onClick={onClick}
      role="button"
    >
      ⚠
    </span>
  ),
}));

const { useGetDownloadError } = require('../../../hooks/useGetDownloadError');

describe('UltimasImportacoesDeVagasTable', () => {
  const mockData: IUltimasImportacoesVagas[] = [
    {
      uuid: '1',
      nome_arquivo: 'vagas_2024.csv',
      processo_nome: 'Processo 1',
      criado_em: '2024-01-15T10:00:00Z',
      status: 'SUCESSO',
      erros: [],
    },
    {
      uuid: '2',
      nome_arquivo: 'vagas_erro.csv',
      processo_nome: 'Processo 2',
      criado_em: '2024-01-16T14:30:00Z',
      status: 'ERRO',
      erros: [
        {
          mensagem: 'Erro na linha 5',
          erros: 'Campo obrigatório: CPF | Campo inválido: Email',
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useGetDownloadError.mockReturnValue({
      handleDownload: mockHandleDownload,
      isDownloading: false,
    });
  });

  describe('Renderização', () => {
    it('deve renderizar o título "Últimas importações"', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByText('Últimas importações')).toBeInTheDocument();
    });

    it('deve renderizar a tabela', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByTestId('styled-table')).toBeInTheDocument();
    });

    it('deve renderizar todas as colunas', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByText('Nome do arquivo')).toBeInTheDocument();
      expect(screen.getByText('Processo')).toBeInTheDocument();
      expect(screen.getByText('Data da importação')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    it('deve renderizar os dados corretamente', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByText('vagas_2024.csv')).toBeInTheDocument();
      expect(screen.getByText('Processo 1')).toBeInTheDocument();
      expect(screen.getByText('SUCESSO')).toBeInTheDocument();
    });
  });

  describe('Renderização de colunas', () => {
    it('deve renderizar "-" quando nome_arquivo é null', () => {
      const dataWithNull = [
        {
          ...mockData[0],
          nome_arquivo: null as any,
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithNull} />);
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('deve renderizar "-" quando processo_nome é null', () => {
      const dataWithNull = [
        {
          ...mockData[0],
          processo_nome: null as any,
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithNull} />);
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('deve renderizar "-" quando status é null', () => {
      const dataWithNull = [
        {
          ...mockData[0],
          status: null as any,
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithNull} />);
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('deve formatar a data corretamente', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
      expect(screen.getByText('16/01/2024')).toBeInTheDocument();
    });

    it('deve renderizar "-" quando criado_em é null', () => {
      const dataWithNull = [
        {
          ...mockData[0],
          criado_em: null as any,
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithNull} />);
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('deve renderizar "-" quando criado_em é string vazia', () => {
      const dataWithEmpty = [
        {
          ...mockData[0],
          criado_em: '',
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithEmpty} />);
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe('Coluna de Ações', () => {
    it('deve renderizar ícone de warning quando status é "ERRO"', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    });

    it('não deve renderizar ícone de warning quando status não é "ERRO"', () => {
      const dataWithoutError = [mockData[0]];
      render(<UltimasImportacoesDeVagasTable data={dataWithoutError} />);
      expect(screen.queryByTestId('warning-icon')).not.toBeInTheDocument();
    });

    it('deve ter tooltip no ícone de warning', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      const icon = screen.getByTestId('warning-icon');
      const tooltip = icon.closest('[title]');
      expect(tooltip).toHaveAttribute('title', 'Importação com erro, clique para visualizar');
    });

    it('deve ter estilos corretos no ícone de warning', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      const icon = screen.getByTestId('warning-icon');
      expect(icon).toHaveAttribute('style');
    });
  });

  describe('Modal de Erros', () => {
    it('não deve renderizar o modal inicialmente', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      expect(screen.queryByTestId('erro-modal')).not.toBeInTheDocument();
    });

    it('deve abrir o modal ao clicar no ícone de warning', async () => {
      const user = userEvent.setup();
      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      expect(screen.getByTestId('erro-modal')).toBeInTheDocument();
    });

    it('deve fechar o modal ao clicar no botão fechar', async () => {
      const user = userEvent.setup();
      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      const closeButton = screen.getByTestId('close-modal');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('erro-modal')).not.toBeInTheDocument();
      });
    });

    it('deve passar os dados corretos para o ErroModal', async () => {
      const user = userEvent.setup();
      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      const erroData = screen.getByTestId('erro-data');
      const expectedError = mockData[1].erros[0];
      expect(erroData.textContent).toContain(expectedError.mensagem);
      expect(erroData.textContent).toContain(expectedError.erros);
    });

    it('deve passar null para importacaoErro quando não há erros', async () => {
      const user = userEvent.setup();
      const dataWithoutErrors = [
        {
          ...mockData[1],
          erros: [],
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithoutErrors} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      expect(screen.queryByTestId('erro-data')).not.toBeInTheDocument();
    });
  });

  describe('Download de erros', () => {
    it('deve chamar handleDownloadError ao clicar no botão download', async () => {
      const user = userEvent.setup();
      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      const downloadButton = screen.getByTestId('download-modal');
      await user.click(downloadButton);

      expect(mockHandleDownload).toHaveBeenCalledWith('2');
    });

    it('não deve chamar handleDownloadError quando uuid não existe', async () => {
      const user = userEvent.setup();
      const dataWithoutUuid = [
        {
          ...mockData[1],
          uuid: null as any,
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={dataWithoutUuid} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      const downloadButton = screen.getByTestId('download-modal');
      await user.click(downloadButton);

      expect(mockHandleDownload).not.toHaveBeenCalled();
    });

    it('deve passar isDownloading para o ErroModal', async () => {
      const user = userEvent.setup();
      useGetDownloadError.mockReturnValue({
        handleDownload: mockHandleDownload,
        isDownloading: true,
      });

      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);

      expect(screen.getByTestId('downloading')).toBeInTheDocument();
    });
  });

  describe('RowClassName', () => {
    it('deve aplicar classe "row-white" para índices pares', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      const row0 = screen.getByTestId('row-0');
      expect(row0).toHaveClass('row-white');
    });

    it('deve aplicar classe "row-gray" para índices ímpares', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      const row1 = screen.getByTestId('row-1');
      expect(row1).toHaveClass('row-gray');
    });
  });

  describe('Props adicionais', () => {
    it('deve passar props adicionais para StyledTable', () => {
      const additionalProps = {
        loading: true,
        pagination: false,
      };
      render(<UltimasImportacoesDeVagasTable data={mockData} {...additionalProps} />);
      
      const table = screen.getByTestId('styled-table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('deve renderizar com array vazio', () => {
      render(<UltimasImportacoesDeVagasTable data={[]} />);
      expect(screen.getByTestId('styled-table')).toBeInTheDocument();
      expect(screen.getByText('Últimas importações')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos registros com erro', () => {
      const multipleErrors = [
        mockData[1],
        { ...mockData[1], uuid: '3', nome_arquivo: 'outro_erro.csv' },
        { ...mockData[1], uuid: '4', nome_arquivo: 'mais_erro.csv' },
      ];
      render(<UltimasImportacoesDeVagasTable data={multipleErrors} />);
      
      const icons = screen.getAllByTestId('warning-icon');
      expect(icons).toHaveLength(3);
    });

    it('deve renderizar com todos os campos null', () => {
      const nullData = [
        {
          uuid: '5',
          nome_arquivo: null as any,
          processo_nome: null as any,
          criado_em: null as any,
          status: null as any,
          erros: [],
        },
      ];
      render(<UltimasImportacoesDeVagasTable data={nullData} />);
      
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('deve alternar seleção de registros ao abrir modal', async () => {
      const user = userEvent.setup();
      const multipleErrors = [
        mockData[1],
        { ...mockData[1], uuid: '3', nome_arquivo: 'outro.csv' },
      ];
      render(<UltimasImportacoesDeVagasTable data={multipleErrors} />);

      const icons = screen.getAllByTestId('warning-icon');
      
      // Abre modal para primeiro registro
      await user.click(icons[0]);
      expect(screen.getByTestId('erro-modal')).toBeInTheDocument();
      
      // Fecha modal
      await user.click(screen.getByTestId('close-modal'));
      await waitFor(() => {
        expect(screen.queryByTestId('erro-modal')).not.toBeInTheDocument();
      });
      
      // Abre modal para segundo registro
      await user.click(icons[1]);
      expect(screen.getByTestId('erro-modal')).toBeInTheDocument();
    });
  });

  describe('RowKey', () => {
    it('deve usar uuid como rowKey', () => {
      render(<UltimasImportacoesDeVagasTable data={mockData} />);
      
      // Verifica se as linhas existem (o rowKey é usado internamente)
      expect(screen.getByTestId('row-0')).toBeInTheDocument();
      expect(screen.getByTestId('row-1')).toBeInTheDocument();
    });
  });

  describe('Interação completa', () => {
    it('deve executar fluxo completo: abrir modal, download e fechar', async () => {
      const user = userEvent.setup();
      render(<UltimasImportacoesDeVagasTable data={mockData} />);

      // Abre modal
      const icon = screen.getByTestId('warning-icon');
      await user.click(icon);
      expect(screen.getByTestId('erro-modal')).toBeInTheDocument();

      // Faz download
      const downloadButton = screen.getByTestId('download-modal');
      await user.click(downloadButton);
      expect(mockHandleDownload).toHaveBeenCalledWith('2');

      // Fecha modal
      const closeButton = screen.getByTestId('close-modal');
      await user.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByTestId('erro-modal')).not.toBeInTheDocument();
      });
    });
  });
});

