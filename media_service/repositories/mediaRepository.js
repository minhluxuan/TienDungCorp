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

    const query = `INSERT INTO media (${fields.map(field => `${field}`)}) VALUES (${fields.map(field => `?`)})`;
    const result = await pool.query(query, values);
    return result[0];
}

const findById = async (id) => {
    const query = "SELECT * FROM media WHERE id = ?";
    return (await pool.query(query, id))[0];
}

const find = async (criteria) => {
    let fields = Object.keys(criteria);
    let values = Object.values(criteria);

    // Check if there are no fields or values
    if (!fields || !values || fields.length === 0 || values.length === 0) {
        const query = "SELECT * FROM media";
        return (await pool.query(query))[0];
    }

    // Check if monthCreated and yearCreated are provided
    if (criteria.monthCreated && criteria.yearCreated) {
        const monthCreated = criteria.monthCreated;
        const yearCreated = criteria.yearCreated;

        // Remove monthCreated and yearCreated from criteria
        delete criteria.monthCreated;
        delete criteria.yearCreated;

        fields = Object.keys(criteria);
        values = Object.values(criteria);

        // Build the query for other criteria
        let query = `SELECT * FROM media`;
        if (fields.length > 0) {
            query += ` WHERE ${fields.map(field => `${field} = ?`).join(" AND ")}`;
            query += " AND date_created >= ? AND date_created < ?";
        } else {
            query += " WHERE date_created >= ? AND date_created < ?";
        }

        // Calculate date range for the specified month and year
        const startDate = new Date(yearCreated, monthCreated - 1, 1);
        const endDate = new Date(yearCreated, monthCreated, 1);

        values.push(startDate.toISOString());
        values.push(endDate.toISOString());

        return (await pool.query(query, values))[0];
    }

    // Build the query for criteria without date conditions
    const query = `SELECT * FROM media WHERE ${fields.map(field => `${field} = ?`).join(" AND ")}`;
    return (await pool.query(query, values))[0];
};

const findAll = async () => {
    let query;

    query = `SELECT * FROM media`;

    try {
        const result = await pool.query(query, values);
        console.log(result);
        return result[0];
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!");
    }
}

module.exports = {
    insert,
    findById,
    find,
    findAll
}