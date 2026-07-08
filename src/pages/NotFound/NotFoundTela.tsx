import { useNavigate } from "react-router-dom";
import { Result } from 'antd';
import { AppButton } from '@/components/ui';




const NotFoundTela = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Desculpe, a página que você visitou não existe."
      extra={
        <AppButton onClick={() => navigate('/')}>
          Voltar pra Home
        </AppButton>
      }
    />
  )
}

export default NotFoundTela;
