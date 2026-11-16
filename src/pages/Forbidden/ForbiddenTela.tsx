import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@/components/ui';
 


const ForbiddenTela = () => {
  const navigate = useNavigate();   

  return (
      <Result
        status="403"
        title="403"
        subTitle="Desculpe, você não está autorizado a acessar esta página"
        extra={
          <AppButton onClick={() => navigate('/')}>
            Voltar pra Home
          </AppButton>
        }
      />          
  );
};

export default ForbiddenTela;
