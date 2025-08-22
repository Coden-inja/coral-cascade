# Climate & Marine Conservation Collaboration Platform - Frontend Development Guide

## 1. Project Setup & Environment

### 1.1 Frontend Framework Setup
```bash
# Create React project with Vite
npm create vite@latest climate-conservation-frontend -- --template react-ts
cd climate-conservation-frontend

# Install core dependencies
npm install react-router-dom axios @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install chart.js react-chartjs-2
npm install @headlessui/react @heroicons/react
npm install socket.io-client

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint prettier @typescript-eslint/eslint-plugin
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 1.2 TailwindCSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### 1.3 Environment Configuration
```bash
# .env.development
VITE_API_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# .env.production
VITE_API_URL=https://api.climateconservation.in/api/v1
VITE_WS_URL=wss://api.climateconservation.in
VITE_GOOGLE_MAPS_API_KEY=your_production_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_production_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_production_upload_preset
```

### 1.4 Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProjectForm.tsx
│   │   └── DataUploadForm.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── DataChart.tsx
│   │   └── MapView.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── ProjectApproval.tsx
│       └── UserManagement.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useDataUpload.ts
│   └── useSensorData.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── data.ts
│   └── sensors.ts
├── stores/
│   ├── authStore.ts
│   ├── projectStore.ts
│   └── uiStore.ts
├── types/
│   ├── user.ts
│   ├── project.ts
│   ├── data.ts
│   └── api.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   ├── maps.ts
│   └── constants.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── DataUpload.tsx
│   ├── Resources.tsx
│   └── Admin.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 2. UI/UX Planning

### 2.1 Design System
- **Color Palette:** Primary blue (#3b82f6), Success green (#22c55e), Warning amber (#f59e0b), Danger red (#ef4444)
- **Typography:** Inter font family with responsive sizing
- **Spacing:** Consistent 4px grid system
- **Components:** Reusable, accessible components with consistent styling

### 2.2 User Interface Mockups

#### 2.2.1 Landing Page
- Hero section with platform introduction
- Feature highlights (data collection, real-time monitoring, SDG tracking)
- Call-to-action for registration
- Footer with links and contact information

#### 2.2.2 Dashboard
- Navigation sidebar with role-based menu items
- Project overview cards with status indicators
- Real-time data visualization charts
- Interactive map showing project locations
- Quick action buttons for common tasks

#### 2.2.3 Project Management
- Project list with filtering and search
- Project detail view with tabs (Overview, Data, Progress, Team)
- Project creation/editing forms with validation
- Approval workflow interface for admins

#### 2.2.4 Data Collection
- Multi-step data upload form
- File upload with drag-and-drop
- Location picker with map integration
- Data validation and preview
- Progress tracking for bulk uploads

### 2.3 User Flow Diagrams

#### 2.3.1 User Registration Flow
1. User visits landing page
2. Clicks "Get Started" or "Register"
3. Fills registration form with role selection
4. Email verification sent
5. User verifies email
6. Profile completion
7. Redirected to dashboard

#### 2.3.2 Project Creation Flow
1. NGO manager logs in
2. Navigates to "Create Project"
3. Fills project details form
4. Submits for admin approval
5. Admin reviews and approves/rejects
6. Project becomes active
7. Data collection begins

#### 2.3.3 Data Upload Flow
1. User selects project
2. Chooses data category
3. Enters data values and location
4. Uploads supporting files
5. Reviews and submits
6. Data undergoes quality checks
7. Data appears in project dashboard

### 2.4 Component Hierarchy
```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Main Content
├── Routes
│   ├── Public Routes
│   │   ├── Home
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes
│       ├── Dashboard
│       ├── Projects
│       ├── DataUpload
│       ├── Resources
│       └── Admin
└── Providers
    ├── QueryClient
    ├── AuthProvider
    └── ThemeProvider
```

### 2.5 Responsive Design Considerations
- **Mobile-first approach** with breakpoints at 640px, 768px, 1024px, 1280px
- **Touch-friendly interfaces** with minimum 44px touch targets
- **Collapsible navigation** for mobile devices
- **Optimized forms** for mobile input
- **Responsive charts and maps** that adapt to screen size

## 3. Development Phases

### Phase 1: Basic App Structure and Navigation (Weeks 1-2)

#### 3.1.1 Setup and Configuration
- [ ] Initialize React + Vite project
- [ ] Configure TailwindCSS and TypeScript
- [ ] Set up ESLint and Prettier
- [ ] Configure environment variables
- [ ] Set up Git repository and CI/CD

#### 3.1.2 Core Components
- [ ] Create basic layout components (Header, Sidebar, Footer)
- [ ] Implement routing with React Router
- [ ] Create common UI components (Button, Input, Modal)
- [ ] Set up authentication context and protected routes
- [ ] Implement basic error handling and loading states

#### 3.1.3 API Integration Foundation
- [ ] Set up Axios client with interceptors
- [ ] Create API service modules
- [ ] Implement React Query for server state management
- [ ] Set up Zustand for client state management
- [ ] Create TypeScript interfaces for API responses

**Code Example - API Client Setup:**
```typescript
// services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
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

