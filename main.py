from flask import Flask
import openpyxl as excel
from pymongo import MongoClient
from flask import render_template
app = Flask(__name__)
@app.route('/')
def hello():
    client = MongoClient('mongodb://localhost:27017/')
    db = client.test
    collection = db.money
    money_list = list(collection.find())
    client.close()
    return render_template('index.html', moneyList=money_list)
