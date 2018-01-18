
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Please provide a title'
  },
  link: {
    type: String,
    required: 'Please provide a link'
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  photo: String,
  favorited: false,
  category: String
});



const Article = mongoose.model('Article', articleSchema);

module.exports = Article;