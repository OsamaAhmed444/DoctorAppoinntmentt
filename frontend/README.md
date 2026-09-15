# Doctor Appointment System

## Description

A full-stack Doctor Appointment System that allows users to browse doctors, search and filter doctors by department, view doctor details, and manage appointments. The system also provides an admin interface for managing doctors and departments.

## Main Features

### User Features

* User registration and login
* JWT-based authentication
* Browse all available doctors
* Search doctors by name
* Filter doctors by department
* Paginated doctor listing
* View detailed doctor information
* Create appointments
* View personal appointments
* Update appointments
* Delete appointments

### Admin Features

* Admin authentication and authorization
* Add doctors
* Edit doctor information
* Delete doctors
* Upload and update doctor images
* Create departments
* Edit departments
* Delete departments
* View and manage doctors and departments

## Technologies Used

### Frontend

* React
* Vite
* React Router
* Bootstrap
* JavaScript
* Fetch API
* React Context API
* React Hooks

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* dotenv

## Installation Steps

### 1. Clone the Project

Clone the project repository to your computer.

### 2. Install Backend Dependencies

Open the backend folder in the terminal and run:
npm install

### 3. Install Frontend Dependencies

Open the frontend folder in another terminal and run:
npm install

### 4. Configure Environment Variables

Create a .env file in the backend and add the required backend environment variables.
Create a .env file in the frontend and add the required frontend environment variable.

## Required Environment Variables

### Backend .env

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

### Frontend .env

VITE_API_URL=http://localhost:3000

## How to Run Backend and Frontend

### Backend

Navigate to the backend folder and run:
npm run dev
The backend will run on:
http://localhost:3000

### Frontend

Navigate to the frontend folder and run:
npm run dev
The frontend will run on the local address provided by Vite in the terminal.

## API Overview

### Authentication

POST /user/register
POST /user/signin

### Doctors

POST /doctors/addDoctors
GET /doctors/allDoctors
GET /doctors/search
GET /doctors/count
GET /doctors/byDepartment/:departmentId
GET /doctors/:id
PUT /doctors/:id
DELETE /doctors/:id

### Departments

POST /departments/addDepartments
GET /departments/allDepartments
GET /departments/count
PUT /departments/:id
DELETE /departments/:id

### Appointments

POST /appointments/createAppointment
GET /appointments/myAppointments
GET /appointments/allAppointments
PUT /appointments/updateAppointment/:id
DELETE /appointments/deleteAppointment/:id
Some endpoints require authentication and/or admin authorization.

## Team Members and Contributions

<!-- Omar Mohamed Abdelfatah Mohamed Hawary --> <!-- 1 -->
<!-- Backend -->
controllers>departmentController.js
models>Departments.js
routes>Departments.js
<!-- Frontend -->
component>Departments.jsx

<!-- Osama Ahmed Alsaeed Alnady --> <!-- 1 -->
<!-- Backend -->
controllers>Appointmentcontroller
routes>Appointment
models>AppointmentSchema
<!-- Frontend -->
pages>add department
pages>Departmentdetails

<!-- Mohamed Ahmed Ali Mahmoud --> <!-- 2 -->
<!-- Backend -->
auth>middleware.js
middleware>errorhandle
server
<!-- Frontend -->
src>components>calltoactin
src>components>protectedroute

<!-- Muhammad Shaaban Said Shaaban --> <!-- 3 -->
<!-- Backend -->
controllers>doctorController
<!-- Frontend -->
pages>DoctorDetails
pages>AllDoctors

<!--  --> <!-- 4 -->
<!-- Backend -->
<!-- Frontend -->

<!-- Saif Mamdouh Shehata --> <!-- 5 -->
<!-- Backend -->
models>UserSchema.js
controllers>UserController
routes>User.js
<!-- Frontend -->
Login
Hero slide
Navbar

<!-- Saged Osama Abdelrahman --> <!-- 6 -->
<!-- Backend -->
seed.js
<!-- Frontend -->
MyAppointments.jsx

<!--  --> <!-- 7 -->
<!-- Backend -->
<!-- Frontend -->

<!-- Abdelrahman Hatem Mohamed --> <!-- 8 -->
<!-- Backend -->
<!-- Frontend -->
Appointments.jsx
Home.jsx
Main.jsx
App.jsx

<!-- Abdallah Hatem Hassan --> <!-- 9 -->
<!-- Backend -->
<!-- Frontend -->
components>About.jsx
components>Register.jsx
components>Stats.jsx
pages>AddAppointment.jsx

## Demo Links

### Live Demo

Not available yet.

### API Documentation

Not available yet.

### Project Presentation

Add the presentation link here when available.
