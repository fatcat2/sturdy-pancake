# imports are listed below
from flask import Flask, request, url_for
from flask import render_template, send_from_directory
import os
import sqlite3
import json

# declare the flask app object
app = Flask(__name__)
# Bootstrap(app)

@app.route("/favicon.ico")
def favicon():
    print("Favicon requested")
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/about")
def about():
	return(render_template("about.html"))

@app.route("/dev")
def dev():
    return(render_template("dev.html"))

@app.route("/data/<year>")
def data(year):
    tableName = "Year"+year
    conn = sqlite3.connect("static/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDict = {}
    retDict["data"] = c.fetchall()
    conn.close()
    return json.dumps(retDict)

@app.route("/data/pie/<year>")
def data(year):
    tableName = "Year" + year
    conn = sqlite3.connect("static/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDict = {}
    for row in cursor:
        dept = row[3]
        comp = int(row[5])
        if dept in retDict.keys():
            retDict[dept] += comp
        else:
            retDict[dept] = comp
    conn.close()
    print(retDict)
    return ":)"
	

# route makes it so when you go to that specific url it will render the index template
@app.route("/")
def hello():
    return render_template("index.html", year="2017" )

# renders the page for the specific year
@app.route("/<page>")
def not_current_year(page):
    return render_template("index.html", year=page)

@app.route("/sports")
def sports():
    return render_template("sports.html")

#renders page for individual salary
@app.route("/salary/<name>", methods=["POST", "GET"])
def individualSalary(name):
    conn = sqlite3.connect("salary_history.db")
    c = conn.cursor()
    c.execute("select * from salary where name=?", [name,])
    data = c.fetchone()
    conn.close()
    try:
        print(data[6])
    except:
        return render_template("error.html")
    salary_data = json.loads(data[7])
    years_sorted = sorted(salary_data.iterkeys())
    salary_sort = []
    for x in years_sorted:
        salary_sort.append(salary_data[x])
    if len(data[4]) > 0:
        lst = list(data)
        lst[4] += "."
        data = tuple(lst)
    return render_template("salary.html", data=data, salary=json.dumps(salary_sort), years=json.dumps(years_sorted))

if __name__ == "__main__":
    app.run()
