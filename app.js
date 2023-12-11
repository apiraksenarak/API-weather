//jshint esversion:6

const express = require("express");
const https = require("https"); // native node module
const bodyParser = require("body-parser");  // body parser module => npm i body-parser
                                            // look through the body of the post request and fetch the data based on the name of input

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const apiKey = "d8231434b163a11f35cc3e0693fcd044"; // authentication
    const unit = "metric";
    // not accept http://(api url) => should be https://
    const url = "https://api.openweathermap.org/data/2.5/find?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    // @param : respons to get response from web
    https.get(url, function(response) {
        //console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data); // parse the data inform JSON that we get back
            const temp = weatherData.list[0].main.temp; // dig to data that we want
            const description = weatherData.list[0].weather[0].description;
            const icon = weatherData.list[0].weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            //refer to home route "/"
            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees celcius.</h1>");
            res.write("<img src=" + iconURL + ">");

            //res.send(); // res.send can use only 1 GET
        })
    });
})

app.listen(3003, function() {
    console.log("Server is running on port 3003.");
})