export default apiClient;
```

### Phase 2: Authentication UI and User Management (Weeks 3-4)

#### 3.2.1 Authentication Components
- [ ] Create login form with validation
- [ ] Implement registration form with role selection
- [ ] Add email verification flow
- [ ] Create password reset functionality
- [ ] Implement profile management interface

#### 3.2.2 User Management
- [ ] Create user profile components
- [ ] Implement organization profile management
- [ ] Add user role-based access control
- [ ] Create admin user management interface
- [ ] Implement user verification workflow

**Code Example - Login Form:**
```typescript
// components/forms/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};
```

### Phase 3: Core Feature Interfaces (Weeks 5-8)

#### 3.3.1 Project Management
- [ ] Create project list with filtering and search
- [ ] Implement project detail view with tabs
- [ ] Build project creation/editing forms
- [ ] Add project approval workflow for admins
- [ ] Implement project status tracking

#### 3.3.2 Data Collection Platform
- [ ] Create data upload interface with multi-step form
- [ ] Implement file upload with drag-and-drop
- [ ] Add location picker with map integration
- [ ] Build data validation and preview
- [ ] Create data management and verification interface

#### 3.3.3 Dashboard and Visualization
- [ ] Build main dashboard with role-based content
- [ ] Implement data visualization charts
- [ ] Create interactive map with project locations
- [ ] Add real-time data updates
- [ ] Implement SDG progress tracking

**Code Example - Project Card Component:**
```typescript
// components/dashboard/ProjectCard.tsx
import { Project } from '../../types/project';
import { Badge } from '../common/Badge';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending_approval': return 'warning';
      case 'completed': return 'primary';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'climate_action': return '🌍';
      case 'marine_conservation': return '🌊';
      case 'biodiversity_protection': return '🌿';
      default: return '📋';
    }
  };

  return (
    <div 
      onClick={() => onClick(project)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(project.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500">{project.organization.name}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(project.status)}>
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>📊 {project.statistics.dataPointsCount} data points</span>
          <span>👥 {project.statistics.participantsCount} participants</span>
        </div>
        <span>🎯 {project.statistics.progressPercentage}% complete</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {project.sdgGoals.map((goal) => (
          <Badge key={goal} variant="outline" size="sm">
            SDG {goal}
          </Badge>
        ))}
      </div>
    </div>
  );
};
```

### Phase 4: Advanced Features and Polish (Weeks 9-12)

#### 3.4.1 Real-time Features
- [ ] Implement WebSocket connection for live sensor data
- [ ] Add real-time dashboard updates
- [ ] Create live notification system
- [ ] Implement collaborative features
- [ ] Add real-time project status updates

#### 3.4.2 Advanced Data Visualization
- [ ] Create interactive charts with Chart.js
- [ ] Implement map overlays and heat maps
- [ ] Add data filtering and export functionality
- [ ] Create custom dashboard widgets
- [ ] Implement data comparison tools

#### 3.4.3 Educational Resources
- [ ] Build resource library interface
- [ ] Implement content filtering and search
- [ ] Add learning progress tracking
- [ ] Create interactive learning modules
- [ ] Implement resource rating and feedback

**Code Example - Real-time Sensor Data Hook:**
```typescript
// hooks/useSensorData.ts
import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface SensorData {
  sensorId: string;
  sensorType: string;
  dataValue: number;
  unit: string;
  location: { lat: number; lng: number };
  recordedAt: string;
}

export const useSensorData = (projectId?: string) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    socketRef.current = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to sensor data stream');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from sensor data stream');
    });

    socket.on('sensor_data', (newData: SensorData) => {
      setData(prev => {
        const filtered = prev.filter(item => 
          item.sensorId !== newData.sensorId || 
          item.recordedAt !== newData.recordedAt
        );
        return [newData, ...filtered].slice(0, 100); // Keep last 100 readings
      });
    });

    socket.on('connect_error', (err) => {
      setError('Failed to connect to sensor data stream');
      console.error('WebSocket connection failed:', err);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendCommand = (sensorId: string, command: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sensor_command', { sensorId, command });
    }
  };

  return {
    data,
    isConnected,
    error,
    sendCommand
  };
};
```

### Phase 5: Testing and Optimization (Weeks 13-16)

#### 3.5.1 Testing Implementation
- [ ] Write unit tests for components
- [ ] Implement integration tests for user flows
- [ ] Add end-to-end tests for critical paths
- [ ] Create performance tests
- [ ] Implement accessibility testing

#### 3.5.2 Performance Optimization
- [ ] Implement code splitting and lazy loading
- [ ] Optimize bundle size and loading times
- [ ] Add caching strategies
- [ ] Optimize images and assets
- [ ] Implement progressive web app features

#### 3.5.3 Accessibility and UX
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add keyboard navigation support
- [ ] Implement screen reader compatibility
- [ ] Add high contrast mode
- [ ] Optimize for mobile devices

**Code Example - Testing Setup:**
```typescript
// tests/components/ProjectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../../components/dashboard/ProjectCard';
import { Project } from '../../types/project';

