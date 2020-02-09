var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

// get request with the starting url to beging the crawl
router.get('/crawl', function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	// array for saving the links
	links = ["Level 1"];

	crawl(req.query.url, req.query.depth);

	function crawl(url, depth) {
		iteration = 1;

		crawled = [];

		request(url, (error, response, html) => {
			// if the url is valid, extracts the links
			if (!error && response.statusCode == 200) {
				process_link(url,html);

			// if not, returns an error
			} else if (error) {
				res.send({ "content": "There was an error with the url" });
			}

			// save the url as crawled
			crawled.push(url);

			// ends the crawling at selected depth
			if (iteration = depth) {
				res.send({ "content": links });
			} else {
				iteration += 1;

				links.push("Level " + iteration);

				links.forEach(l => {
					if (crawled.includes(l)) {
						// do nothing
					} else {
						if (l.includes("http")) {
							request(l, (error, response, html2) => {
								// if the url responds, extracts the links
								if (!error && response.statusCode == 200) {
									process_link(l,html2);

									// if not, returns an error
								} else if (error) {
									res.send({ "content": "There was an error with the url" });
								}

								crawled.push(l);
							})
						};
					};
				});
			}

			function process_link(url,htm) {
				const $ = cheerio.load(htm);

				// finds the links in the html
				$('a').each((i, item) => {
					link = $(item).attr('href');

					// filters the recieved link
					if (link.substring(0, 1) == '/' && link.substring(1, 2) != '/') {
						link = url + link;
						links.push(link);
					} else if (link.substring(0, 2) == '//') {
						link = 'http:' + link;
						links.push(link);
					} else if (link.substring(0, 1) == '#') {
						// do nothing
					} else {
						// do nothing
					}
				});

				// marks the end of a section
				links.push("-----");
			};
		});
	};
});

module.exports = router;