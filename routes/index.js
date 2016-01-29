var express = require('express');
var router = express.Router();
var request = require('request');
var Url = require('../models/url');

var google = require('googleapis');
var urlshortener = google.urlshortener('v1');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET home page. */
router.get(/\/new\/(.*)/, function(req, res, next) {
	if(req.params[0].match(/^(http:\/\/|https:\/\/|www.)?([a-z0-9\-]+\.)?[a-z0-9\-]+\.[a-z0-9]{2,4}(\.[a-z0-9]{2,4})?(\/.*)?$/i)) {
		var params = { resource : { longUrl: req.params[0] } ,  key: process.env.GOOGLE_KEY };
		urlshortener.url.insert(params, function (err, response) {
		  if (err) {
		    console.log('Encountered error', err);
		  } else {
		  	var newUrl = {
		  		longUrl: response.longUrl,
		  		shortUrl: response.id
		  	};
		  	Url.create(newUrl, function(err){
		  		if (err)
		  			res.send(err);
		  	});
		    res.send({
		    	"original_url": response.longUrl,
		    	"short_url": response.id
		    });
		  }
		});
	} else {
		res.send({
			"original_url": "invalid", "short_url": "invalid"
		});
	}
});

router.get(/\/(.*)/, function(req, res, next) {
	console.log(req.params[0]);
	Url.findOne({ 'shortUrl': req.params[0] }, function(err, url){
		if(url == null) {
			res.send(
				{"error":"No short url found for given input"}
			);
		} else {
			res.redirect(url.longUrl);		
		}
	})	
});



module.exports = router;
