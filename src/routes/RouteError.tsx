import React from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { Button, Result, Typography } from "antd";
import type { ResultStatusType } from "antd/es/result";

export default function RouteError(): React.ReactElement {
  const error = useRouteError() as unknown;
  const navigate = useNavigate();

  let status = 500;
  let title = "Algo deu errado";
  let subTitle: React.ReactNode = (
    <Typography.Text>Entre em contato com o Administrador do sistema.</Typography.Text>
  );

  if (isRouteErrorResponse(error)) {
    status = error.status || 500;
    title = `${error.status} ${error.statusText}`;
    subTitle = error.data || subTitle;
  } else if (error instanceof Error) {
    subTitle = error.message;
  }

  return (
    <Result
      status={status as ResultStatusType}
      title={title}
      subTitle={subTitle}
      extra={
        <>
          <Button type="primary" onClick={() => navigate(0)}>Recarregar</Button>
          <Button onClick={() => navigate("/")}>Ir para início</Button>
        </>
      }
    />
  );
}
