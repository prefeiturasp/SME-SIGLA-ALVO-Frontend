import React from "react";
import { Row, Col, Select, Button, Tooltip } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDados } from "./hooks/useImportacaoDadosHabilitados";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  StyledSelect,
  UploadArea,
  StyledUpload,
  ActionButtonsContainer,
  GrupoEsquerda,
} from "../../../components/EstilosCompartilhados";
import { useConcursos } from "../../../hooks/useConcursos";
import { CloudUploadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";

interface HabilitadosProps {
  onShowLayoutPadrao: () => void;
  onShowHistorico: () => void;
  canViewHistoricoHabilitados: boolean;
  canImportarHabilitados: boolean;
}

const HabilitadosFormTab: React.FC<HabilitadosProps> = ({
    onShowLayoutPadrao,
    onShowHistorico,
    canViewHistoricoHabilitados,
    canImportarHabilitados
}) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch    
  } = useImportacaoDados();
  const navigate = useNavigate();
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");
  
  return (
    <>
    <TabContentContainer>
      

        <Row
          
          gutter={40}
        >
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="concurso"
              render={({ field }) => (
                <CustomFormItem
                  label="Concurso"
                  validateStatus={formErrors.concurso ? "error" : undefined}
                  help={formErrors.concurso?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    {...field}
                    placeholder="Selecione o concurso"
                    loading={concursosOptionsIsLoading}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {Array.isArray(concursosData)
                      ? concursosData.map((concurso: any) => (
                          <Select.Option
                            key={concurso.value}
                            value={concurso.value}
                          >
                            {concurso.label}
                          </Select.Option>
                        ))
                      : concursosData?.results?.map((concurso: any) => (
                          <Select.Option
                            key={concurso.value}
                            value={concurso.value}
                          >
                            {concurso.label}
                          </Select.Option>
                        ))}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>
        

        <Col xs={24} sm={12}>
          <Controller
            control={control}
            name="arquivo"
            render={() => (
              <FormItem
                validateStatus={formErrors.arquivo ? "error" : undefined}
                help={formErrors.arquivo?.message}                
                labelCol={{ span: 24 }}
              >
                
                <StyledUpload
                  disabled={!canImportarHabilitados}
                  beforeUpload={(file) => {
                    handleFileUpload(file);
                    return false;
                    // Impede o upload automático
                  }}
                  accept=".csv"
                  showUploadList={false}
                  multiple={false}
                >
                  <Tooltip title={!canImportarHabilitados?"Você não possui permissão para essa ação":"Selecionar arquivo"} arrow={true} >
                  <UploadArea style={{ height: "64px" }} status={formErrors.arquivo ? "error" : undefined}>
                  <GrupoEsquerda>
                  <CloudUploadOutlined style={{ fontSize: 38, color: "#838383" }} />

                    <span style={{ color: "#666", fontSize: "14px", textAlign: "left" }}>
                      {watchedFile
                        ? watchedFile.name
                        : <>
                        Selecione ou arraste e solte aqui <br />o arquivo de importação (.csv)
                          </>                      
                        }
                    </span>
                    </GrupoEsquerda>

                    <Button type="primary" size="small" style={{ fontSize: "14px" }}>
                      Selecionar
                    </Button>
                  </UploadArea>
                  </Tooltip>

                </StyledUpload>
                
              </FormItem>
            )}
          />
        </Col>
        </Row>

      

    </TabContentContainer>
    <ActionButtonsContainer>
      <Tooltip title={!canViewHistoricoHabilitados?"Você não possui permissão para essa ação":"Histórico"} arrow={true} >
    <Button type="primary" ghost size="large" onClick={onShowHistorico} disabled={!canViewHistoricoHabilitados}>
      Histórico
    </Button>        
    </Tooltip>
    <Tooltip title={!canImportarHabilitados?"Você não possui permissão para essa ação":"Importar"} arrow={true} >
    <Button type="primary" size="large" onClick={handleSubmit(handleEnviarForm)} disabled={!canImportarHabilitados}>
    Importar
    </Button>
    </Tooltip>
  </ActionButtonsContainer>
  </>
  );
};

export default HabilitadosFormTab;
