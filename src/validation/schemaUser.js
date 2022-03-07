const yup = require('./yup');

const schemaUser = yup.object().shape({
  username: yup.string().required('Campo usuário é obrigatório'),
  email: yup.string().email().required('Campo email é obrigatório'),
  passwd: yup.string().required('Campo senha é obrigatório'),
});

module.exports = schemaUser;
