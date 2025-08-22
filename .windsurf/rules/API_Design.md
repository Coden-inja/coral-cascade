# Climate & Marine Conservation Collaboration Platform - API Design

## 1. API Architecture Overview

### 1.1 Base URL
```
Development: http://localhost:3001/api/v1
Production: https://api.climateconservation.in/api/v1
```

### 1.2 Authentication Strategy
- **JWT-based Authentication** with access and refresh tokens
- **Role-based Authorization** (government_officer, ngo_manager, citizen_scientist, admin)
- **Token Expiration:** Access tokens (15 minutes), Refresh tokens (7 days)
- **Stateless Design** for scalability

### 1.3 Request/Response Format Standards
```json
// Standard Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Standard Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 1.4 Error Handling Approach
- **HTTP Status Codes:** Standard REST status codes
- **Error Codes:** Custom error codes for specific business logic
- **Validation Errors:** Detailed field-level validation messages
- **Rate Limiting:** 100 requests per minute per user

### 1.5 Rate Limiting Strategy
- **General Endpoints:** 100 requests/minute
- **Data Upload Endpoints:** 50 requests/minute
- **Authentication Endpoints:** 10 requests/minute
- **Admin Endpoints:** 200 requests/minute

## 2. Complete Endpoint Documentation

### 2.1 Authentication Endpoints

#### POST /auth/register
**Purpose:** Register new user account
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "citizen_scientist",
  "organizationId": 1,
  "phone": "+91-9876543210"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "citizen_scientist",
      "isVerified": false
    },
    "message": "Please check your email to verify your account"
  }
}
```

#### POST /auth/login
**Purpose:** Authenticate user and return tokens
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "citizen_scientist",
      "organization": {
        "id": 1,
        "name": "Wildlife Conservation Society India"
      }
    }
  }
}
```

#### POST /auth/refresh
**Purpose:** Refresh access token using refresh token
**Authentication:** Refresh token in header
**Headers:** `Authorization: Bearer <refresh_token>`
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout
**Purpose:** Invalidate refresh token
**Authentication:** Required
**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 2.2 User Management Endpoints

#### GET /users/profile
**Purpose:** Get current user profile
**Authentication:** Required
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "citizen_scientist",
    "organization": {
      "id": 1,
      "name": "Wildlife Conservation Society India",
      "type": "ngo"
    },
    "profileImageUrl": "https://cloudinary.com/...",
    "bio": "Environmental enthusiast...",
    "location": {
      "lat": 19.0760,
      "lng": 72.8777
    },
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /users/profile
**Purpose:** Update user profile
**Authentication:** Required
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio...",
  "phone": "+91-9876543210",
  "location": {
    "lat": 19.0760,
    "lng": 72.8777
  }
}
```

#### GET /users/{userId}
**Purpose:** Get user profile by ID (admin only)
**Authentication:** Required (admin role)
**Response:** Same as GET /users/profile

### 2.3 Organization Management Endpoints

#### GET /organizations
**Purpose:** List organizations with filtering
**Authentication:** Required
**Query Parameters:**
- `type`: government, ngo, research_institution
- `state`: Filter by state
- `verificationStatus`: pending, verified, rejected
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": 1,
        "name": "Wildlife Conservation Society India",
        "type": "ngo",
        "description": "Dedicated to wildlife conservation...",
        "city": "Mumbai",
        "state": "Maharashtra",
        "verificationStatus": "verified",
        "memberCount": 45
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### POST /organizations
**Purpose:** Create new organization
**Authentication:** Required (admin role)
**Request Body:**
```json
{
  "name": "New Conservation NGO",
  "type": "ngo",
  "description": "Organization description...",
  "contactEmail": "contact@ngo.org",
  "contactPhone": "+91-9876543210",
  "address": "123 Conservation Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "registrationNumber": "NGO123456"
}
```

#### PUT /organizations/{organizationId}/verify
**Purpose:** Verify organization (admin only)
**Authentication:** Required (admin role)
**Request Body:**
```json
{
  "status": "verified",
  "notes": "Organization verified successfully"
}
```

