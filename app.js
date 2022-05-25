const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "4af57f649083a12eefb66639b03c484-us14",

    server: "us14"
});

app.post("/", function (req, res){
    const firstName = req.body.fname;
    const secondName = req.body.lname;
    const email = req.body.email;

    const listId = "95da31fb03";

    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
    
    res.sendFile(__dirname + "/success.html")
    console.log(
        `Successfully added contact as an audience member. The contact's id is ${
            response.id
            }.`
    );
    }

    run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(3000, function () {
    console.log("Server is listening on port 3000: ")
  });

//api key

//   4af57f649083a12eefb66639b03c4884-us14

//list ID
//95da31fb03

//https.request(url,  options, function(response){

//})