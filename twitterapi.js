/**
 * Created by cakernstock on 4/13/15.
 */

//Are the following really needed here?
var http = require('http');
var fs = require('fs');
var request = require('request');
var twitter_insights_username = "db3ef214313c6439b79e75a56f79af58";
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

TwitterAPI.greet = function() {
	return "Hello";
}

