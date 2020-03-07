let mongoose = require('mongoose');
var Config = require('./config'),
  conf = new Config();
// server localhost
const server = conf.DB_HOST;
// server port
const port = conf.DB_PORT;
// default name
const database = conf.DB_NAME;
/**
 * Singleton class to init mongoose database
 */
class Database {
  constructor() {
    this._connect()
  }

  async _connect() {
    // connect when init
    try {
      let connectionString = `mongodb://${server}/${database}`;
      // connect to database with server and database name
      if (process.env.NODE_ENV === 'production') {
        connectionString = `mongodb+srv://${conf.DB_USER}:${conf.DB_PASS}@cluster0-gssvw.gcp.mongodb.net/${database}?retryWrites=true&w=majority`;
        console.log(connectionString);
      }
      await mongoose.connect(connectionString, { useNewUrlParser: true });
      // confirm connection
      console.log('Database connection successful');
    } catch (e) {
      // if any error, log in the console
      console.log(e);
      console.error('Database connection error');
    }
  }
}
// export singleton instance 
module.exports = new Database();