### 2.4 Project Management Endpoints

#### GET /projects
**Purpose:** List projects with filtering
**Authentication:** Required
**Query Parameters:**
- `category`: climate_action, marine_conservation, biodiversity_protection
- `status`: draft, pending_approval, approved, active, completed, cancelled
- `organizationId`: Filter by organization
- `location`: lat,lng,radius (in km)
- `sdgGoal`: 13, 14, 15
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "title": "Mangrove Conservation Initiative",
        "description": "Comprehensive mangrove restoration...",
        "category": "marine_conservation",
        "status": "active",
        "organization": {
          "id": 1,
          "name": "Wildlife Conservation Society India"
        },
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "location": {
          "lat": 19.0760,
          "lng": 72.8777,
          "radius": 50
        },
        "sdgGoals": [14, 15],
        "dataPointsCount": 1250,
        "participantsCount": 45,
        "progressPercentage": 65
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 85,
      "totalPages": 5
    }
  }
}
```

#### POST /projects
**Purpose:** Create new project
**Authentication:** Required (ngo_manager role)
**Request Body:**
```json
{
  "title": "New Conservation Project",
  "description": "Project description...",
  "category": "marine_conservation",
  "startDate": "2024-06-01",
  "endDate": "2024-11-30",
  "targetArea": {
    "lat": 19.0760,
    "lng": 72.8777,
    "radius": 25
  },
  "budgetAmount": 500000,
  "budgetCurrency": "INR",
  "sdgGoals": [14, 15],
  "expectedImpact": "Expected environmental impact...",
  "methodology": "Project methodology...",
  "teamSize": 10
}
```

#### GET /projects/{projectId}
**Purpose:** Get project details
**Authentication:** Required
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Mangrove Conservation Initiative",
    "description": "Comprehensive mangrove restoration...",
    "category": "marine_conservation",
    "status": "active",
    "organization": {
      "id": 1,
      "name": "Wildlife Conservation Society India"
    },
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "location": {
      "lat": 19.0760,
      "lng": 72.8777,
      "radius": 50
    },
    "budget": {
      "amount": 1000000,
      "currency": "INR"
    },
    "sdgGoals": [14, 15],
    "expectedImpact": "Expected impact description...",
    "methodology": "Project methodology...",
    "teamSize": 25,
    "isPublic": true,
    "approval": {
      "status": "approved",
      "approvedAt": "2024-01-15T10:30:00Z",
      "approvedBy": {
        "id": 4,
        "name": "Amit Singh"
      }
    },
    "statistics": {
      "dataPointsCount": 1250,
      "participantsCount": 45,
      "progressPercentage": 65,
      "qualityScore": 4.2
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /projects/{projectId}
**Purpose:** Update project
**Authentication:** Required (project owner or admin)
**Request Body:** Same as POST /projects

#### DELETE /projects/{projectId}
**Purpose:** Delete project
**Authentication:** Required (project owner or admin)

### 2.5 Environmental Data Endpoints

#### GET /projects/{projectId}/data
**Purpose:** Get environmental data for a project
**Authentication:** Required
**Query Parameters:**
- `categoryId`: Filter by data category
- `userId`: Filter by data contributor
- `dateFrom`: Start date
- `dateTo`: End date
- `qualityScore`: Minimum quality score
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "dataPoints": [
      {
        "id": 1,
        "category": {
          "id": 1,
          "name": "Deforestation Rate",
          "unit": "%"
        },
        "dataValue": "15.5",
        "numericValue": 15.5,
        "unit": "%",
        "location": {
          "lat": 19.0760,
          "lng": 72.8777,
          "accuracy": 10
        },
        "fileUrl": "https://cloudinary.com/...",
        "qualityScore": 0.85,
        "isVerified": true,
        "contributor": {
          "id": 3,
          "name": "Anjali Patel"
        },
        "collectedAt": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25
    },
    "summary": {
      "totalDataPoints": 1250,
      "verifiedDataPoints": 1100,
      "averageQualityScore": 0.82,
      "categories": [
        {
          "id": 1,
          "name": "Deforestation Rate",
          "count": 450
        }
      ]
    }
  }
}
```

