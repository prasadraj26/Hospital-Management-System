# Hospital Management System - Complete API Documentation

## 🌐 API Overview

The Hospital Management System provides a comprehensive RESTful API built with Node.js and Express.js. All endpoints are secured with JWT authentication and include rate limiting, CORS protection, and comprehensive error handling.

## 🔗 Base URL
```
Development: http://localhost:4451/api
Production: https://yourdomain.com/api
```

## 🔐 Authentication

All API endpoints (except login/register) require authentication via JWT token.

### Headers Required
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## 📊 API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user in the system.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/auth/profile
Get current user profile.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }
}
```

### User Management Endpoints

#### GET /api/user
Get all users (Admin only).

**Query Parameters:**
- `role` (optional): Filter by user role
- `page` (optional): Page number for pagination
- `limit` (optional): Number of users per page

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

#### GET /api/user/:id
Get specific user by ID.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }
}
```

#### PUT /api/user/:id
Update user information.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "user123",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567891"
  }
}
```

#### DELETE /api/user/:id
Delete user (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Doctor Management Endpoints

#### GET /api/doctor
Get all doctors.

**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `available` (optional): Filter by availability

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "id": "doctor123",
      "name": "Dr. Smith",
      "email": "dr.smith@hospital.com",
      "specialization": "Cardiology",
      "experience": "10 years",
      "qualification": "MD, PhD",
      "schedule": {
        "monday": "9:00-17:00",
        "tuesday": "9:00-17:00"
      }
    }
  ]
}
```

#### POST /api/doctor
Create new doctor (Admin only).

**Request Body:**
```json
{
  "name": "Dr. Johnson",
  "email": "dr.johnson@hospital.com",
  "specialization": "Neurology",
  "experience": "8 years",
  "qualification": "MD, PhD",
  "phone": "+1234567890",
  "schedule": {
    "monday": "9:00-17:00",
    "tuesday": "9:00-17:00",
    "wednesday": "9:00-17:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "doctor": {
    "id": "doctor456",
    "name": "Dr. Johnson",
    "email": "dr.johnson@hospital.com",
    "specialization": "Neurology"
  }
}
```

#### GET /api/doctor/:id
Get specific doctor by ID.

**Response:**
```json
{
  "success": true,
  "doctor": {
    "id": "doctor123",
    "name": "Dr. Smith",
    "email": "dr.smith@hospital.com",
    "specialization": "Cardiology",
    "experience": "10 years",
    "qualification": "MD, PhD",
    "schedule": {
      "monday": "9:00-17:00",
      "tuesday": "9:00-17:00"
    },
    "patients": [
      {
        "id": "patient123",
        "name": "John Doe",
        "nextAppointment": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### Nurse Management Endpoints

#### GET /api/nurse
Get all nurses.

**Query Parameters:**
- `department` (optional): Filter by department
- `shift` (optional): Filter by shift

**Response:**
```json
{
  "success": true,
  "nurses": [
    {
      "id": "nurse123",
      "name": "Nurse Johnson",
      "email": "nurse.johnson@hospital.com",
      "department": "ICU",
      "shift": "Day",
      "qualification": "RN, BSN",
      "phone": "+1234567890"
    }
  ]
}
```

#### POST /api/nurse
Create new nurse (Admin only).

**Request Body:**
```json
{
  "name": "Nurse Williams",
  "email": "nurse.williams@hospital.com",
  "department": "Emergency",
  "shift": "Night",
  "qualification": "RN, MSN",
  "phone": "+1234567891"
}
```

### Appointment Management Endpoints

#### GET /api/appointment
Get all appointments.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `doctorId` (optional): Filter by doctor
- `date` (optional): Filter by date
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "id": "appointment123",
      "patient": {
        "id": "patient123",
        "name": "John Doe"
      },
      "doctor": {
        "id": "doctor123",
        "name": "Dr. Smith"
      },
      "date": "2024-01-15",
      "time": "10:00",
      "status": "scheduled",
      "reason": "Regular checkup"
    }
  ]
}
```

#### POST /api/appointment
Create new appointment.

**Request Body:**
```json
{
  "patientId": "patient123",
  "doctorId": "doctor123",
  "date": "2024-01-15",
  "time": "10:00",
  "reason": "Regular checkup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "id": "appointment123",
    "patientId": "patient123",
    "doctorId": "doctor123",
    "date": "2024-01-15",
    "time": "10:00",
    "status": "scheduled"
  }
}
```

#### PUT /api/appointment/:id
Update appointment.

**Request Body:**
```json
{
  "date": "2024-01-16",
  "time": "11:00",
  "status": "rescheduled"
}
```

#### DELETE /api/appointment/:id
Cancel appointment.

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### Medical Records Endpoints

#### GET /api/medical-records
Get medical records.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `doctorId` (optional): Filter by doctor

**Response:**
```json
{
  "success": true,
  "records": [
    {
      "id": "record123",
      "patient": {
        "id": "patient123",
        "name": "John Doe"
      },
      "doctor": {
        "id": "doctor123",
        "name": "Dr. Smith"
      },
      "chiefComplaint": "Chest pain",
      "diagnosis": "Acute Myocardial Infarction",
      "treatment": "Aspirin, Nitroglycerin",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/medical-records
Create medical record.

**Request Body:**
```json
{
  "patientId": "patient123",
  "doctorId": "doctor123",
  "appointmentId": "appointment123",
  "chiefComplaint": "Chest pain",
  "historyOfPresentIllness": "Patient reports chest pain for 2 hours",
  "vitalSigns": {
    "bloodPressure": "140/90",
    "heartRate": "95",
    "temperature": "98.6",
    "oxygenSaturation": "98%"
  },
  "diagnosis": "Acute Myocardial Infarction",
  "treatment": "Aspirin, Nitroglycerin, Cardiac catheterization",
  "prescriptions": [
    {
      "medication": "Aspirin",
      "dosage": "81mg",
      "frequency": "Once daily"
    }
  ]
}
```

### Inventory Management Endpoints

#### GET /api/inventory
Get inventory items.

**Query Parameters:**
- `category` (optional): Filter by category
- `lowStock` (optional): Get low stock items

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "item123",
      "name": "Aspirin 81mg",
      "category": "Medication",
      "quantity": 1000,
      "unit": "tablets",
      "expiryDate": "2025-12-31",
      "supplier": "PharmaCorp",
      "reorderLevel": 100
    }
  ]
}
```

