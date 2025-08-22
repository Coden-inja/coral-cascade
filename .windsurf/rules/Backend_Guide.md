# Climate & Marine Conservation Collaboration Platform - Backend Development Guide

## Project Setup & Environment

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git
- VS Code (recommended)

### Step-by-step Setup

#### 1. Project Initialization
```bash
# Create project directory
mkdir climate-conservation-backend
cd climate-conservation-backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express sequelize mysql2 bcrypt jsonwebtoken cors helmet dotenv multer socket.io swagger-ui-express swagger-jsdoc

# Install development dependencies
npm install -D nodemon jest supertest @types/node typescript ts-node
```

#### 2. Environment Configuration
Create `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=climate_conservation_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# File Upload Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Blynk API Configuration
BLYNK_SERVER_URL=https://blynk.cloud
BLYNK_AUTH_TOKEN=your-blynk-token

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

#### 3. Database Setup
```bash
# Install MySQL locally
sudo apt-get install mysql-server  # Ubuntu/Debian
brew install mysql                 # macOS

# Create database and user
mysql -u root -p
CREATE DATABASE climate_conservation_dev;
CREATE USER 'dev_user'@'localhost' IDENTIFIED BY 'dev_password';
GRANT ALL PRIVILEGES ON climate_conservation_dev.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;
```

## Development Phases

### Phase 1: Basic Setup and Core Models (Week 1-2)

#### Objectives
- Set up Express server with middleware
- Configure Sequelize ORM
- Create database models
- Implement basic error handling

#### Step-by-step Tasks

**1.1 Server Setup**
```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be added)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**1.2 Database Configuration**
```javascript
// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

**1.3 Core Models**
```javascript
// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('government_officer', 'ngo_manager', 'citizen_scientist', 'admin'),
    allowNull: false
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;
```

#### Testing Checkpoint
```bash
# Test database connection
npm run test:db

# Test server startup
npm run dev
```

### Phase 2: Authentication System (Week 3-4)

#### Objectives
- Implement JWT-based authentication
- Create user registration and login
- Add role-based authorization middleware
- Implement password reset functionality

#### Step-by-step Tasks

**2.1 JWT Utilities**
```javascript
// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
```

**2.2 Authentication Middleware**
```javascript
// src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

**2.3 Authentication Routes**
```javascript
// src/routes/auth.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, organization_id } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password_hash: password,
      first_name,
      last_name,
      role,
      organization_id
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### Testing Checkpoint
```bash
# Test authentication endpoints
npm run test:auth

# Test protected routes
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/profile
```

### Phase 3: Core Business Logic APIs (Week 5-8)

#### Objectives
- Implement project management APIs
- Create environmental data collection endpoints
- Add organization management
- Implement admin approval workflow

#### Step-by-step Tasks

**3.1 Project Management**
```javascript
// src/routes/projects.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Project = require('../models/Project');
const router = express.Router();

