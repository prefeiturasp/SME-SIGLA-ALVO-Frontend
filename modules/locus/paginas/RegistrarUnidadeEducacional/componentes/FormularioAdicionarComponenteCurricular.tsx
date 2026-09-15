import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Col, Grid, Row } from "antd";
import {
  BotaoAcaoInline,
  FormItem,
  InputForm,
  SelectForm,
} from "@locus/estilos";
import { opcoesRegistrarUnidadeEducacional } from "../dados/dadosEstaticos";

const { useBreakpoint } = Grid;

export interface FormularioAdicionarComponenteCurricularProps {
  componenteSelecionado?: string;
  quantidadeModulos: string;
  erroComponenteCurricular?: string;
  aoSelecionarComponente: (valor?: string) => void;
  aoAlterarQuantidade: (valor: string) => void;
  aoAdicionar: () => void;
}

export function FormularioAdicionarComponenteCurricular({
  componenteSelecionado,
  quantidadeModulos,
  erroComponenteCurricular,
  aoSelecionarComponente,
  aoAlterarQuantidade,
  aoAdicionar,
}: FormularioAdicionarComponenteCurricularProps) {
  const telas = useBreakpoint();
  const desktop = Boolean(telas.xl);

  return (
    <Row gutter={[10, 16]} align="top">
      <Col xs={24} md={12} xl={9}>
        <FormItem
          label="Componente curricular"
          layout="vertical"
          validateStatus={erroComponenteCurricular ? "error" : undefined}
          help={erroComponenteCurricular}
          style={{ marginBottom: 0 }}
        >
          <SelectForm
            aria-label="Componente curricular"
            status={erroComponenteCurricular ? "error" : undefined}
            placeholder="Selecione"
            allowClear
            value={componenteSelecionado}
            onChange={(valor) =>
              aoSelecionarComponente(valor as string | undefined)
            }
            options={opcoesRegistrarUnidadeEducacional.componenteCurricular}
          />
        </FormItem>
      </Col>

      <Col xs={24} md={12} xl={9}>
        <FormItem
          label="Quantidade de módulos"
          layout="vertical"
          style={{ marginBottom: 0 }}
          help="Informe quantas vagas este componente terá. O mínimo é 0."
        >
          <InputForm
            placeholder="Exemplo: 10"
            value={quantidadeModulos}
            onChange={(e) => aoAlterarQuantidade(e.target.value)}
            inputMode="numeric"
            disabled={!componenteSelecionado}
          />
        </FormItem>
      </Col>

      <Col xs={24} md={24} xl={6}>
        <FormItem
          label={desktop ? " " : undefined}
          colon={false}
          layout="vertical"
          style={{ marginBottom: 0 }}
        >
          <BotaoAcaoInline
            block
            icon={<AddRoundedIcon fontSize="small" />}
            onClick={aoAdicionar}
            style={{ minWidth: 220 }}
          >
            Adicionar componente
          </BotaoAcaoInline>
        </FormItem>
      </Col>
    </Row>
  );
}

export default FormularioAdicionarComponenteCurricular;
