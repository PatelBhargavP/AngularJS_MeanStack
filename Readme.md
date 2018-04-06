Job portal

1.	login / register page
2.	Registration page to has following fields
    a.	Username
    b.	Password
    c.	Email
    d.	Location
    e.	Phone number
    f.	User type
        i.	Company
        ii.	Job seeker
3.	After login / registration user should lands on home page.
4.	Home page will have following links
    a.	Post a job
    b.	Search jobs
    c.	logout
5.	Depending on the user type the navbar toggles between
    a.	Post a job : for company logins
    b.	Search jobs : for job seekers
6.	Post a job page to has following fields
    a.	Job title
    b.	Job description
    c.	Keywords
    d.	Location
    e.	Save jobs button
7.	Search jobs page to has following fields
    a.	Search by title
    b.	Search by keywords
    c.	Search by location
    d.	Search button
    e.	Reset button
    f.	Once search button is clicked it should list all the matching jobs in a list
    g.	Reset button should clear the current search and job list if displayed.
8.	Logout link redirects user to login page and clears the active session.
9.	Home page, post job, search jobs page are accessible only if the user is logged in, else he/she is redirected to login page.



All the data is saved in MongoDB and can be accessed via api in NodeJS.
Styling your pages are done by bootstrap and css

Technologies

Angular @1.5.5
Bootstrap @3.3.7
Mongodb @3.0.1
Mongoose @5.0.2
Express @4.16.2
Node @8.9.4

