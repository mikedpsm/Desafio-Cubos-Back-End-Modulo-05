const jwt = require("jsonwebtoken");
const knex = require("../database/connection");

const loginFilter = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(404).json("Token não autorizado");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const checkUser = await knex("db_user").where({ id }).first();

    if (!checkUser) {
      return res.status(400).json("Usuário não encontrado");
    }

    const { passwd, ...user } = checkUser;

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = loginFilter;
