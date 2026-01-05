import React from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, Space, Switch, Tooltip } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

import { StyledTable } from "../../../../components/EstilosCompartilhados";
import { editIcon, viewIcon } from "../../../Processos/ConvocacaoCandidatos/components/style";
import type {
  IPermissaoUsuarioRow,
  PermissaoUsuarioTableProps,
} from "../../../../services/resources/permissoes/IPermissoes";

const PermissaoUsuarioTable: React.FC<PermissaoUsuarioTableProps> = ({
  data,
  onEdit,
  onView,
  onToggleAtivacao,
  ...rest
}) => {
  const columns: ColumnsType<IPermissaoUsuarioRow> = [
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Permissões",
      dataIndex: "permissoes",
      key: "permissoes",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      width: "10%",
      title: "Ativação",
      dataIndex: "desativar",
      key: "desativar",
      render: (_, record) => (
        <Switch
          checked={record.ativo ?? true}
          onChange={(checked) => onToggleAtivacao?.(record, checked)}
        />
      ),
    },
    {
      width: "14%",
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Space size="small">
            <Tooltip title="Editar" arrow={true}>
              <Button
                type="link"
                icon={<EditOutlined style={{ ...editIcon, color: "#0F59C8" }} />}
                onClick={() => onEdit?.(record)}
              />
            </Tooltip>
            <Tooltip title="Visualizar" arrow={true}>
              <Button
                type="link"
                icon={<EyeOutlined style={viewIcon} />}
                onClick={() => onView?.(record)}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <StyledTable<IPermissaoUsuarioRow>
      columns={columns}
      dataSource={data}
      rowKey={(row) => row.uuid}
      bordered
      {...rest}
    />
  );
};

export default PermissaoUsuarioTable;
