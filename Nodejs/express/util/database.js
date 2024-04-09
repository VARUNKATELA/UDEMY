/////////////////////////////////
// This will connect to mysql //
///////////////////////////////

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: ''
// });

// module.exports = pool.promise();

/////////////////////////////////////
// This will connect to sequelize //
///////////////////////////////////

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', '', { dialect: 'mysql', host: 'localhost' });

// module.exports = sequelize;

///////////////////////////////////
// This will connect to Mongodb //
/////////////////////////////////

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback) => {
//   MongoClient
//     .connect('mongodb+srv://varunkatela04:SAewPoVIKmdP9h8D@cluster0.neztzea.mongodb.net/?retryWrites=true&w=majority')
//     .then(client => {
//       console.log('Connected!')
//       _db = client.db();
//       callback(client);
//     })
//     .catch(err => {
//       console.log(err)
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'Database is not found';
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;