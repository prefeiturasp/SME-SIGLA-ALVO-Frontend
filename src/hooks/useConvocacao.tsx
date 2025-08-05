// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";

// import { API } from "../api";

// import type { IProduct, INewProductForm } from "../api/resources/products/IProduct";
// import type { NotificationInstance } from "antd/es/notification/interface";

// const useConvocacao = (api: NotificationInstance) => {
 

//   const {
//     data: dataAllProductsTable,
//     isFetching: isLoadingProductsTable,
//     refetch: isRefetchProductsTable,
//   } = useQuery({
//     queryKey: ["dataAllProductsTable"],
//     refetchOnWindowFocus: false,
//     queryFn: () => API.Products.getProductsData().response,
//   });


//   return {
//     isLoadingProductsTable,
//     dataAllProductsTable,
//   };
// };

// export default useConvocacao;
