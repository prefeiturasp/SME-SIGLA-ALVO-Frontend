import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import type { IProcessoConvocacao } from "../../../../services/resources/convocacao/IConvocacao";
import { CaretUpOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import { Button, Space, Tooltip } from "antd";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import { useNavigate } from "react-router-dom";
import {
  sortIconContainer,
  sortIconUp,
  sortIconDown,
  statusContainer,
  statusDot,
  statusText,
  statusHeaderContainer,
  editIcon,
  editIconEnabled,
  viewIcon,
  finalizarButton,
  finalizarButtonHover,
  finalizarButtonLeave,
  finalizarButtonDisabled,
  emptyTextContainer,
  deleteIconEnabled,
} from "./style";

import { deleteIcon } from "../../../../components/EstilosCompartilhados";
import ConfirmarExclusaoProcessoModal from "./ConfirmarExclusaoProcessoModal";
import { useDeleteProcessoConvocacao } from "../hooks/useDeleteProcessoConvocacao";

interface ConvocacaoTableProps extends TableProps<IProcessoConvocacao> {
  data: IProcessoConvocacao[];
  canChangeProcessoConvocacao: boolean;
  canDeleteProcessoConvocacao: boolean;
  canViewDetailsProcessoConvocacao: boolean;
  canFinalizeProcessoConvocacao: boolean;
  onFinalizar?: (record: IProcessoConvocacao) => void | Promise<void>;
  finalizandoUuid?: string | null;
}

const ConvocacaoTable: React.FC<ConvocacaoTableProps> = ({ data, canChangeProcessoConvocacao, canDeleteProcessoConvocacao, canViewDetailsProcessoConvocacao, canFinalizeProcessoConvocacao, onFinalizar, finalizandoUuid, ...rest }) => {
  const navigate = useNavigate();
  const { deletarProcesso, isDeleting } = useDeleteProcessoConvocacao();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deletingUuidState, setDeletingUuidState] = React.useState<string | null>(null);
  
  const handleEdit = (editData: IProcessoConvocacao) => {    
    const passo = Number(editData.passo ?? 1);
    let path = `editar/${editData.uuid}/dados-processo`;

    if (passo === 1) {
      path = `editar/${editData.uuid}/selecao-cargos`;
    } else if (passo === 2) {
      path = `editar/${editData.uuid}/agenda`;
    } else if (passo >= 3) {
      path = `editar/${editData.uuid}/resumo`;
    }

    navigate(path, { state: { editData } });
  };

  const handleView = (viewData: IProcessoConvocacao) => {
    navigate(`visualizar/${viewData.uuid}/resumo`, { state: { isViewMode: true } });
    return null;
  };

  const isProcessoFinalizado = (status: string | undefined) => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    return statusLower.includes('finalizado') || statusLower.includes('finalizada');
  };

  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(null);
  const [sortField, setSortField] = React.useState<string | null>(null);

  const SortIcon = ({ onSort, field }: { onSort: (order: 'ascend' | 'descend' | null, field: string) => void, field: string }) => {
    const handleSort = () => {
      let newOrder: 'ascend' | 'descend' | null;
      
      if (sortField !== field) {
        newOrder = 'ascend';
        setSortField(field);
      } else if (sortOrder === null) {
        newOrder = 'ascend';
      } else if (sortOrder === 'ascend') {
        newOrder = 'descend';
      } else {
        newOrder = null;
        setSortField(null);
      }
      
      setSortOrder(newOrder);
      onSort(newOrder, field);
    };

    const isActive = sortField === field;

    return (
      <div 
        style={sortIconContainer}
        onClick={handleSort}
      >
        <CaretUpOutlined 
          style={sortIconUp(isActive && sortOrder === 'ascend')} 
        />
        <CaretDownOutlined 
          style={sortIconDown(isActive && sortOrder === 'descend')} 
        />
      </div>
    );
  };

  const StatusRenderer = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('andamento') || statusLower.includes('em andamento')) {
        return {
          color: '#6691D3',
          label: 'Em andamento'
        };
      } else if (statusLower.includes('pendente')) {
        return {
          color: '#BFBFBF',
          label: 'Pendente'
        };
      } else if (statusLower.includes('finalizado') || statusLower.includes('finalizada')) {
        return {
          color: '#8DD57A',
          label: 'Finalizado'
        };
      } else {
        return {
          color: '#BFBFBF',
          label: status
        };
      }
    };

    const config = getStatusConfig(status);

    return (
      <div style={statusContainer}>
        <div
          style={statusDot(config.color)}
        />
        <span style={statusText}>
          {config.label}
        </span>
      </div>
    );
  };

  const getSortedData = () => {
    if (!sortOrder || !sortField) return data;
    
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'data_convocacao':
          aValue = new Date(a.data_convocacao);
          bValue = new Date(b.data_convocacao);
          break;
        case 'concurso_nome':
          aValue = a.concurso_nome || '';
          bValue = b.concurso_nome || '';
          break;
        case 'descricao':
          aValue = a.descricao || '';
          bValue = b.descricao || '';
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'ascend') {
        if (sortField === 'data_convocacao') {
          return aValue.getTime() - bValue.getTime();
        }
        return aValue.localeCompare ? aValue.localeCompare(bValue) : aValue - bValue;
      } else if (sortOrder === 'descend') {
        if (sortField === 'data_convocacao') {
          return bValue.getTime() - aValue.getTime();
        }
        return bValue.localeCompare ? bValue.localeCompare(aValue) : bValue - aValue;
      }
      return 0;
    });
  };

  const handleSort = (order: 'ascend' | 'descend' | null, field: string) => {
    console.log(`Ordenar por ${field}:`, order);
  };

  const columns: ColumnsType<IProcessoConvocacao> = [
    {
      title: (
        <div style={statusHeaderContainer}>
          <SortIcon 
            onSort={handleSort}
            field="descricao"
          />
          <span>Processo</span>
        </div>
      ),
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: (
        <div style={statusHeaderContainer}>
          <SortIcon 
            onSort={handleSort}
            field="concurso_nome"
          />
          <span>Concurso</span>
        </div>
      ),
      dataIndex: "concurso_nome",
      key: "concurso_nome",
    },
    {
      title: (
        <div style={statusHeaderContainer}>
          <SortIcon 
            onSort={handleSort}
            field="data_convocacao"
          />
          <span>Data de Convocação</span>
        </div>
      ),
      dataIndex: "data_convocacao",
      key: "data_convocacao",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: (
        <div style={statusHeaderContainer}>
          <SortIcon 
            onSort={handleSort}
            field="status"
          />
          <span>Status</span>
        </div>
      ),
      dataIndex: "status",
      key: "status",
      sorter: false,
      render: (status: string) => <StatusRenderer status={status} />,
    },
    {
      width: "12%",
      title: "Gerenciar",
      dataIndex: "manageType",
      key: "manageType",
      render: (_, record) => {
        if (!record) return null;
        const isFinalizado = isProcessoFinalizado(record.status);
        const isEditDisabled = isFinalizado || !canChangeProcessoConvocacao;
        const isDeleteDisabled = isFinalizado || !canDeleteProcessoConvocacao || record.pode_deletar === false;
        const isFinalizarDisabled = isFinalizado || !canFinalizeProcessoConvocacao || finalizandoUuid === record.uuid;

        return (
          <Space size="small">
            <Tooltip title={isFinalizado ? "Processo finalizado" : (!canChangeProcessoConvocacao ? "Você não possui permissão para essa ação" : "Editar processo")} arrow={true} >
              <Button
                type={"link"}
                icon={<EditOutlined style={isEditDisabled ? editIcon : editIconEnabled} />}
                onClick={() => !isFinalizado && handleEdit(record)}
                disabled={isEditDisabled}
              />
            </Tooltip>

            <Tooltip title={!canViewDetailsProcessoConvocacao ? "Você não possui permissão para essa ação" : "Visualizar processo"} arrow={true} >
              <Button
                type={"link"}
                icon={<EyeOutlined style={viewIcon} />}
                onClick={() => handleView(record)}
                disabled={!canViewDetailsProcessoConvocacao}
              />
            </Tooltip>

            <Tooltip title={isFinalizado ? "Processo finalizado" : (!canDeleteProcessoConvocacao ? "Você não possui permissão para essa ação" : "Excluir processo")} arrow={true} >
              <Button
                type={"link"}
                icon={<DeleteOutlined style={isDeleteDisabled ? deleteIcon : deleteIconEnabled} />}
                onClick={() => {
                  if (isFinalizado) return;
                  setDeletingUuidState(record.uuid);
                  setDeleteModalOpen(true);
                }}
                disabled={isDeleteDisabled}
              />
            </Tooltip>

            <Tooltip title={isFinalizado ? "Processo finalizado" : (!canFinalizeProcessoConvocacao ? "Você não possui permissão para essa ação" : "Finalizar processo")} arrow={true} >
              <Button
                style={{ ...finalizarButton, ...(isFinalizarDisabled ? finalizarButtonDisabled : {}) }}
                onMouseEnter={(e) => {
                  if (!isFinalizarDisabled) Object.assign(e.currentTarget.style, finalizarButtonHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, isFinalizarDisabled ? finalizarButtonDisabled : finalizarButtonLeave);
                }}
                onClick={() => !isFinalizado && onFinalizar?.(record)}
                disabled={isFinalizarDisabled}
                loading={finalizandoUuid === record.uuid}
              >
                Finalizar Processo
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <StyledTable<IProcessoConvocacao>
        columns={columns}
        dataSource={getSortedData()}
        rowKey="uuid"        
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="convocacao-table"
        locale={{
          emptyText: (
            <div style={emptyTextContainer}>
              Nenhum processo encontrado
            </div>
          )
        }}
        {...rest}
      />
      <ConfirmarExclusaoProcessoModal
        open={deleteModalOpen}
        confirmLoading={isDeleting}
        onCancel={() => {
          if (isDeleting) return;
          setDeleteModalOpen(false);
          setDeletingUuidState(null);
        }}
        onConfirm={() => {
          if (!deletingUuidState) return;
          deletarProcesso(deletingUuidState, {
            onSettled: () => {
              setDeleteModalOpen(false);
              setDeletingUuidState(null);
            },
          } as any);
        }}
      />
    </>
  );
};

export default ConvocacaoTable;
