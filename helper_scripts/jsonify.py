from pymongo import MongoClient
import os

url = 'mongodb+srv://exponent_cand:'+os.environ.get('password')+'@cluster0-ufki0.mongodb.net/test'
client = MongoClient(url)
db = client.test
collection = db.seventeen
money_list = list(collection.find())
client.close()

f = open("ajax.txt", "w+");

f.write("{ \"data\": [");

for x in range(0, len(money_list)):
	person = money_list[x]
	f.write("[\"" + person['last_name'] + "\"," + person['first_name'] + "\"," + person['employee_group'] + "\"," + person['dept'] + "\"," + str(person['compensation']) + "]\n")
	if(x < len(money_list)-1):
		f.write(",")
f.write("]}")
f.close()