#### POST /api/inventory
Add inventory item.

**Request Body:**
```json
{
  "name": "Aspirin 81mg",
  "category": "Medication",
  "quantity": 1000,
  "unit": "tablets",
  "expiryDate": "2025-12-31",
  "supplier": "PharmaCorp",
  "reorderLevel": 100,
  "unitPrice": 0.50
}
```

#### PUT /api/inventory/:id
Update inventory item.

**Request Body:**
```json
{
  "quantity": 950,
  "unitPrice": 0.55
}
```

### Billing Endpoints

#### GET /api/billing
Get billing records.

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `status` (optional): Filter by payment status

**Response:**
```json
{
  "success": true,
  "bills": [
    {
      "id": "bill123",
      "patient": {
        "id": "patient123",
        "name": "John Doe"
      },
      "totalAmount": 350.00,
      "status": "paid",
      "paymentMethod": "cash",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/billing
Create bill.

**Request Body:**
```json
{
  "patientId": "patient123",
  "appointmentId": "appointment123",
  "services": [
    {
      "name": "Consultation",
      "amount": 200.00
    },
    {
      "name": "ECG",
      "amount": 150.00
    }
  ],
  "medications": [
    {
      "name": "Aspirin",
      "quantity": 30,
      "unitPrice": 2.50
    }
  ],
  "paymentMethod": "insurance",
  "insuranceProvider": "Blue Cross"
}
```

### Analytics Endpoints

#### GET /api/analytics/dashboard
Get dashboard analytics.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalPatients": 1250,
    "totalDoctors": 45,
    "totalNurses": 120,
    "totalAppointments": 3200,
    "revenue": {
      "today": 15000.00,
      "thisMonth": 450000.00,
      "lastMonth": 400000.00,
      "growth": 12.5
    },
    "patientSatisfaction": 4.8,
    "averageWaitTime": 15,
    "emergencyCases": 8,
    "departmentStats": [
      {
        "department": "Cardiology",
        "patients": 150,
        "revenue": 75000.00
      }
    ]
  }
}
```

#### GET /api/analytics/patients
Get patient analytics.

**Response:**
```json
{
  "success": true,
  "patientAnalytics": {
    "totalPatients": 1250,
    "newPatients": 45,
    "ageDistribution": {
      "0-18": 200,
      "19-35": 400,
      "36-50": 350,
      "51-65": 200,
      "65+": 100
    },
    "genderDistribution": {
      "male": 600,
      "female": 650
    }
  }
}
```

#### GET /api/analytics/revenue
Get revenue analytics.

**Response:**
```json
{
  "success": true,
  "revenueAnalytics": {
    "totalRevenue": 450000.00,
    "monthlyRevenue": [
      {
        "month": "January",
        "revenue": 400000.00
      },
      {
        "month": "February",
        "revenue": 450000.00
      }
    ],
    "revenueByService": [
      {
        "service": "Consultation",
        "revenue": 200000.00
      },
      {
        "service": "Surgery",
        "revenue": 150000.00
      }
    ]
  }
}
```

### Notification Endpoints

#### GET /api/notification
Get user notifications.

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notification123",
      "title": "Appointment Reminder",
      "message": "You have an appointment tomorrow at 10:00 AM",
      "type": "appointment",
      "priority": "medium",
      "read": false,
      "createdAt": "2024-01-14T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/notification
Send notification.

**Request Body:**
```json
{
  "userId": "user123",
  "title": "Test Notification",
  "message": "This is a test notification",
  "type": "general",
  "priority": "low"
}
```

#### PUT /api/notification/:id/read
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 🔒 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Example Error Response
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "details": "No user found with the provided ID"
}
```

## 🚀 Rate Limiting

All API endpoints are protected with rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Rate limit information included in response

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## 🔧 Testing the API

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:4451/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

#### Login
```bash
curl -X POST http://localhost:4451/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Profile (with token)
```bash
curl -X GET http://localhost:4451/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection
2. Set base URL to `http://localhost:4451/api`
3. Use the authentication flow
4. Test all endpoints

## 📊 API Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 🔐 Security Features

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user123",
    "email": "john@example.com",
    "role": "patient",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### CORS Configuration
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://yourdomain.com'
];
```

## 📈 Performance Considerations

### Database Indexing
- User email (unique)
- Appointment date and time
- Medical record patient ID
- Inventory item name

### Caching Strategy
- User sessions cached in memory
- Frequently accessed data cached
- Database query optimization

### Response Time Targets
- Authentication: < 200ms
- Data retrieval: < 500ms
- Data creation: < 1000ms
- Complex queries: < 2000ms

---

**Total Endpoints**: 50+ endpoints
**Authentication**: JWT-based
**Rate Limiting**: 100 requests per 15 minutes
**Response Format**: JSON
**Error Handling**: Comprehensive
**Documentation**: Complete

This API documentation provides everything you need to integrate with the Hospital Management System backend and build custom applications on top of it.

