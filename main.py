# imports are listed below
from flask import Flask, request, url_for
import openpyxl as excel
from pymongo import MongoClient
from flask import render_template
import os

# declare the flask app object
app = Flask(__name__)

# test route for the new ajax option
@app.route('/dev')
def dev():
	print 'dev page has been accsessed'
	return render_template('dev.html')

@app.route('/data')
def data():
    x = request.values
    for key,value in x.iteritems():
        print key + ": " + value
    return "lol"
	

# route makes it so when you go to that specific url it will render the index template
@app.route('/')
def hello():
    return render_template('index.html', year="2017" )

@app.route('/<page>')
def not_current_year(page):
    return render_template('index.html', year=page)

@app.route('/sports')
def sports():
    return render_template('sports.html')


