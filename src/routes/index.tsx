import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Login} from "../pages/Login";
import {Dashboard} from "../pages/Dashboard";
import ProtectedRoute from "./protected";


import NotFound from "../pages/NotFound";
import { Home } from "../pages/Home/Home";
import { Processos } from "../pages/Processos/ConvocacaoConcurso";
import Administracao from "../pages/Administracao";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/administracao",
    element: <Administracao />,
  },
  {
    path: "/processos",
    element: <Processos />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />, 
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
