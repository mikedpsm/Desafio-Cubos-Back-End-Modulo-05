const yup = require('./yup');

const schemaEditUser = yup.object().shape({
  username: yup.string('Dados inválidos'),
  email: yup.string().email('Formato de email inválido!'),
  passwd: yup.string().required('É obrigatório informar a senha!').min(8),
  cpf: yup.string('CPF deve ser preenchido com valores válidos'),
  phone: yup.number(),
});

module.exports = schemaEditUser;