// Create project (NGO managers only)
router.post('/', authenticate, authorize('ngo_manager'), async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      organization_id: req.user.organization_id,
      created_by: req.user.id,
      status: 'draft'
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get projects (filtered by user role)
router.get('/', authenticate, async (req, res) => {
  try {
    const where = {};
    
    if (req.user.role === 'ngo_manager') {
      where.organization_id = req.user.organization_id;
    } else if (req.user.role === 'citizen_scientist') {
      where.status = 'approved';
      where.is_public = true;
    }
    
    const projects = await Project.findAll({ where });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**3.2 Environmental Data Collection**
```javascript
// src/routes/environmental-data.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const EnvironmentalData = require('../models/EnvironmentalData');
const multer = require('multer');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Upload environmental data
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { project_id, category_id, data_value, location_lat, location_lng } = req.body;
    
    let file_url = null;
    if (req.file) {
      // Upload to Cloudinary
      file_url = await uploadToCloudinary(req.file);
    }
    
    const data = await EnvironmentalData.create({
      project_id,
      user_id: req.user.id,
      category_id,
      data_value,
      location_lat,
      location_lng,
      file_url,
      collected_at: new Date()
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### Testing Checkpoint
```bash
# Test project creation
npm run test:projects

# Test data upload
npm run test:data-upload
```

### Phase 4: Advanced Features (Week 9-12)

#### Objectives
- Implement real-time sensor data integration
- Add Google Maps API integration
- Create SDG progress tracking
- Implement educational resources

#### Step-by-step Tasks

**4.1 Sensor Data Integration**
```javascript
// src/services/sensorService.js
const axios = require('axios');
const SensorData = require('../models/SensorData');

class SensorService {
  async fetchBlynkData() {
    try {
      const response = await axios.get(`${process.env.BLYNK_SERVER_URL}/external/api/get`, {
        params: {
          token: process.env.BLYNK_AUTH_TOKEN,
          pin: 'V1' // LPG sensor pin
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Blynk API error:', error);
      return null;
    }
  }
  
  async processSensorData(data) {
    try {
      await SensorData.create({
        sensor_type: 'lpg_sensor',
        sensor_id: 'blynk_lpg_001',
        data_value: data.value,
        unit: 'ppm',
        source: 'blynk_api',
        recorded_at: new Date()
      });
    } catch (error) {
      console.error('Sensor data processing error:', error);
    }
  }
}

module.exports = new SensorService();
```

**4.2 Real-time Updates with Socket.io**
```javascript
// src/services/socketService.js
const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
};

const emitSensorData = (data) => {
  if (io) {
    io.emit('sensor-data', data);
  }
};

module.exports = { initializeSocket, emitSensorData };
```

#### Testing Checkpoint
```bash
# Test sensor integration
npm run test:sensors

# Test real-time updates
npm run test:socket
```

### Phase 5: Testing and Optimization (Week 13-16)

#### Objectives
- Implement comprehensive testing
- Add performance optimization
- Security audit and fixes
- Production deployment preparation

#### Step-by-step Tasks

**5.1 Testing Setup**
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });
  
  test('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role: 'citizen_scientist'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

**5.2 Performance Optimization**
```javascript
// src/middleware/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };
    
    next();
  };
};

module.exports = cacheMiddleware;
```

#### Testing Checkpoint
```bash
# Run all tests
npm test

# Performance testing
npm run test:performance

# Security audit
npm audit
```

## Code Structure Guidelines

### Folder Organization
```
src/
├── config/
│   ├── database.js
│   └── swagger.js
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   └── dataController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── EnvironmentalData.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   └── data.js
├── services/
│   ├── sensorService.js
│   ├── emailService.js
│   └── fileService.js
├── utils/
│   ├── jwt.js
│   ├── validation.js
│   └── helpers.js
└── app.js
```

### File Naming Conventions
- Use camelCase for files and folders
- Use PascalCase for model names
- Use kebab-case for route files
- Suffix test files with `.test.js`

### Code Organization Patterns
- **Controllers:** Handle HTTP requests and responses
- **Services:** Business logic and external API calls
- **Models:** Database schema and relationships
- **Middleware:** Request processing and validation
- **Utils:** Helper functions and utilities

## Deployment Preparation

### Production Configuration
```javascript
// src/config/production.js
module.exports = {
  database: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    }
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};
```

### Security Checklist
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers

### Performance Optimization
- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching implementation
- [ ] File compression
- [ ] CDN configuration
- [ ] Load balancing

### Monitoring Setup
```javascript
// src/middleware/monitoring.js
const monitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = monitoring;
```

## Common Issues and Solutions

### Database Connection Issues
**Problem:** Connection timeout or refused
**Solution:** Check database credentials and network connectivity
```bash
# Test connection
mysql -h host -u user -p database_name
```

### JWT Token Issues
**Problem:** Token expiration or invalid signature
**Solution:** Verify JWT_SECRET and token format
```javascript
// Debug token
const decoded = jwt.decode(token, { complete: true });
console.log(decoded);
```

### File Upload Issues
**Problem:** Large file uploads failing
**Solution:** Configure multer limits and cloud storage
```javascript
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

This comprehensive backend development guide provides a structured approach to building the Climate & Marine Conservation Collaboration Platform, ensuring scalability, security, and maintainability.
