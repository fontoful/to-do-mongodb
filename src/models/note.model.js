const mongoose = require('mongoose')
const List = require('./list.model');

// removing user id as it's already included in noteSchema
const ListSchema = List.schema.clone()
ListSchema.remove('userId');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.ObjectId,
    required: true
  },
  list: {
    type: ListSchema,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt' } });


module.exports = mongoose.model('Note', noteSchema);
