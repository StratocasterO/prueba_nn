var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// get request with the starting url to beging the crawl
router.get('/crawl', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	
	// array for saving the links
	links = [];
	
	crawl(req.query.url,1);
	
	function crawl(url, depth) {
		request(url, (error, response, html) => {

			// if the url responds, extracts the links
			if (!error && response.statusCode == 200) {
				const $ = cheerio.load(html);
				
				$('a').each((i, item) => {
					const link = $(item).attr('href');
					
					links.push(link);
				});
				
				res.send({"content": links});
			
			// if not, returns an error
			} else if (error){
				res.send({"content": "There was an error with the url"});
			}
		});
	}
});

module.exports = router;