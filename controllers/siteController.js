const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const axios = require('axios');
const cheerio = require('cheerio');

exports.home = (req, res) => {
  Article
    .find({})
    .then( articles => {
      res.render('index', { title: 'Mongo Scraper by Bo Slott ', articles });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
};

exports.scrape = (req, res) => {
  axios.get('https://swimswam.com/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $('div.item').each(function(i, element) {

      
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find('a')
        .attr('title');
      result.link = $(this)
        .find('a')
        .attr('href');
      result.photo = $(this)
        .find('img')
        .attr('src');

     console.log(result);
     saveArticles(result);
     

    });
    res.redirect('/#articleListing');
    // If we were able to successfully scrape and save an Article, send a message to the client
    console.log('Scrape was successful');
  });
};

const saveArticles = (result) => {
  const article = (new Article(result))
    .save()
    .catch(err => res.json(err));
};


exports.getFavoriteArticles = async (req, res) => {
  const articles = await Article.find({ favorited: true });
  res.render('favoriteArticles', { title: 'Saved Articles ', articles} );
};

exports.deleteArticleFromList = (req, res) => {
  const article = Article.remove({ _id: req.params.id }).exec();
  res.redirect('/#articleListing');
};

exports.favorited = async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { _id: req.params.id },
    { favorited: true },
    { new: true }
   ).exec();
};

exports.unfavorited = async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { _id: req.params.id },
    { favorited: false },
    { new: true }
  ).exec();
  res.redirect('/favorite-articles');
};


