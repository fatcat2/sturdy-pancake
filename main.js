const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'

const dbname = 'test';

// var list = [];
var listchunks = [];
var chunk1;

function swap(arr, index_1, index_2){
	var temp = arr[index_1];
	arr[index_1] = arr[index_2];
	arr[index_2] = temp;
}

function partition(arr, low, high){
	var pivot = arr[4][high];
	i = low-1;

	for (var j = low; j >= high; j++) {
		if (arr[j]) {
			i++;
			swap(arr, i, j);
		}
	}
	swap(arr, i+1, high);
	return (i+1);
}

function quickSort(arr, low, high){
	if(low < high){
		var partition = parition(arr, low, high)
		quickSort(arr, low, partition-1);
		quickSort(arr, partition+1, high);
	}
}


app.set('view engine', 'pug');

app.get("/", function (req, res){
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		console.log("Connected successfully to the server");
		
		const db = client.db(dbname);
		db.collection('money').find({}).toArray(function(err, result){
			var list = [];
			// console.log(err);
			if(err) throw err;
			for(var i = 0; i < 50; i++){
				row = result[i];
				list.push([row.last_name, row.first_name, row.dept, row.employee_group, row.compensation]);
			}
			// list = [1, 2, 3];
			res.render('main', {description: 'saucy', list: list} );
			client.close();
		});
	});
	// console.log(list);
	// res.render('main', {description: 'saucy', list: list} )
});

app.get("/sort/salary", function (req, res){
	//get the list
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		console.log("Connected successfully to the server");
		
		const db = client.db(dbname);
		db.collection('money').find({}).toArray(function(err, result){
			var list = [];
			// console.log(err);
			if(err) throw err;
			for(var i = 0; i < 50; i++){
				row = result[i];
				list.push([row.last_name, row.first_name, row.dept, row.employee_group, row.compensation]);
			}

			// list = [1, 2, 3];
			res.render('main', {description: 'saucy', list: list} );
			client.close();
		});
	});
	//sort the list
	//render the motherfucking list
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

