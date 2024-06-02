const mysql = require("mysql2");

// const dbOptions = {
//     host: process.env.DBHOST,
//     port: process.env.DBPORT,
//     user: process.env.DBUSER,
//     password: process.env.DBPASSWORD,
//     database: process.env.DBNAME,
// };

const dbOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nhan.nguyen1606",
    database: "localtdlogistics",
};

const pool = mysql.createPool(dbOptions).promise();

const insert = async (data) => {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = `INSERT INTO file (${fields.map(field => `${field}`)}) VALUES (${fields.map(field => `?`)})`;
    const result = await pool.query(query, values);
    return result[0];
}

const find = async (criteria) => {
    let fields = Object.keys(criteria);
    let values = Object.values(criteria);

    // Check if there are no fields or values
    if (!fields || !values || fields.length === 0 || values.length === 0) {
        const query = "SELECT * FROM file";
        return (await pool.query(query))[0];
    }

    // Build the query for criteria without date conditions
    const query = `SELECT * FROM file WHERE ${fields.map(field => `${field} = ?`).join(" AND ")}`;
    return (await pool.query(query, values))[0];
}

const remove = async (criteria) => {
    let fields = Object.keys(criteria);
    let values = Object.values(criteria);

    // Check if there are no fields or values
    if (!fields || !values || fields.length === 0 || values.length === 0) {
        return null;
    }

    // Build the query for criteria without date conditions
    const query = `DELETE FROM file WHERE ${fields.map(field => `${field} = ?`).join(" AND ")}`;
    return (await pool.query(query, values))[0];
}

module.exports = {
    insert,
    find,
    remove,
}