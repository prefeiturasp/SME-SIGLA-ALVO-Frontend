import { Typography } from "antd";
import BaseScreen, { type TitleItem } from "../BaseScreen";


const { Text } = Typography;


const breadcrumbItems = [
  {
    title: <a href="/"><Text strong>Home</Text></a>,
  },
  {
    title: 'Processos',
  },
] as TitleItem[];





export const Processos: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Processos sample screen'>
        Processos
    </BaseScreen>

 );

