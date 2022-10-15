const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const joi = require('joi');

async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);

    const rows = await db.query(
      `SELECT id, username, password, user_type, email, phone_num
      FROM Users LIMIT ${offset},${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
      data,
      meta
    }
}

async function getAll(page = 1){
  const rows = await db.query(
    `SELECT id, username, password, user_type, email, phone_num
    FROM Users`
  );

  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

module.exports = {
  getMultiple,
  getAll
}