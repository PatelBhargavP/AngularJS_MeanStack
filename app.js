var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/getAll', function (req, res) {
    User.find({}, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.json({ success: false });
        }
    })
})

app.get('/checkLogIn', function (req, res) {
    User.find({ "isLoggedIn": true }, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.json({ success: false });
        }
    })
})

app.post('/Loginusers', function (req, res) {
    var current = req.body
    User.find({ $and: [{ "username": current.username }, { "password": current.password }] }, function (err, data) {
        if (!err) {
            res.json(data);
            User.update({ "username": current.username }, {
                "isLoggedIn": true
            }, function (err, numberAffected, rawResponse) {
                //handle it
            })
        } else {
            res.json({ success: false });
        }
    })
});

app.post('/createusers', function (req, res) {
    var user_1 = new User(req.body);
    User.find({ "username": user_1.username }, function (err, data) {
        if (err) {
            res.json(data)
            user_1.save(function (err) {
                if (!err) {
                    res.json(req.body)
                } else {
                    res.json({
                        loginStat: false,
                        userThis: null
                    })
                }
            });
        }else{
            res.json({success:false});
        }
    });
});

app.post('/logOut', function (req, res) {
    User.update({ "isLoggedIn": true }, {
        "isLoggedIn": false
    }, function (err, numberAffected, rawResponse) {
        //handle it
        if (!err) {
            res.json(req.body);
        }
    })
});

app.post('/createjob', function (req, res) {
    var job_1 = new Job(req.body);
    job_1.save(function (err) {
        if (!err) {
            res.json(req.body)
        } else {
            res.json({
                loginStat: false,
                userThis: null
            })
        }
    });
});

app.post('/searchbytitle', function (req, res) {
    var title = req.body.titleVal;
    Job.find({ "title": { '$regex': new RegExp(title, "i") } }, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.json({ success: false });
        }
    })
});

app.post('/searchbyloc', function (req, res) {
    var loc = req.body.locVal;
    Job.find({ "location": { '$regex': new RegExp(loc, "i") } }, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.json({ success: false });
        }
    })
});

app.post('/searchbykey', function (req, res) {
    var keyword = req.body;
    var regex = [];
    for (var i = 0; i < keyword.length; i++) {
        regex[i] = new RegExp(keyword[i]);
    }
    Job.find({ "keywords": { $in: regex } }, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.json({ success: false });
        }
    })
});

mongoose.connect('mongodb://localhost/marlabs');
var db = mongoose.connection;
db.on('error', function () {
    console.log('connection error');
});
db.on('open', function () {
    console.log('connection established');
});

var UserSchema = mongoose.Schema({
    "username": {
        type: String,
        required: [true, "username can't be blank"]
    },
    "password": {
        type: String,
        required: [true, "password can't be blank"]
    },
    "email": {
        type: String,
        required: [true, "email can't be blank"]
    },
    "location": {
        type: String,
        required: [true, "location can't be blank"]
    },
    "phone": {
        type: Number,
        required: [true, "phone can't be blank"]
    },
    "type": {
        type: String,
        required: [true, "type can't be blank"]
    },
    "isLoggedIn": {
        type: Boolean
    }
});

var jobSchema = mongoose.Schema({
    "title": {
        type: String,
        required: [true, "username can't be blank"]
    },
    "desc": {
        type: String,
        required: [true, "password can't be blank"]
    },
    "keywords": {
        type: [String],
        required: [true, "email can't be blank"]
    },
    "location": {
        type: String,
        required: [true, "location can't be blank"]
    }
});

var Job = mongoose.model('jobs', jobSchema);

var User = mongoose.model('user', UserSchema);

app.listen(3000, function (err) {
    if (!err) {
        console.log('Server running @ 3000');
    } else {
        console.log('server running @ 3000')
    }
});