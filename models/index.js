var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));


var Place = new mongoose.Schema({
	address: {type: String}, // street address
	city: {type: String}, 
	state: {type: String},
	phone: {type: String}, // as a string
	location: {type: Array}, // two numbers, latitude and longitude
});

var Hotel = new mongoose.Schema({
	name: {type: String},
	place:   {type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
	num_stars: { type: Number, min: 1, max: 5 }, // 1-5 stars
	amenities: {type: Array, get: getCDS} //comma delimited string list
});

var Activity = new mongoose.Schema({
	name: {type: String},
	place: {type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
	age_range: {type: String}
});

var Restaurant = new mongoose.Schema({
	name: {type: String},
	place: {type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
	cuisines: {type: Array, get: getCDS}, //comma delimited string list
	price: { type: Number, min: 1, max: 5 } // 1-5 dollar signs
});

// get comma-delimited string version of array
function getCDS (arr) {
	return arr.join(", ");
}