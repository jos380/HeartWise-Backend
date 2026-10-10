# HeartWise Backend API

## HeartWise: Personalized Preventive Women's Health Companion

HeartWise is a proof-of-concept preventive women's health web application designed to provide educational health information, wellness tracking, screening guidance, appointment management, Visit Prep, and personalized preventive health recommendations.

The backend provides REST APIs that allow the HeartWise frontend to communicate with the application services and database.

> **Important:** This project is an educational prototype. It uses synthetic and demonstration health information only. It is not intended to provide medical diagnosis, treatment, emergency services, or professional medical advice. No real MyChart, Epic, hospital, or electronic health record integration is implemented.

---

# 1. Technology Stack

The HeartWise backend uses:

- Node.js
- Express.js
- SQLite
- JavaScript
- REST API
- JWT authentication
- bcryptjs password hashing
- CORS
- dotenv
- Nodemon for development

---

# 2. Project Structure

```text
HeartWise-Backend/
│
├── src/
│   ├── controllers/
│   │   ├── adminAuthController.js
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── contentController.js
│   │   ├── profileController.js
│   │   ├── recommendationController.js
│   │   ├── screeningController.js
│   │   └── wellnessController.js
│   │
│   ├── database/
│   │   ├── db.js
│   │   ├── init.js
│   │   ├── createAdmin.js
│   │   └── addScreeningGuidanceTable.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminAuthRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contentRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── screeningRoutes.js
│   │   └── wellnessRoutes.js
│   │
│   └── server.js
│
├── database/
│   └── heartwise.db
│
├── docs/
│   └── API_DOCUMENTATION.md
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 3. Main Features

The current HeartWise backend provides the following functionality.

## User Authentication

The authentication system provides:

- User registration
- User login
- Password hashing using bcryptjs
- JWT authentication
- Protected API routes
- User roles

Main endpoints:

```text
POST /api/auth/register
POST /api/auth/login
```

---

# 4. User Health Profile

Authenticated users can create, retrieve, and update their health profile.

The profile supports:

- Date of birth
- Sex
- Height
- Weight
- Health goals
- Risk factors

Endpoints:

```text
POST /api/profile
GET  /api/profile
PUT  /api/profile
```

The current implementation uses synthetic information for demonstration purposes.

---

# 5. Wellness Tracking

The wellness module allows authenticated users to record and retrieve wellness readings.

Supported information includes:

- Reading type
- Reading value
- Unit
- Reading date
- Notes

Endpoints:

```text
POST /api/wellness
GET  /api/wellness
```

The backend validates wellness values and prevents invalid numeric values from being stored.

---

# 6. Screening Management

The screening module provides screening records and screening guidance.

Users can:

- Create screening records
- View screening records
- Update screening records
- View screening guidance

Supported screening status values include:

```text
recommended
scheduled
completed
overdue
```

Endpoints:

```text
POST /api/screenings
GET  /api/screenings
GET  /api/screenings/guidance
PUT  /api/screenings/:id
```

Screening guidance includes information such as:

- Screening type
- Title
- Description
- Recommended age
- Recommended frequency
- Eligibility notes
- Preparation notes
- Category

---

# 7. Appointment Management

The appointment module allows users to manage healthcare appointment information.

Users can:

- Create appointments
- View appointments
- Update appointments
- Store provider information
- Store appointment type
- Store appointment notes
- Track appointment status

Endpoints:

```text
POST /api/appointments
GET  /api/appointments
PUT  /api/appointments/:id
```

Supported appointment statuses include:

```text
scheduled
completed
cancelled
```

---

# 8. Visit Prep

HeartWise provides Visit Prep functionality to help users prepare information for an appointment.

Visit Prep can contain:

- Questions for the healthcare provider
- Symptoms or concerns
- Medication notes
- Other appointment concerns

Endpoints:

```text
POST /api/appointments/visit-prep
GET  /api/appointments/:appointmentId/visit-prep
```

The Visit Prep information is associated with the user's appointment.

---

# 9. Educational Content

The educational content module provides health education resources.

Content can be organized using categories.

Supported content types include:

```text
article
video
guide
resource
```

Endpoints:

```text
GET /api/content
GET /api/content/category/:category
POST /api/content
```

Example categories include:

```text
Wellness
Preventive Health
Lifestyle
Women's Health
Screening
```

---

# 10. Personalized Recommendations

The recommendation module generates preventive health recommendations using available user information.

The recommendation logic considers information such as:

- Health goals
- Risk factors
- Wellness readings
- Screening records
- Pending or overdue screenings

Endpoint:

```text
GET /api/recommendations
```

The recommendation response also contains an educational prototype disclaimer.

> HeartWise is an educational prototype using synthetic data and does not provide medical diagnosis or treatment.

---

# 11. Administrator Authentication

The backend provides a separate administrator authentication system.

Administrator login endpoint:

```text
POST /api/admin-auth/login
```

Administrator access is protected using JWT authentication and role-based authorization.

---

# 12. Administrator Functions

Administrators can manage application content and configuration information.

## Educational Content

```text
GET    /api/admin/content
POST   /api/admin/content
PUT    /api/admin/content/:id
DELETE /api/admin/content/:id
```

## Coaching Messages

```text
GET  /api/admin/coaching-messages
POST /api/admin/coaching-messages
```

## Onboarding Questions

```text
GET  /api/admin/onboarding-questions
POST /api/admin/onboarding-questions
```

## Personalization Rules

```text
GET  /api/admin/personalization-rules
POST /api/admin/personalization-rules
```

## Screening Guidance

```text
GET    /api/admin/screening-guidance
POST   /api/admin/screening-guidance
PUT    /api/admin/screening-guidance/:id
DELETE /api/admin/screening-guidance/:id
```

---

# 13. Database

The current implementation uses SQLite for the proof-of-concept database.

The main database file is:

```text
database/heartwise.db
```

The database contains tables for:

```text
users
health_profiles
wellness_readings
screening_records
screening_guidance
appointments
visit_prep
educational_content
coaching_messages
onboarding_questions
personalization_rules
admin_users
```

The database relationships associate user information with their health profiles, wellness readings, screenings, appointments, and Visit Prep records.

---

# 14. Environment Configuration

The application uses a `.env` file for local environment configuration.

Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

The `.env` file should not be uploaded to a public repository because it may contain private configuration values.

A `.env.example` file is provided as a template.

---

# 15. Installation

Open the HeartWise Backend folder in Visual Studio Code.

Open the terminal and run:

```powershell
npm install
```

This installs the project dependencies.

---

# 16. Running the Backend

Start the backend using:

```powershell
npm start
```

During development, the project can also use Nodemon:

```powershell
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# 17. Health Check

