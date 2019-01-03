# muh imports
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.style as style

# reading the excel file of the latest salary data
df = pd.read_excel("2017.xlsx")

# naming the bins as integers first
binList = [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 300000, 310000, 320000, 330000, 340000, 350000, 360000, 370000, 380000, 390000, 400000, 410000, 4000000]

# split bins
bins = pd.cut(df['Comp'], binList)

# group and aggregate
groupedDF = df.groupby(bins)['Comp'].agg(['count', 'sum'])

# convert bin vals to strings
for x in range(0, len(binList)):
	if(binList[x] == 0):
		binList[x] = str(0)
	elif(binList[x] < 1000000):
		binList[x] = str(binList[x] / 1000) + "K"
	else:
		binList[x] = str(binList[x] / 1000000) + "M"

# make the range bin x-labels
binRangeList = []
for x in range(0, len(binList)-1):
	binRangeList.append("%s - %s" % (binList[x], binList[x+1]))

# setting visualization
ax = groupedDF[['count']].plot(kind='bar', title ="Distribution of salaries at Purdue (2017)", fontsize=12)

# set up axes for matplotlib
ax.set_xticklabels(binRangeList, fontdict={'fontsize':8}, rotation = 45, ha="right")
ax.set_ylabel("Number of Purdue Employees")
ax.set_xlabel("Salary bracket (in units specified)")

plt.show()