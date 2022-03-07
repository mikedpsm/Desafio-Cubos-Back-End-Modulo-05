const yup = require('./yup');

const schemaEditClient = yup.object().shape({
  username: yup.string('Dados inválidos').required(),
  email: yup.string().email('Formato de email inválido!').required(),
  cpf: yup.string('CPF deve ser preenchido com valores válidos').required(),
  phone: yup.number().required(),
});

module.exports = schemaEditClient;
