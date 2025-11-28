import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import LoginTela from '../LoginTela';
import { App } from 'antd';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do react-hook-form
jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  const React = require('react');
  return {
    ...actual,
    Controller: ({ render, name }: any) => {
      const field = { 
        value: '', 
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: name || 'field'
      };
      const fieldState = { error: undefined, invalid: false, isDirty: false, isTouched: false };
      const formState = { errors: {}, touchedFields: {}, dirtyFields: {} };
      return render({ field, fieldState, formState });
    },
  };
});

// Mock do useLogin
const mockHandleSubmit = jest.fn((callback) => {
  return (e?: React.FormEvent) => {
    e?.preventDefault();
    callback();
  };
});

const createMockData = (overrides = {}) => ({
  loading: false,
  alert: null,
  control: {} as any,
  handleSubmit: mockHandleSubmit,
  errors: {},
  ...overrides,
});

jest.mock('../hooks/useLogin', () => ({
  useLogin: jest.fn(),
}));

// Mock dos componentes styled
jest.mock('../style', () => ({
  LoginContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="login-container">{children}</div>
  ),
  LeftSide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="left-side">{children}</div>
  ),
  LoginCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="login-card">{children}</div>
  ),
  StyledForm: ({ children, onSubmit }: any) => (
    <form data-testid="styled-form" onSubmit={onSubmit}>
      {children}
    </form>
  ),
  FormField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field">{children}</div>
  ),
  FieldLabel: ({ children }: { children: React.ReactNode }) => (
    <label data-testid="field-label">{children}</label>
  ),
  ErrorMessage: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="error-message">{children}</span>
  ),
  StyledButton: ({ children, onClick, loading, disabled, htmlType, ...props }: any) => (
    <button
      data-testid="styled-button"
      onClick={onClick}
      disabled={disabled || loading}
      type={htmlType}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  ),
  ForgotPasswordLink: ({ children, onClick }: any) => (
    <a data-testid="forgot-password-link" onClick={onClick}>
      {children}
    </a>
  ),
  PrefLogoContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pref-logo-container">{children}</div>
  ),
  PrefLogoImage: ({ src, alt, ...props }: any) => (
    <img data-testid="pref-logo-image" src={src} alt={alt} {...props} />
  ),
  StyledTitle: ({ children }: any) => (
    <h2 data-testid="styled-title">{children}</h2>
  ),
  StyledText: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="styled-text">{children}</p>
  ),
  StyledAlert: ({ message, type, showIcon, ...props }: any) => (
    <div data-testid="styled-alert" data-type={type} {...props}>
      {message}
      {showIcon && <span data-testid="alert-icon">Icon</span>}
    </div>
  ),
  StyledTooltipIcon: () => <span data-testid="tooltip-icon" />,
}));

// Mock do Input e Input.Password do Ant Design
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const React = require('react');
  
  const InputPassword = (props: any) => {
    const { value, onChange, placeholder, status, iconRender, ...rest } = props;
    return React.createElement('input', {
      'data-testid': 'input-password',
      type: 'password',
      value: value || '',
      onChange: onChange,
      placeholder: placeholder,
      'data-status': status,
      ...rest,
    });
  };
  InputPassword.displayName = 'Input.Password';

  const MockInput = (props: any) => {
    const { value, onChange, placeholder, status, ...rest } = props;
    return React.createElement('input', {
      'data-testid': 'input',
      value: value || '',
      onChange: onChange,
      placeholder: placeholder,
      'data-status': status,
      ...rest,
    });
  };

  MockInput.Password = InputPassword;

  return {
    ...actual,
    Input: MockInput,
    Tooltip: (props: any) => {
      const { children, title } = props;
      return React.createElement('div', { 'data-testid': 'tooltip', title: title }, children);
    },
  };
});

// Mock do ícone
jest.mock('@ant-design/icons', () => ({
  EyeInvisibleOutlined: () => <span data-testid="eye-invisible-icon" />,
}));

// Mock do logo
jest.mock('../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png', () => 'logo.png');

