-- List the following details of each employee: employee number, last name, first name, sex, and salary.
SELECT e.emp_no,
	e.last_name,
	e.first_name,
	e.sex,
	s.salary
FROM employee AS e
LEFT JOIN salary AS s ON e.emp_no = s.emp_no;

-- List first name, last name, and hire date for employees who were hired in 1986.
SELECT e.first_name, 
	e.last_name, 
	e.hire_date
FROM employee AS e
WHERE EXTRACT(YEAR FROM e.hire_date) = '1986';

-- List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name.
SELECT d.dept_no,
	d.dept_name,
	e.emp_no,
	e.last_name,
	e.first_name
FROM dept_manager AS dm
JOIN department AS d ON dm.dept_no = d.dept_no
JOIN employee AS e ON dm.emp_no = e.emp_no;
	
-- List the department of each employee with the following information: employee number, last name, first name, and department name.
SELECT e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
FROM dept_emp AS de
JOIN department AS d ON de.dept_no = d.dept_no
JOIN employee AS e ON de.emp_no = e.emp_no;

-- List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B".
SELECT e.first_name,
	e.last_name,
	e.sex
FROM employee AS e
WHERE e.first_name = 'Hercules'
	AND last_name LIKE 'B%';

-- List all employees in the Sales department, including their employee number, last name, first name, and department name.
SELECT e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
FROM dept_emp AS de
JOIN employee AS e on de.emp_no = e.emp_no
JOIN department AS d ON de.dept_no = d.dept_no
WHERE de.dept_no = (
	SELECT dept_no 
	FROM department 
	WHERE dept_name = 'Sales' 
	LIMIT 1
);

-- List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.
SELECT e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
FROM dept_emp AS de
JOIN employee AS e on de.emp_no = e.emp_no
JOIN department AS d ON de.dept_no = d.dept_no
WHERE de.dept_no IN (
	SELECT dept_no 
	FROM department 
	WHERE dept_name = 'Sales'
		OR dept_name = 'Development'
	);

-- In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.
SELECT e.last_name, 
	COUNT(e.last_name) AS count
FROM employee AS e
GROUP BY e.last_name
ORDER BY count DESC;
