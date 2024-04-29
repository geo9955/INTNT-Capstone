const express = require('express');
const { MongoClient } = require('mongodb');
var app = express();

const uri = "mongodb+srv://glm98:MongoOnlyPawn@cluster0.y7jcivl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;
let books;
app.use(express.json());

const characters = ["Homer", "Marge", "Bart", "Lisa", "Maggie", "Ned", "Graggle", "Apu", "Barney", "Milhouse"];

async function start() {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("DB1");
    books = db.collection("capstoneBooks");
    console.log("Listening");
    app.listen(4000);
}

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
     'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
    });

app.get('/', function(req, res) {
    books.find()
    .project({_id:0})
    .toArray()
    .then( allBooks => {
        let list;
        if(req.query.avail === undefined) {
            list = allBooks;
        } else {
            list = allBooks.filter((book) => book.avail === req.query.avail);
        }
        res.status(200).json(list);
    });
});

app.put('/', function(req, res) {
    books.findOne( {id: req.body.id}, {projection: {_id:0}})
        .then((book) => {
            if(book == null) {
                res.status(404).json({message: "Not Found"});
            } else {
                if(book.avail === "false")
                    books.updateOne({id: req.body.id}, {$set: {avail: "true", who: "", due: ""}})
                        .then(() => {
                            res.status(200).json({message: "Ok"});
                        });
                else 
                    books.updateOne({id: req.body.id}, {$set: {avail: "false", who: characters[Math.floor(Math.random() * 10)], due: "5/1/24"}})
                        .then(() => {
                            res.status(200).json({message: "Ok"});
                        });
            }
        });
});

start();