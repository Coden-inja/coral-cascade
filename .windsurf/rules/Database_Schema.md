# Climate & Marine Conservation Collaboration Platform - Database Schema

## 1. Database Structure Overview

### Database Type: MySQL 8.0+
**Rationale:** Relational database chosen for structured environmental data with complex relationships, ACID compliance, and excellent support for geospatial data and complex queries required for conservation projects.

### Main Entities/Tables
1. **Users** - User accounts and profiles
2. **Organizations** - NGO and government organization profiles
3. **Projects** - Environmental conservation projects
4. **Environmental_Data** - Crowdsourced environmental data
5. **Sensor_Data** - Hardware sensor readings
6. **SDG_Progress** - Sustainable Development Goals tracking
7. **Educational_Resources** - Training materials and content
8. **Project_Approvals** - Admin approval workflow
9. **Data_Categories** - Environmental data classification
10. **Geographic_Regions** - Location and area management

### Entity Relationships
- **Users** belong to **Organizations** (many-to-one)
- **Organizations** create **Projects** (one-to-many)
- **Projects** collect **Environmental_Data** (one-to-many)
- **Environmental_Data** belongs to **Data_Categories** (many-to-one)
- **Projects** track **SDG_Progress** (one-to-many)
- **Sensor_Data** is associated with **Projects** (many-to-one)
- **Project_Approvals** manage **Projects** (one-to-one)
- **Geographic_Regions** contain **Projects** (one-to-many)

## 2. Detailed Schema Design

