var express = require('express');
var router = express.Router();
var collections = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
	var keys = Object.keys(collections).filter(function(a){return a!='Place'}); // all collections except places
	var actions = [];
	for (var i=0;i<keys.length;i++) {
		actions.push(collections[keys[i]].find({}));
	}
	var output = [];
	Promise.all(actions).then(function(results){
		for (var i=0;i<results.length;i++){
			var currKey = keys[i];
			var currList = []
			for (var j=0;j<results[i].length;j++) {
				var current = results[i][j];
				currList.push({name: current.name});
			}
			output.push({name: currKey, list: currList});
		}
	});
	res.render('index', {collections: output});
});

router.get('/newplan',function(req,res){
	var plan = new collections.Plan({
		name: 'pilot plan',
		days: []
	});
	
	plan.save()
		.then(
			function(plan){
				console.log(plan)
				var day = new collections.Day({plan:plan._id});
				return day.save();
			})
		.then(function(day){
			res.redirect('/');
		})
		.catch(function(err){console.log(err);});
});

module.exports = router;
