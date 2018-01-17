const $ = require('jquery');

$(document).ready(() => {
  let site = '';

  $('#scrape-options').change(function() {
    site = $(this).val();
    console.log(site);
    $('#scrapeBtn').attr('href', `/scrape/${site}`)
  });

  $('#scrapeBtn').on('click', function() {
    if ( $('#scrape-options').val() === 'choose' ) {
      $('#noScrape').append('<br /><br />🛑 🛑 🛑 You must first choose a news site from the right-side dropdown menu 🔥 🔥 ')
    }
  });
 

});