### 2.1 Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('government_officer', 'ngo_manager', 'citizen_scientist', 'admin') NOT NULL,
    organization_id INT,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    bio TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_organization (organization_id),
    INDEX idx_location (location_lat, location_lng)
);
```

### 2.2 Organizations Table
```sql
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('government', 'ngo', 'research_institution') NOT NULL,
    description TEXT,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(10),
    registration_number VARCHAR(100),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    verified_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_type (type),
    INDEX idx_verification_status (verification_status),
    INDEX idx_location (city, state)
);
```

### 2.3 Projects Table
```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organization_id INT NOT NULL,
    category ENUM('climate_action', 'marine_conservation', 'biodiversity_protection') NOT NULL,
    status ENUM('draft', 'pending_approval', 'approved', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    target_area_lat DECIMAL(10, 8),
    target_area_lng DECIMAL(11, 8),
    target_area_radius_km DECIMAL(8, 2),
    budget_amount DECIMAL(12, 2),
    budget_currency VARCHAR(3) DEFAULT 'INR',
    sdg_goals JSON, -- Array of SDG goals: [13, 14, 15]
    expected_impact TEXT,
    methodology TEXT,
    team_size INT,
    is_public BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_organization (organization_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_location (target_area_lat, target_area_lng),
    INDEX idx_dates (start_date, end_date)
);
```

### 2.4 Data_Categories Table
```sql
CREATE TABLE data_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    data_type ENUM('numeric', 'text', 'image', 'file', 'location') NOT NULL,
    validation_rules JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_data_type (data_type)
);
```

### 2.5 Environmental_Data Table
```sql
CREATE TABLE environmental_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    data_value TEXT NOT NULL,
    numeric_value DECIMAL(15, 6),
    unit VARCHAR(50),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_accuracy DECIMAL(8, 2), -- in meters
    file_url VARCHAR(500),
    file_type VARCHAR(50),
    file_size INT, -- in bytes
    metadata JSON, -- Additional structured data
    quality_score DECIMAL(3, 2), -- 0.00 to 1.00
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    notes TEXT,
    collected_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES data_categories(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_project (project_id),
    INDEX idx_user (user_id),
    INDEX idx_category (category_id),
    INDEX idx_location (location_lat, location_lng),
    INDEX idx_collected_at (collected_at),
    INDEX idx_quality (quality_score)
);
```

### 2.6 Sensor_Data Table
```sql
CREATE TABLE sensor_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    sensor_type ENUM('lpg_sensor', 'plastic_counter', 'rover', 'temperature', 'humidity', 'air_quality') NOT NULL,
    sensor_id VARCHAR(100) NOT NULL,
    data_value DECIMAL(15, 6) NOT NULL,
    unit VARCHAR(50),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    battery_level DECIMAL(5, 2), -- percentage
    signal_strength DECIMAL(5, 2), -- percentage
    metadata JSON, -- Additional sensor-specific data
    source ENUM('blynk_api', 'static_csv', 'manual_entry') DEFAULT 'blynk_api',
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP NULL,
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    INDEX idx_project (project_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_location (location_lat, location_lng),
    INDEX idx_recorded_at (recorded_at),
    INDEX idx_source (source)
);
```

### 2.7 SDG_Progress Table
```sql
CREATE TABLE sdg_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    sdg_goal INT NOT NULL CHECK (sdg_goal IN (13, 14, 15)),
    indicator VARCHAR(100) NOT NULL,
    baseline_value DECIMAL(15, 6),
    current_value DECIMAL(15, 6),
    target_value DECIMAL(15, 6),
    unit VARCHAR(50),
    progress_percentage DECIMAL(5, 2), -- 0.00 to 100.00
    measurement_date DATE,
    data_source TEXT,
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY unique_project_sdg_indicator (project_id, sdg_goal, indicator),
    INDEX idx_project (project_id),
    INDEX idx_sdg_goal (sdg_goal),
    INDEX idx_measurement_date (measurement_date)
);
```

### 2.8 Educational_Resources Table
```sql
CREATE TABLE educational_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type ENUM('article', 'video', 'pdf', 'interactive', 'webinar') NOT NULL,
    content_url VARCHAR(500),
    file_url VARCHAR(500),
    file_size INT, -- in bytes
    duration_minutes INT, -- for videos/webinars
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    target_audience JSON, -- Array of user roles
    tags JSON, -- Array of relevant tags
    sdg_goals JSON, -- Array of related SDG goals
    author_id INT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    rating_average DECIMAL(3, 2), -- 0.00 to 5.00
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_content_type (content_type),
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_published (is_published),
    INDEX idx_rating (rating_average),
    FULLTEXT idx_search (title, description)
);
```

### 2.9 Project_Approvals Table
```sql
CREATE TABLE project_approvals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL UNIQUE,
    submitted_by INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    status ENUM('pending', 'approved', 'rejected', 'requires_changes') DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    required_changes TEXT,
    resubmitted_at TIMESTAMP NULL,
    final_decision_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_reviewed_by (reviewed_by)
);
```

### 2.10 Geographic_Regions Table
```sql
CREATE TABLE geographic_regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('state', 'district', 'city', 'village', 'protected_area', 'marine_zone') NOT NULL,
    parent_id INT,
    coordinates JSON, -- GeoJSON polygon/multipolygon
    area_sq_km DECIMAL(12, 2),
    population INT,
    climate_zone VARCHAR(100),
    biodiversity_richness ENUM('low', 'medium', 'high', 'very_high'),
    conservation_priority ENUM('low', 'medium', 'high', 'critical'),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES geographic_regions(id),
    INDEX idx_type (type),
    INDEX idx_parent (parent_id),
    INDEX idx_biodiversity (biodiversity_richness),
    INDEX idx_priority (conservation_priority)
);
```

## 3. Sample Data

### 3.1 Organizations Sample Data
```sql
INSERT INTO organizations (name, type, description, city, state, verification_status) VALUES
('Ministry of Environment, Forest and Climate Change', 'government', 'Central government body responsible for environmental policy and conservation', 'New Delhi', 'Delhi', 'verified'),
('Wildlife Conservation Society India', 'ngo', 'Dedicated to wildlife conservation and habitat protection across India', 'Mumbai', 'Maharashtra', 'verified'),
('Marine Biology Research Institute', 'research_institution', 'Leading research institution focused on marine ecosystem studies', 'Chennai', 'Tamil Nadu', 'verified'),
('Green Earth Foundation', 'ngo', 'Community-based environmental conservation and education', 'Bangalore', 'Karnataka', 'pending');
```

### 3.2 Users Sample Data
```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, organization_id) VALUES
('priya.sharma@env.gov.in', '$2b$10$...', 'Priya', 'Sharma', 'government_officer', 1),
('rajesh.kumar@wcsindia.org', '$2b$10$...', 'Rajesh', 'Kumar', 'ngo_manager', 2),
('anjali.patel@student.edu', '$2b$10$...', 'Anjali', 'Patel', 'citizen_scientist', NULL),
('amit.singh@admin.com', '$2b$10$...', 'Amit', 'Singh', 'admin', NULL);
```

### 3.3 Data Categories Sample Data
```sql
INSERT INTO data_categories (name, description, unit, data_type, validation_rules) VALUES
('Deforestation Rate', 'Percentage of forest cover lost over time', '%', 'numeric', '{"min": 0, "max": 100}'),
('Coral Health Index', 'Health assessment of coral reef ecosystems', 'score', 'numeric', '{"min": 0, "max": 10}'),
('Plastic Pollution Density', 'Amount of plastic waste per square meter', 'pieces/m²', 'numeric', '{"min": 0}'),
('Air Quality Index', 'Air pollution measurement', 'AQI', 'numeric', '{"min": 0, "max": 500}'),
('Species Count', 'Number of species observed in area', 'count', 'numeric', '{"min": 0}'),
('Environmental Photo', 'Photographic evidence of environmental conditions', NULL, 'image', '{"max_size": 10485760, "allowed_types": ["jpg", "png", "jpeg"]}');
```

### 3.4 Projects Sample Data
```sql
INSERT INTO projects (title, description, organization_id, category, status, start_date, end_date, sdg_goals, created_by) VALUES
('Mangrove Conservation Initiative', 'Comprehensive mangrove restoration and monitoring project in coastal areas', 2, 'marine_conservation', 'approved', '2024-01-01', '2024-12-31', '[14, 15]', 2),
('Urban Air Quality Monitoring', 'Real-time air quality monitoring across major Indian cities', 1, 'climate_action', 'active', '2024-03-01', '2025-02-28', '[13]', 1),
('Biodiversity Survey Program', 'Comprehensive survey of flora and fauna in protected areas', 3, 'biodiversity_protection', 'pending_approval', '2024-06-01', '2024-11-30', '[15]', 3);
```

### 3.5 Environmental Data Sample Data
```sql
INSERT INTO environmental_data (project_id, user_id, category_id, data_value, numeric_value, location_lat, location_lng, collected_at) VALUES
(1, 3, 1, '15.5', 15.5, 19.0760, 72.8777, '2024-01-15 10:30:00'),
(1, 3, 2, '7.2', 7.2, 19.0760, 72.8777, '2024-01-15 10:30:00'),
(2, 1, 4, '156', 156, 28.7041, 77.1025, '2024-03-10 14:20:00'),
(3, 2, 5, '45', 45, 12.9716, 77.5946, '2024-06-05 09:15:00');
```

## 4. Database Migration Strategy

### 4.1 Local Development Setup
```bash
# Install MySQL locally
sudo apt-get install mysql-server  # Ubuntu/Debian
brew install mysql                 # macOS

