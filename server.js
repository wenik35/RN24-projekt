//server.js
import { MongoClient } from 'mongodb';
import express from "express";

var url = "mongodb://localhost:27017/";
const dbClient = new MongoClient(url);
const db = dbClient.db('rene24').collection("data");
//close the client: https://stackoverflow.com/questions/71779732/closing-mongoclient-connection-on-exit-when-using-mongodb-native-driver

const app = express();
const app_folder = "./client/dist/client/browser";

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', 'js', 'scss', 'css'],
    index: false,
    maxAge: '1y',
    redirect: true,
  }

// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 
               "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(app_folder, options));
app.use(express.json());

app.get('/api/data/:amount?/:offset?', (req, res) => {
    db.find({}).toArray().then((result) => {
        let data = result;

        if (req.params.offset){
            data = data.slice(req.params.offset);
        }
        if (req.params.amount != 0){
            data = data.slice(0, req.params.amount);
        }

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json('I dont have that');
        }
    });
})

app.post('/api/data', (req, res) => {
    db.insertOne(req.body);
})

// serve angular app
app.get('', function (req, res) {
    res.status(200).sendFile(`/`, {root: app_folder});
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});