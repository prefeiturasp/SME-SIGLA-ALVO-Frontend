import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserAvatar } from '../UserAvatar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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
  });

  it('mostra RF e nome do usuário logado', () => {
    localStorage.setItem('RF_USUARIO', '1234567');
    localStorage.setItem('USUARIO', 'login-qualquer');
    localStorage.setItem('NOME_USUARIO', 'Marcus Paulo de Souza Andrade');

    renderizar();

    expect(screen.getByText('RF: 1234567')).toBeInTheDocument();
    expect(
      screen.getByText('Marcus Paulo de Souza Andrade')
    ).toBeInTheDocument();
  });

  it('usa USUARIO como RF quando RF_USUARIO não existe', () => {
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

  it('limpa a sessão e volta para o login ao clicar em Sair', () => {
    localStorage.setItem('TOKEN', 'token');
    localStorage.setItem('USUARIO', '1234567');
    localStorage.setItem('RF_USUARIO', '1234567');
    localStorage.setItem('NOME_USUARIO', 'Marcus');

    renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(localStorage.getItem('TOKEN')).toBeNull();
    expect(localStorage.getItem('USUARIO')).toBeNull();
    expect(localStorage.getItem('RF_USUARIO')).toBeNull();
    expect(localStorage.getItem('NOME_USUARIO')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
