import React from "react";
import { Modal, Typography, Col, Button, Spin } from "antd";
import {
  ModalTitle,
  StyledRow,
  StyledTextArea,
  ErroContainer,
  ButtonsContainer,
} from "../../Vagas/components/style";

interface ErroModalProps {
  open: boolean;
  onClose: () => void;
  importacaoErro: {
    mensagem: string;
    erros: string;
  } | null;
  onDownload: () => void;
  isDownloading: boolean;
}

const ErroModal: React.FC<ErroModalProps> = ({
  open,
  onClose,
  importacaoErro,
  onDownload,
  isDownloading,
}) => {
  // Função para formatar erros de forma técnica mas compreensível
  const formatarErro = (erro: string): string => {
    if (!erro) return "";
    
    // Remover tracebacks e informações de debug muito técnicas
    let erroFormatado = erro
      .replace(/Traceback \(most recent call last\):.*?File.*?\n/g, "")
      .replace(/File ".*?", line \d+, in .*?\n/g, "")
      .replace(/^\s+/gm, "")
      .trim();
    
    // Mapear termos técnicos para linguagem mais compreensível
    const traducoes: Record<string, string> = {
      "DoesNotExist": "não foi encontrado",
      "MultipleObjectsReturned": "múltiplos registros encontrados",
      "ValidationError": "Erro de validação",
      "IntegrityError": "Erro de integridade de dados",
      "ConnectionError": "Erro de conexão",
      "Timeout": "Tempo de espera esgotado",
      "404": "Não encontrado",
      "400": "Requisição inválida",
      "500": "Erro interno do servidor",
      "401": "Não autorizado",
      "403": "Acesso negado",
      "API": "serviço externo",
      "endpoint": "serviço",
      "request": "requisição",
      "response": "resposta",
      "payload": "dados enviados",
      "uuid": "identificador",
      "CPF": "CPF",
      "EOL": "código EOL",
      "processo_uuid": "identificador do processo",
      "concurso_uuid": "identificador do concurso",
      "candidato_uuid": "identificador do candidato",
    };
    
    // Aplicar traduções
    Object.entries(traducoes).forEach(([tecnico, compreensivel]) => {
      const regex = new RegExp(tecnico, "gi");
      erroFormatado = erroFormatado.replace(regex, compreensivel);
    });
    
    // Processar erros separados por " | "
    const partes = erroFormatado.split(" | ");
    const partesFormatadas = partes.map((parte) => {
      // Limpar espaços extras
      parte = parte.trim();
      
      // Se a parte contém ":", formatar como "Campo: Descrição"
      if (parte.includes(":")) {
        const [campo, ...descricao] = parte.split(":");
        const descricaoCompleta = descricao.join(":").trim();
        
        // Traduzir nomes de campos comuns
        const camposTraduzidos: Record<string, string> = {
          "cpf": "CPF",
          "codigo_cargo": "Código do cargo",
          "codigo_eol": "Código EOL da escola",
          "tipo_vaga": "Tipo de vaga",
          "situacao": "Situação",
          "processo_uuid": "Processo de convocação",
          "concurso_uuid": "Concurso",
          "candidato_uuid": "Candidato",
        };
        
        const campoFormatado = camposTraduzidos[campo.toLowerCase()] || campo;
        
        return `${campoFormatado}: ${descricaoCompleta}`;
      }
      
      return parte;
    });
    
    // Remover partes vazias e duplicadas
    const partesUnicas = Array.from(new Set(partesFormatadas.filter(p => p.length > 0)));
    
    return partesUnicas.join("\n");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={<ModalTitle>Erros da Importação</ModalTitle>}
    >
      <Spin spinning={false}>
        <StyledRow gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Text strong>Mensagem:</Typography.Text>
            <StyledTextArea
              rows={3}
              value={importacaoErro?.mensagem || ""}
              placeholder="Mensagem de erro resumida"
              readOnly
            />
          </Col>
          <Col span={24}>
            <Typography.Text strong>Erro:</Typography.Text>
            <ErroContainer
              dangerouslySetInnerHTML={{
                __html: importacaoErro?.erros
                  ? formatarErro(importacaoErro.erros)
                      .split("\n")
                      .map((linha: string) => {
                        // Destacar campos/títulos em negrito
                        if (linha.includes(":")) {
                          return linha.replace(
                            /^([^:]+:)/,
                            '<strong>$1</strong>'
                          );
                        }
                        return linha;
                      })
                      .filter((linha: string) => linha.trim().length > 0)
                      .join("<br/>")
                  : "",
              }}
            />
          </Col>
        </StyledRow>
      </Spin>
      <ButtonsContainer>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="primary" 
          onClick={onDownload}
          loading={isDownloading}
          disabled={!importacaoErro}
        >
          Download
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default ErroModal;

