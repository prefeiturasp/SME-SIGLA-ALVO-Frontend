import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock do react-image-crop: renderiza os filhos (a <img>) e expoe um botao
// para simular a conclusao de um recorte (onComplete com um PixelCrop valido).
jest.mock('react-image-crop', () => {
  // Mantem as funcoes utilitarias reais (centerCrop/makeAspectCrop/
  // convertToPixelCrop) usadas na pre-selecao; mocka apenas o componente.
  const actual = jest.requireActual('react-image-crop');
  const MockReactCrop = ({ children, onComplete, aspect, circularCrop }: any) => (
    <div
      data-testid="react-crop"
      data-aspect={aspect ?? 'livre'}
      data-circular={circularCrop ? 'true' : 'false'}
    >
      {children}
      <button
        type="button"
        data-testid="simular-recorte"
        onClick={() =>
          onComplete?.({ unit: 'px', x: 10, y: 10, width: 100, height: 80 })
        }
      >
        simular recorte
      </button>
    </div>
  );
  return { __esModule: true, ...actual, default: MockReactCrop };
});

import CropImageModal from '../CropImageModal';

describe('CropImageModal', () => {
  const defaultProps = {
    open: true,
    imagemSrc: 'data:image/png;base64,abc',
    onClose: jest.fn(),
    onConfirmar: jest.fn(),
  };

  let toBlobMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Stub do canvas: getContext (drawImage) e toBlob (gera um Blob).
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage: jest.fn() } as unknown as CanvasRenderingContext2D);

    toBlobMock = jest.fn((cb: BlobCallback) => {
      cb(new Blob(['conteudo'], { type: 'image/png' }));
    });
    HTMLCanvasElement.prototype.toBlob = toBlobMock as unknown as HTMLCanvasElement['toBlob'];

    // Dimensoes nao existem no JSDOM por padrao; necessarias para a
    // pre-selecao centralizada (onLoad) e para o calculo do recorte.
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 400,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      configurable: true,
      get: () => 300,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'width', {
      configurable: true,
      get: () => 400,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'height', {
      configurable: true,
      get: () => 300,
    });
  });

  const simularRecorte = () =>
    fireEvent.click(screen.getByTestId('simular-recorte'));

  const carregarImagem = () =>
    fireEvent.load(screen.getByAltText('Imagem para recorte'));

  it('deve exibir a imagem quando aberto', () => {
    render(<CropImageModal {...defaultProps} />);
    expect(screen.getByAltText('Imagem para recorte')).toHaveAttribute(
      'src',
      'data:image/png;base64,abc',
    );
  });

  it('deve usar recorte livre quando aspect nao e informado', () => {
    render(<CropImageModal {...defaultProps} />);
    expect(screen.getByTestId('react-crop')).toHaveAttribute('data-aspect', 'livre');
    expect(screen.getByTestId('react-crop')).toHaveAttribute('data-circular', 'false');
  });

  it('deve repassar aspect e circular quando informados', () => {
    render(<CropImageModal {...defaultProps} aspect={1} circular />);
    expect(screen.getByTestId('react-crop')).toHaveAttribute('data-aspect', '1');
    expect(screen.getByTestId('react-crop')).toHaveAttribute('data-circular', 'true');
  });

  it('deve manter Confirmar desabilitado antes de carregar a imagem', () => {
    render(<CropImageModal {...defaultProps} />);
    expect(screen.getByText('Confirmar').closest('button')).toBeDisabled();
  });

  it('deve habilitar Confirmar com a pre-selecao ao carregar a imagem', () => {
    render(<CropImageModal {...defaultProps} />);
    const confirmar = screen.getByText('Confirmar').closest('button');
    expect(confirmar).toBeDisabled();

    carregarImagem();
    expect(confirmar).not.toBeDisabled();
  });

  it('deve habilitar Confirmar apos um recorte manual', () => {
    render(<CropImageModal {...defaultProps} />);
    const confirmar = screen.getByText('Confirmar').closest('button');

    simularRecorte();
    expect(confirmar).not.toBeDisabled();
  });

  it('deve gerar um File e chamar onConfirmar ao confirmar a pre-selecao', async () => {
    const onConfirmar = jest.fn();
    render(
      <CropImageModal {...defaultProps} onConfirmar={onConfirmar} nomeArquivo="logo.png" />,
    );

    carregarImagem();
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => expect(onConfirmar).toHaveBeenCalledTimes(1));
    const arquivo = onConfirmar.mock.calls[0][0];
    expect(arquivo).toBeInstanceOf(File);
    expect(arquivo.name).toBe('logo.png');
    expect(toBlobMock).toHaveBeenCalled();
  });

  it('deve chamar onClose ao cancelar', () => {
    const onClose = jest.fn();
    render(<CropImageModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
