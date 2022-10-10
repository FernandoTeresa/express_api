const express = require("express");
const postdata = require("./mock-obj-post.json");
const userdata = require("./mock-user.json");
const bodyParser = require('body-parser');
const fs = require('fs');

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
    return res.status(200).send(postdata);
});

app.get("/users", (req, res, next) => {
    return res.status(200).send(userdata)
});


app.post("/login", (req, res, next) => {
    var userData = fs.readFileSync("./mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);

    let reqUsername = req.body.username;
    if (reqUsername === undefined) {
        return res.status(401).send('Dont exist');
    }

    if (reqUsername === '') {
        return res.status(401).send('empty field');
    }

    for (let i = 0; i < userData.length; i++) {
        if (userData[i].username === reqUsername) {
            return res.status(200).send(userData[i])
        }
    }
    return res.status(401).send('Unauthorized')
});


app.post("/registerUser", (req, res, next) => {
    var userData = fs.readFileSync("./mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);

    let user = req.body;

    if (user.username === undefined || user.username ===""){
        return res.status(400).send("Missing username");
    }
    
    if (user.password === undefined || user.password ===""){
        return res.status(400).send("Missing password");
    }

    if (user.first_name === undefined || user.first_name === ""){
        user.first_name = "";
    }

    if (user.last === undefined || user.last_name === ""){
        user.last_name = "";
    }

    user.id = Math.max(...userData.map(param => param.id + 1));
    userData.push(user);

    fs.writeFile("./mock-user.json", JSON.stringify(userData,null,4), (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            console.log("Success!! File written sucessfully");
            return res.status(200).json(user);
        }
    })
});

app.post("/listPost", (req, res, next) => {

    var postData = fs.readFileSync("./mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);  

    let post = req.body;

    console.log(post);

    if (post.id === undefined || post.id === ''){
        return res.status(401).send('Id dont exist or empty field');
    }
    
    if (post.title === undefined || post.title === ''){
        return res.status(401).send('Title dont exist or empty field');
    }

    if (post.content === undefined){
        return res.status(401).send('Content dont exist');
    }

    if (post.id_user === undefined || post.id_user === ''){
        return res.status(401).send('User dont exist or empty field');
    }

    for (let i =0; i<postData.length; i++){
        if (postData[i].id === post.id){
            return res.status(200).send(postData[i]);
        }
    }

    return res.status(401).send('Unauthorized')
});


app.post("/addNewPosts", (req, res, next)=>{
    var postData = fs.readFileSync("./mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);  

    var userData = fs.readFileSync("./mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);

    let post = req.body;
    console.log(post);

    if (post.title === undefined || post.title === ""){
        return res.status(400).send("missing title");
    }

    if (post.id_user === undefined || post.id_user === ""){
        return res.status(400).send("missing user id");
    }

    let user = userData.find(elem => elem.id === post.id_user)

    if (!user){
        return res.status(403).send("User dont exist");
    }

    if (post.content ===undefined){
        post.content = "";
    }

    post.id = Math.max(...postData.map(param => param.id + 1));
    post.date = new Date();


    postData.push(post);

    fs.writeFile("./mock-obj-post.json", JSON.stringify(postData,null,4), (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            console.log("Success!! File written sucessfully");
            return res.status(200).json(post);
        }
    })
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


/* 
separar as mocks comentarios dos posts

*/