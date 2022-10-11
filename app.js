const express = require("express");
const postdata = require("./mocks/mock-obj-post.json");
const userdata = require("./mocks/mock-user.json");
const commentdata = require("./mocks/mock-comments.json");
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
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
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
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
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

    fs.writeFile("./mocks/mock-user.json", JSON.stringify(userData,null,4), (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            console.log("Success!! File written sucessfully");
            return res.status(200).json(user);
        }
    })
});


function getComments(){
    // le o ficheiro json e guarda na variavel commentData
    var commentData = fs.readFileSync("./mocks/mock-comments.json", {encoding: 'utf8', flag: 'r'});
    //converte o que esta na variavel commentData num objecto que por sua vez é guardado na mesma variavel
    commentData = JSON.parse(commentData);
    // guarda na variavel users a funçao getUsers que por sua vez é convertido num objecto users com o conteudo 
    //do objecto userData
    let users = getUsers();

    //vai iterar o objecto commentData e em cada indice vai procurar o id.user no objecto users o id correspondente 
    for (let i=0; i<commentData.length; i++){
        let user = users.find(elem=> elem.id === commentData[i].id_user);
        //vai criar uma nova propriedade no objecto commentData que por sua vez guarda o que encontrou na propriedade user
        commentData[i].user = user;
    }
    // retora o objecto com a sua nova propriedade 
    return commentData;

}

function getPosts(){
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);
    let users = getUsers();

    let comments = getComments();

    for(let i=0;i<postData.length;i++){
        let user = users.find(elem => elem.id === postData[i].id_user);
        postData[i].user = user;

        let comment = comments.filter(elem=>elem.id_post === postData[i].id)
        postData[i].comments = comment;
    }

    return postData;
}

function getUsers(){
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);
    return userData;
}

app.get("/listPost", (req, res, next) => {

    
    let posts = getPosts(); 

    return res.json(posts);

    //return res.status(401).send('Unauthorized')
});


app.post("/addNewPosts", (req, res, next)=>{
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);  

    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);

    let post = req.body;

    if (post.title === undefined || post.title === ""){
        return res.status(400).send("missing title");
    }

    if (post.id_user === undefined || post.id_user === ""){
        return res.status(400).send("missing user id");
    }

    let user = userData.find(elem => elem.id === post.id_user);

    if (!user){
        return res.status(403).send("User dont exist");
    }

    if (post.content ===undefined){
        post.content = "";
    }

    post.id = Math.max(...postData.map(param => param.id + 1));
    post.date = new Date();


    postData.push(post);

    fs.writeFile("./mocks/mock-obj-post.json", JSON.stringify(postData,null,4), (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            console.log("Success!! File written sucessfully");
            return res.status(200).json(post);
        }
    })
});


app.get("/listPosts/:id", (req, res, next)=>{

    let posts = getPosts();
    if (posts.id_user){
        posts = [];
    }
    let post = posts.filter(elem => elem.id_user === parseInt(req.params['id']))

    return res.status(200).send(post);

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

/* 
/listPost/{{id-user}}

mostrar unicamente os posts 



*/