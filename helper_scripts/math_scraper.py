from BeautifulSoup import BeautifulSoup as BS
import requests

r = requests.get("https://www.math.purdue.edu/people/faculty.php")
soup = BS(r.text)

list = soup.findAll("div", {"class":"persondetails"})

for div in list:
    contents = div.h3.contents
    for name in contents:
        split_name = name.rstrip().lstrip().split(", ")
        print split_name[1] + " " + split_name[0]
