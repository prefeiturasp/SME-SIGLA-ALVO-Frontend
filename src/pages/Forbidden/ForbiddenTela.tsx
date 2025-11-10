import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
 


const ForbiddenTela = () => {
  const navigate = useNavigate();   

  return (
      <Result
        status="403"
        title="403"
        subTitle="Desculpe, você não está autorizado a acessar esta página"
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/')}
            >
            Voltar pra Home
          </Button>
        }
      />          
  );
};

export default ForbiddenTela;
