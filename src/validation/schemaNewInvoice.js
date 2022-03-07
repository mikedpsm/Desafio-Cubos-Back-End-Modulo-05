const yup = require('./yup');

const schemaInvoice = yup.object().shape({
  duedate: yup.string().required('A data de vencimento é obrigatória'),
  total: yup.number().required('Campo total é obrigatório'),
  paidout: yup.bool().required('O status da cobrança é obrigatório'),
  description: yup.string().required('A descrição é obrigatória.'),
});

module.exports = schemaInvoice;
