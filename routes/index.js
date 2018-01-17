const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const noteController = require('../controllers/noteController');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/', articleController.home);
router.get('/scrape/:site', catchErrors(articleController.scrape));
router.get('/favorite-articles', catchErrors(articleController.getFavoriteArticles));
router.get('/delete/:id', articleController.deleteArticleFromList);
router.get('/favorited/:id', catchErrors(articleController.favorited));
router.get('/unfavorited/:id', catchErrors(articleController.unfavorited));

router.post('/favorite-articles/:id/:src', catchErrors(noteController.addNote));
router.get('/all-notes/:id', catchErrors(noteController.allNotes));
router.post('/all-notes/:noteId/:articleId', catchErrors(noteController.updateNote));
router.get('/deleteNote/:noteId/:articleId', catchErrors(noteController.deleteNote));

module.exports = router;