from pymongo import MongoClient
import os

url = 'mongodb+srv://exponent_cand:'+os.environ.get('password')+'@cluster0-ufki0.mongodb.net/test'
client = MongoClient(url)
db = client.test
collection = db.sixteen
money_list = list(collection.find())
client.close()

f = open("ajax.txt", "w+");

f.write("{ \n\t\"data\": [\n");
for x in range(0, len(money_list)):
	person = money_list[x]
        print person
        if person['first_name'] == None:
            person['first_name'] = ""
        if person['last_name'] == None:
            person['first_name'] = ""
        try:
            f.write("\t\t[\"" + person['last_name'] + "\",\"" + person['first_name'] + "\",\"" + person['employee_group'] + "\",\"" + person['dept'] + "\",\"" + str('${:,.2f}'.format(person['compensation'])) + "\"]")
	    if(x < len(money_list)-1):
	        f.write(",\n")
            else:
                f.write("\n")
        except Exception as e:
            print person
            print e
f.write("\t]\n}")
f.close()

