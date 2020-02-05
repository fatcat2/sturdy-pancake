# imports are listed below
from flask import Flask, request, url_for
from flask import render_template, send_from_directory
import os
import sqlite3
import json

# declare the flask app object
app = Flask(__name__, template_folder="frontend/build", static_folder="frontend/build/static")
# Bootstrap(app)

def getSQLQuery(query_id, year):
    try:
        year = int(year)
    except Exception as e:
        return -1
    if year == 2011:
        return "select * from Year2011"
    elif year == 2012:
        return "select * from Year2012"
    elif year == 2013:
        return "select * from Year2013"
    elif year == 2014:
        return "select * from Year2014"
    elif year == 2015:
        return "select * from Year2015"
    elif year == 2016:
        return "select * from Year2016"
    elif year == 2017:
        return "select * from Year2017"
    elif year == 2018:
        return "select * from Year2018"
    elif year == 2019:
        return "select * from Year2019"


@app.route("/favicon.ico")
def favicon():
    print("Favicon requested")
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')
# comment
@app.route("/about")
def about():
	return(render_template("index.html"))

@app.route("/dev")
def dev():
    return(render_template("dev.html"))

@app.route("/react_data/<year>")
def react_data(year):
    tableName = "Year"+year
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDict = {}
    retDict["data"] = [{
        "last_name": row[0],
        "first_name": row[1],
        "middle_name": row[2],
        "dept": row[3],
        "group": row[4],
        "comp": row[5]
    } for row in c.fetchall()]
    conn.close()
    return json.dumps(retDict)


@app.route("/data/<year>")
def data(year):
    tableName = "Year"+year
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDict = {}
    retDict["data"] = c.fetchall()
    conn.close()
    return json.dumps(retDict)

@app.route("/data/<year>/salary/<LastFirstMiddle>")
def indiv_salary(year, LastFirstMiddle):
    tableName = "Year"+year
    try:
        year = int(year)
    except Exception as e:
        return "Access denied."

    # Scrub LastFirstMiddle to remove all whitespace
    LastFirstMiddle = "".join(LastFirstMiddle.split())

    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    sql = getSQLQuery(1, year) + " where combined = ?"
    c.execute(sql, (LastFirstMiddle,))
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDict = {}
    retDict["year"] = year
    retDict["data"] = c.fetchall()
    conn.close()
    return json.dumps(retDict)

# @app.route("/data/<year>/name/<c>")

@app.route("/data/pie/<year>")
def dataPie(year):
    tableName = "Year" + year
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    #for row in cursor:
    #    tmpList.append(row)
    retDictTMP = {}
    for row in c:
        dept = row[3]
        comp = int(row[5])

        # Make sure we're just getting WL salaries
        if "WL - " not in dept:
            continue

        # Insert into the retDictTMP
        if dept in retDictTMP.keys():
            retDictTMP[dept] += comp
        else:
            retDictTMP[dept] = comp

    retDict = []
    for dept in retDictTMP.keys():
        tmpDict = {}
        tmpDict["label"] = dept
        tmpDict["comp"] = retDictTMP[dept]
        retDict.append(tmpDict)

    conn.close()
    # print(retDict)
    return json.dumps(retDict)


# route makes it so when you go to that specific url it will render the index template
@app.route("/")
def hello():
<<<<<<< HEAD
=======
    return render_template("index.html", year="2019" )

# renders the page for the specific year
@app.route("/<page>")
def not_current_year(page):
    return render_template("index.html", year=page)

@app.route("/sports")
def sports():
>>>>>>> 56852a426e51d0e0b2242c1978b9d5e93fae2ef3
    return render_template("index.html")

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
    years_sorted = sorted(salary_data.keys())
    salary_sort = []
    for x in years_sorted:
        salary_sort.append(salary_data[x])
    if len(data[4]) > 0:
        lst = list(data)
        lst[4] += "."
        data = tuple(lst)
    return render_template("salary.html", data=data, salary=json.dumps(salary_sort), years=json.dumps(years_sorted))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
