import BaseScreen, { type TitleItem } from "../BaseScreen";




const breadcrumbItems=[
      {
        title:'Home',
      },

    ] as TitleItem[];
    






export const Home: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Consulta de convocação de candidatos'>
        HOME
    </BaseScreen>

 );

