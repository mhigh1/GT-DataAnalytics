# Assignment 9: SQL

## Files
| File     | Description | Source |
|:---------|:------------|:-------|
[schema.sql](schema.sql) | SQL statements to generate the database tables | This Repository
[query.sql](query.sql) | Collection of SQL queries for the data analysis | This Repository

** The CSV files referenced below containing the sample data used in this assignment may be obtained from the course repository.

## Getting Started
1. In the local instance on PostgreSQL create a database called `employees_db`:
```sql
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
```
2. Create the tables using [schema.sql](schema.sql).
3. Import each csv data file to the appropriate table in the following order:

| Order | Source File | Table |
|:-----:|:------------|:------|
1 | departments.csv | department |
2 | titles.csv | title |
3 | employees.csv | employee |
4 | dept_emp.csv | dept_emp |
5 | dept_managers.csv | dept_manager
6 | salaries.csv | salary

### Entity Relationship Diagram
![Entity Relationshop Diagram](images/ERD.png)

## Walkthrough
1. Open the [query.sql](query.sql) file in the query editor.
2. Execute each query by highlighting the query and running the statement.
 
## Output
List the following details of each employee: employee number, last name, first name, sex, and salary.

![Query1](images/query_1.png)

List first name, last name, and hire date for employees who were hired in 1986.

![Query2](images/query_2.png)

List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name.

![Query3](images/query_3.png)

List the department of each employee with the following information: employee number, last name, first name, and department name.

![Query4](images/query_4.png)

List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B".

![Query5](images/query_5.png)

List all employees in the Sales department, including their employee number, last name, first name, and department name.

![Query6](images/query_6.png)

List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.

![Query7](images/query_7.png)

In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.

![Query8](images/query_8.png)
