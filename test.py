from pymongo import MongoClient

client = MongoClient()

db = client.test
collection = db.money
money_list = list(collection.find())
print money_list[0]

client.close()
