
from  pymongo import MongoClient
from openpyxl import Workbook
from openpyxl import load_workbook
client = MongoClient()

client = MongoClient("mongodb://localhost:27017")

db = client["test"]
money = db.seventeen
wb = load_workbook(filename='2017.xlsx')
print(wb.sheetnames)

sheet = wb.active

print(sheet['B2'].value)

data_list = []

for row in sheet.iter_rows(min_row=2, min_col=1, max_row=1001, max_col=11):
#    a = []
    print row
'''    for cell in row:
        a.append(cell.value)
    post_data = {
            'last_name': a[2],
            'first_name': a[3],
            'middle_name': a[4],
            'dept': a[5],
            'employee_group': a[10],
            'compensation': a[11]
            }
    data_list.append(post_data)
    #insert the entire fucking list yooooo
    db.money.insert_many(data_list)'''
