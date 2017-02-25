//install and save to package json
//window.navigator.userAgent = 'react-native';

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);	
var io = require('socket.io')(server);

var db = require('./db/db');
var auth = require('./auth');
var cors = require('cors');

//Middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var cors = require('cors');

// Pass middleware into express
app.use(cors()); 
app.use(bodyParser.json());
// app.use(bodyParser.urlencodeed({extended: true}));

app.use(cookieParser());

// app.post('/signup', auth.signup);
// app.get('/getUsers', auth.getAll);

io.on('connection', (socket) => {
	console.log('a client just joined', socket.id);
	socket.on('message', (message) => {
		console.log('message received:', message);
	});
	socket.on('action', (action) => {
    	if (action.type === 'socket/signin') {
    	  auth.signin(action.payload, function(token){
          console.log('index.js socket/signin - got token, emitting action with token back to app for token', token);
          socket.emit('action', {type:'LOGIN_RESPONSE', data: token});   
        })  
    	}
      if (action.type === 'socket/signup') {
        auth.signup(action.payload, function(token){
          console.log('index.js socket/signup - got token, emitting action with token back to app for token', token);
          socket.emit('action', {type:'LOGIN_RESPONSE', data: token});          
        })
      }
  	});
	io.emit('message2', 'xxxxxxxx received from server: connection established');
});


module.exports = server;
