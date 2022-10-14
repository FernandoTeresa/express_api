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

app.use(function (req, res, next) {
    if (req.method != "OPTIONS") {
        console.log("»»» [REQUEST]: ","origin: ", req.ip," path: ", req.url, " METHOD: ", req.method," «««" );
    }

    next();
});
//quando é feita uma solicitação get ao endpoint /posts
//é enviado um status 200 e os dados contidos no json postdata
app.get("/posts", (req, res, next) => {
    return res.status(200).send(postdata);
});

//quando é feita uma solicitação get ao endpoint /users
//é enviado um status 200 e os dados contidos no json userdata
app.get("/users", (req, res, next) => {
    return res.status(200).send(userdata)
});

//OK

//quando é feita uma solicitação post ao endpoint /login
app.post("/login", (req, res, next) => {
    //lê o ficheiro com modo sincrono
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    //converte o ficheiro de string para json
    userData = JSON.parse(userData);

    //para facilitar o codigo e para ficar mais conciso (boas praticas) 
    //vai guardar na variavel reqUsername o conteudo do objeto que vem no body neste caso
    //guarda a propriedade username do objeto
    let reqUsername = req.body.username;
    // se a variavel for undefined envia um status 401 e envia uma msg 
    if (reqUsername === undefined) {
        return res.status(401).send('Dont exist');
    }

    // se a variavel estiver vazia envia um status 401 e envia uma msg
    if (reqUsername === '') {
        return res.status(401).send('empty field');
    }

    //vai iterar todas as posiçoes do ficheiro userData
    for (let i = 0; i < userData.length; i++) {
        //se na posiçao i na propriedade username for igual a variavel reqUsername
        if (userData[i].username === reqUsername) {
            //retorna um status 200 e envia essa posiçao do ficheiro
            return res.status(200).send(userData[i])
        }
    }
    // senao cumprir as condiçoes retorna status 401 com a msg
    return res.status(401).send('Unauthorized')
});


//OK

