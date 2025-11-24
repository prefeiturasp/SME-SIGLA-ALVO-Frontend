// utils/parsers.ts
// import type { IBackendWithSubOptions } from "../types/IListRequest";

// // Parser para concursos -> [{ value, label }]
// export const parseConcursosToOptions = (concursos: IBackendWithSubOptions[]) => {
//   return concursos.map((c) => ({
//     value: c.uuid,
//     label: c.nome,
//     cargos: c.cargos  
//   }));
// };

// [
//     { 
//         value:'jereuroi334u3',
//         label:'xyz', 
//         cargos:[
//         { 
//             value:1,
//             label:'cargo1'
//         }]
//      }
// ]

// // Parser para cargos do concurso selecionado -> [{ value, label }]
// export const parseCargosToOptions = (cargos: IBackendWithSubOptions["cargos"]) => {
//   return cargos.map((cargo) => ({
//     value: cargo.uuid,
//     label: cargo.nome
//   }));
// };
