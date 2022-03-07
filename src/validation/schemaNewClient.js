const yup = require('./yup');

const schemaClient = yup.object().shape({
  username: yup.string().required('Campo nome é obrigatório'),
  email: yup.string().email().required('Campo email é obrigatório'),
  cpf: yup.number('Use apenas números no campo cpf!').required('Campo cpf é obrigatório'),
  phone: yup.number('Use apenas números no campo telefone').required('Campo telefone é obrigatório'),
  city: yup.string(),
  uf: yup.string().max(2),
  cep: yup.string(),
  street: yup.string(),
  region: yup.string(),
  complement: yup.string(),
});

module.exports = schemaClient;
