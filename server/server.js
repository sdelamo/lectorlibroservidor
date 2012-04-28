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
app.set('views', __dirname+'/views');


Book.find({}, function (err, books){

	books.forEach(function (book){

		console.log(book);
	})
})


app.get('/', function (req, res){

	res.render('root.jade');
})

app.post('/register', function (req,res){

	var user = new User();

	
	user.name = req.body.name;
	user.email = req.body.email;
	user.passwd = req.body.passwd;

	user.role = req.body.role;

	var image = gravatar.url(user.email);

	if (image != null){

		user.imageURL = image;
	}

	user.save(function (err){

		if (!err) console.log(user.name+' has registered :)');
	})
})

app.post('/edit', function (req,res){

	var id = req.session.user._id;

	User.findById(id, function (err, user){

		user.name = req.body.name;
		if (req.body.email) user.email = req.body.email;

		if (req.body.passwd) user.passwd = req.body.passwd;

		user.save(function (err){

		if (!err) console.log(user.name+' has edited :)');
	})


	})
})

app.post('/book/new', function (req, res){

	var book = new Book();

	book.title = req.body.title;
	book.author = req.session._id;

	/*var image = req.files.image.path;
	if image
	console.log(req.files.image);
	var path = __dirname+"/static/images/"+book._id+".png";
	fs.rename(image, path, function (err){
		
		if (err) throw err;
	  });
	book.imageURL = path;*/
	book.save(function (err){

		if (!err) console.log (book.title+ " saved :)");
	})
})

app.post('book/edit', function (req, res){

	var id = req.body._id;
	Book.findById(id, function (err, book){

		book.title = req.body.title;

		/*var image = req.files.image.path;
		if image
	console.log(req.files.image);
	var path = __dirname+"/static/images/"+book._id+".png";
	fs.rename(image, path, function (err){
		
		if (err) throw err;
	  });
	book.imageURL = path;*/
	})
})



app.listen(PORT, function(err){

	console.log('Up and Running on '+PORT);
})

function needsLogin(req, res, next){
	
	if (req.session.user){
		next();
	}
	else {
		
		console.log('not allowed');
		res.send('Not allowed in here... Please, login..');
	}
}

