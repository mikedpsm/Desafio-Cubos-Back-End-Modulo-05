const express = require("express");
const user = require("../controller/userController");
const client = require("../controller/clientController");
const invoice = require("../controller/invoiceController");
const loginFilter = require("../filters/login");

const router = express();

router.post("/user/login", user.login);
router.post("/user", user.addNewUser);
router.use(loginFilter);
router.patch("/user", user.editUser);
router.get("/user", user.getUser);

router.get("/clients", client.getClients);
router.get("/client/:cpf", client.getClient);
router.post("/client", client.addClient);
router.patch("/client/:cpf", client.editClient);
router.delete("/client/:cpf", client.deleteClient);

router.get("/invoices/:cpf", invoice.getInvoices);

router.get("/invoices", invoice.getAllInvoices);
router.get("/invoice/:id", invoice.getInvoice);
router.get("/invoice", invoice.getTotal);
router.post("/invoice/:cpf", invoice.addNewInvoice);
router.patch("/invoice/:id", invoice.editInvoice);
router.delete("/invoice/:id", invoice.deleteInvoice);

module.exports = router;
