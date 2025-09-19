import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';




const NotFoundTela = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Desculpe, a página que você visitou não existe."
      extra={
        <Button
          type="primary"
          onClick={() => navigate('/')}
          >
          Voltar pra Home
        </Button>
      }
    />
  )
}

export default NotFoundTela;
