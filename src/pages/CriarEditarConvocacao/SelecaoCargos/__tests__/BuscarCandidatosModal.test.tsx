import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { message } from 'antd';
import BuscarCandidatosModal from '../BuscarCandidatosModal';

const mockUseGetCandidatos = jest.fn();
const mockUseGetCandidatosReposicao = jest.fn();
const mockUseGetCandidatosReconvocacao = jest.fn();
const mockUseGetCandidatosCalculados = jest.fn();
const mockUseGetVagasPorProcessoECargo = jest.fn();

jest.mock('../hooks/useGetCandidatos', () => ({
  useGetCandidatos: (...args: unknown[]) => mockUseGetCandidatos(...args),
}));
jest.mock('../hooks/useGetCandidatosReposicao', () => ({
  useGetCandidatosReposicao: (...args: unknown[]) => mockUseGetCandidatosReposicao(...args),
}));
jest.mock('../hooks/useGetCandidatosReconvocacao', () => ({
  useGetCandidatosReconvocacao: (...args: unknown[]) => mockUseGetCandidatosReconvocacao(...args),
}));
jest.mock('../hooks/useGetCandidatosCalculados', () => ({
  useGetCandidatosCalculados: (...args: unknown[]) => mockUseGetCandidatosCalculados(...args),
}));
jest.mock('../hooks/useGetVagasPorProcessoECargo', () => ({
  useGetVagasPorProcessoECargo: (...args: unknown[]) => mockUseGetVagasPorProcessoECargo(...args),
}));

