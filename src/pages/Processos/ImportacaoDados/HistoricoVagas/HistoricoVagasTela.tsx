import React from "react";

import dayjs from "dayjs";
import { Row, Col, Typography } from "antd";

import { useImportacaoDadosVagas } from "../Vagas/hooks/useImportacaoDadosVagas";
import {
  TabContentContainer,
  SectionCard,
  ActionButtonsContainer,
  SecondaryButton 
} from "../../../../components/EstilosCompartilhados";
 
import UltimasImportacoesDeVagasTable from "../Vagas/components/UltimasImportacoesDeVagasTable";
import { Link, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";

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
  
  } = useImportacaoDadosVagas();


  const navigate=useNavigate();
 
 const onShowHistorico = () => {
  navigate(-1)
   };

 
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
              data={importacoesArquivosData?.results || [{
                uuid: '111',
                metodo_de_importacao: 'WebService',
                data_de_fechamento_do_modulo: dayjs().toString(),
                cargo: '2650 - ESP.INF.TEC.CULT.DESP.-BIBLIOTECA',
                opcoes_de_importacao: 'Ajustar',
                data_importacao: dayjs().toString()
              }]}
              pagination={false}
            />
          </Col>
        </Row>

      </SectionCard>

       <ActionButtonsContainer> 
       <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
         <SecondaryButton size="large" onClick={()=>navigate(-1)}>
           Voltar
         </SecondaryButton>
       </div>
 
      </ActionButtonsContainer>
    </TabContentContainer>
    </BaseTela>
  );
};

export default HistoricoVagasTela;
