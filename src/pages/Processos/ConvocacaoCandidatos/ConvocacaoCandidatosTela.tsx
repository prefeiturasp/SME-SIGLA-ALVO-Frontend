import React, { useState, useCallback } from "react";
import { Typography, Row, Col, Button, Tooltip } from "antd";
import { UsergroupAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import ConvocacaoTable from "./components/ConvocacaoTable";
import ConvocacaoFiltros from "./components/ConvocacaoFiltros";
import FinalizarProcessoModal from "./components/FinalizarProcessoModal";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { usePostFinalizarProcessoConvocacao } from "./hooks/usePostFinalizarProcessoConvocacao";
import { useNavigate } from "react-router-dom";
import type { IProcessoConvocacao } from "../../../services/resources/convocacao/IConvocacao";
import {
  PageContainer,
  ActionButton,
  ConteudoPagina,
  TituloPagina,
  TableContainer,
  ButtonGroup,
} from "./style";
import { useGetPermissions } from "../../../routes/PermissionContextGuard";

const { Text } = Typography;

const ConvocacaoCandidatosTela: React.FC = () => {
  const navigate = useNavigate();
  const [finalizandoUuid, setFinalizandoUuid] = useState<string | null>(null);
  const [modalFinalizarOpen, setModalFinalizarOpen] = useState(false);
  const [processoParaFinalizar, setProcessoParaFinalizar] = useState<IProcessoConvocacao | null>(null);

  const postFinalizar = usePostFinalizarProcessoConvocacao();

  const openModalFinalizar = useCallback((record: IProcessoConvocacao) => {
    setProcessoParaFinalizar(record);
    setModalFinalizarOpen(true);
  }, []);

  const closeModalFinalizar = useCallback(() => {
    setModalFinalizarOpen(false);
    setProcessoParaFinalizar(null);
  }, []);

  const handleConfirmFinalizar = useCallback(async () => {
    if (!processoParaFinalizar) return;
    setFinalizandoUuid(processoParaFinalizar.uuid);
    try {
      await postFinalizar.mutateAsync(processoParaFinalizar.uuid);
      closeModalFinalizar();
    } finally {
      setFinalizandoUuid(null);
    }
  }, [processoParaFinalizar, postFinalizar, closeModalFinalizar]);

  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/processos")}
        >
          Processos
        </Text>
      ),
    },
    { title: "Lista de Convocações" },
  ] as TitleItem[];

  const { can } = useGetPermissions();
  const canAddProcessoConvocacao = can("add_processoconvocacao");
  const canChangeProcessoConvocacao = can("change_processoconvocacao");
  const canDeleteProcessoConvocacao = can("delete_processoconvocacao");
  const canViewDetailsProcessoConvocacao = can("details_processoconvocacao");
  const canFinalizeProcessoConvocacao = can("finalize_processoconvocacao");
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const canViewProcessoConvocacao = can("view_processoconvocacao");
  const {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosOptionsIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    dayjs,
  } = useProcessosConvocacao();

  return (
    <PageContainer>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Lista de Convocações"
        buttons={
          <ButtonGroup>
            <Tooltip title={!canAddImportacaoArquivoVagas?"Você não possui permissão para essa ação":"Gerenciamento de vagas"} arrow={true} >
            <ActionButton
              type="primary"
              size="large"
              ghost={true}
              disabled={!canAddImportacaoArquivoVagas}
              icon={<UserSwitchOutlined />}
              onClick={() => navigate("/processos/gerenciamento-vagas")}
            >
              Gerenciamento de vagas
            </ActionButton>
            </Tooltip>
            <Tooltip title={!canAddProcessoConvocacao?"Você não possui permissão para essa ação":"Nova convocação"} arrow={true} >
            <Button
              type="primary"
              size="large"
              icon={<UsergroupAddOutlined />}
              disabled={!concursosOptions || !canAddProcessoConvocacao}
              onClick={() =>
                navigate("/processos/convocacao/dados-processo/criar", {
                  state: concursosOptions,
                })
              }
            >
              Nova convocação
            </Button>
            </Tooltip>
          </ButtonGroup>
        }
      >
        <ConteudoPagina>
          <TituloPagina level={4}>Busca processos</TituloPagina>

          <ConvocacaoFiltros
            canViewProcessoConvocacao={canViewProcessoConvocacao}
            control={control}
            formErrors={formErrors}
            concursosOptions={concursosOptions}
            concursosOptionsIsLoading={concursosOptionsIsLoading}
            handleSubmit={handleSubmit}
            handleSub={handleSub as any}
            handleReset={handleReset}
            dayjs={dayjs}
          />
        </ConteudoPagina>

        <Row>
          <Col xs={24}>
            <TableContainer>
              <ConvocacaoTable
                canChangeProcessoConvocacao={canChangeProcessoConvocacao}
                canDeleteProcessoConvocacao={canDeleteProcessoConvocacao}
                canViewDetailsProcessoConvocacao={
                  canViewDetailsProcessoConvocacao
                }
                canFinalizeProcessoConvocacao={canFinalizeProcessoConvocacao}
                onFinalizar={openModalFinalizar}
                finalizandoUuid={finalizandoUuid}
                loading={processosConvocacaoIsLoading}
                data={processosConvocacaoData?.results || []}
                pagination={{
                  current: listRequest.pagination.page,
                  pageSize: 10,
                  defaultPageSize: 10,
                  position: ["bottomLeft"],
                  total: processosConvocacaoData?.count,
                  showTotal: (total, range) => (
                    <span style={{ marginLeft: 16 }}>
                      {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
                    </span>
                  ),
                }}
                onChange={onAntTableChange}
              />
            </TableContainer>
          </Col>
        </Row>

        <FinalizarProcessoModal
          open={modalFinalizarOpen}
          confirmLoading={!!finalizandoUuid}
          onCancel={closeModalFinalizar}
          onConfirm={handleConfirmFinalizar}
        />
      </BaseTela>
    </PageContainer>
  );
};

export default ConvocacaoCandidatosTela;
