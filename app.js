const express = require("express");
const data = require("./mock-obj-post.json");
const bodyParser = require( 'body-parser');

var app = express();


//req: is the request body and carries information about the request
//res: The res is the response body and is used to handle response functions like .render() to render templates and .json() to return json data.
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});
app.get("/posts", (req, res, next) => {
    return res.send(200, data); 
   });


app.listen(3000, () => {
 console.log("Server running on port 3000");
});