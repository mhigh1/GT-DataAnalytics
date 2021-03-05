# Assignment 4: Pandas

## Files
| File     | Description | Source |
|:---------|:------------|:-------|
schools_complete.csv | CSV file containing general data on PyCity Schools | This Repository
students_complete.csv | CSV file containing student performance data for PyCity Schools | This Repository
[PyCitySchools.ipynb](PyCitySchools/PyCitySchools.ipynb) | Jupyter Notebook for analyzing PyCity Schools data | This Repository


## Walkthrough
1. Download the data source files "schools_complete.csv" and "students_complete.csv" and add them to the "Resources" directory in the "PyCitySchools" directory.
1. Open the [PyCitySchools.ipynb](PyCitySchools/PyCitySchools.ipynb) Jupyter Notebook and execute it.


## Output
Script will produce several data summary tables:
- District Summary
- School Summary
- Top Performing Schools (by % Overall Passing)
- Bottom Performing Schools (by % Overall Passing)
- Math Scores by Grade
- Reading Scores by Grade
- Scores by School Spending
- Scores by School Size
- Scores by School Type


## Observations
Charter schools rank among the top 5 schools in overall passing, this is mostly likely attributed to the smaller student populations verses that of the District schools which make up the bottom 5 performers in overall passing percentages. 

### Spending Per Student vs. School Performance
There is no correlation between spending per student and school performance. The data suggestes an inverse relationship, the more spent per student the lower school performance. 

| Spending (per student) | Avg. Math Score | Avg. Reading Score | % Passing Math | % Passing Reading | % Overall Passing |
|---:|---:|---:|---:|---:|---:|
| < $585 | 83.455 | 83.934 | 93.460 | 96.611 | 90.369 |
| $585-$630 | 81.900 | 83.155 | 87.134 | 92.718 | 81.419 |
| $630-$645 | 78.519 | 81.624 | 73.484 | 84.392 | 62.858 |
| $645-$680 | 76.997 | 81.028 | 66.165 | 81.134 | 53.527 |

### Scores by School Size
Schools with large student populations have lower average reading and math scores, in addition to significantly lower passing percentages in math, reading, and overall. There is no significant difference in performance between schools with small or medium student populations. 

|School Size | Avg. Math Score | Avg. Reading Score | % Passing Math | % Passing Reading | % Overall Passing |
|---:|---:|---:|---:|---:|---:|
| Small (<1000) | 83.822 | 83.930 | 93.550 | 96.099 | 89.884 |
| Medium (1000-2000) | 83.375 | 83.864 | 93.600 | 96.791 | 90.622 |
| Large (2000-5000) | 77.746 | 81.344 | 69.963 | 82.767 | 58.286 |

### Scores by School Type
Charter schools have higher percentages of students passing math, reading, and overall verses students in District schools.

| School Type | Avg. Math Score | Avg. Reading Score | % Passing Math | % Passing Reading | % Overall Passing |
|---:|---:|---:|---:|---:|---:|
| Charter | 83.474 | 83.896 | 93.621 | 96.586 | 90.432 |
| District | 76.957 | 80.967 | 66.548 | 80.799 | 53.672 |