# Full-Stack To-Do Application

A comprehensive full-stack To-Do application built with an Angular SSR frontend and a Node.js/Express.js backend, containerized with Docker.

## Features

- User authentication (Register/Login) with JWT.
- Create, Read, Update, Delete (CRUD) operations for tasks.
- Server-Side Rendering (SSR) for the Angular frontend for improved SEO and performance.
- Responsive user interface.
- Dockerized for consistent development and deployment environments.

## Tech Stack

**Frontend:**
- Angular 20+
- Angular SSR
- TypeScript
- HTML, CSS (or SCSS/Sass if used)
- RxJS
- `http-proxy-middleware` (for SSR API proxying)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

**DevOps & Tools:**
- Docker & Docker Compose
- Git & GitHub
- Google Cloud Platform (Cloud Run, Artifact Registry, Secret Manager, Cloud Build) - *Optional for deployment*

## Prerequisites

- Node.js (v20.x recommended, check `.nvmrc` or `package.json` engines if specified)
- npm (v10.x recommended) or yarn
- Docker Desktop (or Docker Engine + Docker Compose CLI)
- Git
- Access to a MongoDB instance (e.g., MongoDB Atlas free tier)
- Google Cloud SDK (`gcloud` CLI) - *Optional, only if deploying to GCP*

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd fullstack-todo-app
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file by copying `.env.example` (if you create one) or by creating it manually with the following content:
```env
# backend/.env
NODE_ENV=development
PORT=3030
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_strong_jwt_secret"
```
Replace placeholders with your actual MongoDB connection string and a strong JWT secret.

Install dependencies and run the backend server:
```bash
yarn install
yarn run dev start
```
The backend server should be running on `http://localhost:3030`.

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend # from backend directory, or cd frontend from root
```

Install dependencies and run the frontend development server:
```bash
npm install
ng serve
```
The Angular development server (with SSR capabilities if using `ng serve` that builds SSR) will be running on `http://localhost:4200`. API requests to `/api` will be proxied to the backend.

### 4. Running with Docker Compose (Recommended for Local Development)

Ensure Docker is running. From the project root (`fullstack-todo-app`):

Create a root `.env` file for Docker Compose:
```env
# /fullstack-todo-app/.env
NODE_ENV=development
BACKEND_PORT=3030
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_strong_jwt_secret"
```

Build and run the services:
```bash
docker-compose up --build
```
The frontend will be accessible at `http://localhost:4200` and the backend at `http://localhost:3030` (or the port specified in `BACKEND_PORT`).

## Deployment

This application is designed to be deployed using Docker containers.


## Project Structure (Brief Overview)

- `/backend`: Contains the Node.js/Express.js backend application.
- `/frontend`: Contains the Angular SSR frontend application.
- `docker-compose.yml`: Defines the multi-container Docker setup for local development.
- `Dockerfile` (in `frontend` and `backend`): Instructions to build the respective Docker images.
