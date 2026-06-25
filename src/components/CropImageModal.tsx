import React, { useRef, useState } from "react";
import { Modal, Button } from "antd";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Tamanho inicial da pre-selecao, em % da menor dimensao da imagem.
const SELECAO_INICIAL_PORCENTAGEM = 80;

interface CropImageModalProps {
  /** Controla a exibicao do modal. */
  open: boolean;
  /** DataURL da imagem a ser recortada. */
  imagemSrc: string;
  /** Proporcao fixa do recorte. Omitido => recorte livre. */
  aspect?: number;
  /** Renderiza o recorte de forma circular. */
  circular?: boolean;
  /** Titulo exibido no cabecalho do modal. */
  titulo?: string;
  /** Nome do arquivo gerado ao confirmar. */
  nomeArquivo?: string;
  /** Exibe estado de carregamento no botao de confirmar. */
  carregando?: boolean;
  /** Chamado ao fechar/cancelar o modal. */
  onClose: () => void;
  /** Chamado com o arquivo recortado ao confirmar. */
  onConfirmar: (file: File) => void;
}

/**
 * Modal de recorte de imagem reutilizavel baseado em react-image-crop.
 *
 * O recorte e livre por padrao (sem proporcao fixa). Ao confirmar, desenha a
 * area selecionada num canvas convertendo para pixels naturais da imagem e
 * gera um File via canvas.toBlob.
 */
const CropImageModal: React.FC<CropImageModalProps> = ({
  open,
  imagemSrc,
  aspect,
  circular,
  titulo = "Recortar imagem",
  nomeArquivo = "imagem-recortada.png",
  carregando = false,
  onClose,
  onConfirmar,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [cropCompleto, setCropCompleto] = useState<PixelCrop | null>(null);
  const [gerando, setGerando] = useState<boolean>(false);

  const limparEstado = () => {
    setCrop(undefined);
    setCropCompleto(null);
  };

  // Cria uma pre-selecao centralizada assim que a imagem carrega, ja deixando
  // o "Confirmar" habilitado sem o usuario precisar desenhar o recorte.
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropInicial = centerCrop(
      makeAspectCrop(
        { unit: "%", width: SELECAO_INICIAL_PORCENTAGEM },
        aspect ?? width / height,
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(cropInicial);
    setCropCompleto(convertToPixelCrop(cropInicial, width, height));
  };

  const handleClose = () => {
    limparEstado();
    onClose();
  };

  const gerarArquivoRecortado = async (): Promise<File | null> => {
    const imagem = imgRef.current;
    if (!imagem || !cropCompleto || cropCompleto.width === 0 || cropCompleto.height === 0) {
      return null;
    }

    // Converte as coordenadas exibidas para os pixels naturais da imagem.
    const scaleX = imagem.naturalWidth / imagem.width;
    const scaleY = imagem.naturalHeight / imagem.height;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropCompleto.width * scaleX);
    canvas.height = Math.round(cropCompleto.height * scaleY);

    const contexto = canvas.getContext("2d");
    if (!contexto) {
      return null;
    }

    contexto.drawImage(
      imagem,
      cropCompleto.x * scaleX,
      cropCompleto.y * scaleY,
      cropCompleto.width * scaleX,
      cropCompleto.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        resolve(new File([blob], nomeArquivo, { type: blob.type || "image/png" }));
      }, "image/png");
    });
  };

  const handleConfirmar = async () => {
    setGerando(true);
    try {
      const arquivo = await gerarArquivoRecortado();
      if (arquivo) {
        onConfirmar(arquivo);
        limparEstado();
      }
    } finally {
      setGerando(false);
    }
  };

  const confirmarDesabilitado =
    !cropCompleto || cropCompleto.width === 0 || cropCompleto.height === 0;

  return (
    <Modal
      open={open}
      title={titulo}
      onCancel={handleClose}
      destroyOnClose
      maskClosable={false}
      footer={[
        <Button key="cancelar" onClick={handleClose}>
          Cancelar
        </Button>,
        <Button
          key="confirmar"
          type="primary"
          onClick={handleConfirmar}
          disabled={confirmarDesabilitado}
          loading={carregando || gerando}
        >
          Confirmar
        </Button>,
      ]}
    >
      {imagemSrc && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCropCompleto(pixelCrop)}
            aspect={aspect}
            circularCrop={circular}
          >
            <img
              ref={imgRef}
              src={imagemSrc}
              alt="Imagem para recorte"
              onLoad={handleImageLoad}
              style={{ maxWidth: "100%", maxHeight: "60vh" }}
            />
          </ReactCrop>
        </div>
      )}
    </Modal>
  );
};

export default CropImageModal;
