const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Note = mongoose.model('Note');
const axios = require('axios');
const cheerio = require('cheerio');
const { catchErrors } = require('../handlers/errorHandlers');

exports.home = (req, res) => {
  Article
    .find({}).sort([['_id', -1]])
    .then( articles => {
      res.render('index', { title: 'Multisport News Scraper by Bo Slott ', articles, site: 'choose' });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
};

const scrapeSwim = (res) => {
  axios.get('https://swimswam.com/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
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
      result.category = 'swimming';
      
        saveArticles(result);
        console.log('swim scraping complete')
    });
    res.redirect('/#articleListing')
  });
};

const scrapeTriathlete = (res) => {
  axios.get('http://www.triathlete.com/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    $('article.article').each(function(i, element) {

      
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find('h2')
        .text();
      result.link = $(this)
        .find('a')
        .attr('href');
      result.photo = $(this)
        .find('img')
        .attr('data-original')
      result.category = 'triathlon';
      
        saveArticles(result);
    });
    res.redirect('/#articleListing')
  });
};

const scrapeRunnersWorld = (res) => {
  axios.get('https://www.runnersworld.com/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    $('div.channel-image').each(function(i, element) {

      
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find('div.article-title')
        .text();
      result.link = $(this)
        .find('a')
        .attr('href');
      result.link = 'https://www.runnersworld.com' + result.link;
      result.photo = $(this)
        .find('img')
        .attr('src')
      result.category = 'running';
      
        saveArticles(result);
    });
    res.redirect('/#articleListing')
  });
};


const scrapeVeloNews = (res) => {
  axios.get('http://www.velonews.com/category/news/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    $('article.article').each(function(i, element) {

      
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find('h3')
        .text();
      result.link = $(this)
        .find('a')
        .attr('href');
      result.link = 'https://www.runnersworld.com' + result.link;
      result.photo = $(this)
        .find('img')
        .attr('src')
      result.category = 'cycling';
      
        saveArticles(result);
        console.log(result)
    });
    res.redirect('/#articleListing')
  });
};

exports.scrape = async (req, res) => {
  const site = req.params.site
  switch (site) {
    case 'swimswam':
      await scrapeSwim(res);
      break;
    case 'triathlete':
      await scrapeTriathlete(res);
      break;
    case 'runnersworld':
      await scrapeRunnersWorld(res);
      break;
    case 'velonews':
      await scrapeVeloNews(res);
      break;
    default:
      break;
  }

  // if (req.params.site === 'swimswam') {
  //   console.log('calling scrapeSwim');
  //   await scrapeSwim(res);
  // }
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


const delNote = async id => {
  const note = await Note.remove({ _id: id }).exec();
}
 

exports.deleteArticleFromList = async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id })
    .then( async function(article) {
      // Remove all the notes from the DB first
      let notes = article.notes
      console.log(notes[0]);
      let i = 0;
      notes.forEach(id => {
        console.log(id);
        catchErrors(delNote(id));
      });

      // Then remove the article from the DB
      Article.remove({ _id: req.params.id }).exec();
      res.redirect('/#articleListing');
    });
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






