# imports are listed below
from flask import Flask, request, url_for, jsonify
from flask import render_template, send_from_directory, abort
import os
import sqlite3
import json

app = Flask(__name__, template_folder="frontend/build", static_folder="frontend/build/static")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

@app.route("/about")
def about():
	return(render_template("index.html"))

@app.route("/data/<year>")
def react_data(year):
    tableName = "Year"+year
    department_table = f"Department{year}"
    group_table = f"Group{year}"
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute("select * from "+tableName)
    tmpList = []
    retDict = {}
    retDict["data"] = [{
        "last_name": row[0],
        "first_name": row[1],
        "middle_name": row[2],
        "dept": row[3],
        "group": row[4],
        "comp": row[5],
        "long_text": row[6]
    } for row in c.fetchall()]

    c.execute("select * from " + department_table + " order by name asc")
    retDict["departments"] = [{
        "text": row[0],
        "value": row[0],
    } for row in c.fetchall()]

    c.execute("select * from " + group_table + " order by name asc")
    retDict["groups"] = [{
        "text": row[0],
        "value": row[0],
    } for row in c.fetchall()]

    conn.close()
    return json.dumps(retDict)


@app.route("/data/<year>/departments")
def dataPie(year):
    """Returns the departments and compensations for the year.
    """
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute(f"select name, sum(compensation) from Department{year} join Year{year} on name=department group by name")
    
    retDict = {}
    retDict["year"] = year
    retDict["data"] = {}

    for row in c.fetchall():
        retDict["data"][row[0]] = row[1]

    conn.close()
    return json.dumps(retDict)

@app.route("/search", methods=["POST"])
def search_route():
    print(request.json)
    data = request.json
    query = data["query"].split(" ")
    print(query)
    if data["year"] not in ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]:
        return abort(404)
    
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()

    s = set()

    for term in query:
        c.execute(f"select * from Year{data['year']} where firstName like \'{term}\' or lastName like \'{term}\' or department like \'%{term}%\' limit 10")
        for row in c.fetchall():
            s.add(row)
    print(len(s))

    conn.close()

    results_dict = {
        "results": list(s)
    }

    return jsonify(results_dict)

    

@app.route("/statistics", methods=["POST"])
def statistical_route():
    """Returns the statistics for a certain department.
    """
    data = request.data

    if data["year"] not in ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]:
        return abort()

    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()
    c.execute(f"select * from stat{data['year']} where department={data['department']}")

    data_row = c.fetchone()

    conn.close()

    retDict = {
        "data": {
            "department": data_row[0],
            "q1": data_row[1],
            "q2": data_row[2],
            "q3": data_row[3],
            "q4": data_row[4],
            "min": data_row[5],
            "max": data_row[6],
            "median": data_row[7],
            "average": data_row[8],
            "stdev": data_row[9]
        }
    }

    return json.dumps(retDict)


@app.route("/")
def hello():
    """The index route.
    """
    return render_template("index.html", year="2019" )


@app.route("/<page>")
def not_current_year(page):
    """Renders the page for the specific year. Works well with React!
    """
    return render_template("index.html", year=page)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
