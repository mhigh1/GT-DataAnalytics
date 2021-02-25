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
electionData = os.path.join(dirname, "Resources", "election_data.csv")

# Declare variables
total_votes = 0
results = []

# Open the csv file in read mode
with open(electionData, "r") as csvFile:

    # Read the csv file
    csvreader = csv.reader(csvFile, delimiter=",")

    # Skip the header row
    next(csvreader, None)

    for row in csvreader:
        # Add vote to total counter
        total_votes += 1

        # If the candidate doesn't exist in the results list
        if not any(record["candidate"] == row[2] for record in results):
            # create and add candidate record
            data = {
                "candidate": row[2],
                "votes": 1,
                "percentage": None
            }
            results.append(data)
        else:
            # Get candidate's total votes from results list add a vote to it
            record = next(item for item in results if item["candidate"] == row[2])
            record["votes"] += 1

# Calculate the percentage votes per candidate
for record in results:
    percentVote = float(int(record["votes"]) / int(total_votes))
    record["percentage"] = percentVote

# Find the winner
winner = max(results, key=lambda el:el['votes'])

# Print results to console
print("\n")
print("Election Results")
print("---"*12)
print(f"{'Total Votes':<12}: {total_votes:,}")
print("---"*12)
for record in results:
    print(f"{record['candidate']:<12}: {record['percentage']:>7.2%} ({record['votes']:,})")
print("---"*12)
print(f"{'Winner':<12}: {winner['candidate']}")
print("---"*12)
print("\n")

# Export results to a text file
# Declare the file path for the results.txt file
outFile = os.path.join(dirname, "Analysis", "mhigh_results.txt")

# Create the outFile's directory if it doesn't exist
if not os.path.exists(os.path.dirname(outFile)):
    os.makedirs(os.path.dirname(outFile))

# Write results to the results.txt file
with open(outFile, "w") as f:
    f.write("Election Results\n")
    f.write("---"*12 + "\n")
    f.write(f"{'Total Votes':<12}: {total_votes:,}\n")
    f.write("---"*12 + "\n")
    for record in results:
        f.write(f"{record['candidate']:<12}: {record['percentage']:>7.2%} ({record['votes']:,})\n")
    f.write("---"*12 + "\n")
    f.write(f"{'Winner':<12}: {winner['candidate']}\n")
    f.write("---"*12 + "\n")