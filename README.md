# Virtual Art Gallery

A web application that allows users to browse, upload, and interact with art images.

## Features

- Browse images with filtering and search capabilities
- Upload and download images
- User authentication (register, login)
- Comment and like functionality
- Dark mode support
- Responsive design

## Tech Stack

### Frontend
- ReactJS (Vite)
- TailwindCSS
- React Router v6
- Axios
- React Toastify

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- MongoDB running locally at `mongodb://127.0.0.1:27017/`

### Installation

1. Clone the repository
```
git clone <repository-url>
cd virtual-art-gallery
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm run dev
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Project Structure

### Backend
- `/backend/models` - MongoDB schemas
- `/backend/controllers` - Route handlers
- `/backend/routes` - API routes
- `/backend/middleware` - Custom middleware
- `/backend/uploads` - Uploaded images storage
- `/backend/config` - Configuration files

### Frontend
- `/frontend/src/pages` - Main application pages
- `/frontend/src/components` - Reusable UI components
- `/frontend/src/contexts` - React context providers
- `/frontend/src/utils` - Utility functions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/profile` - Get user details
- `PUT /api/auth/profile` - Update user profile

### Images
- `GET /api/images` - Get all images with filters
- `GET /api/images/:id` - Get specific image details
- `POST /api/images/upload` - Upload a new image
- `DELETE /api/images/:id` - Delete an image
- `PUT /api/images/:id/like` - Like/unlike an image
- `POST /api/images/:id/comment` - Add a comment to an image
- `GET /api/images/featured` - Get featured images 