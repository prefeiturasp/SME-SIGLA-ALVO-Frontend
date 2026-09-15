import { Card, List, Switch, Typography } from "antd";
import { FormItem, SelectForm, TextAreaForm } from "@locus/estilos";
import {
  opcoesRegistrarUnidadeEducacional,
  type CaracteristicasPadrao,
} from "../dados/dadosEstaticos";
import type { DadosUnidade } from "../hooks/useRegistrarUnidadeEducacional";

const { Title, Paragraph, Text } = Typography;

export interface CardCaracteristicasUnidadeProps {
  caracteristicas: CaracteristicasPadrao;
  dados: DadosUnidade;
  erroMotivoNaoContabilizacao?: string;
  aoAlternar: (chave: keyof CaracteristicasPadrao) => void;
  aoAtualizarDados: (
    campo: keyof DadosUnidade,
    valor: string | undefined,
  ) => void;
}

export function CardCaracteristicasUnidade({
  caracteristicas,
  dados,
  erroMotivoNaoContabilizacao,
  aoAlternar,
  aoAtualizarDados,
}: CardCaracteristicasUnidadeProps) {
  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Características da unidade educacional
      </Title>
      <Paragraph>
        Selecione as características que se aplicam a esta unidade educacional.
      </Paragraph>

      <List itemLayout="horizontal">
        <List.Item
          actions={[
            <Switch
              key="escolaMunicipalizada"
              checked={caracteristicas.escolaMunicipalizada}
              onChange={() => aoAlternar("escolaMunicipalizada")}
              aria-label="Escola Municipalizada"
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text strong>Escola Municipalizada</Text>}
            description={
              <>
                <Text style={{ fontSize: 13 }}>
                  Se a unidade educacional for municipalizada, selecione abaixo
                  o ano da municipalização.
                </Text>
                <FormItem
                  label="Ano da municipalização"
                  layout="vertical"
                  style={{
                    marginBottom: 0,
                    marginTop: 12,
                    width: "50%",
                    maxWidth: "100%",
                  }}
                >
                  <SelectForm
                    id="ano-municipalizacao"
                    aria-label="Ano da municipalização"
                    placeholder="Selecione"
                    allowClear
                    disabled={!caracteristicas.escolaMunicipalizada}
                    value={dados.anoMunicipalizacao}
                    onChange={(valor) =>
                      aoAtualizarDados(
                        "anoMunicipalizacao",
                        valor as string | undefined,
                      )
                    }
                    options={
                      opcoesRegistrarUnidadeEducacional.anoMunicipalizacao
                    }
                  />
                </FormItem>
              </>
            }
          />
        </List.Item>

        <List.Item
          actions={[
            <Switch
              key="ensinoFundamentalI"
              checked={caracteristicas.ensinoFundamentalI}
              onChange={() => aoAlternar("ensinoFundamentalI")}
              aria-label="Ensino fundamental I"
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text strong>Ensino fundamental I</Text>}
            description={
              <Text style={{ fontSize: 13 }}>
                A unidade educacional possui ensino fundamental I.
              </Text>
            }
          />
        </List.Item>

        <List.Item
          actions={[
            <Switch
              key="ejaModular"
              checked={caracteristicas.ejaModular}
              onChange={() => aoAlternar("ejaModular")}
              aria-label="EJA Modular"
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text strong>EJA Modular</Text>}
            description={
              <Text style={{ fontSize: 13 }}>
                A unidade educacional possui Ensino de Jovens e Adultos na
                modalidade Modular.
              </Text>
            }
          />
        </List.Item>

        <List.Item
          actions={[
            <Switch
              key="saoPauloIntegral"
              checked={caracteristicas.saoPauloIntegral}
              onChange={() => aoAlternar("saoPauloIntegral")}
              aria-label="São Paulo Integral"
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text strong>São Paulo Integral</Text>}
            description={
              <Text style={{ fontSize: 13 }}>
                A unidade educacional faz parte do programa São Paulo Integral.
              </Text>
            }
          />
        </List.Item>

        <List.Item
          actions={[
            <Switch
              key="contabilizarUE"
              checked={caracteristicas.contabilizarUE}
              onChange={() => aoAlternar("contabilizarUE")}
              aria-label="Contabilizar UE"
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text strong>Contabilizar UE</Text>}
            description={
              <>
                <Text style={{ fontSize: 13 }}>
                  A unidade será contabilizada nos cálculos do LOCUS.
                </Text>
                {!caracteristicas.contabilizarUE ? (
                  <FormItem
                    label="Por que a unidade não deve ser contabilizada?"
                    layout="vertical"
                    required
                    validateStatus={
                      erroMotivoNaoContabilizacao ? "error" : undefined
                    }
                    help={erroMotivoNaoContabilizacao}
                    style={{
                      marginBottom: 0,
                      marginTop: 12,
                      width: "100%",
                      maxWidth: 1192,
                    }}
                  >
                    <TextAreaForm
                      status={
                        erroMotivoNaoContabilizacao ? "error" : undefined
                      }
                      aria-label="Por que a unidade não deve ser contabilizada?"
                      aria-required
                      aria-invalid={Boolean(erroMotivoNaoContabilizacao)}
                      placeholder="Digite o motivo da não contabilização..."
                      value={dados.motivoNaoContabilizacao}
                      onChange={(e) =>
                        aoAtualizarDados(
                          "motivoNaoContabilizacao",
                          e.target.value,
                        )
                      }
                    />
                  </FormItem>
                ) : null}
              </>
            }
          />
        </List.Item>
      </List>
    </Card>
  );
}
