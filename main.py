# imports are listed below
from contextlib import closing

from flask import Flask, request, jsonify, abort
from flask import render_template, send_from_directory
import os
import sqlite3
import json
import statistics

app = Flask(
    __name__,
    template_folder="frontend/dist",
    static_folder="frontend/dist/static",
)

app.config["CORS_HEADERS"] = "Content-Type"

years = range(2011, 2025)

groupIndex = {}
departmentIndex = {}


def yearQueryBuilder(year):
    return (year, f"select * from Year{year}")


def deptQueryBuilder(year):
    return (year, f"select * from Department{year}")


def groupQueryBuilder(year):
    return (year, f"select * from Group{year}")


class Salary:
    last_name = ""
    first_name = ""
    middle_name = ""
    dept = ""
    group = ""
    comp = ""
    long_text = ""

    def __init__(
        self, last_name, first_name, middle_name, dept, group, comp, long_text
    ):
        self.last_name = last_name
        self.first_name = first_name
        self.middle_name = middle_name
        self.dept = dept
        self.group = group
        self.comp = comp
        self.long_text = long_text

    def get_map(self):
        return {
            "last_name": self.last_name,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "dept": self.dept,
            "group": self.group,
            "comp": self.comp,
            "long_text": self.long_text,
        }


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


@app.route("/about")
def about():
    return render_template("index.html")


@app.route("/compare")
def compare_page():
    return render_template("index.html")


def validateYear(year):
    try:
        y = int(year)
    except:
        return False

    if int(year) not in years:
        return False

    return True


def queryBuilder(args):
    department = args.get("department", "")
    group = args.get("group", "")
    year = args.get("year", "2020")
    maxComp = int(args.get("max_comp", -1))
    minComp = int(args.get("min_comp", 0))

    if not validateYear(year):
        return abort(500)

    tableName = "Year" + year
    year = int(year)

    base_query = f"select * from {tableName}"
    conditionals = []
    query_args = []

    if len(department) > 0 and department in departmentIndex[year]:
        conditionals.append("department=?")
        query_args.append(department)

    if len(group) > 0 and group in groupIndex[year]:
        conditionals.append("group=?")
        query_args.append(group)

    if maxComp > 0:
        conditionals.append("compensation<?")
        query_args.append(float(maxComp))

    if minComp > 0:
        conditionals.append("compensation>?")
        query_args.append(float(minComp))

    if len(conditionals) > 0:
        base_query += " where "
        conditional = " and ".join(conditionals)
        base_query += conditional

    return base_query, tuple(query_args)


@app.route("/data/query")
def query():
    result_rows = []
    query, query_args = queryBuilder(request.args)

    with closing(sqlite3.connect("data/salaries.db")) as connection:
        with closing(connection.cursor()) as cursor:
            results = cursor.execute(query, query_args)
            result_rows = [Salary(*row).get_map() for row in results.fetchall()]

    count = len(result_rows)

    if count > 0:
        comps = [x["comp"] for x in result_rows]
        stats = {
            "max_comp": max(comps),
            "min_comp": min(comps),
            "mean_comp": sum(comps) / count,
            "median": statistics.median(comps),
        }
    else:
        stats = {
            "max_comp": 0,
            "min_comp": 0,
            "mean_comp": 0,
            "median": 0,
        }

    metadata = {"count": count, "request_params": {**request.args}}

    returnData = {"metadata": metadata, "stats": stats, "data": result_rows}

    return jsonify(returnData)


@app.route("/data/treemap")
def treemap():
    result_rows = []
    query, query_args = queryBuilder(request.args)

    with closing(sqlite3.connect("data/salaries.db")) as connection:
        with closing(connection.cursor()) as cursor:
            results = cursor.execute(query, query_args)
            result_rows = [Salary(*row).get_map() for row in results.fetchall()]

    dept_totals = {}
    for row in result_rows:
        dept = row["dept"]
        if "WL - " not in dept:
            continue
        dept_totals[dept] = dept_totals.get(dept, 0) + row["comp"]

    data = [{"name": dept, "comp": comp} for dept, comp in dept_totals.items()]

    returnData = {"data": sorted(data, key=lambda row: row["comp"])}

    return jsonify(returnData)


