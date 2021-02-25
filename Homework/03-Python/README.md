# Assignment 3: Python

## Files
| File     | Description | Source |
|:---------|:------------|:-------|
budget_data.csv | CSV file containing profit/losses data | Course Repository
election_data.csv | CSV file containing election data | Course Repository
[main.py](PyBank/main.py) | Python script for analyzing budget data | This Repository
[main.py](PyPoll/main.py) | Python script for analyzing election data | This Repository


## Walkthrough
### Before You Begin
The scripts use relative paths to locate their respective data source files. The CSV file must be placed in a "Resources" directory within the same directory as the script.

### PyBank
1. Download the file "budget_data.csv" from the course repository and add it to the "Resources" directory in the "PyBank" directory.
1. Run the [main.py](PyBank/main.py) script

### PyPoll
1. Download the file "election_data.csv" from the course respository and place it in the "Resources" directory in the "PyPoll" directory.
1. Run the [main.py](PyPoll/main.py) script

## Output
Each script will analyze the csv file and print the results to the console and write the results to the "results.txt" file located in the "Analysis" directory in each script's respective project directory.

PyBank Example:
```
Financial Analysis
------------------------------------------------------------
Total Months                 : 86
Net Total                    : $38,382,578
Average Change               : $-2,315.12
Greatest Increase in profits : Feb-2012 ($1,926,159.00)
Greatest Decrease in profits : Sep-2013 ($-2,196,167.00)
```

PyPoll Example:
```
Election Results
------------------------------------
Total Votes : 3,521,001
------------------------------------
Khan        :  63.00% (2,218,231)
Correy      :  20.00% (704,200)
Li          :  14.00% (492,940)
O'Tooley    :   3.00% (105,630)
------------------------------------
Winner      : Khan
------------------------------------
```
