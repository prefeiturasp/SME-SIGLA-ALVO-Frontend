import { useQuery } from "@tanstack/react-query";

import { API } from "../services";

// import type { IProduct, IProcessoConvocacao } from "../api/resources/products/IProduct";
// import type { NotificationInstance } from "antd/es/notification/interface";

 const useConcursos = () => {
 
   const {
     data,
     isFetching,
     refetch,
   } = useQuery({
     queryKey: ["concursos-lista"],
     refetchOnWindowFocus: false,
     queryFn: () => API.Concursos.getConcursosOptions().response,
   });


   return {
     data,
     isFetching,
     refetch,
  };
};

export default useConcursos;
