var PORT = 8080;

var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect('mongodb://localhost/books');

var app = express.createServer();

var BookSchema = new mongoose.Schema ({

	title:String,
	imageURL:String,

	pages: [String],
	author: String,
	readers:[Read]



})
var Read = new mongoose.Schema ({

	reader:String,


})
var UserSchema = new mongoose.Schema ({

	email:String,
	passwd:String,

	name:String,

	books:[Book],
	role:String,

	payingMonthly:Number


})

var User = mongoose.model('User', UserSchema);
var Book = mongoose.model('Book', BookSchema);

Book.find({}, function (err, books){

	books.forEach(function (book){

		console.log(book);
	})
})


app.get('/', function (req, res){

	res.send('Hello :)');
})

app.post('/register')

app.listen(PORT, function(err){

	console.log('Up and Running on '+PORT);
})
