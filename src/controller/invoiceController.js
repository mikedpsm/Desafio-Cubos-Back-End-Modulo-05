const knex = require('../database/connection');
const schemaInvoice = require('../validation/schemaNewInvoice');
const schemaEditInvoice = require('../validation/schemaEditInvoice');

// POST
const addNewInvoice = async (req, res) => {
  const { duedate, paidout, description } = req.body;

  const { total } = req.body;

  const { cpf } = req.params;

  await schemaInvoice.validate(req.body);

  // Check client at database
  try {
    const checkClient = await knex('client').where({ cpf });

    if (checkClient.rows === 0) {
      return res.status(400).json('Cliente não encontrado');
    }

    const dateDayF = duedate.slice(0, 2);
    const dateMonth = duedate.slice(3, 5);
    const dateYear = duedate.slice(6, 10);
    const dateFormatted = dateYear.concat('/', dateMonth, '/', dateDayF);

    const newInvoice = {
      total,
      duedate: dateFormatted,
      client_id: cpf,
      paidout,
      description,
    };

    const newInvoiceQuery = await knex('invoice').insert(newInvoice).returning('*');

    return res.status(201).json(newInvoiceQuery);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// GET
const getInvoices = async (req, res) => {
  const { cpf } = req.params;
  try {
    const listInvoices = await knex('invoice').where({ client_id: cpf });

    if (!listInvoices) {
      return res.status(400).json({ mensagem: 'Não foram encontradas cobranças neste CPF. Verifique os dados.' });
    }

    return res.status(200).json(listInvoices);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// GET
const getAllInvoices = async (req, res) => {
  try {
    const invoiceQuery = await knex.raw('SELECT username, invoice.id, total, duedate, paidout, description FROM invoice JOIN client on invoice.client_id = client.cpf');
    invoiceQuery.rows.forEach((x) => {
      const prefix = x.duedate;
      const duedateM = new Date(`${prefix.toString().slice(4, 7)} 25, 1995 23:15:30`);
      const convertedM = Number(duedateM.getMonth()) + 1;
      const duedateY = x.duedate.toString().slice(11, 15);
      const duedateD = x.duedate.toString().slice(8, 10);
      if (duedateM.getMonth() >= 9) {
        const dateFormatted = duedateD.concat('/', `${convertedM}`, '/', duedateY);
        x.duedate = dateFormatted;
      } else {
        const dateFormatted = duedateD.concat('/', `0${convertedM}`, '/', duedateY);
        x.duedate = dateFormatted;
      }
    });

    return res.status(200).json(invoiceQuery.rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// GET
const getInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const invoiceQuery = await knex('invoice').where({ id }).first();
    return res.status(200).json(invoiceQuery);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// PATCH
const editInvoice = async (req, res) => {
  const { id } = req.params;
  const {
    description, duedate, total, paidout,
  } = req.body;

  try {
    const invoiceQuery = await knex('invoice').where({ id });

    await schemaEditInvoice.validate(req.body);

    if (!invoiceQuery) {
      return res.status(404).json({
        mensagem: 'Cobrança não encontrada',
      });
    }

    const editedInvoice = await knex('invoice').where({ id }).update({
      description,
      paidout,
      total,
      duedate: new Date(),
    });

    if (!editedInvoice) {
      return res.status(400).json('Erro ao editar cobrança');
    }

    return res.status(200).json('Cobrança editada com sucesso !');
  } catch (error) {
    return res.status(400).json({ Erro: error.message });
  }
};

// DELETE
const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const invoiceQuery = await knex('invoice').where({ id });
    if (invoiceQuery.rows === 0) {
      return res.status(400).json({ mensagem: 'Cobrança não localizada. Verifique o id.' });
    }

    const delInvoiceQuery = await knex('invoice').del().where({ id });

    return res.status(200).json({ mensagem: 'Cobrança deletada com sucesso!' });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// GET
const getTotal = async (req, res) => {
  try {
    // total overdue
    const overdueQuery = await knex.raw('SELECT Sum(total) FROM invoice WHERE paidout = false AND duedate < CURRENT_DATE');
    // total to be paid -not overdue-
    const toBePaidQuery = await knex.raw('SELECT Sum(total) FROM invoice WHERE paidout = false AND duedate >= CURRENT_DATE');
    // total paid
    const paidQuery = await knex.raw('SELECT Sum(total) FROM invoice WHERE paidout = true');
    // overdue clients (4 clients)
    const ovdClients = await knex.raw('SELECT username, duedate, total, invoice.id FROM client JOIN invoice on client.cpf = invoice.client_id WHERE overdue = true AND invoice.paidout = false LIMIT 4');
    // up to date clients (4)
    const upToDateClients = await knex.raw('SELECT username, duedate, total, invoice.id FROM client JOIN invoice on client.cpf = invoice.client_id WHERE overdue = false AND duedate > CURRENT_DATE LIMIT 4');

    const responseObject = {
      overdueQuery: overdueQuery.rows,
      toBePaidQuery: toBePaidQuery.rows,
      paidQuery: paidQuery.rows,
      ovdClients: ovdClients.rows,
      upToDateClients: upToDateClients.rows,
    };

    const clientQuery = await knex.raw

    return res.status(200).json(responseObject);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  addNewInvoice,
  getInvoices,
  editInvoice,
  getInvoice,
  deleteInvoice,
  getTotal,
  getAllInvoices,
};
