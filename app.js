/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');

//for filesystem reading and writing
var fs = require('fs');

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

//Create the TwitterAPI object
var TwitterAPI = require('./twitterapi');
var twitter = TwitterAPI();

// setup middleware
var app = express();
app.use(app.router);
app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views


// render index page
app.get('/', function(req, res){
	res.render('index');
	var hashtag_input = req.query.hashtag_box;
	var text_input = req.query.text_box;
	var url_input = req.query.url_box;

	console.log(text_input, url_input, hashtag_input);

	if (typeof text_input !== 'undefined') {
		if (typeof url_input !== 'undefined') {
			console.log('Sending url to alchemy...');
			//console.log(url_input);
			example_url(url_input);
			//res.render('index');
		}
		if (typeof hashtag_input !== 'undefined') {
			console.log('Sending twitter data to alchemy...');
			console.log(hashtag_input);
			TwitterAPI.search_text(hashtag_input, 10, function(returnValue) {
				res.render('index', {url_data: returnValue});
			});
		}
		console.log(text_input);
		example(text_input);
		//res.render('index');
	} else {
		console.log('Blank input');
		//res.render('index');
	}

	//Twitter API calls
	//var ans = TwitterAPI.greet();
	//console.log(ans);
	//TwitterAPI.count("IBM");
	//TwitterAPI.search_text("Internet of Things", 5, function(returnValue) {
	//	console.log(returnValue);
	//});
});

app.get('/about', function(req, res) {
	res.render('about', {
		title: 'About'
	});
});


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);

//demo variables for testing alchemy api
var demo_text = 'Yesterday dumb Bob destroyed my fancy iPhone in beautiful Denver, Colorado. I guess I will have to head over to the Apple Store and buy a new one.';
var demo_url = 'http://www.npr.org/2013/11/26/247336038/dont-stuff-the-turkey-and-other-tips-from-americas-test-kitchen';
var demo_html = '<html><head><title>Node.js Demo | AlchemyAPI</title></head><body><h1>Did you know that AlchemyAPI works on HTML?</h1><p>Well, you do now.</p></body></html>';

function example(req, res) {
	var output = {};
	
	//start analyzing
	entities(req, res, output);
}

function example_url(req, res) {
	var output = {};

	entities_url(req, res, output);
}

//entity extraction for entity, type, relevance, and overall sentiment
function entities(req, res, output) {
	console.log('entities for basic text called...');
	alchemyapi.entities('text', req, {'sentiment':1}, function(response) {
		output['entities'] = {text:req, response:JSON.stringify(response, null, 4), results:response['entities'] }
		console.log(JSON.stringify(output['entities'], null, 4));

		//json object
		var entry_text = JSON.parse(JSON.stringify(output['entities'], null, 4));

		//make sure entry was called before writing to particular file
		if (entry_text.text == "") {
			console.log("Nothing to write to text file...");
		} else {
			fs.writeFile('public/test_results.json', JSON.stringify(output['entities'], null, 4), function (err) {
				if (err) return console.log(err);
				console.log('test_results written with JSON\n');
			});
		}
	});
}

function entities_url(req, res, output) {
	console.log('entities for url called...');
	alchemyapi.entities('url', req, {'sentiment':1}, function(response) {
		output['entities'] = {url: req, response:JSON.stringify(response, null, 4), results:response['entities'] }
		console.log(JSON.stringify(output['entities'], null, 4));

		//json object
		var entry_url = JSON.parse(JSON.stringify(output['entities'], null, 4));

		//make sure entry was called before writing to particular file
		if (entry_url.url == "") {
			console.log("Nothing to write to url file");
		} else{
			fs.writeFile('public/test_results_url.json', JSON.stringify(output['entities'], null, 4), function (err) {
				if (err) return console.log(err);
				console.log('test_results_url written with JSON\n');
			});
		}
	});
}

//language detection (TODO: Implement in conjunction with Machine Translation API)
function language(req, res, output) {
	alchemyapi.language('text', demo_text, {}, function(response) {
		output['language'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response };
		title(req, res, output);
	});
}
