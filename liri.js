require("dotenv").config();

//twitter api npm module
var twitter = require("twitter");

//access twitter keys
var keys = require("./keys.js");

//spotify api
var spotify = require("node-spotify-api");

//request api
var request = require("request");

// NPM module used to read the random.txt file.
var fs = require("fs");

var inquirer = require("inquirer");



inquirer.prompt([
        {
            type: "list",
            message: "what would you like to do?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        },
    ]).then(function (inquirerResponse) {
        switch (inquirerResponse.command) {
            //get tweets
            case "my-tweets":
                getMyTweets();
                break;

            //get a spotify song
            case "spotify-this-song":
                spotifySong();
                break;

            //get movie
            case "movie-this":
                movieThis();
                break;

            //do what it says
            case "do-what-it-says":
                doIt();
                break;

        }

        function getMyTweets() {
            //passes twitter keys
            var client = new twitter(keys.twitter);

            //params
            var params = { q: "@dumbdatas", count: 20 };

            console.log("im here")

            //
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {

                    for (var i = 0; i < tweets.length; i++){
                        var tweetText = tweets[i].text;
                        var tweetTime = tweets[i].created_at;
                        console.log("tweets: " + tweetText + " " + tweetTime );
                    }
                }
                else { console.log(error); }
            });

        };

        function spotifySong(){
            var song = new spotify(keys.spotify);
            song.search({ type: 'track', query: "It's Okay To Cry"}, function (err, data){
                if (err){
                    return console.log("error occurred" + err);
                }
                console.log(data.tracks.items[0].name + " - " + data.tracks.items[0].album.artists[0].name);
                console.log(data.tracks.items[0].preview_url);
            });
        }

        function movieThis(){
           var movieTitle = "drive"
            var queryUrl = "http://www.omdapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

            request(queryUrl, function (error, response, body){
                if (!error && response.statusCode === 200){
                    var movie = JSON.parse(body);
                    console.log(movie.Title + movie.Year);
                    console.log(movie.Country + movie.Language);
                    console.log(movie.Plot + movie.Actors)
                    console.log(movie.imdbRating);
                }
            });

        }

        function doIt (){
            fs.readFile("random.txt", "utf8", function (err, data){
                if (err){
                    console.log(err);
                }
                else {
                    var randomArray = data.split(",");

                    action = randomArray[0];
                    argument = randomArray[1];

                    doSomething(action, argument);
                }
            })
        }







    });

