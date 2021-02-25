import sys
import os
import csv

# Script uses methods only supported in v3.6 and later
# Minimum python version check
MIN_PYTHON = (3, 6)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

# Get directory path of this script
# We'll use this for making our paths relative
dirname = os.path.dirname(__file__)

# Get the csv file
budgetData = os.path.join(dirname, "Resources", "budget_data.csv")

# Declare variables
dates = []
pl_changes = []
net_pl = 0
prev_pl = 0

# Open the csv file in read mode
with open(budgetData, "r") as csvFile:
    # read the csv file
    csvreader = csv.reader(csvFile, delimiter=",")

    # Skip the header row
    next(csvreader, None)

    for i, row in enumerate(csvreader):
        # Add the date string to dates list if it doesn't already exist
        if not row[0] in dates:
            dates.append(row[0])

        # add month's Profit/Losses to net_pl
        net_pl = net_pl + int(row[1])
        
        # Calculate the changes in Profit/Loss from previous month
        data = {
            "date": row[0],
            "chg": int(row[1]) - int(prev_pl)
        }
        
        # Set the prev_pl for use in next interation
        prev_pl = int(row[1])

        # The first month's Profit/Loss value is being used as the initial value of the period rather than assuming 0
        # Add the change value to pl_changes list if not the first row
        if i != 0:
            pl_changes.append(data)

# Calculate average change in profit/losses over entire period
avg_change = sum(item["chg"] for item in pl_changes) / len(pl_changes)

# Find Max Increase and Max Decrease in Profit/Losses
max_gain = max(pl_changes, key=lambda el:el['chg'])
max_loss = min(pl_changes, key=lambda el:el['chg'])

# Print results to console
print("\n")
print("Financial Analysis")
print("---"*20)
print("{0:<28} : {1}".format("Total Months",len(dates)))
print("{0:<28} : ${1:,}".format("Net Total", net_pl))
print("{0:<28} : ${1:,.2f}".format("Average Change", avg_change))
print("{0:<28} : {date} (${chg:,.2f})".format("Greatest Increase in profits",**max_gain))
print("{0:<28} : {date} (${chg:,.2f})".format("Greatest Decrease in profits",**max_loss))
print("\n")

# Export results to a text file
# Declare the file path for the results.txt file
outFile = os.path.join(dirname, "Analysis", "mhigh_results.txt")

# Create the outFile's directory if it doesn't exist
if not os.path.exists(os.path.dirname(outFile)):
    os.makedirs(os.path.dirname(outFile))

# Write results to the results.txt file
with open(outFile, "w") as f:
    f.write("Financial Analysis\n")
    f.write("---"*20 + "\n")
    f.write("{0:<28} : {1}\n".format("Total Months",len(dates)))
    f.write("{0:<28} : ${1:,}\n".format("Net Total", net_pl))
    f.write("{0:<28} : ${1:,.2f}\n".format("Average Change", avg_change))
    f.write("{0:<28} : {date} (${chg:,.2f})\n".format("Greatest Increase in profits",**max_gain))
    f.write("{0:<28} : {date} (${chg:,.2f})\n".format("Greatest Decrease in profits",**max_loss))
