import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Card, Col, Form, Row, Typography } from "antd";
import {
  BotaoAcaoInline,
  InputForm,
  InputFormFlex,
  LinhaCampoCentralizada,
  SelectForm,
} from "@locus/estilos";
import { opcoesRegistrarUnidadeEducacional } from "../dados/dadosEstaticos";
import type { DadosUnidade } from "../hooks/useRegistrarUnidadeEducacional";

const { Title, Paragraph } = Typography;

export interface CardDadosUnidadeProps {
  dados: DadosUnidade;
  erroCodigoLotacao?: string;
  aoAtualizar: (campo: keyof DadosUnidade, valor: string | undefined) => void;
  aoConsultar: () => void;
}

export function CardDadosUnidade({
  dados,
  erroCodigoLotacao,
  aoAtualizar,
  aoConsultar,
}: CardDadosUnidadeProps) {
  const camposPreenchidosAutomaticamente = Boolean(
    dados.tipoUnidade && dados.dre && dados.nome,
  );

  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Dados da unidade educacional
      </Title>
      <Paragraph>
        Informe o código de lotação para localizar os dados da unidade. As
        demais informações serão preenchidas automaticamente.
      </Paragraph>

      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Código de lotação"
              validateStatus={erroCodigoLotacao ? "error" : undefined}
              help={erroCodigoLotacao}
              style={{ marginBottom: 16 }}
            >
              <LinhaCampoCentralizada>
                <InputFormFlex
                  status={erroCodigoLotacao ? "error" : undefined}
                  placeholder="Exemplo: 123"
                  value={dados.codigoLotacao}
                  aria-invalid={Boolean(erroCodigoLotacao)}
                  onChange={(e) =>
                    aoAtualizar("codigoLotacao", e.target.value)
                  }
                />
                <BotaoAcaoInline
                  icon={<SearchOutlinedIcon fontSize="small" />}
                  onClick={aoConsultar}
                >
                  Consultar
                </BotaoAcaoInline>
              </LinhaCampoCentralizada>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Tipo da unidade" style={{ marginBottom: 16 }}>
              <SelectForm
                aria-label="Tipo da unidade"
                placeholder="Selecione"
                allowClear={false}
                disabled
                value={dados.tipoUnidade}
                options={opcoesRegistrarUnidadeEducacional.tipoUnidade}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Diretoria Regional de Educação (DRE)"
              style={{ marginBottom: 16 }}
            >
              <SelectForm
                aria-label="Diretoria Regional de Educação (DRE)"
                placeholder="Selecione"
                allowClear={false}
                disabled
                value={dados.dre}
                options={opcoesRegistrarUnidadeEducacional.dre}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nome da unidade educacional"
              style={{ marginBottom: 0 }}
            >
              <InputForm
                placeholder={
                  camposPreenchidosAutomaticamente
                    ? undefined
                    : "Preenchido automaticamente após consulta"
                }
                value={dados.nome}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default CardDadosUnidade;
