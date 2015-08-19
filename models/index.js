var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/tripplanner');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var placeSchema = new mongoose.Schema({
	address: {type: String}, // street address
	city: {type: String}, 
	state: {type: String},
	phone: {type: String}, // as a string
	location: {type: Array}, // two numbers, latitude and longitude
});

var hotelSchema = new mongoose.Schema({
	name: {type: String},
	place: {type: Object},
	num_stars: { type: Number, min: 1, max: 5 }, // 1-5 stars
	amenities: {type: Array, get: getCDS} //comma delimited string list
});

var activitySchema = new mongoose.Schema({
	name: {type: String},
	place: {type: Object},
	age_range: {type: String}
});

var restaurantSchema = new mongoose.Schema({
	name: {type: String},
	place: {type: Object},
	cuisines: {type: Array, get: getCDS}, //comma delimited string list
	price: { type: Number, min: 1, max: 5 } // 1-5 dollar signs
});

var planSchema = new mongoose.Schema({
	name: {type: String},
	days: {type: Array} // array of day _ids
});

var daySchema = new mongoose.Schema({
	index: { type: Number, default: 1 },
	hotel: {type: Array}, 
	restaurants: {type: Array}, 
	activities: {type: Array}, 
	plan: {type: mongoose.Schema.Types.ObjectId, ref: 'Plan'} // the plan it belongs to
});

daySchema.pre('save', function(next) {
    var day = this;
    Plan.findById(day.plan._id, function (err, plan) {
    	day.index = plan.days.length + 1;
    	day.save(function (err) {});
        next();
    });
});

// get comma-delimited string version of array
function getCDS (arr) {
	return arr.join(", ");
}

var Place = mongoose.model('Place', placeSchema);
var Hotel = mongoose.model('Hotel', hotelSchema);
var Activity = mongoose.model('Activity', activitySchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Plan = mongoose.model('Plan', planSchema);
var Day = mongoose.model('Day', daySchema);

module.exports = {
  Place: Place,
  Hotel: Hotel,
  Activity: Activity,
  Restaurant: Restaurant,
  Plan: Plan,
  Day: Day
};