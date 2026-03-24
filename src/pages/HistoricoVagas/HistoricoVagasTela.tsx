import React from "react";

import { Row, Col, Typography } from "antd";

import { useImportacaoDadosVagas } from "../ImportacaoDados/Vagas/hooks/useImportacaoDadosVagas";
import {
  TabContentContainer,
  SectionCard,
  ActionButtonsContainer,
  SecondaryButton 
} from "../../components/EstilosCompartilhados";
 
import UltimasImportacoesDeVagasTable from "../ImportacaoDados/Vagas/components/UltimasImportacoesDeVagasTable"; 
import { Link, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";

const { Text } = Typography;


const HistoricoVagasTela: React.FC = ({  }) => {

  const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: <Link to="/processos/importacao-dados"><Text strong>Importação de dados</Text></Link> },
  { title: "Histórico de importação de Vagas" },
] as TitleItem[];


  const {
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    listRequest,
    onAntTableChange
  } = useImportacaoDadosVagas();


  const navigate=useNavigate();
 
 
  return (
     <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados - Vagas"
    >
    <TabContentContainer>
      <SectionCard>
 
 
        <Row gutter={[0, 16]}>
          <Col xs={24} sm={24}>

            <UltimasImportacoesDeVagasTable
              loading={importacoesArquivosIsLoading}
              data={importacoesArquivosData?.results || []}
              pagination={{
                current: listRequest.pagination.page,
                pageSize: 10,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: importacoesArquivosData?.count,
                showTotal: (total, range) => (
                  <span style={{ marginLeft: 16 }}>
                    {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
                  </span>
                ),
              }}
              onChange={onAntTableChange}
 />
          </Col>
        </Row>

      </SectionCard>

       <ActionButtonsContainer> 
       <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
         <SecondaryButton size="large" onClick={() => navigate('/processos/importacao-dados', { state: { tipo: 'VAGAS' } })}>
           Voltar
         </SecondaryButton>
       </div>
 
      </ActionButtonsContainer>
    </TabContentContainer>
    </BaseTela>
  );
};

export default HistoricoVagasTela;
