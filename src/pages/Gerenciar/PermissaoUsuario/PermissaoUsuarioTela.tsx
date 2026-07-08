import React from "react";
import { Input, Select, Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";

import { Controller } from "react-hook-form";

import PermissaoUsuarioTable from "./components/PermissaoUsuarioTable";
import EditarPermissaoModal from "./components/EditarPermissaoModal";
import AtivacaoModal from "./components/AtivacaoModal";
import SucessoModal from "./components/SucessoModal";
import { AppButton, AppFormItem, FilterInlineRow, FilterFieldCol, FilterActionsGroup } from '@/components/ui';
import type {
  AtivacaoModalMode,
  AtivacaoModalStep,
  EditarPermissaoModalMode,
  IPermissaoUsuarioRow,
} from "../../../services/resources/permissoes/IPermissoes";
import { getGruposDisponiveisOptions, getUsuariosComGrupos } from "./hooks/getPermissaoUsuario";
import { patchUsuario } from "./hooks/patchAtualizarPermissoesUsuarios";

import {
  PageContainer,
  ConteudoPagina,
  SearchTableContainer as TableContainer,
  FieldLabel,
  SearchFieldsContainer,
} from "@/components/ui";

const { Text } = Typography;

const PermissaoUsuarioTela: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<EditarPermissaoModalMode>("edit");
  const [selectedUser, setSelectedUser] = React.useState<IPermissaoUsuarioRow | undefined>(
    undefined
  );
  const [permissaoSucessoOpen, setPermissaoSucessoOpen] = React.useState(false);
  const [permissaoSucessoNome, setPermissaoSucessoNome] = React.useState<string>("");
  const [ativacaoModalOpen, setAtivacaoModalOpen] = React.useState(false);
  const [ativacaoModalMode, setAtivacaoModalMode] = React.useState<AtivacaoModalMode>("desativar");
  const [ativacaoModalStep, setAtivacaoModalStep] = React.useState<AtivacaoModalStep>("confirm");
  const [ativacaoTarget, setAtivacaoTarget] = React.useState<IPermissaoUsuarioRow | undefined>(
    undefined
  );
  const [ativacaoNextChecked, setAtivacaoNextChecked] = React.useState<boolean>(true);
  const didInitRef = React.useRef(false);
  const [usuarios, setUsuarios] = React.useState<IPermissaoUsuarioRow[]>([]);
  const [usuariosLoading, setUsuariosLoading] = React.useState(false);
  const [usuariosTotal, setUsuariosTotal] = React.useState(0);
  const [usuariosError, setUsuariosError] = React.useState<string | null>(null);
  const [gruposOptions, setGruposOptions] = React.useState<Array<{ value: string; label: string }>>(
    []
  );
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/gerenciar")}>
          Gerenciar
        </Text>
      ),
    },
    { title: "Gerenciamento de usuários" },
  ] as TitleItem[];

  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      login_rf: "",
      nome: "",
      permissao_tipo: undefined as unknown as string | undefined,
    },
  });

  const handleReset = () => {
    reset();
    setPagination({ current: 1, pageSize: 10 });
    void handleSub({ login_rf: "", nome: "", permissao_tipo: undefined });
  };

  const handleSub = async (values?: any) => {
    const login = values?.login_rf?.trim?.() || undefined;
    const nome = values?.nome?.trim?.() || undefined;
    const permissao = values?.permissao_tipo || undefined;

    // Resetar paginação ao fazer nova busca
    setPagination({ current: 1, pageSize: pagination.pageSize });
    setUsuariosLoading(true);
    setUsuariosError(null);
    try {
      // Evita enviar ?usuario=undefined (ou vazio)
      const params = login ? { usuario: login } : undefined;
      const data = await getUsuariosComGrupos(params);
      const mapped: IPermissaoUsuarioRow[] = (data.results || []).map((u: any, idx: number) => {
        const grupos = u.grupos || [];
        const permissoesTexto = (grupos || []).filter(Boolean).join("/") || "Usuário sem permissão";
        return {
          uuid: u.usuario || String(idx),
          username: u.usuario,
          login: u.usuario,
          nome: u.nome || undefined,
          email: u.email || undefined,
          grupos,
          permissoes: permissoesTexto,
          ativo: u.is_active ?? true,
        };
      });

      // Filtro client-side por nome e permissao (backend só filtra por usuario)
      const filtered = mapped.filter((row) => {
        const okNome = nome
          ? (row.nome || "").toLowerCase().includes(String(nome).toLowerCase())
          : true;
        const okPerm = permissao ? (row.grupos || []).includes(permissao) : true;
        return okNome && okPerm;
      });

      setUsuarios(filtered);
      setUsuariosTotal(filtered.length);
    } catch (e: any) {
      console.error("Falha ao carregar usuários/grupos:", e);
      setUsuarios([]);
      setUsuariosTotal(0);
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Falha ao carregar usuários do AdminUsuarios.";
      setUsuariosError(String(msg));
      message.error("Não foi possível carregar os usuários.");
    } finally {
      setUsuariosLoading(false);
    }
  };

  React.useEffect(() => {
    // Em dev, o React StrictMode pode disparar effects 2x. Evitamos requests duplicados.
    if (didInitRef.current) return;
    didInitRef.current = true;

    // carrega grupos e lista inicial
    const load = async () => {
      try {
        setGruposOptions(await getGruposDisponiveisOptions());
      } catch {
        setGruposOptions([]);
      }
    };
    void load();
    void handleSub({ login_rf: "", nome: "", permissao_tipo: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (mode: EditarPermissaoModalMode, row: IPermissaoUsuarioRow) => {
    setSelectedUser(row);
    setModalMode(mode);
    setModalOpen(true);
  };

  const onToggleAtivacao = (row: IPermissaoUsuarioRow, nextChecked: boolean) => {
    setAtivacaoTarget(row);
    setAtivacaoNextChecked(nextChecked);
    setAtivacaoModalMode(nextChecked ? "ativar" : "desativar");
    setAtivacaoModalStep("confirm");
    setAtivacaoModalOpen(true);
  };

  return (
    <PageContainer>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Gerenciamento de usuários"
        buttons={
          <AppButton
            variant="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => navigate("/gerenciar/adicao-usuario")}
          >
            Adicionar usuário
          </AppButton>
        }
      >
        <SucessoModal
          open={permissaoSucessoOpen}
          texto={
            <>
              Permissão concedida com sucesso <br />
              para o usuário <strong>{permissaoSucessoNome}</strong>!
            </>
          }
          onOk={() => setPermissaoSucessoOpen(false)}
        />
        <AtivacaoModal
          open={ativacaoModalOpen}
          mode={ativacaoModalMode}
          nomeUsuario={ativacaoTarget?.nome || ativacaoTarget?.login}
          permissao={ativacaoTarget?.permissoes}
          step={ativacaoModalStep}
          onCancel={() => {
            setAtivacaoModalOpen(false);
            setAtivacaoModalStep("confirm");
          }}
          onConfirm={() => {
            const run = async () => {
              if (!ativacaoTarget) return;
              const username = ativacaoTarget.username || ativacaoTarget.login;
              if (!username) return;

              try {
                await patchUsuario({ username, is_active: ativacaoNextChecked });
                setUsuarios((prev) =>
                  prev.map((u) =>
                    u.uuid === ativacaoTarget.uuid ? { ...u, ativo: ativacaoNextChecked } : u
                  )
                );
                setAtivacaoModalStep("success");
              } catch (e: any) {
                console.error("Falha ao atualizar is_active:", e);
                message.error("Não foi possível atualizar a ativação do usuário.");
                setAtivacaoModalOpen(false);
                setAtivacaoModalStep("confirm");
              }
            };
            void run();
          }}
          onOk={() => {
            setAtivacaoModalOpen(false);
            setAtivacaoModalStep("confirm");
          }}
        />
        <EditarPermissaoModal
          open={modalOpen}
          mode={modalMode}
          data={{
            login: selectedUser?.login,
            nome: selectedUser?.nome,
            email: selectedUser?.email,
            permissoes: selectedUser?.grupos || (selectedUser?.permissoes ? [selectedUser.permissoes] : []),
          }}
          username={selectedUser?.username || selectedUser?.login}
          onClose={() => setModalOpen(false)}
          permissoesOptions={gruposOptions}
          onSuccess={(savedNome) => {
            setPermissaoSucessoNome(savedNome || selectedUser?.nome || selectedUser?.login || "");
            setPermissaoSucessoOpen(true);
            setModalOpen(false);
            const vals = (control as any)?._formValues ?? {};
            void handleSub(vals);
          }}
        />
        <ConteudoPagina>
          <SearchFieldsContainer>
            <FilterInlineRow gutter={[16, 8]}>
              <FilterFieldCol xs={24} md={8}>
                <Controller
                  control={control}
                  name="login_rf"
                  render={({ field }) => (
                    <AppFormItem
                      label={<FieldLabel>Login (RF)</FieldLabel>}
                      validateStatus={
                        (formState.errors as any).login_rf ? "error" : undefined
                      }
                      help={(formState.errors as any).login_rf?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Input
                        {...field}
                        placeholder="Entre com o RF"
                      />
                    </AppFormItem>
                  )}
                />
              </FilterFieldCol>

              <FilterFieldCol xs={24} md={8}>
                <Controller
                  control={control}
                  name="nome"
                  render={({ field }) => (
                    <AppFormItem
                      label={<FieldLabel>Nome</FieldLabel>}
                      validateStatus={
                        (formState.errors as any).nome ? "error" : undefined
                      }
                      help={(formState.errors as any).nome?.message}
                      labelCol={{ span: 24 }}
                      className="custom-form-item-cargo"
                    >
                      <Input
                        {...field}
                        placeholder="Entre com o nome"
                      />
                    </AppFormItem>
                  )}
                />
              </FilterFieldCol>

              <FilterFieldCol xs={24} md={8}>
                <Controller
                  control={control}
                  name="permissao_tipo"
                  render={({ field }) => (
                    <AppFormItem
                      label={<FieldLabel>Permissões</FieldLabel>}
                      validateStatus={
                        (formState.errors as any).permissao_tipo
                          ? "error"
                          : undefined
                      }
                      help={(formState.errors as any).permissao_tipo?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        value={(field.value as any) ?? undefined}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        style={{ width: "100%" }}
                        placeholder="Selecione o tipo de permissão"
                        allowClear
                        options={gruposOptions}
                      />
                    </AppFormItem>
                  )}
                />
              </FilterFieldCol>

            </FilterInlineRow>
            <FilterInlineRow gutter={[16, 8]} style={{ marginTop: "1rem" }}>
              <FilterFieldCol xs={24} md={{ span: 8, offset: 16 }}>
                <FilterActionsGroup>
                  <AppButton variant="secondary" size="large" onClick={handleReset}>
                    Limpar filtros
                  </AppButton>
                  <AppButton variant="primary" size="large" onClick={handleSubmit(handleSub as any)}>
                    Buscar
                  </AppButton>
                </FilterActionsGroup>
              </FilterFieldCol>
            </FilterInlineRow>
          </SearchFieldsContainer>
        </ConteudoPagina>

        <TableContainer>
          {usuariosError && (
            <Typography.Text type="danger" style={{ display: "block", marginBottom: 12 }}>
              {usuariosError}
            </Typography.Text>
          )}
          <PermissaoUsuarioTable
            loading={usuariosLoading}
            data={usuarios}
            onEdit={(row: IPermissaoUsuarioRow) => openModal("edit", row)}
            onView={(row: IPermissaoUsuarioRow) => openModal("view", row)}
            onToggleAtivacao={onToggleAtivacao}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              defaultPageSize: 10,
              position: ["bottomLeft"],
              total: usuariosTotal,
              showTotal: (total: number, range: [number, number]) => (
                <span style={{ marginLeft: 16 }}>
                  {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
                </span>
              ),
            }}
            onChange={(paginationConfig) => {
              if (paginationConfig.current !== undefined) {
                setPagination({
                  current: paginationConfig.current,
                  pageSize: paginationConfig.pageSize || pagination.pageSize,
                });
              }
            }}
          />
        </TableContainer>
      </BaseTela>
    </PageContainer>
  );
};

export default PermissaoUsuarioTela;
