const express = require("express");
const postdata = require("./mock-obj-post.json");
const userdata = require("./mock-user.json");
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
    return res.send(200, postdata); 
   });

app.get("/users", (req, res, next) => {
    return res.send(200, userdata)
});


app.post("/login", (req, res, next)=> {
    let reqUsername = req.body.username;
    if (reqUsername === undefined){
        return res.send(401, 'Dont exist');
    }

    if(reqUsername === ''){
        return res.send(401, 'empty field');
    }

    for(let i=0;i <userdata.length; i++){
        if(userdata[i].username === reqUsername){
            return res.send(200, userdata[i])
        }
    }
    return res.send(401, 'Unauthorized')
})

app.listen(3000, () => {
 console.log("Server running on port 3000");
});