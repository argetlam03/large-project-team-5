const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb+srv://dbAdmin:itMmocaV6xThvvQq@processes.ysma6.mongodb.net/COP4331?retryWrites=true&w=majority&appName=Processes';
const client = new MongoClient(url);
client.connect();

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

function generateMD5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

app.post('/api/login', async (req, res, next) => {
    var error = '';
    const { login, password } = req.body;
    var id = -1;
    var fn = '';
    var ln = '';

    try {
        const db = client.db();
        const results = await db.collection('Users').find({ Login: login, Password: generateMD5(password) }).toArray();

        if (results.length > 0) {
            id = results[0]._id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
        }
        else {
            error = 'Invalid user name/password';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: error };
    res.status(200).json(ret);
});

app.post('/api/createUser', async (req, res, next) => {
    var error = '';
    const { login, password, firstName, lastName, email } = req.body;
    const newUser = {
        Login: login,
        Password: generateMD5(password),
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        TypeNum: 0,
        AvgAcc: 0.00,
        AvgWpm: 0,
        MaxWpm: 0,
        WpmList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    if (!login || !password || !firstName || !lastName || !email) {
        error = "Please enter valid values."
    } else {
        try {
            const db = client.db();
            const result = db.collection('Users').insertOne(newUser);

            if (result.modifiedCount === 0) {
                error = 'Failed creating user.';
            }
        }
        catch (e) {
            error = e.toString();
        }
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/getUser', async (req, res, next) => {
    var error = '';
    const { id } = req.body;
    var firstName = '';
    var lastName = '';
    var email = '';
    var login = '';
    var avgAcc = '';
    var avgWpm = '';
    var maxWpm = '';

    try {
        const db = client.db();
        const results = await db.collection('Users').find({ _id: ObjectId.createFromHexString(id) }).toArray();

        if (results.length > 0) {
            firstName = results[0].FirstName;
            lastName = results[0].LastName;
            email = results[0].Email;
            login = results[0].Login;
            avgAcc = results[0].AvgAcc;
            avgWpm = results[0].AvgWpm;
            maxWpm = results[0].MaxWpm;
        }
        else {
            error = 'Invalid user.';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        login: login,
        avgAcc: avgAcc,
        avgWpm: avgWpm,
        maxWpm: maxWpm,
        error: error
    };

    res.status(200).json(ret);
});

app.post('/api/getSettings', async (req, res, next) => {
    var error = '';
    const { id } = req.body;
    var firstName = '';
    var lastName = '';
    var email = '';
    var login = '';

    try {
        const db = client.db();
        const results = await db.collection('Users').find({ _id: ObjectId.createFromHexString(id) }).toArray();

        if (results.length > 0) {
            login = results[0].Login;
            firstName = results[0].FirstName;
            lastName = results[0].LastName;
            email = results[0].Email;
        }
        else {
            error = 'Failed to retrieve user settings.';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret =
    {
        login: login,
        firstName: firstName,
        lastName: lastName,
        email: email,
        error: error
    };

    res.status(200).json(ret);
});

app.post('/api/updateSettings', async (req, res, next) => {
    var error = '';
    const { id, login, firstName, lastName, email } = req.body;

    try {
        const db = client.db();

        const updateFields = {};
        if (login) updateFields.Login = login;
        if (firstName) updateFields.FirstName = firstName;
        if (lastName) updateFields.LastName = lastName;
        if (email) updateFields.Email = email;

        if (Object.keys(updateFields).length > 0) {
            const results = await db.collection('Users').updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: updateFields });

            if (results.modifiedCount === 0) {
                error = 'Failed to update settings';
            }
        }

    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };

    res.status(200).json(ret);
});

app.post('/api/saveScore', async (req, res, next) => {
    var error = '';
    const { id, acc, wpm } = req.body;

    try {
        const db = client.db();
        const user = await db.collection('Users').find({ _id: ObjectId.createFromHexString(id) }).toArray();

        if (user) {
            const num = user[0].TypeNum;
            const list = user[0].WpmList;

            const newStats = {
                AvgAcc: (user[0].AvgAcc * num + acc) / (num + 1),
                AvgWpm: parseInt((user[0].AvgWpm * num + wpm) / (num + 1)),
                MaxWpm: Math.max(user[0].MaxWpm, wpm),
                WpmList: [wpm, list[0], list[1], list[2], list[3], list[4], list[5], list[6], list[7], list[8]],
                TypeNum: num + 1
            };

            const results = await db.collection('Users').updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: newStats });

            if (results.modifiedCount === 0) {
                error = 'Unable to save score';
            }

        }
        else {
            error = 'User does not exist';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };

    res.status(200).json(ret);
});

app.post('/api/getRecentStats', async (req, res, next) => {
    var error = '';
    const { id } = req.body;
    var stats = [];

    try {
        const db = client.db();
        const results = await db.collection('Users').find({ _id: ObjectId.createFromHexString(id) }).toArray();

        if (results.length > 0) {
            stats = results[0].WpmList;
        }
        else {
            error = 'Could not find recent stats.';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = {
        stats: stats,
        error: error
    };

    res.status(200).json(ret);
});

app.post('/api/getSearch', async (req, res, next) => {

    var error = '';
    const { search } = req.body;

    var _search = search.trim();

    try {
        const db = client.db();
        const results = await db.collection('Users').find({ "Login": { $regex: _search + '.*' }, }).toArray();

        var _ret = [];
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                _ret.push(results[i].Login);
                _ret.push(results[i].AvgAcc);
                _ret.push(results[i].AvgWpm);
                _ret.push(results[i].MaxWpm);
            }
        }
        else {
            error = 'No users found.';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = {
        results: _ret,
        error: error
    };
    res.status(200).json(ret);
});