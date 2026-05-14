import React from "react";
import { Alert, Button, Col, Input, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { CustomFormItem } from "../../../components/FormStyle";
import { postBuscarUsuarioEol } from "../../../services/resources/usuarios";
import type { IBuscarUsuarioEolResponse } from "../../../services/resources/usuarios";
import { usePostCriarUsuario } from "./hooks/usePostCriarUsuario";

import {
  PageContainer,
  ConteudoPagina,
  FieldLabel,
  SearchButton,
} from "./styles";

const { Text } = Typography;

const AdicionarUsuarioTela: React.FC = () => {
  const navigate = useNavigate();

  const [rf, setRf] = React.useState("");
  const [buscando, setBuscando] = React.useState(false);
  const [dadosUsuario, setDadosUsuario] = React.useState<IBuscarUsuarioEolResponse | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [erroAdicao, setErroAdicao] = React.useState<string | null>(null);

  const criarUsuarioMutation = usePostCriarUsuario({
    onSuccess: () => navigate("/gerenciar/gerenciamento-usuarios"),
  });

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/gerenciar")}>
          Gerenciar
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/gerenciar/gerenciamento-usuarios")}
        >
          Gerenciamento de usuários
        </Text>
      ),
    },
    { title: "Adicionar usuário" },
  ] as TitleItem[];

  const handleBuscar = async () => {
    const rfTrimmed = rf.trim();
    if (!rfTrimmed) return;

    setDadosUsuario(null);
    setErro(null);
    setErroAdicao(null);
    setBuscando(true);

    try {
      const { response } = postBuscarUsuarioEol({ rf: rfTrimmed });
      const data = await response;
      setDadosUsuario(data);
    } catch (e: any) {
      console.log(e);
      console.log(e?.status);
      const statusCode = e?.response?.status;
      const detail = e?.response?.data?.detail;

      if (statusCode === 400) {
        setErro(detail || "Usuário já cadastrado no Sigla.");
      } else if (statusCode === 404) {
        setErro("Usuário não encontrado no EOL.");
      } else {
        setErro("Falha ao consultar o EOL. Tente novamente.");
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleAdicionar = () => {
    if (!dadosUsuario) return;

    setErroAdicao(null);

    criarUsuarioMutation.mutate(
      {
        username: dadosUsuario.username,
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
      },
      {
        onError: (e: any) => {
          const detail = e?.response?.data?.detail;
          setErroAdicao(detail || "Falha ao criar o usuário. Tente novamente.");
        },
      }
    );
  };

  return (
    <PageContainer>
      <BaseTela breadcrumbItems={breadcrumbItems} title="Adicionar usuário">
        <ConteudoPagina>
          <Text style={{ display: "block", marginBottom: 16 }}>
            Preencha os campos para adicionar um novo usuário
          </Text>
          <Row gutter={[16, 0]} style={{ alignItems: "flex-end" }}>
            <Col xs={24} md={20}>
              <CustomFormItem
                label={<FieldLabel>Registro funcional (RF)</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <Input
                  allowClear
                  value={rf}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setRf(onlyNumbers);
                    setDadosUsuario(null);
                    setErro(null);
                    setErroAdicao(null);
                  }}
                  onPressEnter={handleBuscar}
                  placeholder="Entre com o RF"
                />
              </CustomFormItem>
            </Col>
            <Col xs={24} md={4}>
              <CustomFormItem label={<span style={{ visibility: "hidden" }}>_</span>} labelCol={{ span: 24 }}>
                <Button                  
                  size="large"
                  onClick={handleBuscar}
                  disabled={!rf.trim()}
                  style={{ width: "100%" }}
                >
                  Buscar usuário
                </Button>
              </CustomFormItem>
            </Col>
          </Row>

          {erro && (
            <Alert
              type="error"
              message={erro}
              showIcon
              style={{ marginTop: 16 }}
            />
          )}

          {dadosUsuario && (
            <>
              <Row gutter={[16, 0]} style={{ marginTop: 32 }}>
                <Col xs={24} md={12}>
                  <CustomFormItem
                    label={<FieldLabel>Nome</FieldLabel>}
                    labelCol={{ span: 24 }}
                  >
                    <Input value={dadosUsuario.nome} disabled />
                  </CustomFormItem>
                </Col>
                <Col xs={24} md={12}>
                  <CustomFormItem
                    label={<FieldLabel>E-mail</FieldLabel>}
                    labelCol={{ span: 24 }}
                  >
                    <Input value={dadosUsuario.email} disabled />
                  </CustomFormItem>
                </Col>
              </Row>

              {erroAdicao && (
                <Alert
                  type="error"
                  message={erroAdicao}
                  showIcon
                  style={{ marginTop: 8, marginBottom: 8 }}
                />
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <Button
                  size="large"
                  onClick={() => navigate("/gerenciar/gerenciamento-usuarios")}
                  disabled={criarUsuarioMutation.isPending}              
                >
                  Voltar
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleAdicionar}
                  loading={criarUsuarioMutation.isPending}             
                >
                  Adicionar usuário
                </Button>
              </div>
            </>
          )}
        </ConteudoPagina>
      </BaseTela>
    </PageContainer>
  );
};

export default AdicionarUsuarioTela;
