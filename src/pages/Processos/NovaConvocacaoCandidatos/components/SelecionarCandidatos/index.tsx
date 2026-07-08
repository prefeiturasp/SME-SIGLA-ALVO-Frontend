import React, { useState } from 'react';
import { Modal, Typography, Col, Space, message, Spin, Alert } from 'antd';
import { AppButton } from '@/components/ui';
import {
  ModalTitle,
  CompetitionInfo,
  InfoItem,
  ModalInputGroup as InputGroup,
  ModalTableContainer as TableContainer,
  ModalTableHeader as TableHeader,
  ModalTableRow as TableRow,
  ModalTableCell as TableCell,
  ModalActionButtonContainer as ButtonContainer,
  StyledInput,
  StyledText,
} from "@/components/ui";
import { brandHighlightText } from "@/design-system/estilos";

const styles = {
  modalBody: {
    padding: "1rem",
    width: "100%",
    height: "auto",
    minHeight: "728px",
    display: "flex",
    flexDirection: "column" as const,
  },
  modalTitle: { marginTop: "-0.5rem", textAlign: "left" as const },
  highlightText: brandHighlightText,
  quantityRow: { display: "flex", gap: "1rem", width: "100%" },
  quantityField: { width: "40%" },
  inputNoMarginTop: { marginTop: "0rem" },
  inputRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  alertContainer: { width: "100%", marginBottom: "1rem" },
  alertFullWidth: { width: "100%" },
  actionsStart: { display: "flex", justifyContent: "flex-start", width: "100%" },
  candidatesSection: { marginTop: "0rem", marginBottom: "1rem", width: "100%" },
  candidatesTitle: { fontSize: "20px", marginBottom: "0.5rem", display: "block" },
  loadingContainer: { textAlign: "center" as const, padding: "2rem" },
  loadingText: { marginTop: "1rem" },
  tableWrapper: {
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    overflow: "hidden" as const,
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#EBEBED",
    padding: "0.5rem 1rem",
    borderBottom: "1px solid #d9d9d9",
    display: "flex",
    alignItems: "center",
  },
  tableHeaderCell: { fontWeight: "bold" as const, fontSize: "1.125rem" },
  tableRow: (index: number, total: number) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: index % 2 === 1 ? "#F6F6F6" : "#FFFFFF",
    borderBottom: index < total - 1 ? "1px solid #f0f0f0" : "none",
  }),
  tableCell: {
    padding: "0.5rem 1rem",
    minHeight: "3rem",
    display: "flex",
    alignItems: "center",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "2rem",
    color: "#666",
    backgroundColor: "#f5f5f5",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
  },
  footerActions: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: "0.5rem",
  },
  columnWidth: { geral: "20%", candidato: "35%", classificacao: "15%" },
};
import { useCandidatos } from './useCandidatos';

const { Title, Text } = Typography;

interface SelecionarCandidatosProps {
  visible: boolean;
  onClose: () => void;
  concurso?: string;
  concursoValue?: string;
  cargo?: string;
  vagas?: number;
  autorizacoes?: number;
  onCandidatosSelecionados?: (quantidade: number, quantidadesIndividuais: { geral: number; pcd: number; nna: number }) => void;
}

