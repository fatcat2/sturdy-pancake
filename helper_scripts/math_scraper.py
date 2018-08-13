from bs4 import BeautifulSoup as bs
import requests

r = requests.get("https://www.math.purdue.edu/people/faculty.php")
soup = bs(r.text, "lxml")

list = soup.findAll("div", {"class":"persondetails"})

for div in list:
    contents = div.h3.contents
    for name in contents:
        split_name = name.rstrip().lstrip().split(", ")
        print(split_name[1] + " " + split_name[0])
