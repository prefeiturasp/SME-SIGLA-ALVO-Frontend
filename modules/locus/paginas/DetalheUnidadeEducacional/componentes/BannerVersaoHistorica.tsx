import { Alert, Button } from "antd";
import { formatarDataHistorico } from "./PainelHistorico";

export interface BannerVersaoHistoricaProps {
  data: string;
  aoVoltar: () => void;
}

export function BannerVersaoHistorica({
  data,
  aoVoltar,
}: BannerVersaoHistoricaProps) {
  return (
    <Alert
      type="info"
      showIcon
      message={`Visualizando versão de ${formatarDataHistorico(data)}`}
      description="As informações não poderão ser alteradas, são apenas para visualização."
      action={
        <Button type="default" onClick={aoVoltar}>
          Voltar à versão atual
        </Button>
      }
    />
  );
}

export default BannerVersaoHistorica;