@app.route("/data/years")
def years_route():
    with closing(sqlite3.connect("data/salaries.db")) as conn:
        with closing(conn.cursor()) as c:
            c.execute("select * from years")
            ret_body = {"years": [row[0] for row in c.fetchall()]}

    return jsonify(ret_body)


def createPickerData(row, query):
    name = (
        row[1]
        + ((" " + row[2]) if row[2] != None and len(row[2]) > 0 else "")
        + " "
        + row[0]
    )

    return {
        "label": name,
        "description": f"Group: {row[4]}//Dept: {row[3]}//Comp: {row[5]}",
        "value": {
            "value": row[0],
            "last_name": row[0],
            "first_name": row[1],
            "middle_name": row[2],
            "dept": row[3],
            "group": row[4],
            "comp": row[5],
            "long_text": row[6],
        },
    }


@app.route("/data/picker/<year>")
def picker_data(year):
    tableName = "Year" + year
    department_table = f"Department{year}"
    group_table = f"Group{year}"

    query = request.args.get("query")

    with closing(sqlite3.connect("data/salaries.db")) as conn:
        with closing(conn.cursor()) as c:
            c.execute("select * from " + tableName + " limit 15")

            retDict = {}
            all_results = []

            for row in c.fetchall():
                person = createPickerData(row, query)

                if query is not None and query in person["label"]:
                    all_results.append(person)
                elif query is None:
                    all_results.append(person)

            retDict["data"] = all_results

            c.execute("select * from " + department_table + " order by department asc limit 15")
            retDict["departments"] = [
                {
                    "text": row[0],
                    "value": row[0],
                }
                for row in c.fetchall()
            ]

            c.execute("select * from " + group_table + " order by empGroup asc limit 15")
            retDict["groups"] = [
                {
                    "text": row[0],
                    "value": row[0],
                }
                for row in c.fetchall()
            ]

    return jsonify(retDict)


@app.route("/data/<year>")
def react_data(year):
    tableName = "Year" + year

    with closing(sqlite3.connect("data/salaries.db")) as conn:
        with closing(conn.cursor()) as c:
            c.execute("select * from " + tableName)

            retDict = {}
            retDict["data"] = [
                {
                    "last_name": row[0],
                    "first_name": row[1],
                    "middle_name": row[2],
                    "dept": row[7] + " - " + row[3],
                    "group": row[4],
                    "comp": row[5],
                    "long_text": row[6],
                    "key": f"{row[0]}-{row[1]}-{row[2]}-{row[5]}",
                }
                for row in c.fetchall()
            ]

            c.execute(
                f"select distinct name from (select campus || ' - ' || department as name from {tableName}) order by name asc"
            )
            retDict["departments"] = [
                {
                    "text": row[0],
                    "value": row[0],
                }
                for row in c.fetchall()
            ]

            c.execute(f"select distinct empGroup from {tableName} order by empGroup asc")
            retDict["groups"] = [
                {
                    "text": row[0],
                    "value": row[0],
                }
                for row in c.fetchall()
            ]

    return jsonify(retDict)


@app.route("/data/<year>/departments")
def dataPie(year):
    """Returns the departments and compensations for the year."""
    with closing(sqlite3.connect("data/salaries.db")) as conn:
        with closing(conn.cursor()) as c:
            c.execute(
                f"select name, sum(compensation) from Department{year} join Year{year} on name=department group by name"
            )

            retDict = {}
            retDict["year"] = year
            retDict["data"] = {}

            for row in c.fetchall():
                retDict["data"][row[0]] = row[1]

    return jsonify(retDict)


