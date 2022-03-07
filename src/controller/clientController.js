const knex = require('../database/connection');
const schemaClient = require('../validation/schemaNewClient');
const schemaEditClient = require('../validation/schemaEditClient');

// GET
const getClients = async (req, res) => {
  try {
    const listClients = await knex('client');
    return res.status(200).json(listClients);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// GET
const getClient = async (req, res) => {
  const { cpf } = req.params;

  try {
    const findClient = await knex('client').where('cpf', cpf).first();

    if (!findClient) {
      return res.status(400).json('CPF inválido');
    }

    return res.status(200).json(findClient);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// POST
const addNewClient = async (req, res) => {
  const {
    phone, email, username, cpf, city, uf, cep, street, region, complement,
  } = req.body;

  // Check if email and cpf are unique, then create new user
  try {
    await schemaClient.validate(req.body);

    const checkClient = await knex('client').where({ cpf });

    if (checkClient.rowCount > 0) {
      return res.status(400).json('Já existe usuário com este cpf.');
    }

    const checkEmail = await knex('client').where({ email });

    if (checkEmail.rowCount > 0) {
      return res.status(400).json('Já existe usuário com este email. Tente outro.');
    }

    const newClient = {
      phone,
      username,
      cpf,
      email,
      uf,
      city,
      region,
      cep,
      street,
      complement,
    };

    const newClientQuery = await knex('client').insert(newClient).returning('*');

    return res.status(201).json(newClientQuery);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// PATCH
const editClient = async (req, res) => {
  const {
    username, email, cpf, phone,
  } = req.body;

  try {
    await schemaEditClient.validate(req.body);

    const findClient = await knex('db_user').where({ cpf });
    if (findClient.rowCount === 0) {
      return res.status(400).json({
        message: 'Cliente não encontrado',
      });
    }

    // Check if a cpf has been typed and if it already exists at db
    if (cpf) {
      const checkCpf = await knex('client').where({ cpf });
      if (checkCpf.rowCount > 0) {
        return res.status(400).json({
          message: 'Já existe cliente cadastrado com o Cpf informado',
        });
      }
    }

    // Check if an email has been typed and if it already exists at db
    if (email) {
      const checkEmail = await knex('client').where({ email });
      if (checkEmail.rowCount > 0) {
        return res.status(400).json({
          message: 'Já existe cliente cadastrado com o email informado',
        });
      }
    }

    const editedClient = await knex('client').where({ cpf }).update({
      username,
      email,
      cpf,
      phone,
    });

    if (!editedClient) {
      return res.status(400).json('Erro ao editar cliente');
    }

    return res.status(200).json('Cliente editado com sucesso !');
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// DELETE
const deleteClient = async (req, res) => {
  const { cpf } = req.params;
  console.log(cpf);

  const checkClient = await knex('client').where({ cpf });

  if (checkClient.rows === 0) {
    return res.status(400).json('Cliente não encontrado');
  }

  try {
    const delInvoicesQuery = await knex('invoice').del().where({ client_id: cpf });
    const deleteClientQuery = await knex('client').del().where({ cpf }).returning('*');
    return res.status(200).json(deleteClientQuery);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  getClients,
  getClient,
  editClient,
  addNewClient,
  deleteClient,
};
