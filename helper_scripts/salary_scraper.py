import json
import sqlite3
from openpyxl import Workbook, load_workbook
wb = load_workbook(filename='2016.xlsx')

sheet = wb.active

data_list = []

#initiate connection with sqlite3 db file
conn = sqlite3.connect("salary_history.db")
c = conn.cursor()

x = 0

#go through excel file and add entries to sqlite3 db
for row in sheet.iter_rows(min_row=2, min_col=1, max_row=sheet.max_row, max_col=sheet.max_column):
    a = []
    for cell in row:
        a.append(cell.value)
    
    compensation_json = "{\"2011\":" + a[12] + "}"

    post_data = {
            "id": x,
            "name": a[2]+a[3]+a[4],
            "last_name": a[2],
            "first_name": a[3],
            "middle_name": a[4],
            "dept": a[5],
            "employee_group": a[10],
            "compensation": compensation_json
            }
    data_list.append(post_data)
    x++

#add 2011 entries to sqlite3
for i in range(0, len(data_list)):
    person = data_list[i]
    c.execute("insert into salary values(\"?, ?, ?, ?, ?, ?, ?, ?\")", (person["id"], person["name"], person["last_name"], person["first_name"], person["middle_name"], person["dept"], person["employee_group"], person"compensation"])

conn.commit()
conn.close()

