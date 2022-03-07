const express = require('express');
const knex = require('../database/connection');
const user = require('../controller/userController');
const client = require('../controller/clientController');
const invoice = require('../controller/invoiceController');
const loginFilter = require('../filters/login');

const router = express();

// User
router.get('/test', async (req, res) => {
  const invoiceQuery = await knex.raw('SELECT CAST(duedate as DATE) FROM invoice WHERE id = 14');

  return res.status(200).json(invoiceQuery.rows);
});
router.post('/user/login', user.login);
router.post('/user', user.addNewUser);
router.use(loginFilter); // Everything underneath this router needs authentication
router.patch('/user', user.editUser);
router.get('/user', user.getUser);

// Client
router.get('/clients', client.getClients);
router.get('/client/:cpf', client.getClient);
router.post('/client', client.addNewClient);
router.patch('/client/:cpf', client.editClient);
router.delete('/client/:cpf', client.deleteClient);

// Invoice
router.get('/invoices/:cpf', invoice.getInvoices); // Get invoices from a especific client

router.get('/invoices', invoice.getAllInvoices); // Get invoices from all clients
router.get('/invoice/:id', invoice.getInvoice); // Get a especific invoice using an id
router.get('/invoice', invoice.getTotal); // Home page data
router.post('/invoice/:cpf', invoice.addNewInvoice);
router.patch('/invoice/:id', invoice.editInvoice);
router.delete('/invoice/:id', invoice.deleteInvoice);

module.exports = router;
