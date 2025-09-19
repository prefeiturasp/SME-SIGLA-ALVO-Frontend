import React from "react";
import { Typography } from "antd";
import { useAgenda, type Option } from "../../hooks/useAgenda";
import AgendaForm from "./AgendaForm";
import AgendaTabela from "./AgendaTabela";

const { Title } = Typography;

interface AgendaTelaProps {
  cargosDisponiveis: Option[];
  watchFields: any;
}

const AgendaTela: React.FC<AgendaTelaProps> = ({
  cargosDisponiveis,
  watchFields: _, // Pode ser usado futuramente para sincronização
}) => {
  // Hook com toda a lógica da agenda
  const {
    control,
    formErrors,
    isRetardatario,
    setIsRetardatario,
    periodosList,
    getErrorMessage,
    isAgendaComplete,
    handleAdicionarPeriodo,
    handleRemoverPeriodo,
  } = useAgenda(cargosDisponiveis);

  return (
    <div>
      <Title level={3}>Agenda</Title>

      <AgendaForm
        control={control}
        formErrors={formErrors}
        cargosDisponiveis={cargosDisponiveis}
        isRetardatario={isRetardatario}
        setIsRetardatario={setIsRetardatario}
        getErrorMessage={getErrorMessage}
        isAgendaComplete={isAgendaComplete}
        handleAdicionarPeriodo={handleAdicionarPeriodo}
      />

      <AgendaTabela
        periodosList={periodosList}
        handleRemoverPeriodo={handleRemoverPeriodo}
      />
    </div>
  );
};

export default AgendaTela;
