let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'to-do';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }

  async _connect() {
    try {
      await mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true })
      console.log('Database connection successful')
    } catch (e) {
      console.error('Database connection error')
    }
  }
}

module.exports = new Database()