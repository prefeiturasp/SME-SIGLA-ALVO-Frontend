import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Login} from "../pages/Login";
import {Dashboard} from "../pages/Dashboard";
import ProtectedRoute from "./protected";


import NotFound from "../pages/NotFound";
import { Home } from "../pages/Home/Home";
import { Processos } from "../pages/Processos";
import ProcessosConvocacao from "../pages/ProcessosConvocacao";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/processos/convocacao",
    element: <ProcessosConvocacao />,
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