describe('BuscarCandidatosModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSelecionados = jest.fn();
  const mockOnUuidsChange = jest.fn();
  const mockFetchCandidatosNow = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    concurso: 'Concurso SME',
    concursoValue: 'conc-1',
    cargo: 'Professor',
    cargoCodigo: 'P001',
    cargoUuid: 'cargo-1',
    processoUuid: 'proc-1',
    tipoEscolha: 'ESCOLHA',
    onCandidatosSelecionados: mockOnSelecionados,
    onCandidatosUuidsChange: mockOnUuidsChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGetVagasPorProcessoECargo.mockReturnValue({
      vagasIsLoading: false,
      totalVagas: 5,
    });

    mockUseGetCandidatos.mockReturnValue({
      candidatosData: null,
      candidatosIsLoading: false,
      fetchCandidatosNow: mockFetchCandidatosNow,
    });
    mockUseGetCandidatosReposicao.mockReturnValue({
      candidatosData: null,
      candidatosIsLoading: false,
    });
    mockUseGetCandidatosReconvocacao.mockReturnValue({
      candidatosData: null,
      candidatosIsLoading: false,
    });
    mockUseGetCandidatosCalculados.mockReturnValue({
      candidatosData: null,
      candidatosIsLoading: false,
    });

    jest.spyOn(message, 'error').mockImplementation(jest.fn());
    jest.spyOn(message, 'warning').mockImplementation(jest.fn());
  });

  it('renderiza dados principais e bloqueia busca com total zerado', async () => {
    const user = userEvent.setup();
    render(<BuscarCandidatosModal {...defaultProps} />);

    expect(screen.getByText('Concurso SME')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /buscar/i }));
    expect(message.error).toHaveBeenCalledWith('Preencha pelo menos um campo de autorização');
  });

  it('valida entrada numérica e mostra aviso ao digitar caractere inválido', async () => {
    const user = userEvent.setup();
    render(<BuscarCandidatosModal {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText('00');
    await user.type(inputs[0], '12abc');
    expect(inputs[0]).toHaveValue('12');

    await user.keyboard('{a}');
    expect(message.warning).toHaveBeenCalledWith('Digite apenas números');
  });

  it('executa fluxo digitado padrão, busca e adiciona ao cargo', async () => {
    const user = userEvent.setup();
    const candidatosResponse = {
      results: [
        { candidato: { uuid: 'c1', nome: 'Ana' }, categoria_efetiva: 'GERAL', classificacao: '1' },
        { candidato: { uuid: 'c2', nome: 'Bia' }, categoria_efetiva: 'PCD', classificacao_pcd: '1' },
        { candidato: { uuid: 'c3', nome: 'Caio' }, categoria_efetiva: 'NNA', classificacao_nna: '1' },
      ],
    };

    mockFetchCandidatosNow.mockResolvedValue(candidatosResponse);
    mockUseGetCandidatos.mockReturnValue({
      candidatosData: candidatosResponse,
      candidatosIsLoading: false,
      fetchCandidatosNow: mockFetchCandidatosNow,
    });

    render(<BuscarCandidatosModal {...defaultProps} />);

    const [geralInput, pcdInput, nnaInput] = screen.getAllByPlaceholderText('00');
    await user.type(geralInput, '1');
    await user.type(pcdInput, '1');
    await user.type(nnaInput, '1');

    await user.click(screen.getByRole('button', { name: /buscar/i }));

    await waitFor(() => {
      expect(mockFetchCandidatosNow).toHaveBeenCalledWith({
        geral: 1,
        pcd: 1,
        nna: 1,
        concurso_uuid: 'conc-1',
      });
      expect(mockOnUuidsChange).toHaveBeenCalledWith('cargo-1', ['c1', 'c2', 'c3']);
    });

    await user.click(screen.getByRole('button', { name: 'Adicionar ao cargo' }));
    expect(mockOnSelecionados).toHaveBeenCalledWith(3, { geral: 1, pcd: 1, nna: 1 }, 5, ['c1', 'c2', 'c3']);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('para reposicao, exige concurso e processa UUIDs do hook especifico', async () => {
    const user = userEvent.setup();
    const reposicaoData = [
      { uuid: 'r1', candidato: { uuid: 'r1', nome: 'R1' }, categoria_efetiva: 'GERAL' },
      { uuid: 'r2', candidato: { uuid: 'r2', nome: 'R2' }, categoria_efetiva: 'PCD' },
    ];
    mockUseGetCandidatosReposicao.mockReturnValue({
      candidatosData: reposicaoData,
      candidatosIsLoading: false,
    });

    const { rerender } = render(<BuscarCandidatosModal {...defaultProps} tipoEscolha="REPOSICAO" concursoValue={undefined} />);
    const [missingConcursoInput] = screen.getAllByPlaceholderText('00');
    await user.type(missingConcursoInput, '1');
    await user.click(screen.getByRole('button', { name: /buscar/i }));
    expect(message.error).toHaveBeenCalledWith('Concurso não informado');

    rerender(<BuscarCandidatosModal {...defaultProps} tipoEscolha="REPOSICAO" />);
    const [geralInput] = screen.getAllByPlaceholderText('00');
    await user.clear(geralInput);
    await user.type(geralInput, '2');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    await waitFor(() => {
      expect(mockOnUuidsChange).toHaveBeenCalledWith('cargo-1', ['r1', 'r2']);
    });
  });

  it('cobre reconvocacao, alterna tipo de convocacao e processa UUIDs de reconvocacao', async () => {
    const user = userEvent.setup();
    const reconvocacaoData = [
      { uuid: 'rc1', candidato: { uuid: 'rc1', nome: 'RC1' }, categoria_efetiva: 'GERAL' },
      { uuid: 'rc2', candidato: { uuid: 'rc2', nome: 'RC2' }, categoria_efetiva: 'PCD' },
    ];
    mockUseGetCandidatosReconvocacao.mockReturnValue({
      candidatosData: reconvocacaoData,
      candidatosIsLoading: false,
    });

    const { rerender } = render(<BuscarCandidatosModal {...defaultProps} tipoEscolha="RECONVOCAO" concursoValue={undefined} />);
    const [reconvInput] = screen.getAllByPlaceholderText('00');
    await user.type(reconvInput, '2');
    await user.click(screen.getByRole('button', { name: /buscar/i }));
    expect(message.error).toHaveBeenCalledWith('Concurso não informado');

    rerender(<BuscarCandidatosModal {...defaultProps} tipoEscolha="RECONVOCAO" />);
    const [reconvInputWithConcurso] = screen.getAllByPlaceholderText('00');
    await user.clear(reconvInputWithConcurso);
    await user.type(reconvInputWithConcurso, '2');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    await waitFor(() => {
      expect(mockOnUuidsChange).toHaveBeenCalledWith('cargo-1', ['rc1', 'rc2']);
    });

    rerender(<BuscarCandidatosModal {...defaultProps} tipoEscolha="ESCOLHA" />);
    await user.click(screen.getByRole('radio', { name: 'Calculada' }));
    expect(screen.getByText('Lista de Convocados por autorizações calculadas')).toBeInTheDocument();
  });

  it('para nova autorizacao calculada usa contagem por categoria ao adicionar', async () => {
    const user = userEvent.setup();
    const calculados = {
      results: [
        { uuid: 'n1', candidato: { nome: 'N1' }, categoria_efetiva: 'GERAL' },
        { uuid: 'n2', candidato: { nome: 'N2' }, categoria_efetiva: 'PCD' },
        { uuid: 'n3', candidato: { nome: 'N3' }, categoria_efetiva: 'NNA' },
      ],
    };
    mockUseGetCandidatosCalculados.mockReturnValue({
      candidatosData: calculados,
      candidatosIsLoading: false,
    });

    render(<BuscarCandidatosModal {...defaultProps} tipoEscolha="NOVA_AUTORIZACAO" />);

    const [quantidadeInput] = screen.getAllByPlaceholderText('00');
    await user.type(quantidadeInput, '3');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    await user.click(screen.getByRole('button', { name: 'Adicionar ao cargo' }));
    expect(mockOnSelecionados).toHaveBeenCalledWith(3, { geral: 1, pcd: 1, nna: 1 }, 5, ['n1', 'n2', 'n3']);
  });

  it('impede adicionar quando total excede vagas', async () => {
    const user = userEvent.setup();
    mockUseGetVagasPorProcessoECargo.mockReturnValue({
      vagasIsLoading: false,
      totalVagas: 1,
    });
    mockUseGetCandidatos.mockReturnValue({
      candidatosData: { results: [{ candidato: { uuid: 'x1', nome: 'X' }, categoria_efetiva: 'GERAL' }] },
      candidatosIsLoading: false,
      fetchCandidatosNow: mockFetchCandidatosNow,
    });
    mockFetchCandidatosNow.mockResolvedValue({
      results: [{ candidato: { uuid: 'x1', nome: 'X' }, categoria_efetiva: 'GERAL' }],
    });

    render(<BuscarCandidatosModal {...defaultProps} />);
    const [geralInput] = screen.getAllByPlaceholderText('00');
    await user.type(geralInput, '2');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(message.error).toHaveBeenCalledWith('Total de vagas excedido');
  });

  it('reseta estado ao fechar e preenche estado ao editar', async () => {
    const user = userEvent.setup();
    const candidatosResponse = {
      results: [{ candidato: { uuid: 'z1', nome: 'Zoe' }, categoria_efetiva: 'GERAL', classificacao: '1' }],
    };
    mockUseGetCandidatos.mockReturnValue({
      candidatosData: candidatosResponse,
      candidatosIsLoading: false,
      fetchCandidatosNow: mockFetchCandidatosNow,
    });
    mockFetchCandidatosNow.mockResolvedValue(candidatosResponse);

    const { rerender } = render(<BuscarCandidatosModal {...defaultProps} />);
    const [geralInput] = screen.getAllByPlaceholderText('00');
    await user.type(geralInput, '1');
    await user.click(screen.getByRole('button', { name: /buscar/i }));
    expect(screen.getByText('Lista de Convocados por autorizações digitadas')).toBeInTheDocument();

    rerender(<BuscarCandidatosModal {...defaultProps} visible={false} />);
    rerender(
      <BuscarCandidatosModal
        {...defaultProps}
        visible
        cargoEmEdicao={{ geral: 2, pcd: 1, nna: 1 }}
        tipoEscolha="NOVA_AUTORIZACAO"
      />
    );
    const [editInput] = screen.getAllByPlaceholderText('00');
    expect(editInput).toHaveValue('4');
  });
});