const SelecionarCandidatos: React.FC<SelecionarCandidatosProps> = ({
  visible,
  onClose,
  concurso,
  concursoValue,
  cargo,
  vagas = 9,
  autorizacoes = 0,
  onCandidatosSelecionados
}) => {
  const [quantidade, setQuantidade] = useState(0);
  const [autorizacoesDigitadas, setAutorizacoesDigitadas] = useState({
    geral: 0,
    def: 0,
    nna: 0
  });
  const [mostrarTabelaCandidatos, setMostrarTabelaCandidatos] = useState(false);
  const [parametrosBusca, setParametrosBusca] = useState<{ geral: number; pcd: number; nna: number; concurso_uuid: string } | undefined>(undefined);

  // Hook para buscar candidatos - só executa quando mostrarTabelaCandidatos for true
  const { candidatosData, candidatosIsLoading } = useCandidatos(mostrarTabelaCandidatos, parametrosBusca);
  
  // Dados formatados para a tabela - só mostra quando necessário
  const candidatos = mostrarTabelaCandidatos && candidatosData ? candidatosData : [];

  // Validação em tempo real
  const totalAutorizacoes = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
  const isTotalValido = totalAutorizacoes === quantidade && quantidade > 0;
  const temCamposPreenchidos = autorizacoesDigitadas.geral > 0 && autorizacoesDigitadas.def > 0 && autorizacoesDigitadas.nna > 0;
  const mostrarErroValidacao = quantidade > 0 && temCamposPreenchidos && !isTotalValido;

  // Função para validar e formatar entrada numérica
  const handleNumericInput = (value: string, setter: (value: number) => void) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setter(0);
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue)) {
        setter(numValue);
      }
    }
  };

  // Função para validar entrada em tempo real
  const validateNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    // Permite apenas números, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (!allowedKeys.includes(key) && !/^[0-9]$/.test(key)) {
      e.preventDefault();
      message.warning('Digite apenas números');
    }
  };

  const handleAutorizacaoChange = (tipo: 'geral' | 'def' | 'nna', value: number) => {
    setAutorizacoesDigitadas(prev => ({
      ...prev,
      [tipo]: value
    }));
  };

  const handleBuscarPorCalculadas = () => {
    console.log('Buscando candidatos por autorizações calculadas');
  };

  const handleBuscarPorDigitadas = () => {
    // Validar se o somatório das autorizações digitadas é igual ao campo quantidade
    const somatorio = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    if (somatorio !== quantidade) {
      message.error(`O somatório dos candidatos (${somatorio}) deve ser igual ao campo "Quantidade" (${quantidade})`);
      return;
    }

    // Se a validação passou, define os parâmetros e mostra a tabela
    setParametrosBusca({
      geral: autorizacoesDigitadas.geral,
      pcd: autorizacoesDigitadas.def, // def = pcd conforme especificação
      nna: autorizacoesDigitadas.nna,
      concurso_uuid: concursoValue
    });
    setMostrarTabelaCandidatos(true);
  };

  const handleSelecionar = () => {
    // Calcula a quantidade total de candidatos com base nas autorizações digitadas
    const quantidadeCandidatos = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    // Quantidades individuais baseadas nas autorizações digitadas
    const quantidadesIndividuais = {
      geral: autorizacoesDigitadas.geral,
      pcd: autorizacoesDigitadas.def, // def = pcd conforme especificação
      nna: autorizacoesDigitadas.nna
    };
    
    // Chama o callback para informar a quantidade de candidatos selecionados e quantidades individuais
    if (onCandidatosSelecionados) {
      onCandidatosSelecionados(quantidadeCandidatos, quantidadesIndividuais);
    }
    
    onClose();
  };

  // Dados vêm do hook useCandidatos quando mostrarTabelaCandidatos for true

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1104}
        centered
        destroyOnHidden
        style={{ 
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        <div style={styles.modalBody}>
        <ModalTitle>
          <Title level={3} style={styles.modalTitle}>
            Convocar candidatos ao cargo
          </Title>
        </ModalTitle>

        <CompetitionInfo>
          <InfoItem>
            <Text strong>Concurso:</Text>
            <Text style={styles.highlightText}>
              {concurso}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Cargo:</Text>
            <Text style={styles.highlightText}>
              {cargo}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Vagas:</Text>
            <Text style={styles.highlightText}>
              {vagas}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Autorizações:</Text>
            <Text style={styles.highlightText}>
              {autorizacoes}
            </Text>
          </InfoItem>
        </CompetitionInfo>

        <InputGroup>
          <div style={styles.quantityRow}>
            <div style={styles.quantityField}>
              <StyledText strong>Quantidade:</StyledText>
              <StyledInput
                type="text"
                inputMode="numeric"
                value={quantidade || ''}
                onChange={(e) => handleNumericInput(e.target.value, setQuantidade)}
                onKeyDown={validateNumericInput}
                placeholder="0"
                style={styles.inputNoMarginTop}
              />
            </div>
          </div>
        </InputGroup>

        <TableContainer>
          <TableHeader>
            <Col span={8}>
              <Text strong>Autorizações Calculadas</Text>
            </Col>
            <Col span={8}>
              <Text strong>Autorizações digitadas</Text>
            </Col>
            <Col span={8}>
              <Text strong>Candidatos convocados</Text>
            </Col>
          </TableHeader>
          
          <TableRow>
            <TableCell span={8}>
              <StyledText className="text-gray">0 (Geral)</StyledText>
            </TableCell>

            {/* INPUT + TEXTO AO LADO */}
            <TableCell span={8}>
              <div style={styles.inputRow}>
                <StyledInput
                  type="text"
                  inputMode="numeric"
                  value={autorizacoesDigitadas.geral}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('geral', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="Digite apenas números"
                />
                <StyledText className="text-gray">{autorizacoesDigitadas.geral} (Geral)</StyledText>
              </div>
            </TableCell>

            <TableCell span={8}>
              <StyledText className="text-gray">0 (Geral)</StyledText>
            </TableCell>
          </TableRow>
          
          {/* DEF */}
          <TableRow className="alternate">
            <TableCell span={8}>
              <StyledText className="text-gray">0 (Def.)</StyledText>
            </TableCell>

            {/* INPUT + TEXTO AO LADO */}
            <TableCell span={8}>
              <div style={styles.inputRow}>
                <StyledInput
                  type="text"
                  inputMode="numeric"
                  value={autorizacoesDigitadas.def}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('def', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="Digite apenas números"
                />
                <StyledText className="text-gray">{autorizacoesDigitadas.def} (Def.)</StyledText>
              </div>
            </TableCell>

            <TableCell span={8}>
              <StyledText className="text-gray">0 (Def.)</StyledText>
            </TableCell>
          </TableRow>
          
          {/* NNA */}
          <TableRow>
            <TableCell span={8}>
              <StyledText className="text-gray">0 (NNA)</StyledText>
            </TableCell>

            {/* INPUT + TEXTO AO LADO */}
            <TableCell span={8}>
              <div style={styles.inputRow}>
                <StyledInput
                  type="text"
                  inputMode="numeric"
                  value={autorizacoesDigitadas.nna}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('nna', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="Digite apenas números"
                />
                <StyledText className="text-gray">{autorizacoesDigitadas.nna} (NNA)</StyledText>
              </div>
            </TableCell>

            <TableCell span={8}>
              <StyledText className="text-gray">0 (NNA)</StyledText>
            </TableCell>
          </TableRow>
        </TableContainer>

        {/* Alert de validação */}
        {mostrarErroValidacao && (
          <div style={styles.alertContainer}>
            <Alert 
              message="A SOMA dos campos GERAL, DEF. e NNA tem que ser igual ao total inserido em QUANTIDADE." 
              type="error" 
              showIcon
              style={styles.alertFullWidth}
            />
          </div>
        )}

        <ButtonContainer>
          <div style={styles.actionsStart}>
            <Space size="middle">
              <AppButton
                variant="primary"
                size="large"
                onClick={handleBuscarPorCalculadas}
              >
                Buscar candidatos por autorizações calculadas
              </AppButton>
              <AppButton
                variant="primary"
                size="large"
                onClick={handleBuscarPorDigitadas}
              >
                Buscar candidatos por autorizações digitadas
              </AppButton>
            </Space>
          </div>
          
          {/* Tabela de candidatos convocados - aparece apenas quando mostrarTabelaCandidatos for true */}
          {mostrarTabelaCandidatos && (
            <div style={styles.candidatesSection}>
              <Text strong style={styles.candidatesTitle}>
                Convocados por autorizações digitadas
              </Text>
              
              {/* Loading state */}
              {candidatosIsLoading && (
                <div style={styles.loadingContainer}>
                  <Spin size="large" />
                  <div style={styles.loadingText}>Buscando candidatos...</div>
                </div>
              )}
              
              {/* Tabela de dados */}
              {!candidatosIsLoading && candidatos.length > 0 && (
                <div style={styles.tableWrapper}>
                  {/* Cabeçalho da tabela com mesmo estilo */}
                  <div style={styles.tableHeader}>
                    <div style={{ ...styles.tableHeaderCell, width: styles.columnWidth.geral }}>Convocado por</div>
                    <div style={{ ...styles.tableHeaderCell, width: styles.columnWidth.candidato }}>Candidato</div>
                    <div style={{ ...styles.tableHeaderCell, width: styles.columnWidth.classificacao }}>Classificação</div>
                    <div style={{ ...styles.tableHeaderCell, width: styles.columnWidth.classificacao }}>Classificação especial</div>
                    <div style={{ ...styles.tableHeaderCell, width: styles.columnWidth.classificacao }}>Classificação NNA</div>
                  </div>
                  
                  {/* Linhas da tabela com cores alternadas */}
                  {candidatos.map((candidato, index) => (
                    <div key={index.toString()} style={styles.tableRow(index, candidatos.length)}>
                      <div style={{ ...styles.tableCell, width: styles.columnWidth.geral }}>
                        COGEP
                      </div>
                      <div style={{ ...styles.tableCell, width: styles.columnWidth.candidato }}>
                        {candidato.candidato.nome}
                      </div>
                      <div style={{ ...styles.tableCell, width: styles.columnWidth.classificacao }}>
                        {candidato.classificacao}
                      </div>
                      <div style={{ ...styles.tableCell, width: styles.columnWidth.classificacao }}>
                        {candidato.classificacao_pcd}
                      </div>
                      <div style={{ ...styles.tableCell, width: styles.columnWidth.classificacao }}>
                        {candidato.classificacao_nna}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Mensagem quando não há candidatos */}
              {!candidatosIsLoading && candidatos.length === 0 && (
                <div style={styles.emptyState}>
                  Nenhum candidato encontrado.
                </div>
              )}
            </div>
          )}
          
          <div style={styles.footerActions}>
            <Space size="middle">
              <AppButton
                variant="secondary"
                onClick={onClose}
              >
                Cancelar
              </AppButton>
              <AppButton
                variant="primary"
                onClick={handleSelecionar}
                disabled={!isTotalValido}
              >
                Selecionar
              </AppButton>
            </Space>
          </div>
        </ButtonContainer>
              </div>
    </Modal>
    </>
  );
};

export default SelecionarCandidatos;
