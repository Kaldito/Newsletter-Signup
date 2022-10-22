//jshint esversion: 6

const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const { url } = require("inspector");
const dotenv = require("dotenv");

const app = express();
app.use(express.static("public"));  // Hace que pueda usar el css  y las imagenes de manera correcta.
app.use(bodyParser.urlencoded({extended: true}));

const result = dotenv.config();
const audience_id = result.parsed.AUDIENCE_ID;
const api_key = result.parsed.API_KEY;
const API_ROOT = "https://us13.api.mailchimp.com/3.0/";
let api_endpoint = "/lists/" + audience_id;
let api_url = API_ROOT + api_endpoint;

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                }
            }
        ]
    }

    const json_data = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "dantek:" + api_key,
    }

    const request = https.request(api_url, options, function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/sucess.html");
        } else{
            res.sendFile(__dirname + "failure.html");
        }

        response.on("data", function(d){
            console.log(JSON.parse(d));
        }) 
    })

    request.write(json_data);
    request.end();
})

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