The backend provides a health check endpoint:

```text
GET /api/health
```

Open:

```text
http://localhost:5000/api/health
```

A successful response is:

```json
{
  "success": true,
  "service": "HeartWise Backend",
  "status": "healthy"
}
```

---

# 18. Authentication

Protected endpoints require a JWT token.

After successful login, the returned token should be included in the request header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```javascript
fetch("http://localhost:5000/api/profile", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
});
```

---

# 19. Backend and Frontend Integration

The HeartWise frontend communicates with the backend through REST APIs.

The communication follows this structure:

```text
HeartWise Frontend
        │
        │ HTTP Requests
        ▼
Express REST API
        │
        ▼
Controllers
        │
        ▼
SQLite Database
```

The frontend does not communicate directly with the database.

Instead, the frontend sends HTTP requests to the backend API, and the backend performs the required database operations.

---

# 20. Security

The current proof-of-concept includes basic security mechanisms:

### Password Hashing

User passwords are hashed using `bcryptjs`.

### JWT Authentication

JSON Web Tokens are used to authenticate users.

### Administrator Authorization

Administrator endpoints require an authenticated administrator role.

### Protected Routes

Health profile, wellness, screening, appointment, Visit Prep, recommendation, and administrative operations are protected where appropriate.

### Environment Variables

JWT configuration is stored in `.env`.

### CORS

CORS is enabled to allow the frontend application to communicate with the backend during development.

---

# 21. Synthetic Data

This project uses synthetic demonstration information.

Example demonstration account:

```text
Email:
jane.demo@heartwise.test

Password:
HeartWise123
```

Example administrator account:

```text
Email:
admin@heartwise.test

Password:
Admin12345
```

These accounts are for demonstration and testing only.

No real patient information should be entered into this application.

---

# 22. API Documentation

Detailed API information is available in:

```text
docs/API_DOCUMENTATION.md
```

The API documentation provides:

- Endpoint descriptions
- HTTP methods
- Authentication requirements
- Request examples
- Response examples
- Error examples
- Frontend integration examples

---

# 23. Testing

The API can be tested using:

- Postman
- Thunder Client
- PowerShell
- Browser
- HeartWise frontend

Basic health check using PowerShell:

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:5000/api/health" `
    -Method Get
```

Authentication can then be tested by registering a synthetic user and logging in.

The returned JWT token can be used to test protected endpoints.

---

# 24. Error Handling

The backend returns JSON responses for successful and unsuccessful requests.

Successful response:

```json
{
  "success": true,
  "message": "Operation completed successfully."
}
```

Error response:

```json
{
  "success": false,
  "message": "An error occurred."
}
```

Common HTTP status codes include:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 25. Project Limitations

HeartWise is currently a proof-of-concept school project.

The current implementation:

- Uses synthetic health information.
- Uses SQLite as the current database.
- Does not connect to real healthcare systems.
- Does not connect to MyChart or Epic.
- Does not provide medical diagnosis.
- Does not provide medical treatment.
- Uses rule-based personalization.
- Uses demonstration authentication and administrator accounts.
- Is intended for academic demonstration and frontend/backend integration.

A production version would require additional security controls, testing, monitoring, privacy protection, infrastructure, and appropriate healthcare compliance measures.

---

# 26. Project Architecture

The current backend follows a layered structure:

```text
                 HeartWise Frontend
                         │
                         ▼
                  REST API Routes
                         │
                         ▼
                    Middleware
                         │
                         ▼
                    Controllers
                         │
                         ▼
                  Database Layer
                         │
                         ▼
                   SQLite Database
```

This structure separates routing, authentication, business logic, and database operations.

---

# 27. Purpose of the Backend

The HeartWise backend provides the foundation for the HeartWise frontend by implementing:

1. User authentication
2. User health profiles
3. Wellness tracking
4. Screening management
5. Appointment management
6. Visit Prep
7. Educational content
8. Personalized recommendations
9. Administrator authentication
10. Administrator content management
11. Screening guidance
12. Personalization rules
13. REST API communication
14. Database storage

The backend is designed to demonstrate how the HeartWise frontend can communicate with application services through structured REST APIs while keeping the database layer separate from the user interface.