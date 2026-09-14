import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PainelLateral } from "@locus/componentes/PainelLateral";
import type { RegistroHistorico } from "@locus/servicos/recursos/unidadesEducacionais/tipos";

export function formatarDataHistorico(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;

  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");

  return `${doisDigitos(data.getDate())}/${doisDigitos(
    data.getMonth() + 1,
  )}/${data.getFullYear()} ${doisDigitos(data.getHours())}:${doisDigitos(
    data.getMinutes(),
  )}`;
}

function criarColunas(
  aoVisualizar: (registro: RegistroHistorico) => void,
): ColumnsType<RegistroHistorico> {
  return [
    { title: "Ação", dataIndex: "acao", key: "acao" },
    { title: "Responsável", dataIndex: "responsavel", key: "responsavel" },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 180,
      render: (data: string) => formatarDataHistorico(data),
    },
    {
      title: "",
      key: "acoes",
      width: 64,
      align: "right",
      render: (_, registro) => (
        <Tooltip title="Visualizar versão">
          <Button
            type="default"
            aria-label={`Visualizar versão de ${formatarDataHistorico(registro.data)}`}
            icon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => aoVisualizar(registro)}
          />
        </Tooltip>
      ),
    },
  ];
}

export interface PainelHistoricoProps {
  aberto: boolean;
  registros: RegistroHistorico[];
  carregando?: boolean;
  aoFechar: () => void;
  aoVisualizar: (registro: RegistroHistorico) => void;
}

export function PainelHistorico({
  aberto,
  registros,
  carregando = false,
  aoFechar,
  aoVisualizar,
}: PainelHistoricoProps) {
  return (
    <PainelLateral
      aberto={aberto}
      titulo="Histórico de alterações"
      descricao="Confira o histórico de alterações, incluindo responsável e data de atualização. Clique em no botão de visualização para exibir versões anteriores do registro sem alterar a versão atual."
      aoFechar={aoFechar}
    >
      <Table
        rowKey="id"
        columns={criarColunas(aoVisualizar)}
        dataSource={registros}
        loading={carregando}
        pagination={false}
      />
    </PainelLateral>
  );
}

export default PainelHistorico;
