var PORT = 8080;

var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	gravatar = require('gravatar');

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
	imageURL:String,

	books:[Book],
	role:String,

	payingMonthly:Number


})

var User = mongoose.model('User', UserSchema);
var Book = mongoose.model('Book', BookSchema);

var memStore = require('connect').session.MemoryStore;
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'books', store: memStore({
		reapInterval : 60000*10
	})}));
	app.use(express.static(__dirname+'/static'));
});

Book.find({}, function (err, books){

	books.forEach(function (book){

		console.log(book);
	})
})


app.get('/', function (req, res){

	res.send('Hello :)');
})

app.post('/register', function (req,res){

	var user = new User();

	
	user.name = req.body.name;
	user.email = req.body.email;
	user.passwd = req.body.passwd;

	var image = gravatar.url(user.email);

	if (image != null){

		user.imageURL = image;
	}

	user.save(function (err){

		if (!err) console.log(user.name+' has registered :)');
	})
})

app.post('/edit', function (req,res){

	var id = req.body._id;
	User.findById(id, function (err, user){

		user.name = req.body.name;
		if (req.body.email) user.email = req.body.email;

		if (req.body.passwd) user.passwd = req.body.passwd;

		user.save(function (err){

		if (!err) console.log(user.name+' has edited :)');
	})


	})
})



app.listen(PORT, function(err){

	console.log('Up and Running on '+PORT);
})
