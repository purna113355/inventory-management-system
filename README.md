# Inventory Management System

## Overview

Inventory Management System is a full-stack web application for managing products and inventory through a responsive dashboard. It provides product CRUD operations, stock tracking, search and category filtering, user registration and JWT-based authentication, validation, and a deployed production environment.

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard access
- Product CRUD operations
- Add, edit, and delete products
- Stock quantity management
- Low-stock and out-of-stock status indicators
- Product search
- Category filtering
- Form validation and error handling
- Delete confirmation
- Responsive dashboard UI
- Persistent login using browser storage
- Production deployment with Vercel and Railway

## Tech Stack

### Frontend
- React.js
- JavaScript (JSX)
- CSS3
- Vite
- HTML5

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- JWT Authentication

### Database
- MySQL

### Tools & Deployment
- Git & GitHub
- VS Code
- Vercel — Frontend deployment
- Railway — Backend and MySQL deployment

## System Architecture

```text
User
  │
  ▼
React Frontend (Vercel)
  │
  │ REST API / JSON
  ▼
FastAPI Backend (Railway)
  │
  ▼
MySQL Database (Railway)

## Project Structure

```text
inventory-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── Register.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── main.py
│   ├── requirements.txt
│   ├── .python-version
│   └── venv/
│
├── .gitignore
└── README.md


## Authentication & Security

- User registration with password validation
- Password hashing using bcrypt
- JWT-based authentication
- Protected API endpoints
- Token verification for authenticated requests
- Login/logout functionality
- Environment variables for database credentials and JWT secret
- CORS configuration for the deployed frontend
- Backend validation using Pydantic
- Frontend validation for user inputs



## API Overview

The FastAPI backend provides REST API endpoints for authentication and product management.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user and return a JWT |

### Products

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve products |
| POST | `/products` | Add a product |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |

The API can also be explored and tested through FastAPI's automatically generated Swagger UI.


## Database

The application uses MySQL for persistent data storage.

### Tables

#### `users`

Stores registered user accounts.

| Column | Type | Description |
|---|---|---|
| `id` | INT | Primary key |
| `username` | VARCHAR(100) | Unique username |
| `password` | VARCHAR(255) | Hashed password |

#### `products`

Stores inventory product information.

| Column | Type | Description |
|---|---|---|
| `id` | INT | Primary key |
| `name` | VARCHAR(100) | Product name |
| `category` | VARCHAR(100) | Product category |
| `stock` | INT | Available stock quantity |



## Live Demo

**Live Application:**  
https://inventory-management-system-blush-iota.vercel.app/

**GitHub Repository:**  
https://github.com/purna113355/inventory-management-system



## Future Improvements

- Role-based access control for different types of users
- Inventory reports and analytics
- Export inventory data
- Advanced product filtering and sorting
- Pagination for larger product datasets
- Automated testing



## Project Status

**Completed and deployed.**

The application has been tested in the production environment, including authentication, product management, search and filtering, validation, and responsive UI functionality.