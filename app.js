
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server=http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var util=require('util')
var twitter=require('twitter')
var twit=new twitter({
	consumer_key:'ZC2mf56bQWVxlqEvgyzUeP8M9',
	consumer_secret:'cAxuIQPdG4seBqA7j6vFCElZM5c1mx854lbt81wWePJTN6MxPW',
	access_token_key: '2483064248-MoGX6dycSzoFHK7vbGkvkPZCscq4MiFOxD19CXx',
	access_token_secret: 'i7rA9d2WGpLWuGX4UgGAQ6OoS5pgEPRtI8VkL8ejgI2sO'
});

var io= require('socket.io').listen(server)
io.sockets.on('connection',function(socket){
	var show_timeline=(function(){
		twit.get('/statuses/home_timeline.json',{include_entries:true},function(data){
			socket.emit('timeline',data)
			console.log(data[0])
		})
	})()
	setInterval(function(){
		twit.get('/statuses/home_timeline.json',{include_entries:true},function(data){
			socket.emit('timeline',data)
			console.log(data[0])
		})
	},80 * 1000)
})