const mockProject: Project = {
  id: 1,
  title: 'Test Project',
  description: 'Test project description',
  category: 'marine_conservation',
  status: 'active',
  organization: { id: 1, name: 'Test Org' },
  statistics: {
    dataPointsCount: 100,
    participantsCount: 10,
    progressPercentage: 75
  },
  sdgGoals: [14, 15],
  // ... other required fields
};

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    const mockOnClick = jest.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('100 data points')).toBeInTheDocument();
    expect(screen.getByText('75% complete')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Test Project'));
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });
});
```

## 4. Code Organization

### 4.1 Folder Structure Best Practices
- **Feature-based organization** for complex features
- **Shared components** in common directory
- **Type definitions** centralized in types directory
- **Custom hooks** for reusable logic
- **Service layer** for API communication

### 4.2 Component Organization
- **Atomic design principles** (atoms, molecules, organisms)
- **Single responsibility** for each component
- **Props interface** for all components
- **Default exports** for page components
- **Named exports** for reusable components

### 4.3 State Management Approach
- **React Query** for server state (projects, data, users)
- **Zustand** for client state (UI state, form state)
- **React Context** for theme and authentication
- **Local state** for component-specific state

### 4.4 Styling Methodology
- **TailwindCSS utility classes** for consistent styling
- **Component variants** using clsx or class-variance-authority
- **CSS custom properties** for theme values
- **Responsive design** with mobile-first approach

## 5. User Experience Guidelines

### 5.1 Loading States and Error Handling
- **Skeleton loaders** for content loading
- **Progress indicators** for long operations
- **Error boundaries** for component errors
- **User-friendly error messages** with recovery options
- **Retry mechanisms** for failed operations

### 5.2 Form Validation and User Feedback
- **Real-time validation** with immediate feedback
- **Clear error messages** with specific guidance
- **Success confirmations** for completed actions
- **Form persistence** to prevent data loss
- **Accessibility labels** for all form elements

### 5.3 Mobile Responsiveness Requirements
- **Touch-friendly interfaces** with 44px minimum targets
- **Responsive navigation** with hamburger menu
- **Optimized forms** for mobile input
- **Gesture support** for common actions
- **Offline capability** for critical features

### 5.4 Accessibility Considerations
- **WCAG 2.1 AA compliance** throughout the application
- **Keyboard navigation** for all interactive elements
- **Screen reader compatibility** with proper ARIA labels
- **Color contrast** meeting accessibility standards
- **Focus management** for modal and form interactions

## 6. Deployment and CI/CD

### 6.1 Vercel Deployment Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Environment variables in Vercel dashboard
VITE_API_URL=https://api.climateconservation.in/api/v1
VITE_WS_URL=wss://api.climateconservation.in
VITE_GOOGLE_MAPS_API_KEY=your_production_key
```

### 6.2 Build Optimization
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          maps: ['@googlemaps/js-api-loader'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### 6.3 Performance Monitoring
- **Core Web Vitals** tracking with Google Analytics
- **Error monitoring** with Sentry
- **Performance budgets** for bundle size
- **Lighthouse CI** for automated performance testing
- **Real User Monitoring** (RUM) for production insights

This comprehensive frontend development guide provides a structured approach to building the Climate & Marine Conservation Collaboration Platform, ensuring high-quality code, excellent user experience, and maintainable architecture.