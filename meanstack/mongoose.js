/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/meanapi');
var db = mongoose.connection;
db.on('error',function(){
	console.log("this is a period failure!!");
});

db.on('open', function() {
	console.log('Connection established');
	});