import BaseScreen, { type TitleItem } from "../BaseScreen";




const breadcrumbItems=[
      {
        title: <a href="/">Home</a>,
      },
      {
        title:'Processos',
      },
      
    ] as TitleItem[];
    






export const Processos: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Processos sample screen'>
        Processos
    </BaseScreen>

 );

