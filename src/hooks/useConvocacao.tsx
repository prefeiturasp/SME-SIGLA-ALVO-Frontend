// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";

// import { API } from "../api";

// import type { ISample, IProcessoConvocacao } from "../api/resources/sample/ISample";
// import type { NotificationInstance } from "antd/es/notification/interface";

// const useConvocacao = (api: NotificationInstance) => {
 

//   const {
//     data: dataAllConvocacaoTable,
//     isFetching: isLoadingConvocacaoTable,
//     refetch: isRefetchConvocacaoTable,
//   } = useQuery({
//     queryKey: ["dataAllConvocacaoTable"],
//     refetchOnWindowFocus: false,
//     queryFn: () => API.Convocacao.getProcessosConvocacao().response,
//   });


//   return {
//     isLoadingConvocacaoTable,
//     dataAllConvocacaoTable,
//   };
// };

// export default useConvocacao;
