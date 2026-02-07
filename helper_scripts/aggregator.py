import sqlite3

years = [2024]

conn = sqlite3.connect("../data/salaries.db")

c = conn.cursor()

for year in years:
    c.execute(
        f"CREATE TABLE Department{year} AS SELECT DISTINCT department FROM Year{year}"
    )
    c.execute(f"CREATE TABLE Group{year} AS SELECT DISTINCT empGroup FROM Year{year}")
    c.execute(f"CREATE TABLE Campus{year} AS SELECT DISTINCT campus FROM Year{year}")

conn.commit()
conn.close()
