import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import type { IProcessoConvocacao } from "../../../../services/resources/convocacao/IConvocacao";
import { CaretUpOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import { Button, Space } from "antd";
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
  viewIcon,
  deleteIcon,
  finalizarButton,
  finalizarButtonHover,
  finalizarButtonLeave,
  emptyTextContainer,
  hiddenButton
} from "./style";

interface ConvocacaoTableProps extends TableProps<IProcessoConvocacao> {
  data: IProcessoConvocacao[];
}

const ConvocacaoTable: React.FC<ConvocacaoTableProps> = ({ data, ...rest }) => {
  const navigate = useNavigate();
  
  const handleEdit = (editData: IProcessoConvocacao) => {    
    navigate(`editar`, {state:{editData}});
  };

  const handleView = (viewData: IProcessoConvocacao) => {    
    navigate(`editar`, {state:{editData: viewData, isViewMode: true}});
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
        
        return (
          <Space size="small">
            {!isFinalizado ? (
              <Button
                type={"link"}
                icon={
                  <EditOutlined 
                    style={editIcon}
                  />
                }
                onClick={() => handleEdit(record)}
              />
            ) : (
              <Button
                type={"link"}
                style={hiddenButton}
                icon={
                  <EditOutlined 
                    style={editIcon}
                  />
                }
              />
            )}

            <Button
              type={"link"}
              icon={
                <EyeOutlined 
                  style={viewIcon}
                />
              }
              onClick={() => handleView(record)}
            />

            {!isFinalizado ? (
              <Button
                type={"link"}
                icon={
                  <DeleteOutlined 
                    style={deleteIcon}
                  />
                }
                onClick={() => console.log("delete", record)}
              />
            ) : (
              <Button
                type={"link"}
                style={hiddenButton}
                icon={
                  <DeleteOutlined 
                    style={deleteIcon}
                  />
                }
              />
            )}

            {!isFinalizado && (
              <Button
                style={finalizarButton}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, finalizarButtonHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, finalizarButtonLeave);
                }}
                onClick={() => console.log(record)}
              >
                Finalizar Processo
              </Button>
            )}
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
    </>
  );
};

export default ConvocacaoTable;
