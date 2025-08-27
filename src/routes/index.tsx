import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Dashboard} from "../pages/Dashboard";
import ProtectedRoute from "./protected";


import NotFound from "../pages/NotFound";
import { Home } from "../pages/Home/Home";
import ConvocacaoCandidatos from "../pages/Processos/ConvocacaoCandidatos";
import NovaConvocacaoCandidatos from "../pages/Processos/NovaConvocacaoCandidatos";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/processos/convocacao",
    element: <ConvocacaoCandidatos />,
  },
  {
    path: "/processos/convocacao/nova",
    element: <NovaConvocacaoCandidatos />,
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
