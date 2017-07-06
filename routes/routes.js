module.exports = function (app) {
	var path = require('path');
	var cfenv = require("cfenv");
	var appEnv = cfenv.getAppEnv();
	var commentWallCloudant = appEnv.getService("commentWallCloudant");
	var Cloudant = require('cloudant');
	var cloudant = Cloudant(commentWallCloudant.credentials.url);  
	var db = cloudant.db.use('scrapbook');

	app.get('/', function(req, res) {
		res.render('index.html');
	});

	//TODO: Use unique ID for users so people can have the same names
	app.get('/api/getComments', function(req, res) {
		//TODO: filter out xml to prevent XXS attacks
		var requestedName = req.query.name;
		if(requestedName == '' || requestedName == null){
			res.status(400).json({ok:false, msg:'name is a required parameter.'});
			return;
		}

		db.list({include_docs:true},function(err, body) {
			if (err) {
				console.log("error getting comments: " + err);
				res.status(500).json({ok:false});
				return;
			}

			var comments = [];
			// find all comments for the requested user and format them
			body.rows.forEach(function(entry) {
				if(entry.doc.to.toUpperCase() == requestedName.toUpperCase()){
					comments.push({from: entry.doc.from, msg: entry.doc.msg});
				}
			});

			res.json({msgs:comments});
		});
		
	});

	app.post('/api/addComment', function(req, res) {
		var toParam = req.body.to;
		var fromParam = req.body.from;
		var msgParam = req.body.msg;

		var comment = {to: toParam, from: fromParam, msg: msgParam};

		db.insert(comment, function(err, body) {
			if (err){
				console.log("error adding comment: " + err);
				res.status(500).json({ok:false});
				return;
			}
			console.log('----------\nAdded comment for: ' + toParam + '\nfrom: ' + fromParam + '\nmessage: ' + msgParam + '\n----------');
			res.json(body);
		});
	});
}