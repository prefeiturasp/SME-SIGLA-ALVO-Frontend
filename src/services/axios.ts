import axios from "axios";

export const appAxiosMock = axios.create({
  baseURL: import.meta.env.VITE_API_MOCK,
});

export const appAxios = axios.create({
  baseURL: "http://127.0.0.1:8000", //todo add in .env
});

export const appAxiosServico1 = axios.create({
  baseURL: "http://+59566985688:8000", //todo add in .env
});

export const appAxiosCandidatos = axios.create({
  baseURL: "http://localhost:8002", //todo add in .env
});


export const appAxiosConcursos = axios.create({
  baseURL: "http://localhost:8001", //todo add in .env
});

export const appAxiosServico3 = axios.create({
  baseURL: "http://localhost:3000", //todo add in .env
});

//import.meta.env.VITE_API,
// appAxios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: any) => {
//     if (
//       error.response?.status !== 401 ||
//       // error.config.url === "/Auth/RefreshToken" ||
//       error.config.url === "/Auth/Login"
//     ) {
//       return Promise.reject(error);
//     }

//     const profile = AppLocalStorage.getItem("APP:USER");
//     const newData: any = { ...profile, token: "expired_toke" };
//     AppLocalStorage.setItem("APP:USER", newData as ISignInResponse);
//     return Promise.reject(error);
//   }
// );