#### POST /projects/{projectId}/data
**Purpose:** Upload environmental data
**Authentication:** Required
**Request Body (multipart/form-data):**
```json
{
  "categoryId": 1,
  "dataValue": "15.5",
  "numericValue": 15.5,
  "unit": "%",
  "location": {
    "lat": 19.0760,
    "lng": 72.8777,
    "accuracy": 10
  },
  "file": "(binary file data)",
  "notes": "Additional observations..."
}
```

#### PUT /data/{dataId}/verify
**Purpose:** Verify data point (admin only)
**Authentication:** Required (admin role)
**Request Body:**
```json
{
  "isVerified": true,
  "notes": "Data verified successfully"
}
```

### 2.6 Sensor Data Endpoints

#### GET /sensors/live-ws
**Purpose:** WebSocket endpoint for real-time sensor data
**Authentication:** Required
**WebSocket Connection:**
```javascript
const socket = io('wss://api.climateconservation.in/sensors/live-ws', {
  auth: {
    token: 'access_token'
  }
});

socket.on('sensor_data', (data) => {
  console.log('New sensor data:', data);
});
```

#### GET /sensors/static-csv
**Purpose:** Fallback endpoint for static sensor data
**Authentication:** Required
**Response:**
```json
{
  "success": true,
  "data": {
    "sensors": [
      {
        "sensorId": "LPG001",
        "sensorType": "lpg_sensor",
        "dataValue": 45.2,
        "unit": "ppm",
        "location": {
          "lat": 19.0760,
          "lng": 72.8777
        },
        "batteryLevel": 85.5,
        "signalStrength": 92.3,
        "recordedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /sensors/data
**Purpose:** Get historical sensor data
**Authentication:** Required
**Query Parameters:**
- `sensorType`: lpg_sensor, plastic_counter, rover, etc.
- `sensorId`: Specific sensor ID
- `projectId`: Filter by project
- `dateFrom`: Start date
- `dateTo`: End date
- `page`: Page number
- `limit`: Items per page

### 2.7 SDG Progress Endpoints

#### GET /projects/{projectId}/sdg-progress
**Purpose:** Get SDG progress for a project
**Authentication:** Required
**Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "sdgGoal": 14,
        "indicator": "Marine Protected Areas",
        "baselineValue": 5.2,
        "currentValue": 7.8,
        "targetValue": 10.0,
        "unit": "%",
        "progressPercentage": 78.0,
        "measurementDate": "2024-01-15",
        "dataSource": "Government marine survey data"
      }
    ],
    "summary": {
      "totalGoals": 2,
      "averageProgress": 72.5,
      "onTrackGoals": 1,
      "needsAttentionGoals": 1
    }
  }
}
```

#### POST /projects/{projectId}/sdg-progress
**Purpose:** Add SDG progress measurement
**Authentication:** Required (project owner or admin)
**Request Body:**
```json
{
  "sdgGoal": 14,
  "indicator": "Marine Protected Areas",
  "currentValue": 7.8,
  "unit": "%",
  "measurementDate": "2024-01-15",
  "dataSource": "Government marine survey data",
  "notes": "Progress notes..."
}
```

### 2.8 Educational Resources Endpoints

#### GET /resources
**Purpose:** List educational resources
**Authentication:** Required
**Query Parameters:**
- `contentType`: article, video, pdf, interactive, webinar
- `difficultyLevel`: beginner, intermediate, advanced
- `sdgGoal`: 13, 14, 15
- `tags`: Comma-separated tags
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": 1,
        "title": "Introduction to Marine Conservation",
        "description": "Learn the basics of marine ecosystem protection...",
        "contentType": "video",
        "contentUrl": "https://youtube.com/...",
        "durationMinutes": 45,
        "difficultyLevel": "beginner",
        "targetAudience": ["citizen_scientist", "ngo_manager"],
        "tags": ["marine", "conservation", "basics"],
        "sdgGoals": [14],
        "author": {
          "id": 2,
          "name": "Dr. Rajesh Kumar"
        },
        "viewCount": 1250,
        "ratingAverage": 4.5,
        "ratingCount": 89,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### POST /resources
