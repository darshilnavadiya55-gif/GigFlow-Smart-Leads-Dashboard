# API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require a JWT in the header:

```
Authorization: Bearer <token>
```

---

## Response format

### Success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Description of the result",
  "data": {}
}
```

List endpoints also include `pagination`:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 42,
    "recordsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": {
    "email": "Valid email is required"
  }
}
```

---

## Health check

### `GET /health`

No authentication required.

**Response `200`**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Authentication

### `POST /auth/register`

Register a new user. New accounts get the `sales_user` role. Only `admin@gmail.com` can register as `admin`.

**Body**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | Valid email |
| `password` | string | Yes | Min 8 chars, uppercase, lowercase, number |
| `confirmPassword` | string | Yes | Must match `password` |

**Example**

```json
{
  "email": "sales@example.com",
  "password": "SecurePass1",
  "confirmPassword": "SecurePass1"
}
```

**Response `201`**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "email": "sales@example.com",
      "role": "sales_user",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:** `400` (validation), `400` (email already exists)

---

### `POST /auth/login`

**Body**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Example**

```json
{
  "email": "admin@gmail.com",
  "password": "Admin@12345"
}
```

**Response `200`**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "email": "admin@gmail.com",
      "role": "admin",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:** `401` (invalid credentials)

---

## Leads

All lead routes require authentication.

### Role behavior

| Role | List / view | Create | Update | Delete |
|------|-------------|--------|--------|--------|
| `admin` | All leads | Yes | Any lead | Yes |
| `sales_user` | Own leads only | Yes | Own leads only | No |

---

### `GET /leads`

List leads with filters, search, sort, and pagination.

**Query parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |
| `status` | string | — | `New`, `Contacted`, `Qualified`, or `Lost` |
| `source` | string | — | `Website`, `Instagram`, or `Referral` |
| `search` | string | — | Case-insensitive match on name or email |
| `sortBy` | string | `latest` | `latest` or `oldest` (by `createdAt`) |

**Example**

```
GET /leads?status=Qualified&source=Instagram&search=rahul&sortBy=latest&page=1&limit=10
```

**Response `200`**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalRecords": 1,
    "recordsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### `GET /leads/:id`

Get a single lead by ID.

**Response `200`**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Website",
    "createdBy": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `404` (not found or not accessible for `sales_user`)

---

### `POST /leads`

Create a lead. `createdBy` is set from the authenticated user.

**Body**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email |
| `status` | string | Yes | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Yes | `Website`, `Instagram`, `Referral` |

**Example**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

**Response `201`**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Lead created successfully",
  "data": { }
}
```

**Errors:** `400` (validation)

---

### `PUT /leads/:id`

Update a lead. Same body rules as create.

**Response `200`**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lead updated successfully",
  "data": { }
}
```

**Errors:** `404` (not found or not owned by `sales_user`)

---

### `DELETE /leads/:id`

Delete a lead. **Admin only.**

**Response `200`**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lead deleted successfully",
  "data": { }
}
```

**Errors:** `403` (not admin), `404` (not found)

---

## HTTP status codes

| Code | Usage |
|------|--------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error |
| `401` | Missing or invalid auth |
| `403` | Forbidden (role or token) |
| `404` | Resource not found |
| `500` | Server error |

---

## Default admin (development)

On first database connection, an admin user is seeded if missing:

- **Email:** `admin@gmail.com`
- **Password:** `Admin@12345`

Change this password in production.
