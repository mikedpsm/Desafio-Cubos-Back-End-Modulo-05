const yup = require('yup');

const schemaEditInvoice = yup.object().shape({
  description: yup.string().required('Descrição da cobrança é obrigatória'),
  duedate: yup.string().required('Data de vencimento é obrigatória'),
  total: yup.number().required('Valor total é obrigatório'),
  paidout: yup.boolean().required('Status da cobrança é obrigatório'),
});

module.exports = schemaEditInvoice;
