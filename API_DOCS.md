# Task Management API Documentation

## Authentication Endpoints

### 1. Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```

### 2. Login User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response (200):** Sets an `HttpOnly` cookie named `token`.
  ```json
  {
    "success": true,
    "message": "Login successful"
  }
  ```

---

## Task Endpoints (Requires Authentication)

### 3. Create Task
- **URL:** `/api/tasks`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "title": "Complete Assignment",
    "description": "Finish the task management app",
    "status": "in-progress"
  }
  ```
- **Security:** The `description` is encrypted using AES-256-CBC before storage.

### 4. Get All Tasks (Paginated, Search, Filter)
- **URL:** `/api/tasks?page=1&limit=10&status=pending&search=App`
- **Method:** `GET`
- **Response (200):**
  ```json
  {
    "success": true,
    "total": 5,
    "page": 1,
    "pages": 1,
    "tasks": [
      {
        "_id": "task_id",
        "title": "Complete Assignment",
        "description": "Finish the task management app",
        "status": "in-progress",
        "createdAt": "2024-03-20T10:00:00.000Z"
      }
    ]
  }
  ```

### 5. Update Task
- **URL:** `/api/tasks/:id`
- **Method:** `PUT`
- **Body:** Any field (`title`, `description`, `status`).

### 6. Delete Task
- **URL:** `/api/tasks/:id`
- **Method:** `DELETE`
