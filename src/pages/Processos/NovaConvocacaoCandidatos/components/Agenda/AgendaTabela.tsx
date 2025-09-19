import React from "react";
import { Table, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

interface PeriodoItem {
  id: number;
  cargo: string;
  convocacao: string;
  dataEscolha: string;
  sessao: string;
  horario: string;
}

interface AgendaTabelaProps {
  periodosList: PeriodoItem[];
  handleRemoverPeriodo: (id: number) => void;
}

const AgendaTabela: React.FC<AgendaTabelaProps> = ({
  periodosList,
  handleRemoverPeriodo,
}) => {
  if (periodosList.length === 0) {
    return null;
  }

  const columns = [
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Convocação',
      dataIndex: 'convocacao',
      key: 'convocacao',
    },
    {
      title: 'Data da Escolha',
      dataIndex: 'dataEscolha',
      key: 'dataEscolha',
      align: 'center' as const,
    },
    {
      title: 'Sessão',
      dataIndex: 'sessao',
      key: 'sessao',
    },
    {
      title: 'Horário',
      dataIndex: 'horario',
      key: 'horario',
      align: 'center' as const,
    },
    {
      title: 'Ações',
      key: 'acoes',
      align: 'center' as const,
      render: (_: any, record: PeriodoItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<ModeEditOutlineOutlinedIcon style={{ color: "#05409A" }} />}
            onClick={() => {}} // Sem ação por enquanto, apenas visual
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoverPeriodo(record.id)}
            style={{ color: '#ff4d4f' }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <Table
        dataSource={periodosList}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{
          backgroundColor: '#fff',
        }}
        rowClassName={(_: any, index: number) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        components={{
          body: {
            row: (props: any) => (
              <tr 
                {...props} 
                style={{
                  backgroundColor: props.className?.includes('table-row-dark') ? '#f5f5f5' : '#fff'
                }}
              />
            )
          }
        }}
      />
    </div>
  );
};

export default AgendaTabela;
