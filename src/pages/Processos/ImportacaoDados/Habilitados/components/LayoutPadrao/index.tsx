import React from "react";
import { Table, Typography } from "antd";
import { LayoutContainer, HeaderSection, TableContainer, ButtonContainer } from '@/components/ui';
import { AppButton } from '@/components/ui';
import { API } from "../../../../../../services";
import { useQuery } from "@tanstack/react-query";
import type { ILayout } from "../../../../../../services/resources/importacaoDados/IImportacaoArquivos";

const columns = [
  {
    title: "Ordem",
    dataIndex: "ordem",
    key: "ordem",
    width: "10%",
    align: "center" as const,
  },
  {
    title: "Campo",
    dataIndex: "campo",
    key: "campo",
    width: "25%",
  },
  {
    title: "Tipo de dado",
    dataIndex: "tipoDado",
    key: "tipoDado",
    width: "15%",
  },
  {
    title: "Tamanho",
    dataIndex: "tamanho",
    key: "tamanho",
    width: "10%",
    align: "center" as const,
  },
  {
    title: "Regras de validação",
    dataIndex: "regrasValidacao",
    key: "regrasValidacao",
    width: "40%",
    render: (text: string) => (
      <span style={{ color: text?.includes("obrigatório") ? "#ff4d4f" : "inherit" }}>
        {text}
      </span>
    ),
  },
];

 
const { Title } = Typography;

interface LayoutPadraoProps {
  loading:boolean;
  tipo: string;
  onVoltar: () => void;
  dataSource: ILayout[],
  title: string,
}

const LayoutPadrao: React.FC<LayoutPadraoProps> = ({ loading,tipo, onVoltar, dataSource, title }) => {


  const { refetch: refetchDownload, isFetching: isDownloading } = useQuery({
    queryKey: ["layout-download", tipo],
    queryFn: ({ signal }) => API.ImportacaoDados.getLayoutDownload({ tipo: tipo }, { signal }).response,
    enabled: false,
  });

  const handleSalvarArquivo = async () => {
    const { data } = await refetchDownload();
    if (!data) return;
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout_'+tipo+'.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <LayoutContainer>
        <HeaderSection>
          <Title level={3}>{title}</Title>
        </HeaderSection>

        <TableContainer>
          <Table
          loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="middle"
            scroll={{ x: "100%" }}
          />
        </TableContainer>
      </LayoutContainer>

      <ButtonContainer>
        <AppButton
          variant="secondary"
          size="large"
          onClick={onVoltar}
        >
          Voltar
        </AppButton>
        <AppButton
          variant="primary"
          size="large"
          onClick={handleSalvarArquivo}
          loading={isDownloading}
        >
          Exportar
        </AppButton>
      </ButtonContainer>
    </div>
  );
};

export default LayoutPadrao;