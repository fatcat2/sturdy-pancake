## Exponent 2017 Salary Guide
Made by Ryan Chen because Brad said to
### Dependencies
- Flask
- OpenPYXL
- PyMongo
- DataTables JQuery Plugin

### What does this repository include?
1. All the Excel files I have, which dates back to 2011.
2. The SQLite3 file with all the salaries inside.
3. A Python3 script that scrapes the data from the Excel files into the DB file. (`helper_scripts/importExcelToSqlite.py`)
4. My joy and happiness!

### No fair, you get all the data to yourself!
Nah I'm open to sharing! Hit up the endpoint `salary.purdueexponent.org/data/<insert year from 2010 to 2011>` to get a JSON of the specified year's data!
