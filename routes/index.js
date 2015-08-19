var express = require('express');
var router = express.Router();
var collections = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
	var keys = Object.keys(collections);
	var actions = [];
	for (var i=0;i<keys.length;i++) {
		actions.push(collections[keys[i]].find({}));
	}
	var output = [];
	Promise.all(actions).then(function(results){
		console.log('all the actions were performed');
		console.log(results.length);
		//results = results[1];
		for (var i=0;i<results.length;i++){
			for (var j=0;j<results[i].length;j++) {
				var current = results[i][j];
				console.log(current);
				output.push({name: current.name});
			}
		}
	});
	res.render('index', {businesses: output});
});

module.exports = router;
