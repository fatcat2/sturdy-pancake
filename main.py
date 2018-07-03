# imports are listed below
from flask import Flask, request, url_for
from pymongo import MongoClient
from flask import render_template
import openpyxl as excel
import os
import sqlite3
import json

# declare the flask app object
app = Flask(__name__)

# test route for the new ajax option
@app.route("/dev")
def dev():
	print "dev page has been accsessed"
	return render_template("dev.html")

@app.route("/data")
def data():
    x = request.values
    for key,value in x.iteritems():
        print key + ": " + value
    return "lol"
	

# route makes it so when you go to that specific url it will render the index template
@app.route("/")
def hello():
    return render_template("index.html", year="2017" )

# renders the page for the specific year
@app.route("/<page>")
def not_current_year(page):
    return render_template("index.html", year=page)

# this one is for the sports desk #alleyes
@app.route("/sports")
def sports():
    return render_template("sports.html")

#renders page for individual salary
@app.route("/salary/<name>", methods=["POST"])
def individualSalary(name):
    conn = sqlite3.connect("salary_history.db")
    c = conn.cursor()
    c.execute("select * from salary where name=?", (name))
    data = c.fetchone()
    salary_data = json.loads(data["compensation"])
    return render_template("salary.html", data=data, salary=salary_data)
