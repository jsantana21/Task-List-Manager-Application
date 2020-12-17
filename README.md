# Task List Manager Application

### Project Duration: November 11, 2020 - December 15, 2020

### Project Task
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The aim of this project is to create a simple task list application using the MEAN tech stack. This project is also meant to demonstrated my understanding of CRUD operation, building an restful API, user authentication and other essential features needed in web app development. 


### Background
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Due to the sudden COVID-19 pandemic and quarantine, my class wasn't able to get through the entire syallbus for my Full Stack MEAN Development class. Thus we were only able to make a simple Node Exprees app, Angular app, and how to use MongoDB and never got to make an app using all four software components. Thus in an effort to finish what was started, I wanted to make a project that incorporated all the technologies that I learned from this course and so I decided to make a simple to-do / task list manager app. As simple and basic as this project may seem, I believe that this project is perfect in displaying all that I've learned from CS 400 as it's application of essential features needed in any web application; more on this below.  

### App Demo 
#### Sign Up / Log In Feature
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; With the user authentication feature, the user can create an account by signing up and is automatically logged into the main app page where you can create new tasklists and new tasks.
<img src="https://github.com/jsantana21/Task-List-Manager-Application/blob/main/web%20app%20demo%20gifs/SignUp_LogIn.gif"  /> 
#### Create / Read Operation Feature
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; With the aid of therestful API, the app is able to read in the tasklists and tasks associated with the user's account. The user can then create new tasklists by clicking the "Make a New List" button and new tasks by clicking the "+" button.
<img src="https://github.com/jsantana21/Task-List-Manager-Application/blob/main/web%20app%20demo%20gifs/Create%20List%20and%20Tasks.gif"  />  
#### Edit Operation Feature
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The app also allows the user to edit the tasklist's title by clicking on the cog icon drop down menu and click on "Edit Tasklist's title" option and also edit a task by clicking on the edit icon button that appears when the mouse hovers on the task.
<img src="https://github.com/jsantana21/Task-List-Manager-Application/blob/main/web%20app%20demo%20gifs/Edit%20List%20and%20Task.gif"  />  
#### Delete Operation Feature
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The app allows the user to delete a tasklist along with its tasks by clicking on the cog icon drop down menu and click on "Delete Tasklist" option in red and also delete a individual task if needed. The user can also click on a task to cross out the task's title as an indication to show that task has been completed.  
<img src="https://github.com/jsantana21/Task-List-Manager-Application/blob/main/web%20app%20demo%20gifs/Delete%20List%20and%20Task.gif"  />  
#### User Authentication Feature
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; By using JSON web token to verify authenciated users, the app's API can respond faster as it doesn't have to query MongoDB and so the user can only view their own tasklists and tasks and not other users. The user also logout out of their account by revoking their access tokens to remove the session.
<img src="https://github.com/jsantana21/Task-List-Manager-Application/blob/main/web%20app%20demo%20gifs/User%20Auth.gif"  />  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; To run this project on your own machine after cloning this repo, type in "ng serve" to run the angular frontend and type in "nodemon app.js" to run the API backend.

### What Could be Improved?
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; One thing to improve that comes to mind would be when an user edits a tasklist or task that the original title be displayed in the input field but I don't know how to do that at the moment so for the sake of time I'll leave this to be updated later. Another thing would be to fix the data breach that would happen when logging into an account; this can be seen in the last gif. I guess that this is one of the downsides to using JSON web tokens for user authentication and I currently have no solution to this problem unfornately. Overall as simple as this project may seem, having to code the frontend in Angular was difficult for me so for my next major project I plan on using React in the MERN stack to see if it's any easier.   