//quando é feita uma solicitação post ao endpoint /registerUser
app.post("/registerUser", (req, res, next) => {
    //lê o ficheiro com modo sincrono
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    //converte o ficheiro de string para json
    userData = JSON.parse(userData);

    //para melhorar o codigo "mudo" a conveçao do objeto que esta no body (req.body)
    let user = req.body;

    //se a propriedade username for undefined ou vazia envia erro
    if (user.username === undefined || user.username ===""){
        return res.status(400).send("Missing username");
    }
    
    //se a propriedade password for undefined ou vazia envia erro
    if (user.password === undefined || user.password ===""){
        return res.status(400).send("Missing password");
    }

    //se a propriedade first_name for undefined guarda vazio 
    if (user.first_name === undefined){
        user.first_name = "";
    }

    //se a propriedade last_name for undefined guarda vazio
    if (user.last === undefined){
        user.last_name = "";
    }

    //vai fazer o maximo das posiçoes do array de objetos e adiciona +1, guarda na propriedade do objeto novo  
    user.id = Math.max(...userData.map(param => param.id + 1));
    //depois guarda no array de objetos userData o objeto user 
    userData.push(user);

    //converte o array de objetos para json e depois guarda no ficheiro
    fs.writeFile("./mocks/mock-user.json", JSON.stringify(userData,null,4), (err) => {
        //se existir erros, faz o tratamento
        if (err) {
            console.log(err);
            return res.status(404).send("error");
            //senao houver erros manda uma mensagem e envia um status 200 e o body como json
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
    // retorna o objecto com a sua nova propriedade 
    return commentData;

}

function getPosts(){
    // le o ficheiro json e guarda na variavel postData
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    //converte o que esta na variavel postData num objecto que por sua vez é guardado na mesma variavel
    postData = JSON.parse(postData);
    // guarda na variavel users a funçao getUsers que por sua vez é convertido num objecto users com o conteudo 
    //do objecto userData
    let users = getUsers();
    // guarda na variavel comments a funçao getComments que por sua vez é convertido num objecto comments com o conteudo 
    //do objecto commentData
    let comments = getComments();

    //vai iterar o array de objetos postData
    for(let i=0;i<postData.length;i++){
        
        if (postData[i].id != null || postData[i].id != undefined){
            //vai procurar em cada posiçao do objeto postData na propriedade id_user
            //qual coincide com o id do user
            let user = users.find(elem => elem.id === postData[i].id_user);
            //vai criar uma nova propriedade user e o que encontrou vai guardar dentro dessa propriedade
            postData[i].user = user;

            //vai procurar em cada posiçao do objeto postData na propriedade id
            //qual coincide com o id do id_post nesse comentario
            let comment = comments.filter(elem=>elem.id_post === postData[i].id)
            //vai criar uma nova propriedade comments e o que encontrou vai guardar dentro dessa propriedade
            postData[i].comments = comment;
        }
    }
    //retorna todas as alteraçoes feitas
    return postData;
}

function getUsers(){
    //lê o ficheiro com modo sincrono
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    //converte o ficheiro de string para json
    userData = JSON.parse(userData);
    //retorna o conteudo do array de objectos
    return userData;
}


//OK
app.get("/listPost", (req, res, next) => {

    //guarda na variavel users a funçao getUsers que por sua vez é convertido num
    //objecto users com o conteudo  do objecto userData
    let posts = getPosts(); 

    //retorna o array de objetos posts no formato json
    return res.json(posts);
});

//OK
app.post("/addNewPosts", (req, res, next)=>{
    // le o ficheiro json e guarda na variavel postData
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    //converte o que esta na variavel postData num objecto que por sua vez é guardado na mesma variavel
    postData = JSON.parse(postData);  

    //lê o ficheiro com modo sincrono 
    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    //converte o ficheiro de string para json
    userData = JSON.parse(userData);

    let post = req.body;

    //se na propriedade do objecto for undefined ou vazio envia erro e sai
    if (post.title === undefined || post.title === ""){
        return res.status(400).send("missing title");
    }

    //se na propriedade do objecto for undefined ou vazio envia erro e sai
    if (post.id_user === undefined || post.id_user === ""){
        return res.status(400).send("missing user id");
    }

    //procura no array de objectos userData em que o id no array seja igual ao id_user do post
    //depois guarda na variavel user
    let user = userData.find(elem => elem.id === post.id_user);

    //se não encontrou envia erro com um status 403 e uma msg
    if (!user){
        return res.status(403).send("User dont exist");
    }

    //se na propriedade content for undefined, iguala a vazio
    if (post.content ===undefined){
        post.content = "";
    }

    //calcula o maximo do array de objetos e depois adiciona 1, sendo que o post.id criado será o max +1
    post.id = Math.max(...postData.map(param => param.id + 1));
    //guarda a data e hora atual na propriedade date
    post.date = new Date();
    //guarda o objeto post no array de objetos postData
    postData.push(post);

    //depois escreve no ficheiro o array de objetos 
    fs.writeFile("./mocks/mock-obj-post.json", JSON.stringify(postData,null,4), (err) => {
        //se existir erro retorna um status 404 e envia uma msg de erro
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            //senao houver error envia um status 200 e o objeto post no tipo json no body do response  
            console.log("Success!! File written sucessfully");
            post.user = user;
            return res.status(200).json(post);
        }
    })
});

//OK
app.post("/addNewComment", (req,res, next)=>{
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);

    var userData = fs.readFileSync("./mocks/mock-user.json", { encoding: 'utf8', flag: 'r' });
    userData = JSON.parse(userData);

    var commentData = fs.readFileSync("./mocks/mock-comments.json", { encoding: 'utf8', flag: 'r'});
    commentData = JSON.parse(commentData);

    let comment = req.body;

    if (comment.content === undefined){
        return res.status(400).send("missing content");
    }

    let post = postData.find(elem=>elem.id === comment.id_post);

    let user = userData.find(elem => elem.id === comment.id_user);

    if (!user){
        return res.status(403).send("User dont exist");
    }

    comment.id = Math.max(...commentData.map(param => param.id + 1));
    comment.date = new Date();
    
    commentData.push(comment);
    console.log(commentData)
 
    fs.writeFile("./mocks/mock-comments.json", JSON.stringify(commentData,null,4), (err) => {
        //se existir erro retorna um status 404 e envia uma msg de erro
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            //senao houver error envia um status 200 e o objeto post no tipo json no body do response  
            console.log("Success!! File written sucessfully");
            comment.id_user = user.id;
            return res.status(200).json(true);
        }
    })

});

//OK
app.get("/listPosts/:id", (req, res, next)=>{

    //a funçao getposts é convertido num objecto posts com o conteudo do objecto postData
    let posts = getPosts();

    // if (posts.id_user){ ?????
    //     posts = [];
    // }

    //faz um filtro do array de objetos posts em que a propriedade id_user seja igual ao parametro id que
    //vem no endpoint do pedido get,( o parametro que vem no endpoint como vem como string e convertido em int)
    let post = posts.filter(elem => elem.id_user === parseInt(req.params['id']));

    return res.status(200).send(post);

});

//OK
app.post("/removePost/:id", (req, res, next)=>{
    var postData = fs.readFileSync("./mocks/mock-obj-post.json", { encoding: 'utf8', flag: 'r' });
    postData = JSON.parse(postData);  

    var commentData = fs.readFileSync("./mocks/mock-comments.json", {encoding: 'utf8', flag: 'r'});
    commentData = JSON.parse(commentData);

    let post = postData.filter(elem=>elem.id != parseInt(req.params['id']));

    let comment = commentData.filter(elem=>elem.id_post !=  parseInt(req.params['id']) )


    fs.writeFile("./mocks/mock-comments.json", JSON.stringify(comment,null,2), (err)=>{
        //se existir erro retorna um status 404 e envia uma msg de erro
        if (err) {
            console.log(err);
            // nao é necessario devido se fizer o return sai da funçao
            // return res.status(404).send("error");
        } else {
            // nao é necessario devido se fizer o return sai da funçao
            //senao houver error envia um status 200 e o objeto post no tipo json no body do response  
            console.log("Success!! File written sucessfully");
            // return res.status(200).json(commentData);
        }
    })

    fs.writeFile("./mocks/mock-obj-post.json", JSON.stringify(post,null,4), (err) => {
        //se existir erro retorna um status 404 e envia uma msg de erro
        if (err) {
            console.log(err);
            return res.status(404).send("error");
        } else {
            //senao houver error envia um status 200 e o objeto post no tipo json no body do response  
            console.log("Success!! File written sucessfully");
            return res.status(200).json(post);
        }
    })
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});