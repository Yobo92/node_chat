var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var dbURL = "mongodb+srv://yobo:Yobo1234@cluster0.5xuwt.mongodb.net/nodeChat?retryWrites=true&w=majority"

var server = app.listen(3000, () => {
    console.log("Server is running on port", server.address().port)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname));

mongoose.connect(dbURL, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("mongodb connected");
    }
    
})

io.on('connection', () => {
    console.log("A user is connected")
});

var Message = mongoose.model('Message', {name: String, message: String});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})  

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err) sendStatus(500)
        io.emit('message', req.body)
        res.sendStatus(200)
    })
})