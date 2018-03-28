# imports are listed below
from flask import Flask
import openpyxl as excel
from pymongo import MongoClient
from flask import render_template
import os

# declare the flask app object
app = Flask(__name__)

# route makes it so when you go to that specific url it will render the index template
@app.route('/')
def hello():
    url = 'mongodb+srv://exponent_cand:'+os.environ.get('password')+'@cluster0-ufki0.mongodb.net/test'
    client = MongoClient(url)
    db = client.test
    collection = db.seventeen
    money_list = list(collection.find())
    client.close()
    print money_list[0]
    return render_template('index.html', downyear=2016, year=2017, moneyList=money_list)

@app.route('/2016')
def sixteen():
    url = 'mongodb+srv://exponent_cand:'+os.environ.get('password')+'@cluster0-ufki0.mongodb.net/test'
    client = MongoClient(url)
    db = client.test
    collection = db.sixteen
    money_list = list(collection.find())
    client.close()
    print money_list[0]
    return render_template('index.html', downyear=2015, year=2016, moneyList=money_list)
