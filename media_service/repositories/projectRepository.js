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

    const query = `INSERT INTO project (${fields.map(field => `${field}`)}) VALUES (${fields.map(field => `?`)})`;
    const result = await pool.query(query, values);
    return result[0];
}

const existById = async (id) => {
    const query = "SELECT * FROM project WHERE id = ?";
    return (await pool.query(query, [id]))[0].length > 0;
}

const findById = async (id) => {
    const query = "SELECT * FROM project WHERE id = ?";
    return (await pool.query(query, [id]))[0];
}

// const find = async (criteria) => {
//     let fields = Object.keys(criteria);
//     let values = Object.values(criteria);

//     // Check if there are no fields or values
//     if (!fields || !values || fields.length === 0 || values.length === 0) {
//         const query = "SELECT * FROM project";
//         return (await pool.query(query))[0];
//     }

//     // Check if monthCreated and yearCreated are provided
//     if (criteria.yearStart && criteria.yearEnd) {
//         const yearStart = criteria.yearStart;
//         const yearEnd = criteria.yearEnd;

//         // Remove monthCreated and yearCreated from criteria
//         delete criteria.yearStart;
//         delete criteria.yearEnd;

//         fields = Object.keys(criteria);
//         values = Object.values(criteria);

//         // Build the query for other criteria
//         let query = `SELECT * FROM project`;
//         if (fields.length > 0) {
//             query += ` WHERE ${fields.map(field => `${field} = ?`).join(" AND ")}`;
//             query += " AND date_created >= ? AND date_created < ?";
//         } else {
//             query += " WHERE date_created >= ? AND date_created < ?";
//         }

//         // Calculate date range for the specified month and year
//         const startDate = new Date(yearStart, 1, 1);
//         const endDate = new Date(yearEnd, 12, 31);

//         values.push(startDate.toISOString());
//         values.push(endDate.toISOString());

//         return (await pool.query(query, values))[0];
//     }

//     values = Object.values(criteria).map(value => `%${value}%`);


//     // Build the query for criteria without date conditions
//     const query = `SELECT * FROM project WHERE ${fields.map(field => `${field} LIKE ?`).join(" AND ")}`;
//     return (await pool.query(query, values))[0];
// };


const find = async (criteria) => {
    let fields = Object.keys(criteria);
    let values = [];
  
    let query = "SELECT * FROM project";
    let whereClauses = [];
  
    if (criteria.yearStart && criteria.yearEnd) {
        const yearStart = criteria.yearStart;
        const yearEnd = criteria.yearEnd;
    
        delete criteria.yearStart;
        delete criteria.yearEnd;
    
        const startDate = new Date(yearStart, 0, 1);
        const endDate = new Date(yearEnd + 1, 0, 1);

    
        whereClauses.push("date_created >= ? AND date_created < ?");
        values.push(startDate.toISOString(), endDate.toISOString());
    }
  
    if (criteria.title) {
      whereClauses.push("title LIKE ?");
      values.push(`%${criteria.title}%`);
      delete criteria.title;
    }
  
    fields = Object.keys(criteria);
    if (fields.length > 0) {
      whereClauses.push(...fields.map((field) => `${field} = ?`));
      values.push(...Object.values(criteria));
    }
  
    if (whereClauses.length > 0) {
      query +=  `WHERE ${whereClauses.join(" AND ")}`;
    }
  
    const [results] = await pool.query(query, values);
    return results;
};

const deleteById = async (id) => {
    if (!id) {
        return null;
    }

    const query = "DELETE FROM project WHERE id = ?";
    return (await pool.query(query, [id]))[0];
}

module.exports = {
    insert,
    findById,
    find,
    existById,
    deleteById,
}