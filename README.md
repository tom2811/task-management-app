# Task Management App

A modern, responsive task management application built with React, TypeScript,
and Vite. Features a clean UI with pagination, filtering, bulk operations, and
persistent state management.

## 🚀 Features

### Core Functionality

- **Task Management**: Create, read, update, and delete tasks
- **Task Status**: Track tasks with three states - Todo, In Progress, Done
- **Priority Levels**: Organize tasks by Low, Medium, and High priority
- **Due Dates**: Set optional due dates for tasks
- **Bulk Operations**: Select and delete multiple tasks at once

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Pagination**: Navigate through tasks with persistent page state
- **Filtering**: Filter tasks by All, Active, or Completed status
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Persistent State**: Page numbers and filters persist across browser
  refreshes
- **Loading States**: Smooth loading indicators and error handling

### Technical Features

- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for global state management
- **Data Fetching**: TanStack Query for server state management
- **Form Validation**: React Hook Form with Zod schema validation
- **Modern UI**: ShadCN components with Tailwind CSS styling
- **Mock API**: JSON Server for development and testing

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **ShadCN**
- **Lucide React**

### State Management & Data Fetching

- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development Tools

- **JSON Server** - Mock REST API
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📦 Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development servers**

   You need to run both the frontend and the mock API server:

   **Terminal 1 - Frontend Development Server:**

   ```bash
   npm run dev
   ```

   **Terminal 2 - Mock API Server:**

   ```bash
   npm run server
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API Server: http://localhost:3001

## 🎯 Usage

### Creating Tasks

1. Click the "Add Task" button in the header
2. Fill in the task details:
   - Task text (required)
   - Due date (optional)
   - Priority level (Low, Medium, High)
3. Click "Create Task" to save

### Managing Tasks

- **Edit**: Click the edit icon on any task card
- **Delete**: Click the delete icon and confirm
- **Change Status**: Use the status dropdown on each task card
- **Bulk Delete**: Select multiple tasks using checkboxes and use bulk actions

### Filtering and Navigation

- **Filter**: Use the filter dropdown to show All, Active, or Completed tasks
- **Pagination**: Navigate through pages using Previous/Next buttons
- **Persistent State**: Page numbers and filters are saved in the URL and
  persist across refreshes

## 🔍 API Endpoints

The mock API server provides the following endpoints:

- `GET /tasks` - Get all tasks (supports pagination and filtering)
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
