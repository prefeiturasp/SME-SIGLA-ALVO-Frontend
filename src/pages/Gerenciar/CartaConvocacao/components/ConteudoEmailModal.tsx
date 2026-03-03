import React from "react";
import { CustomModal2 } from "../../../../components/EstilosCompartilhados";

import logoCartaConvocacao from "../assets/logo_carta_convocacao.png";

interface ConteudoEmailModalProps {
  open: boolean;
  onClose: () => void;
  nomeCandidato?: string;
  conteudo: string;
}

const ConteudoEmailModal: React.FC<ConteudoEmailModalProps> = ({
  open,
  onClose,
  nomeCandidato,
  conteudo,
}) => {
  const title = nomeCandidato
    ? `E-mail enviado para ${nomeCandidato}`
    : "Conteúdo do e-mail";

  const conteudoComLogo =
    typeof conteudo === "string"
      ? conteudo
          .replace(/src="cid:logo_sigla"/g, `src="${logoCartaConvocacao}"`)
          .replace(/src='cid:logo_sigla'/g, `src="${logoCartaConvocacao}"`)
      : "";

  return (
    <CustomModal2
      className="conteudo-email-modal"
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={960}
    >
      <style>{`
        .conteudo-email-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
      <div
        style={{
          maxHeight: "70vh",
          overflow: "auto",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 16,
          background: "#fff",
        }}
      >
        {conteudoComLogo ? (
          <div dangerouslySetInnerHTML={{ __html: conteudoComLogo }} />
        ) : (
          <span style={{ color: "#999" }}>Nenhum conteúdo disponível.</span>
        )}
      </div>
    </CustomModal2>
  );
};

export default ConteudoEmailModal;
