import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import { Card, Select } from "antd";
import { CabecalhoSecao } from "@locus/componentes/CabecalhoSecao";
import { CardDados } from "@locus/componentes/CardDados";
import { FormItem, GridCardsDados } from "@locus/estilos";
import { LEGENDAS_ESTATISTICA } from "@locus/servicos/recursos/unidadesEducacionais/textos";
import type { OpcaoSelecao } from "@locus/servicos/recursos/unidadesEducacionais/tipos";

const LARGURA_FILTRO = 306;

export interface CardComponenteCurricularProps {
  opcoesComponente: OpcaoSelecao[];
  componenteSelecionado: string;
  aoSelecionarComponente: (componente: string) => void;
}

export function CardComponenteCurricular({
  opcoesComponente,
  componenteSelecionado,
  aoSelecionarComponente,
}: CardComponenteCurricularProps) {
  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <CabecalhoSecao
          titulo="Painel de informações por componente curricular"
          descricao="Estes são dados de todas as unidades educacionais considerando o componente curricular selecionado no filtro."
          larguraAcao={LARGURA_FILTRO}
          acao={
            <FormItem
              label="Componente curricular"
              htmlFor="componente-curricular"
              layout="vertical"
              style={{ marginBottom: 0 }}
            >
              <Select
                id="componente-curricular"
                style={{ width: "100%" }}
                value={componenteSelecionado}
                onChange={aoSelecionarComponente}
                options={opcoesComponente}
              />
            </FormItem>
          }
        />
      </div>

      <GridCardsDados $colunas={3}>
        <CardDados
          valor={105}
          titulo="Módulos"
          descricao={LEGENDAS_ESTATISTICA.modulos}
          icone={<ViewModuleOutlinedIcon />}
        />
        <CardDados
          valor={108}
          titulo="Lotação"
          descricao={LEGENDAS_ESTATISTICA.lotacao}
          icone={<GroupsOutlinedIcon />}
        />
        <CardDados
          valor={152}
          titulo="Afastados"
          descricao={LEGENDAS_ESTATISTICA.afastados}
          icone={<PersonRemoveOutlinedIcon />}
        />
        <CardDados
          valor={54}
          titulo="Vagas"
          descricao={LEGENDAS_ESTATISTICA.vagas}
          icone={<EventSeatOutlinedIcon />}
        />
        <CardDados
          valor={596}
          titulo="Unidades Educacionais"
          descricao="Quantidade total de unidades educacionais"
          icone={<ApartmentOutlinedIcon />}
        />
        <CardDados
          valor={16}
          titulo="Turmas ativas"
          descricao="Quantidade de turmas ativas no EOL."
          icone={<Groups3OutlinedIcon />}
        />
      </GridCardsDados>
    </Card>
  );
}

export default CardComponenteCurricular;
