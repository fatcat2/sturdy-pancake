const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'

const dbname = 'test';

var list = [];
var listchunks = [];
var chunk1;
app.set('view engine', 'pug');

app.get("/", function (req, res){
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		console.log("Connected successfully to the server");
		
		const db = client.db(dbname);
		db.collection('money').find({}).toArray(function(err, result){
			if(err) throw err;
			for(var i = 0; i < 25; i++){
				row = result[i];
				list.push([row.last_name, row.first_name, row.dept, row.employee_group, row.compensation]);
			}

			res.render('main', {description: 'saucy', list: list} )
		});
		client.close();
	});
	//console.log(list);
	//res.render('main', {description: 'saucy', list: list} )
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
