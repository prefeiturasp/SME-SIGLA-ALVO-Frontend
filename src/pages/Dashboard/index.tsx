import BaseScreen, { type TitleItem } from "../BaseScreen";




const breadcrumbItems=[
      {
        title: 'Home',
      },
      {
        title: <a href="">Processos</a>,
      },
      {
        title:'Consulta de candidatos',        
      }
    ] as TitleItem[];
    






export const Dashboard: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Consulta de convocação de candidatos'>
        Dashboard
    </BaseScreen>

 );

