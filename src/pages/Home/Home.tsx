import { Typography } from "antd";
import BaseScreen, { type TitleItem } from "../BaseScreen";



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




export const Home: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Consulta de convocação de candidatos'>
        HOME
    </BaseScreen>

 );

