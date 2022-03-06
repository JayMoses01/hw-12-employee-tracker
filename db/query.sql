/* View all employees: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to */
SELECT movies.movie_name AS movie, reviews.review
FROM reviews
LEFT JOIN movies
ON reviews.movie_id = movies.id
ORDER BY movies.movie_name;


/* View all roles: job title, role id, the department that role belongs to, and the salary for that role*/



/* View all departments: department names and department ids*/



