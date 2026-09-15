import { Card } from "antd";
import { BotaoAcaoInline } from "@locus/estilos";

export interface LinhaHistoricoAlteracoesProps {
  aoAbrir: () => void;
}

export function LinhaHistoricoAlteracoes({
  aoAbrir,
}: LinhaHistoricoAlteracoesProps) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <span>
          Confira as alterações realizadas no registro ao clicar em{" "}
          <strong>“histórico de alterações”</strong>.
        </span>
        <BotaoAcaoInline onClick={aoAbrir}>
          Histórico de alterações
        </BotaoAcaoInline>
      </div>
    </Card>
  );
}

export default LinhaHistoricoAlteracoes;