# Create database
mysql -u root -p
CREATE DATABASE climate_conservation_dev;
CREATE USER 'dev_user'@'localhost' IDENTIFIED BY 'dev_password';
GRANT ALL PRIVILEGES ON climate_conservation_dev.* TO 'dev_user'@'localhost';

# Using Sequelize CLI
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4.2 Production Migration
```bash
# Environment variables for production
DATABASE_URL=mysql://username:password@host:port/database_name

# Migration commands
npx sequelize-cli db:migrate --env production
npx sequelize-cli db:seed:all --env production
```

### 4.3 Migration Files Structure
```
migrations/
├── 001-create-users.js
├── 002-create-organizations.js
├── 003-create-projects.js
├── 004-create-data-categories.js
├── 005-create-environmental-data.js
├── 006-create-sensor-data.js
├── 007-create-sdg-progress.js
├── 008-create-educational-resources.js
├── 009-create-project-approvals.js
└── 010-create-geographic-regions.js
```

## 5. Performance Considerations

### 5.1 Indexing Strategy
- **Primary Keys:** All tables have auto-incrementing primary keys
- **Foreign Keys:** Indexed for join performance
- **Location Data:** Composite indexes on latitude/longitude for spatial queries
- **Date Fields:** Indexed for time-based queries
- **Status Fields:** Indexed for filtering
- **Search Fields:** Full-text indexes on content fields

### 5.2 Query Optimization
```sql
-- Optimized query for project data with location
SELECT p.*, o.name as organization_name, 
       COUNT(ed.id) as data_points,
       AVG(ed.quality_score) as avg_quality
FROM projects p
JOIN organizations o ON p.organization_id = o.id
LEFT JOIN environmental_data ed ON p.id = ed.project_id
WHERE p.status = 'active'
  AND ST_Distance_Sphere(
    POINT(p.target_area_lng, p.target_area_lat),
    POINT(?, ?)
  ) <= p.target_area_radius_km * 1000
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### 5.3 Potential Bottlenecks and Solutions

#### 5.3.1 Large Data Volumes
- **Issue:** Environmental data can grow rapidly
- **Solution:** Implement data partitioning by date and region
- **Implementation:** Monthly partitions for environmental_data table

#### 5.3.2 Real-time Sensor Data
- **Issue:** High-frequency sensor data ingestion
- **Solution:** Use message queues (Redis/RabbitMQ) for buffering
- **Implementation:** Batch insert sensor data every 5 minutes

#### 5.3.3 Complex Spatial Queries
- **Issue:** Geographic queries can be slow
- **Solution:** Use spatial indexes and optimize coordinate storage
- **Implementation:** MySQL spatial indexes on location fields

#### 5.3.4 File Storage
- **Issue:** Large file uploads can slow down the system
- **Solution:** Use cloud storage (Cloudinary) with CDN
- **Implementation:** Store only metadata in database, files in cloud

### 5.4 Caching Strategy
```sql
-- Cache frequently accessed data
-- Project summaries
CREATE VIEW project_summary AS
SELECT p.id, p.title, p.status, o.name as organization,
       COUNT(ed.id) as data_points,
       AVG(ed.quality_score) as avg_quality
FROM projects p
JOIN organizations o ON p.organization_id = o.id
LEFT JOIN environmental_data ed ON p.id = ed.project_id
GROUP BY p.id;

-- SDG progress summary
CREATE VIEW sdg_summary AS
SELECT sdg_goal, 
       COUNT(DISTINCT project_id) as projects,
       AVG(progress_percentage) as avg_progress
FROM sdg_progress
GROUP BY sdg_goal;
```

### 5.5 Backup and Recovery
```bash
# Automated daily backups
mysqldump -u username -p climate_conservation > backup_$(date +%Y%m%d).sql

# Point-in-time recovery
mysqlbinlog --start-datetime="2024-01-15 10:00:00" \
            --stop-datetime="2024-01-15 11:00:00" \
            mysql-bin.000001 | mysql -u root -p
```

This database schema provides a robust foundation for the Climate & Marine Conservation Collaboration Platform, supporting all the features outlined in the PRD while maintaining performance, scalability, and data integrity.