
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  created: {
    type: Date,
    default: Date.now()
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;