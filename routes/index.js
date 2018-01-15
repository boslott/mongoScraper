const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/', siteController.home);
router.get('/scrape', siteController.scrape);
router.get('/favorite-articles', catchErrors(siteController.getFavoriteArticles));
router.get('/delete/:id', siteController.deleteArticleFromList);
router.get('/favorited/:id', catchErrors(siteController.favorited));
router.get('/unfavorited/:id', catchErrors(siteController.unfavorited));

module.exports = router;