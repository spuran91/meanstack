var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var bcrypt = require('bcrypt-node');
var SendGrid = require('sendgrid').SendGrid;
var app =express();

//app.get('/', function(req, res) {
//	res.send('Hello this is my home page.. Thanks for visiting...!!! :)');
//});

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/angular.html');
});
mongoose.connect('mongodb://localhost:27017/meanstacktest');
var db = mongoose.connection;
db.on('error',function(){
	console.log("this is a period failure!!");
});


var user_schema = mongoose.Schema({
	'firstname':String,
	'lastname':String,
	'address':String,
	'city':String,
	'zipcode':Number,
	'phonenumber':Number ,
	'state':String,
	'username':String
});

var login_schema = mongoose.Schema({
	'password': String,
	'emailid':String,
	'username':String
});
var login_model = mongoose.model('logind',login_schema);
console.log("one more step done");

var user_model = mongoose.model('details', user_schema);
app.use(bodyparser.json());
console.log("two more done")

app.post('/save_details', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var address = req.body.address;
	var zipcode =req.body.zipcode;
	var city = req.body.city;
	var phonenumber = req.body.phonenumber;
	var state = req.body.state;
	var username = req.body.username;
	
	var user_document = new user_model({
		'firstname':firstname,
		'lastname':lastname,
		'address':address,
		'zipcode':zipcode,
		'city':city,
		'phonenumber':phonenumber ,
		'state':state,
		'username':username
	});
	user_document.save(function(err ,save_resp) {
		if(err) {
			res.send({'flag':'err'});
		} else {
			res.send({'flag':'success'});

		}
	});
});

app.get('/sendmail',function(req,res){
	
	var sendgrid = new SendGrid(user, key);
	sendgrid.send({
	  to: 'example@example.com',
	  from: 'other@example.com',
	  subject: 'Hello World',
	  text: 'My first email through SendGrid'
	});
	
});

app.post('/login_details',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var emailid = req.body.emailid;
	var password_hashed = bcrypt.hashSync(password);
	console.log(password_hashed);
	var login_document = new login_model({
		'username' : username ,
		'password' : password_hashed,
		'emailid':emailid
	});
	login_document.save(function(err ,save_resp) {
		if(err) {
			res.send({'flag':'err'});
		} else {
			res.send({'flag':'success'});
			db.collection('details').aggregate([{
			    '$lookup': {
			            from: "loginds",
			            localField: "username",
			            foreignField: "username",
			            as: "logindetails"
			        }
			       
			}, { '$out' : "details" }] , function(err, res) {
			    console.log(res.logindetails);
			   
			});
		}
	});
	
});


app.get('/liststudents/:id', function(req, res) {
	console.log("helloo form res" + req.params.id);
	user_model.findOne({"username": (req.params.id)},function(err, data) {
		res.send(JSON.stringify(data));
		console.log("helloo form res" );
	});
});

app.use(express.static('assets'));

app.listen(8085 , function(){
	console.log("app is listening to the host");
});