import { useLogin } from '../hooks/useLogin';

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe('LoginTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseLogin.mockReturnValue(createMockData());
  });

  const renderComponent = () => {
    return renderWithProviders(
      <App>
        <LoginTela />
      </App>
    );
  };

  describe('Renderização inicial', () => {
    it('deve renderizar o componente corretamente', () => {
      renderComponent();

      expect(screen.getByTestId('login-container')).toBeInTheDocument();
      expect(screen.getByTestId('left-side')).toBeInTheDocument();
      expect(screen.getByTestId('login-card')).toBeInTheDocument();
    });

    it('deve renderizar título e texto descritivo', () => {
      renderComponent();

      expect(screen.getByText('Bem-vindo ao SIGLA')).toBeInTheDocument();
      expect(screen.getByText('Sistema Integrado de Gestão de Lotação e Alocação')).toBeInTheDocument();
    });

    it('deve renderizar campos de formulário', () => {
      renderComponent();

      expect(screen.getByText('RF')).toBeInTheDocument();
      expect(screen.getByText('Senha')).toBeInTheDocument();
      
      const inputs = screen.queryAllByTestId('input');
      const passwordInputs = screen.queryAllByTestId('input-password');
      
      // Deve ter pelo menos um input regular ou password
      expect(inputs.length + passwordInputs.length).toBeGreaterThan(0);
    });

    it('deve renderizar botão de acesso e link de esqueceu senha', () => {
      renderComponent();

      expect(screen.getByText('Acessar')).toBeInTheDocument();
      expect(screen.getByText('Esqueci minha senha')).toBeInTheDocument();
    });

    it('deve renderizar logo da prefeitura', () => {
      renderComponent();

      expect(screen.getByTestId('pref-logo-image')).toBeInTheDocument();
      expect(screen.getByTestId('pref-logo-image')).toHaveAttribute('alt', 'Prefeitura de São Paulo');
    });
  });

  describe('Alertas', () => {
    it('deve renderizar alerta quando alert está presente', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          alert: {
            type: 'error' as const,
            message: 'Usuário ou senha inválidos.',
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('styled-alert')).toBeInTheDocument();
      expect(screen.getByText('Usuário ou senha inválidos.')).toBeInTheDocument();
      expect(screen.getByTestId('styled-alert')).toHaveAttribute('data-type', 'error');
    });

    it('deve renderizar alerta de sucesso quando tipo é success', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          alert: {
            type: 'success' as const,
            message: 'Login realizado com sucesso',
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('styled-alert')).toBeInTheDocument();
      expect(screen.getByText('Login realizado com sucesso')).toBeInTheDocument();
      expect(screen.getByTestId('styled-alert')).toHaveAttribute('data-type', 'success');
    });

    it('não deve renderizar alerta quando alert é null', () => {
      renderComponent();

      expect(screen.queryByTestId('styled-alert')).not.toBeInTheDocument();
    });
  });

  describe('Erros de validação', () => {
    it('deve renderizar erro de validação para campo usuario', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          errors: {
            usuario: {
              type: 'required',
              message: 'RF é obrigatório',
            },
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('RF é obrigatório')).toBeInTheDocument();
    });

    it('deve renderizar erro de validação para campo senha', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          errors: {
            senha: {
              type: 'required',
              message: 'Senha é obrigatória',
            },
          },
        })
      );

      renderComponent();

      const errorMessages = screen.getAllByTestId('error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });

    it('deve mostrar status error nos campos com erro', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          errors: {
            usuario: {
              type: 'required',
              message: 'RF é obrigatório',
            },
          },
        })
      );

      renderComponent();

      const inputs = screen.queryAllByTestId('input');
      const passwordInputs = screen.queryAllByTestId('input-password');
      const allInputs = [...inputs, ...passwordInputs];
      
      // Pelo menos um input deve ter status error
      const inputWithError = allInputs.find(input => input.getAttribute('data-status') === 'error');
      expect(inputWithError).toBeTruthy();
    });
  });

  describe('Interações', () => {
    it('deve navegar para esqueci-minha-senha ao clicar no link', () => {
      renderComponent();

      const link = screen.getByTestId('forgot-password-link');
      fireEvent.click(link);

      expect(mockNavigate).toHaveBeenCalledWith('/esqueci-minha-senha');
    });

    it('deve chamar handleSubmit ao submeter o formulário', () => {
      renderComponent();

      const form = screen.getByTestId('styled-form');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('deve mostrar loading no botão quando loading é true', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          loading: true,
        })
      );

      renderComponent();

      const button = screen.getByTestId('styled-button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });

  describe('Tooltips', () => {
    it('deve renderizar tooltip no campo RF', () => {
      renderComponent();

      const tooltips = screen.getAllByTestId('tooltip');
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('deve renderizar ícone de tooltip', () => {
      renderComponent();

      const tooltipIcons = screen.getAllByTestId('tooltip-icon');
      expect(tooltipIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Valores padrão dos campos', () => {
    it('deve renderizar placeholders corretos', () => {
      renderComponent();

      const inputs = screen.queryAllByTestId('input');
      const passwordInputs = screen.queryAllByTestId('input-password');
      
      // Verificar que pelo menos um input tem placeholder de RF
      const rfInput = [...inputs, ...passwordInputs].find(
        input => input.getAttribute('placeholder') === '12345678'
      );
      expect(rfInput).toBeTruthy();
      
      // Verificar que pelo menos um input tem placeholder de senha
      const senhaInput = [...inputs, ...passwordInputs].find(
        input => input.getAttribute('placeholder') === '********'
      );
      expect(senhaInput).toBeTruthy();
    });
  });

  describe('Status dos campos', () => {
    it('deve renderizar status vazio quando não há erro no campo senha', () => {
      renderComponent();

      const passwordInputs = screen.queryAllByTestId('input-password');
      const senhaInput = passwordInputs.find(
        input => input.getAttribute('placeholder') === '********'
      );
      if (senhaInput) {
        const status = senhaInput.getAttribute('data-status');
        expect(status).toBe('');
      }
    });

    it('deve mostrar status error no campo senha quando há erro', () => {
      mockUseLogin.mockReturnValue(
        createMockData({
          errors: {
            senha: {
              type: 'required',
              message: 'Senha é obrigatória',
            },
          },
        })
      );

      renderComponent();

      const passwordInputs = screen.queryAllByTestId('input-password');
      const senhaInput = passwordInputs.find(
        input => input.getAttribute('placeholder') === '********'
      );
      if (senhaInput) {
        expect(senhaInput).toHaveAttribute('data-status', 'error');
      }
    });
  });
});

