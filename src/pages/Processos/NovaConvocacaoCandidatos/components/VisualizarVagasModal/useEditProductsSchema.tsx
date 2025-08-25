import * as yup from 'yup';

const useEditProductsSchema = () => {
 
  return yup.object({
     
     name: yup.string().required("campo obrigatório"),
    description: yup.string().required("campo obrigatório"),
    stock: yup
      .number()
      .min(1, 'valor mínino do campo')
      .required("campo obrigatório"),
    price: yup
      .number()
      .min(0.01, 'valor mínino do campo')
      .required("campo obrigatório"),
    is_active: yup.boolean().required(),
  });
};


export default useEditProductsSchema;
