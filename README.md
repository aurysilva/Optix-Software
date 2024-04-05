Technical Assessment – React App - (Optix Business Management)

The test is to assess your coding skill and identify your strengths and weaknesses. There is no specific time limit for this technical test, however, it should be completed within a practical time. 

You should consider:
•	Pay attention to how you structure your project(s).
•	Remember KISS! Keep things simple, do not get bogged down in trying to be too complicated. It’s better to complete the basic requirements and then go back to improve further if you feel you have the time.
•	Think about code reuse, readability, and patterns and add some exception handling if you can.
•	Think about deploying the application, it should be easy to deploy for example you could use docker and docker-compose files.
•	Think about testing your code.
•	If you have any questions or get stuck on anything at all, please reach out to us!

The Task
Our developer was part way through developing the following feature but left the company and you are tasked with picking up where they left off.
The aim is to complete the piece of work by refactoring and improving the current code to get it to a working state that passes all A/C. Use material UI components and a form library where desirable.
The existing solution has been provided to you in a zip archive.

Acceptance Criteria

Must have(s)
•	Display total number of movies.
•	Table must show: 
o	Movie titles
o	Average review score (to 1 decimal place)
o	Company that produces the film.
•	Movie company data comes from movieCompanies GET request.
•	Movies data comes from movies GET request.
•	User must be able to select table row to leave a review with form appearing when there is a selected movie.
•	Request to submitReview endpoint and display message returned on response.
•	Form must restrict message to 100 characters and show an error message if over 100 and not allow for submission in this instance.
•	Highlight selected movie row when clicked.
•	Handle error and loading states.

Should have(s)
•	Reviews column should be sortable.
•	Submit review form should appear in a modal on mobile devices or small breakpoints.

Could have(s)
•	Add a button (or other mechanism) to refresh movies and movie companies.
