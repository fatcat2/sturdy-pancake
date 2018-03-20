from flask import Flask
import openpyxl as excel
from pymongo import MongoClient
from flask import render_template
import os
app = Flask(__name__)
@app.route('/')
def hello():
    url = 'mongodb+srv://exponent_cand:'+os.environ.get('password')+'@cluster0-ufki0.mongodb.net/test'
    client = MongoClient(url)
    db = client.test
    collection = db.seventeen
    money_list = list(collection.find())
    client.close()
    print money_list[0]
    return render_template('index.html', moneyList=money_list)