**Purpose:** Create educational resource (admin only)
**Authentication:** Required (admin role)
**Request Body:**
```json
{
  "title": "New Educational Resource",
  "description": "Resource description...",
  "contentType": "article",
  "contentUrl": "https://example.com/article",
  "difficultyLevel": "beginner",
  "targetAudience": ["citizen_scientist"],
  "tags": ["conservation", "education"],
  "sdgGoals": [13, 14, 15]
}
```

### 2.9 Admin Endpoints

#### GET /admin/projects/pending-approval
**Purpose:** Get projects pending approval
**Authentication:** Required (admin role)
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

#### POST /admin/projects/{projectId}/approve
**Purpose:** Approve or reject project
**Authentication:** Required (admin role)
**Request Body:**
```json
{
  "status": "approved",
  "notes": "Project approved successfully"
}
```

#### GET /admin/dashboard
**Purpose:** Get admin dashboard statistics
**Authentication:** Required (admin role)
**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalUsers": 1250,
      "totalOrganizations": 85,
      "totalProjects": 150,
      "totalDataPoints": 25000,
      "pendingApprovals": 12
    },
    "recentActivity": [
      {
        "type": "project_created",
        "project": {
          "id": 1,
          "title": "New Project"
        },
        "user": {
          "id": 2,
          "name": "Rajesh Kumar"
        },
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## 3. Data Models

### 3.1 User Model
```json
{
  "id": "integer",
  "email": "string (email)",
  "firstName": "string (max 100)",
  "lastName": "string (max 100)",
  "role": "enum (government_officer, ngo_manager, citizen_scientist, admin)",
  "organizationId": "integer (optional)",
  "phone": "string (max 20, optional)",
  "profileImageUrl": "string (max 500, optional)",
  "bio": "string (optional)",
  "location": {
    "lat": "decimal (10,8)",
    "lng": "decimal (11,8)"
  },
  "isVerified": "boolean",
  "isActive": "boolean",
  "emailVerifiedAt": "timestamp (optional)",
  "lastLoginAt": "timestamp (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3.2 Project Model
```json
{
  "id": "integer",
  "title": "string (max 255)",
  "description": "string",
  "organizationId": "integer",
  "category": "enum (climate_action, marine_conservation, biodiversity_protection)",
  "status": "enum (draft, pending_approval, approved, active, completed, cancelled)",
  "startDate": "date",
  "endDate": "date",
  "location": {
    "lat": "decimal (10,8)",
    "lng": "decimal (11,8)",
    "radius": "decimal (8,2)"
  },
  "budget": {
    "amount": "decimal (12,2)",
    "currency": "string (3 chars)"
  },
  "sdgGoals": "array of integers (13, 14, 15)",
  "expectedImpact": "string",
  "methodology": "string",
  "teamSize": "integer",
  "isPublic": "boolean",
  "createdBy": "integer",
  "approvedBy": "integer (optional)",
  "approvedAt": "timestamp (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3.3 Environmental Data Model
```json
{
  "id": "integer",
  "projectId": "integer",
  "userId": "integer",
  "categoryId": "integer",
  "dataValue": "string",
  "numericValue": "decimal (15,6, optional)",
  "unit": "string (max 50, optional)",
  "location": {
    "lat": "decimal (10,8)",
    "lng": "decimal (11,8)",
    "accuracy": "decimal (8,2)"
  },
  "fileUrl": "string (max 500, optional)",
  "fileType": "string (max 50, optional)",
  "fileSize": "integer (optional)",
  "metadata": "json (optional)",
  "qualityScore": "decimal (3,2)",
  "isVerified": "boolean",
  "verifiedBy": "integer (optional)",
  "verifiedAt": "timestamp (optional)",
  "notes": "string (optional)",
  "collectedAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 4. Security Considerations

### 4.1 Authentication Flow
1. **Registration:** User registers with email/password
2. **Email Verification:** User verifies email address
3. **Login:** User authenticates and receives JWT tokens
4. **Token Refresh:** Access token refreshed using refresh token
5. **Logout:** Refresh token invalidated

### 4.2 Authorization Rules
- **Government Officers:** Can view all projects, create government projects, access official data
- **NGO Managers:** Can create/manage their organization's projects, upload data
- **Citizen Scientists:** Can view public projects, upload data, access educational resources
- **Admins:** Full access to all endpoints, can approve projects, manage users

### 4.3 Data Validation Requirements
- **Input Sanitization:** All user inputs sanitized
- **File Upload Validation:** File type, size, and content validation
- **Location Validation:** GPS coordinates within valid ranges
- **Business Logic Validation:** Project approval workflow, data quality scoring

### 4.4 CORS Policy
```javascript
// CORS Configuration
{
  origin: ['https://climateconservation.in', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 5. Integration Examples

### 5.1 Frontend API Integration
```javascript
// API Client Setup
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          localStorage.setItem('accessToken', response.data.data.accessToken);
          return apiClient.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Example API calls
export const projectAPI = {
  getProjects: (params) => apiClient.get('/projects', { params }),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
};

export const dataAPI = {
  getProjectData: (projectId, params) => 
    apiClient.get(`/projects/${projectId}/data`, { params }),
  uploadData: (projectId, formData) => 
    apiClient.post(`/projects/${projectId}/data`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
```

### 5.2 Real-time Sensor Data Integration
```javascript
// WebSocket connection for real-time sensor data
import io from 'socket.io-client';

class SensorDataService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    this.socket = io(process.env.REACT_APP_WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to sensor data stream');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from sensor data stream');
    });

    this.socket.on('sensor_data', (data) => {
      this.handleSensorData(data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection failed:', error);
      this.fallbackToStaticData();
    });
  }

  handleSensorData(data) {
    // Process real-time sensor data
    console.log('New sensor data:', data);
    // Update UI components, charts, etc.
  }

  fallbackToStaticData() {
    // Fallback to static CSV data if WebSocket fails
    fetch('/api/v1/sensors/static-csv')
      .then(response => response.json())
      .then(data => {
        console.log('Using static sensor data:', data);
      })
      .catch(error => {
        console.error('Failed to fetch static data:', error);
      });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new SensorDataService();
```

### 5.3 Common Workflow Examples

#### Project Creation Workflow
```javascript
// 1. Create project
const projectData = {
  title: "Mangrove Conservation Initiative",
  description: "Comprehensive mangrove restoration project...",
  category: "marine_conservation",
  startDate: "2024-06-01",
  endDate: "2024-11-30",
  targetArea: {
    lat: 19.0760,
    lng: 72.8777,
    radius: 25
  },
  sdgGoals: [14, 15],
  expectedImpact: "Expected environmental impact...",
  methodology: "Project methodology...",
  teamSize: 10
};

const project = await projectAPI.createProject(projectData);

// 2. Upload initial data
const formData = new FormData();
formData.append('categoryId', 1);
formData.append('dataValue', '15.5');
formData.append('numericValue', 15.5);
formData.append('unit', '%');
formData.append('location', JSON.stringify({
  lat: 19.0760,
  lng: 72.8777,
  accuracy: 10
}));
formData.append('file', fileInput.files[0]);

await dataAPI.uploadData(project.id, formData);

// 3. Track SDG progress
const sdgData = {
  sdgGoal: 14,
  indicator: "Marine Protected Areas",
  currentValue: 7.8,
  unit: "%",
  measurementDate: "2024-01-15",
  dataSource: "Initial baseline measurement"
};

await apiClient.post(`/projects/${project.id}/sdg-progress`, sdgData);
```

This API design provides a comprehensive RESTful interface for the Climate & Marine Conservation Collaboration Platform, supporting all features outlined in the PRD while maintaining security, performance, and scalability.