# 🗳️ Voting Management Portal

A full-stack web application for managing college elections, candidates, voting, and election results.

## 🚀 Features

### 👨‍💼 Admin

* Admin login
* Create and manage elections
* Add and remove candidates
* View election results
* Manage election status

### 👨‍🎓 Voter

* Voter registration and login
* View active elections
* View candidate information and manifestos
* Cast a vote
* One-vote-per-election protection
* View election results

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* Axios
* CSS

**Backend**

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA

**Database**

* MySQL

## 📁 Project Structure

```text
voting-management-portal/
├── backend/
├── frontend/
├── database/
├── README.md
└── .gitignore
```

## ⚙️ How It Works

1. Admin logs into the portal.
2. Admin creates an election.
3. Admin adds candidates and their manifestos.
4. Voters register or log in.
5. Voters select an active election.
6. Voters cast their vote.
7. The system prevents the same voter from voting twice in the same election.
8. Results display the vote count for each candidate.

## 🔐 Authentication

The application uses JWT-based authentication with role-based access:

* `ADMIN` — manages elections, candidates, and results.
* `VOTER` — participates in elections and casts votes.

## 🗄️ Database

The application uses MySQL to store:

* Users
* Elections
* Candidates
* Votes

## ▶️ Running the Project

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 📌 Project Status

**Completed and tested**

The core authentication, election management, candidate management, voting, duplicate-vote protection, results, and frontend UI have been implemented and tested.

## 👨‍💻 Author

**Dhananjay Patil**

GitHub: `dmppatil8-debug`
