import { Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { PlaceholderTestDashboard } from "./styles";
const { Text } = Typography;




 


const breadcrumbItems = [
  {
    title: <a href="/"><Text strong>Home</Text></a>,
  },
  {
    title: <a href="/processos"><Text strong>Processos</Text></a>,
  },
  {
    title: 'Consulta de candidatos',
  },
] as TitleItem[];



export const DashboardTela: React.FC = () => (

    <BaseTela breadcrumbItems={breadcrumbItems}  title='Consulta de convocação de candidatos'>
        <PlaceholderTestDashboard>
            Dashboard
        </PlaceholderTestDashboard>        
    </BaseTela>

 );

