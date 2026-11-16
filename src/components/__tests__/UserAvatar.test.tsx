import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserAvatar } from '../UserAvatar';

const mockNavigate = jest.fn();
const mockEncerrarSessao = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/utils/autenticacao', () => ({
  encerrarSessao: (...args: unknown[]) => mockEncerrarSessao(...args),
}));

const renderizar = () =>
  render(
    <MemoryRouter>
      <UserAvatar />
    </MemoryRouter>
  );

describe('UserAvatar', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockEncerrarSessao.mockClear();
  });

  it('mostra RF e nome do usuário logado', () => {
    localStorage.setItem('USUARIO', '1234567');
    localStorage.setItem('NOME_USUARIO', 'Marcus Paulo de Souza Andrade');

    renderizar();

    expect(screen.getByText('RF: 1234567')).toBeInTheDocument();
    expect(
      screen.getByText('Marcus Paulo de Souza Andrade')
    ).toBeInTheDocument();
  });

  it('mostra "Usuário" quando o nome não está salvo', () => {
    localStorage.setItem('USUARIO', '7654321');

    renderizar();

    expect(screen.getByText('RF: 7654321')).toBeInTheDocument();
    expect(screen.getByText('Usuário')).toBeInTheDocument();
  });

  it('leva para Meus Dados ao clicar no bloco do usuário', () => {
    renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Dados do usuário' }));

    expect(mockNavigate).toHaveBeenCalledWith('/meus-dados');
  });

  it('encerra a sessão ao clicar em Sair', () => {
    localStorage.setItem('TOKEN', 'token');
    localStorage.setItem('USUARIO', '1234567');
    localStorage.setItem('NOME_USUARIO', 'Marcus');

    renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(mockEncerrarSessao).toHaveBeenCalled();
  });
});
