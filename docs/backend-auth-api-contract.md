# BIS-SATHI Primary Backend Authentication API Contract

## Base URL

- Development: http://localhost:3000

## Auth endpoints

### 1. Register

- Method: POST
- Path: /api/auth/register
- Body:
  {
  "name": "User Name",
  "email": "user@example.com",
  "password": "StrongPassword123"
  }
- Response: 201 with `success`, `message`, and `data.user` plus `data.tokens`

### 2. Login

- Method: POST
- Path: /api/auth/login
- Body:
  {
  "email": "user@example.com",
  "password": "StrongPassword123"
  }
- Response: 200 with `data.user` and `data.tokens`

### 3. Refresh token

- Method: POST
- Path: /api/auth/refresh
- Body:
  {
  "refreshToken": "..."
  }
- Response: 200 with new access/refresh tokens

### 4. Get current user

- Method: GET
- Path: /api/auth/me
- Headers: Authorization: Bearer <access_token>
- Response: 200 with current safe user object

### 5. Logout

- Method: POST
- Path: /api/auth/logout
- Headers: Authorization: Bearer <access_token>
- Response: 200 with logged out message

### 6. Forgot password

- Method: POST
- Path: /api/auth/forgot-password
- Body:
  {
  "email": "user@example.com"
  }
- Response: 200 with generic message

### 7. Reset password

- Method: POST
- Path: /api/auth/reset-password
- Body:
  {
  "token": "...",
  "password": "NewStrongPassword123"
  }
- Response: 200 on success

### 8. Change password

- Method: POST
- Path: /api/auth/change-password
- Headers: Authorization: Bearer <access_token>
- Body:
  {
  "currentPassword": "StrongPassword123",
  "newPassword": "UpdatedStrong456"
  }
- Response: 200 on success

## Error codes

- VALIDATION_ERROR
- INVALID_CREDENTIALS
- UNAUTHORIZED
- TOKEN_EXPIRED
- INVALID_TOKEN
- ACCOUNT_DISABLED
- USER_ALREADY_EXISTS
- USER_NOT_FOUND
- INVALID_RESET_TOKEN
- FORBIDDEN

## Security notes

- Access token is short-lived
- Refresh token rotates and is invalidated on logout/reset
- Passwords are hashed with bcrypt
- JWTs are kept minimal and do not include sensitive profile data
- CORS is restricted by environment-based origin list
