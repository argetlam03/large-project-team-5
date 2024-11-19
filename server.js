const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//TODO: Database Implementation
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://dbAdmin:i79M5ezCQfyyYX@@processes.ysma6.mongodb.net/COP4331?retryWrites=true&w=majority&appName=Processes';
const client = new MongoClient(url);
client.connect();

app.post('/api/login', async (req, res, next) => {
    var error = '';
    const { login, password } = req.body;
    var id = -1;
    var fn = '';
    var ln = '';

    // TODO: Database Implementation
    try {
        const db = client.db();
        const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

        if (results.length > 0) {
            id = results[0].UserId;
            fn = results[0].FirstName;
            ln = results[0].LastName;
        }
        else {
            error = 'Invalid user name/password';
        }
    }
    catch(e) {
        error = e.toString();
    }


    if (login.toLowerCase() == 'test' && password == 'test') {
        id = 1;
        fn = 'TestFirst';
        ln = 'TestLast';
    }
    else {
        error = 'Invalid user name/password';
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: error };
    res.status(200).json(ret);
});

app.post('/api/createUser', async (req, res, next) => {
    var error = '';
    const { login, password, firstName, lastName, email } = req.body;
    const newUser = {
        Login: login, 
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        Email: email
    };

    // TODO: Database Implementation
    try {
        const db = client.db();
        const result = db.collection('Users').insertOne(newUser);
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.listen(5000);