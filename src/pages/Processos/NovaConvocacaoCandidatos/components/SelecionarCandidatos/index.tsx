import React, { useState } from 'react';
import { Modal, Typography, Col, Button, Space, message, Table, Spin } from 'antd';
import { 
  ModalTitle, 
  CompetitionInfo, 
  InfoItem, 
  InputGroup, 
  TableContainer, 
  TableHeader, 
  TableRow, 
  TableCell, 
  ButtonContainer,
  StyledInput,
  StyledText
} from '../../styles';
import { useCandidatos } from '../../hooks/useCandidatos';

const { Title, Text } = Typography;

interface SelecionarCandidatosProps {
  visible: boolean;
  onClose: () => void;
  concurso?: string;
  cargo?: string;
  vagas?: number;
  autorizacoes?: number;
  onCandidatosSelecionados?: (quantidade: number) => void;
}

export const SelecionarCandidatos: React.FC<SelecionarCandidatosProps> = ({
  visible,
  onClose,
  concurso,
  cargo,
  vagas = 9,
  autorizacoes = 0,
  onCandidatosSelecionados
}) => {
  const [classificacaoInicial, setClassificacaoInicial] = useState(1);
  const [quantidade, setQuantidade] = useState(0);
  const [autorizacoesDigitadas, setAutorizacoesDigitadas] = useState({
    geral: 0,
    def: 0,
    nna: 0
  });
  const [mostrarTabelaCandidatos, setMostrarTabelaCandidatos] = useState(false);

  // Hook para buscar candidatos - só executa quando mostrarTabelaCandidatos for true
  const { candidatosData, candidatosIsLoading } = useCandidatos(mostrarTabelaCandidatos);
  
  // Dados formatados para a tabela - só mostra quando necessário
  const candidatos = mostrarTabelaCandidatos && candidatosData ? candidatosData : [];

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
    console.log('Buscando candidatos por autorizações digitadas');
    setMostrarTabelaCandidatos(true);
  };

  const handleSelecionar = () => {
    console.log('Selecionando candidatos');
    
    // Conta a quantidade de candidatos na tabela
    // candidatosData pode ser PaginatedResponse<ICandidato> ou undefined
    const quantidadeCandidatos = candidatosData?.results?.length || 0;
    
    // Chama o callback para informar a quantidade de candidatos selecionados
    if (onCandidatosSelecionados) {
      onCandidatosSelecionados(quantidadeCandidatos);
    }
    
    onClose();
  };

  // Dados vêm do hook useCandidatos quando mostrarTabelaCandidatos for true

  return (
    <>
      <GlobalFonts />
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
        <div style={{ padding: '1rem', width: '100%', height: 'auto', minHeight: '728px', display: 'flex', flexDirection: 'column' }}>
        <ModalTitle>
          <Title level={3} style={{ marginTop: '-0.5rem', textAlign: 'left' }}>
            Convocar candidatos ao cargo
          </Title>
        </ModalTitle>

        <CompetitionInfo>
          <InfoItem>
            <Text strong>Concurso:</Text>
            <Text style={{ color: '#05409A' }}>
              {concurso}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Cargo:</Text>
            <Text style={{ color: '#05409A' }}>
              {cargo}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Vagas:</Text>
            <Text style={{ color: '#05409A' }}>
              {vagas}
            </Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Autorizações:</Text>
            <Text style={{ color: '#05409A' }}>
              {autorizacoes}
            </Text>
          </InfoItem>
        </CompetitionInfo>

        <InputGroup>
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <div style={{ width: '40%' }}>
              <StyledText strong>Classificação inicial:</StyledText>
              <StyledInput
                type="text"
                inputMode="numeric"
                value={classificacaoInicial || ''}
                onChange={(e) => handleNumericInput(e.target.value, setClassificacaoInicial)}
                onKeyDown={validateNumericInput}
                placeholder="0"
                style={{ marginTop: '0rem' }}
              />
            </div>
            <div style={{ width: '40%' }}>
              <StyledText strong>Quantidade:</StyledText>
              <StyledInput
                type="text"
                inputMode="numeric"
                value={quantidade || ''}
                onChange={(e) => handleNumericInput(e.target.value, setQuantidade)}
                onKeyDown={validateNumericInput}
                placeholder="0"
                style={{ marginTop: '0rem' }}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <StyledText className="text-gray">0 (Geral)</StyledText>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <StyledText className="text-gray">0 (Def.)</StyledText>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <StyledText className="text-gray">0 (NNA)</StyledText>
              </div>
            </TableCell>

            <TableCell span={8}>
              <StyledText className="text-gray">0 (NNA)</StyledText>
            </TableCell>
          </TableRow>
        </TableContainer>

        <ButtonContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
            <Space size="middle">
              <Button
                type="primary"
                size="large"
                onClick={handleBuscarPorCalculadas}
                style={{
                  backgroundColor: '#05409A',
                  borderColor: '#05409A',
                  color: '#fff'
                }}
              >
                Buscar candidatos por autorizações calculadas
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleBuscarPorDigitadas}
                style={{
                  backgroundColor: '#05409A',
                  borderColor: '#05409A',
                  color: '#fff'
                }}
              >
                Buscar candidatos por autorizações digitadas
              </Button>
            </Space>
          </div>
          
          {/* Tabela de candidatos convocados - aparece apenas quando mostrarTabelaCandidatos for true */}
          {mostrarTabelaCandidatos && (
            <div style={{ marginTop: '0rem', marginBottom: '1rem', width: '100%' }}>
              <Text strong style={{ fontSize: '20px', marginBottom: '0.5rem', display: 'block' }}>
                Convocados por autorizações digitadas
              </Text>
              
              {/* Loading state */}
              {candidatosIsLoading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '1rem' }}>Buscando candidatos...</div>
                </div>
              )}
              
              {/* Tabela de dados */}
              {!candidatosIsLoading && candidatos.length > 0 && (
                <div style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px',
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {/* Cabeçalho da tabela com mesmo estilo */}
                  <div style={{
                    backgroundColor: '#EBEBED',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid #d9d9d9',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '20%', fontWeight: 'bold', fontSize: '1.125rem' }}>Convocado por</div>
                    <div style={{ width: '35%', fontWeight: 'bold', fontSize: '1.125rem' }}>Candidato</div>
                    <div style={{ width: '15%', fontWeight: 'bold', fontSize: '1.125rem' }}>Classificação</div>
                    <div style={{ width: '15%', fontWeight: 'bold', fontSize: '1.125rem' }}>Classificação especial</div>
                    <div style={{ width: '15%', fontWeight: 'bold', fontSize: '1.125rem' }}>Classificação NNA</div>
                  </div>
                  
                  {/* Linhas da tabela com cores alternadas */}
                  {candidatos.map((candidato, index) => (
                    <div key={index.toString()} style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: index % 2 === 1 ? '#F6F6F6' : '#FFFFFF',
                      borderBottom: index < candidatos.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <div style={{ width: '20%', padding: '0.5rem 1rem', minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                        {candidato.convocado_por}
                      </div>
                      <div style={{ width: '35%', padding: '0.5rem 1rem', minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                        {candidato.nome_candidato}
                      </div>
                      <div style={{ width: '15%', padding: '0.5rem 1rem', minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                        {candidato.classificacao_geral}
                      </div>
                      <div style={{ width: '15%', padding: '0.5rem 1rem', minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                        {candidato.classificacao_especial}
                      </div>
                      <div style={{ width: '15%', padding: '0.5rem 1rem', minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                        {candidato.classificacao_nna}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Mensagem quando não há candidatos */}
              {!candidatosIsLoading && candidatos.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  color: '#666',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px'
                }}>
                  Nenhum candidato encontrado.
                </div>
              )}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '0.5rem' }}>
            <Space size="middle">
              <Button
                onClick={onClose}
                style={{
                  borderColor: '#05409A',
                  color: '#05409A'
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={handleSelecionar}
                style={{
                  backgroundColor: '#05409A',
                  borderColor: '#05409A',
                  color: '#fff'
                }}
              >
                Selecionar
              </Button>
            </Space>
          </div>
        </ButtonContainer>
              </div>
    </Modal>
    </>
  );
};

export default SelecionarCandidatos;
