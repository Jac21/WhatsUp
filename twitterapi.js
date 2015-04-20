/**
 * Created by cakernstock on 4/13/15.
 */

//Are the following really needed here?
var http = require('http');
var fs = require('fs');
var request = require('request');
var twitter_insights_username = "";
var twitter_insights_password = ""; //don't track this in git, fill in later
var insight_url = "https://" +
                  twitter_insights_username + ":" +
                  twitter_insights_password +
                  "@cdeservice.mybluemix.net:443/api/v1/messages/";

exports = module.exports = TwitterAPI;

function TwitterAPI() {}

TwitterAPI.count = function(query) {
	var final_url = insight_url + "count?q=" + query;

	var response_body;
	request(final_url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			response_body = JSON.parse(body);
			console.log(response_body.search.results);
		}
	});

}

TwitterAPI.search_urls = function(query, size, callback) {
	if (typeof(size)==='undefined') size = 10; //size defaults to 10
	var final_url = insight_url + "search?q=" + query + "&size=" + size;

	var response_body;
	var url_list = [];
	request(final_url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			response_body = JSON.parse(body);

			for (i = 0; i < response_body.tweets.length; ++i) {
				var tweet_url_list = response_body.tweets[i].message.twitter_entities.urls;
				for (j = 0; j < tweet_url_list.length; ++j) {
					var exp_url = tweet_url_list[j].expanded_url;
					//console.log("within tapi" + exp_url);
					if (typeof exp_url !== 'undefined') {
						url_list.push(exp_url);
					} else {
						console.log("fubar")
					}

				}
			}
		}
		callback(url_list);
	});
}

TwitterAPI.search_text = function(query, size, callback) {
	if (typeof(size)==='undefined') size = 10; //size defaults to 10
	var final_url = insight_url + "search?q=" + query + "&size=" + size;

	var response_body;
	var text_list = [];
	request(final_url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			response_body = JSON.parse(body);

			for (i = 0; i < response_body.tweets.length; ++i) {
				var tweet_text = response_body.tweets[i].message.body;
				text_list.push(tweet_text);
			}
		}
		callback(text_list);
	});
}

TwitterAPI.greet = function() {
	return "Hello";
}

