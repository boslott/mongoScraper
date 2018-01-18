const $ = require('jquery');
const axios = require('axios');

$(document).ready(() => {
  let site = '';
  let sortCategory = '';

  $('#scrape-options').change(function() {
    site = $(this).val();
    console.log(site);
    $('#scrapedModalBtn').attr('href', `/scrape/${site}`)
  });



  $('#scrapeBtn').on('click', function() {
    console.log('scrapebtn clicked')
    if ( $('#scrape-options').val() === 'choose' ) {
      console.log('warning')
      const newH4 = $('<h4></h4>').addClass('text-dark');
      const warningSpan = $('<span></span>').addClass('text-danger').text(' -- WARNING -- ');
      const warningSpan2 = $('<span></span>').addClass('text-danger').text(' -- WARNING -- ');
      const messageSpan = $('<span></span>').addClass('text-dark').text('You must first choose a news site before getting articles')
      newH4.append(warningSpan).append(messageSpan).append(warningSpan2);
      $('#noScrape').append(newH4);
    } else {
      $('#scrapedModal').modal('show');
    }
  });

  $(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
      $('.scrolltop').fadeIn();
    } else {
      $('.scrolltop').fadeOut();
    }
  });

  $('#sort-options').on('change', () => {
    sortCategory = $('#sort-options').val();
  });

  //check for navigation time API support
  if (window.performance) {
    console.info("window.performance work's fine on this browser");
  }
    if (performance.navigation.type == 1) {
      console.info( "This page is reloaded" );
    } else {
      console.info( "This page is not reloaded");
    }

 

});