@app.route("/data/ranges/<year>")
def dataRanges(year):
    """Returns the averages, mins, and max compensations for each employee group and department."""

    if int(year) not in years:
        return abort(404)

    with closing(sqlite3.connect("data/salaries.db")) as conn:
        with closing(conn.cursor()) as c:
            c.execute(
                f"select campus, department, min(compensation), avg(compensation), max(compensation), count(department) from Year{year} where compensation > 15000 group by campus, department;"
            )

            department_result = [
                {
                    "campus": row[0],
                    "department": row[1],
                    "minSalary": row[2],
                    "averageSalary": row[3],
                    "maxSalary": row[4],
                    "count": row[5],
                }
                for row in c.fetchall()
            ]

            c.execute(
                f"select campus, empGroup, min(compensation), avg(compensation), max(compensation) from Year{year} where compensation > 15000 group by campus, empGroup;"
            )

            group_result = [
                {
                    "campus": row[0],
                    "group": row[1],
                    "minSalary": row[2],
                    "averageSalary": row[3],
                    "maxSalary": row[4],
                }
                for row in c.fetchall()
            ]

            c.execute(
                f"select campus, empGroup, department, min(compensation), avg(compensation), max(compensation) from Year{year} where compensation > 15000 group by campus, empGroup, department;"
            )
            combined_result = [
                {
                    "campus": row[0],
                    "group": row[1],
                    "department": row[2],
                    "minSalary": row[3],
                    "averageSalary": row[4],
                    "maxSalary": row[5],
                }
                for row in c.fetchall()
            ]

    return jsonify(
        {
            "departments": department_result,
            "groups": group_result,
            "combined": combined_result,
        }
    )


@app.route("/data/compare/search")
def compare_search():
    """Search for employees by name to add to comparison."""
    query = request.args.get("query", "").strip()
    year = request.args.get("year", "2024")

    if not query or len(query) < 2:
        return jsonify({"results": []})

    tableName = f"Year{year}"
    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()

    c.execute(
        f"select distinct firstName, middleName, lastName, department, campus from {tableName} "
        "where lower(firstName || ' ' || lastName) like ? "
        "or lower(lastName || ', ' || firstName) like ? "
        "limit 20",
        (f"%{query.lower()}%", f"%{query.lower()}%"),
    )

    results = [
        {
            "first_name": row[0],
            "middle_name": row[1] or "",
            "last_name": row[2],
            "dept": (row[4] + " - " + row[3]) if row[4] else row[3],
        }
        for row in c.fetchall()
    ]

    conn.close()
    return jsonify({"results": results})


@app.route("/data/compare")
def compare_salaries():
    """Compare salary data for selected employees across all years."""
    first_name = request.args.get("first_name", "")
    last_name = request.args.get("last_name", "")

    if not first_name or not last_name:
        return jsonify({"error": "first_name and last_name are required"}), 400

    conn = sqlite3.connect("data/salaries.db")
    c = conn.cursor()

    # Get available years from Year* table names
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'Year%'")
    available_years = sorted([int(row[0].replace("Year", "")) for row in c.fetchall()])

    salary_history = []

    for yr in available_years:
        tableName = f"Year{yr}"
        try:
            c.execute(
                f"select firstName, middleName, lastName, department, empGroup, compensation, campus "
                f"from {tableName} where firstName=? and lastName=?",
                (first_name, last_name),
            )
            rows = c.fetchall()
            for row in rows:
                salary_history.append({
                    "year": yr,
                    "first_name": row[0],
                    "middle_name": row[1] or "",
                    "last_name": row[2],
                    "dept": (row[6] + " - " + row[3]) if row[6] else row[3],
                    "group": row[4],
                    "comp": row[5],
                })
        except Exception:
            continue

    conn.close()
    return jsonify({"data": salary_history, "years": available_years})


@app.route("/")
def hello():
    """The index route."""
    return render_template("index.html", year="2019")


@app.route("/<page>")
def not_current_year(page):
    """Renders the page for the specific year. Works well with React!"""
    return render_template("index.html", year=page)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5100)
