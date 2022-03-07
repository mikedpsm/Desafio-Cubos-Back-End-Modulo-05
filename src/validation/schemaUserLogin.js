const yup = require('./yup');

const schemaUserLogin = yup.object().shape({
  email: yup.string().email().required('O campo email é obrigatório!'),
  passwd: yup.string().required('O campo senha é obrigatório!'),
});

module.exports = schemaUserLogin;
