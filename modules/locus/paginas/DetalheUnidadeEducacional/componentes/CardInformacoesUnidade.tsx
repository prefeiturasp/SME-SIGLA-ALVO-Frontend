import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import { Card, Typography } from "antd";
import { CardDados } from "@locus/componentes/CardDados";
import { GridCardsDados } from "@locus/estilos";
import type { EstatisticaPainel } from "@locus/servicos/recursos/unidadesEducacionais/tipos";

const { Title, Paragraph } = Typography;

export interface CardInformacoesUnidadeProps {
  estatisticas: EstatisticaPainel[];
}

export function CardInformacoesUnidade() { 

  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Informações da unidade educacional
      </Title>
      <Paragraph>
        Quadro de professores. Compare o módulo previsto com quem está lotado e
        a quantidade de afastados dentro da unidade educacional.
      </Paragraph>

      <GridCardsDados  $colunas={4}>
        <CardDados
          valor="105"
          titulo="Módulos"
          descricao="Quantidade de vagas disponibilizadas"
          icone={<ViewModuleOutlinedIcon />}
        />
        <CardDados
          valor="108"
          titulo="Lotação"
          descricao="Quantidade de professores alocados"
          icone={<GroupsOutlinedIcon />}
        />
        <CardDados
          valor="8"
          titulo="Afastados"
          descricao="Quantidade de afastamentos temporários"
          icone={<PersonRemoveOutlinedIcon />}
        />
        <CardDados
          valor="5"
          titulo="Vagas"
          descricao="Quantidade de vagas ainda disponíveis"
          icone={<EventSeatOutlinedIcon />}
        />
      </GridCardsDados>
    </Card>
  );
}

export default CardInformacoesUnidade;
