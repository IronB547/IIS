const db_password = process.env.DB_PASSWORD;

const config = {
    db: {
        /* don't expose password or any sensitive info, done only for demo */
        host: "34.65.213.141",
        user: "backend",
        password: db_password,
        database: "IIS",
    },
    listPerPage: 2,
    };
module.exports = config;