import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonCounter } from './Button';

describe('ButtonCounter', () => {
  it('renderiza contador inicial como 0', () => {
    render(<ButtonCounter />);
    expect(screen.getByText(/Contador: 0/i)).toBeInTheDocument();
  });

  it('incrementa contador ao clicar', async () => {
    render(<ButtonCounter />);
    const button = screen.getByRole('button', { name: /increment-button/i });

    await userEvent.click(button);
    expect(screen.getByText(/Contador: 1/i)).toBeInTheDocument();

    await userEvent.click(button);
    expect(screen.getByText(/Contador: 2/i)).toBeInTheDocument();
  });
});
