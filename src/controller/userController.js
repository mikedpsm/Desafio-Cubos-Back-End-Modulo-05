/* eslint-disable default-case */
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const schemaUserLogin = require('../validation/schemaUserLogin');
const schemaEditUser = require('../validation/schemaEditUser');
const schemaUser = require('../validation/schemaUser');
const knex = require('../database/connection');

const pwd = securePassword();

// POST
const addNewUser = async (req, res) => {
  const {
    username, email, passwd,
  } = req.body;

  await schemaUser.validate(req.body);

  // Check user at database
  try {
    const checkUser = await knex('db_user').where({ email });

    if (checkUser.rowCount > 0) {
      return res.status(400).json({
        message: 'Já existe usuário cadastrado com o Cpf informado',
      });
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  // Create hash for password and insert user at database
  try {
    const hash = (await pwd.hash(Buffer.from(passwd))).toString('hex');

    const newUser = {
      username,
      email,
      passwd: hash,
    };

    const newUserQuery = await knex('db_user').insert(newUser).returning('*');

    return res.status(201).json(newUserQuery);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// POST
const login = async (req, res) => {
  await schemaUserLogin.validate(req.body);
  const { email, passwd } = req.body;
  try {
    const checkUser = await knex('db_user').where({ email }).first();

    if (!checkUser) {
      return res.status(403).json({
        mensagem: 'Email inválido',
      });
    }

    const validation = await pwd.verify(
      Buffer.from(passwd),
      Buffer.from(checkUser.passwd, 'hex'),
    );

    switch (validation) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        // eslint-disable-next-line no-console
        return res.status(404).json({ mensagem: 'Senha incorreta.' });
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(passwd))).toString('hex');
          // eslint-disable-next-line no-unused-vars
          const userQuery = await knex('db_user').update({ passwd: hash }).where('email', email);
        // eslint-disable-next-line no-empty
        } catch {}
        break;
    }

    const token = jwt.sign(
      {
        id: checkUser.id,
      },
      process.env.JWT_SECRET,
    );

    return res.status(200).json(token);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// PATCH
const editUser = async (req, res) => {
  const {
    username, email, cpf, phone, passwd,
  } = req.body;

  const { user } = req;

  try {
    await schemaEditUser.validate(req.body);

    // Find logged user at database
    const findUser = await knex('db_user').where({ id: user.id });
    if (!findUser) {
      return res.status(400).json({
        message: 'Usuário não encontrado',
      });
    }

    // Check if a cpf has been typed and if it already exists at db
    if (cpf) {
      const checkCpf = await knex('db_user').where({ cpf });
      if (checkCpf.rowCount > 0) {
        return res.status(400).json({
          message: 'Já existe usuário cadastrado com o Cpf informado',
        });
      }
    }

    // Check if an email has been typed and if it already exists at db
    if (email) {
      const checkEmail = await knex('db_user').where({ email });
      if (checkEmail.rowCount > 0) {
        return res.status(400).json({
          message: 'Já existe usuário cadastrado com o email informado',
        });
      }
    }

    // Convert the new password in hash code, so it can be stored at db
    const hash = (await pwd.hash(Buffer.from(passwd))).toString('hex');

    const newUser = await knex('db_user').where({ email: user.email }).update({
      username,
      email,
      passwd: hash,
      cpf,
      phone,
    });

    if (!newUser) {
      return res.status(400).json('Erro ao editar usuário');
    }

    return res.status(200).json('Usuário editado com sucesso !');
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// GET
const getUsers = async (req, res) => {
  try {
    const listUsers = await knex('db_user');
    return res.status(200).json(listUsers);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// GET
const getUser = async (req, res) => {
  const { user } = req;

  try {
    const findUser = await knex('db_user').where({ id: user.id }).first();

    const { passwd, ...userData } = findUser;

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  addNewUser,
  editUser,
  getUsers,
  getUser,
  login,
};
