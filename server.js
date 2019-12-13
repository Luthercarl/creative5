var express = require('express');
var router = express.Router();
var cors = require('cors');

const bodyParser = require("body-parser");
const multer = require('multer')
const upload = multer({
  dest: './images/',
  limits: {
    fileSize: 10000000
  }
});
var app = express();
app.options('*', cors())
app.use(cors());

const mongoose = require('mongoose');
// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true,useUnifiedTopology: true
});


app.use(bodyParser.json());

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  amount: Number,
  path: String,
});

const cartSchema = new mongoose.Schema({
	title:String,
	price: String,
	amount: String,
	path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

const Cart = mongoose.model('Cart',cartSchema);

app.use(express.static('public'));



app.get('/items', async (req, res) => {
  try {
	
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/carts', async (req, res) => {
  try {
	
    let cart = await Cart.find();
    res.send(cart);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.delete('/items/:id', async(req,res) => {
	var id = req.params.id;
	Item.deleteOne({_id: id },
	function(err){
		if(err){
			console.log(err)
		}
		else{
			return res.send("Deleted");
		}
	});
	
});

app.delete('/carts/:id', async(req,res) => {
	var id = req.params.id;
	Cart.deleteOne({_id: id },
	function(err){
		if(err){
			console.log(err)
		}
		else{
			return res.send("Deleted");
		}
	});
	
});


app.put('/items/:id', async (req, res) => {
	var id = req.params.id
	console.log(req.body.title);
	console.log(id);
	Item.findOneAndUpdate(
	{_id: id},
	{$set: {"title" : req.body.title}});
	item = Item.updateOne({_id: id},{$set:{title: req.body.title,description: req.body.description}},
	{new:true},(err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }

    console.log(doc);
	});
	
});


app.post('/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "images/" + req.file.filename
  });
});

app.post('/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
	price: req.body.price,
    path: req.body.path,
	description: req.body.description,
  });
  try {
    await item.save(function (err,itema) {
		if (err) return consol.error(err);
		console.log(itema.title + " saved to item collection.");
	});

    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/carts', async (req, res) => {
  const cart = new Cart({
    title: req.body.title,
	price: req.body.price,
    path: req.body.path,
	description: req.body.description,
	amount: req.body.amount,
  });
  try {
    await cart.save(function (err,carter) {
		if (err) return consol.error(err);
		console.log(carter.title + " saved to item collection.");
	});

    res.send(cart);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



module.exports = router;
app.listen(8001, () => console.log('Server listening on port 8001!'));