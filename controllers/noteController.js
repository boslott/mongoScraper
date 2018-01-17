const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Note = mongoose.model('Note');

exports.addNote = async (req, res) => {
  const note = await (new Note(req.body))
    .save()
    .then(note => Article.findByIdAndUpdate(req.params.id, { $push: { notes: { _id: note._id  }}},
      { new: true }));

      if (req.params.src === 'favList') {
        res.redirect('/favorite-articles');
      } else {
        res.redirect(`/all-notes/${req.params.id}`)
      }
};

exports.allNotes = async (req, res) => {
  const article = await Article
    .findOne({ _id: req.params.id })
    .populate('notes')
    .then(article => res.render('allNotes', { title: 'All Notes', article }));
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.noteId }, req.body, { new: true }).exec();
  res.redirect(`/all-notes/${req.params.articleId}`);
};

exports.deleteNote = async (req, res) => {
  
  const id = req.params.noteId;
  const article = await Article.findOne({ _id: req.params.articleId })
    .then(function(article) {
      article.notes.splice(article.notes.indexOf(id), 1)
      article.save()
    .then(async () => {
      const note = await Note.remove({ _id: req.params.noteId })
    });
      res.redirect(`/all-notes/${req.params.articleId}`);
    })

};