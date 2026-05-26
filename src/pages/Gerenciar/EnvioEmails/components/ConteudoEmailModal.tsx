import React from "react";
import { CustomModal2 } from "../../../../components/EstilosCompartilhados";

import logoEnvioEmail from "../assets/logo_envio_email.png";

interface ConteudoEmailModalProps {
  open: boolean;
  onClose: () => void;
  nomeCandidato?: string;
  conteudo: string;
  status?: string;
  statusDetalhe?: string;
}

const ConteudoEmailModal: React.FC<ConteudoEmailModalProps> = ({
  open,
  onClose,
  nomeCandidato,
  conteudo,
  status,
  statusDetalhe,
}) => {
  const title = nomeCandidato
    ? `E-mail enviado para ${nomeCandidato}`
    : "Conteúdo do e-mail";

  const isErroEmailDuplicado = status === "ERRO" && statusDetalhe;

  const conteudoComLogo =
    typeof conteudo === "string"
      ? conteudo
          .replace(/src="cid:logo_sigla"/g, `src="${logoEnvioEmail}"`)
          .replace(/src='cid:logo_sigla'/g, `src="${logoEnvioEmail}"`)
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
      {isErroEmailDuplicado && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: 8,
            color: "#cf1322",
          }}
        >
          {statusDetalhe}
        </div>
      )}
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
