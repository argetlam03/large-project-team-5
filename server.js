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
        AvgAcc: 0.00,
        AvgWpm: 0,
        MaxWpm: 0
    };

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
            error = 'Invalid user name/password';
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
            error = 'Failed to retrieve user settings. Please verify the user ID or try again later.';
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

    var ret =
    {
        success: error === "",
        error: error
    };

    res.status(200).json(ret);
});

app.post('/api/saveScore', async (req, res, next) => {
    var error = '';
    const { id, avgAcc, avgWpm, maxWpm } = req.body;

    try {
        const db = client.db();
        const results = await db.collection('Users').findOne({ _id: ObjectId.createFromHexString(id) }).toArray();

        if (user) {
            const saveScore = {};
            saveScore.AvgAcc = avgAcc;
            saveScore.AvgWpm = avgWpm;
            saveScore.MaxWpm = maxWpm;



            const results = await db.collection('Users').updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: saveScore });

            if (updateResult.modifiedCount === 0) {
                error = 'No fields were updated';
            }

        }
        else {
            error = 'Unable to save score';
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret =
    {
        avgAcc: avgAcc,
        avgWpm: avgWpm,
        maxWpm: maxWpm
    };

    res.status(200).json(ret);
});
