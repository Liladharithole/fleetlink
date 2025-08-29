# FleetLink

A modern vehicle rental management system that connects vehicle owners with customers looking to rent vehicles for short-term use.

## Features

- **Vehicle Listings**: Browse and search available vehicles
- **Booking System**: Easy online booking with real-time availability
- **Owner Portal**: Vehicle owners can list and manage their vehicles
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios for API calls

### Backend

- Node.js with Express
- MongoDB with Mongoose
- RESTful API

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB (local or Atlas)

## Getting Started

### Backend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/Liladharithole/fleetlink.git
   cd fleetlink/backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```bash
   cd ../frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

### Backend (`.env`)

```
MONGODB_URI=mongodb://localhost:27017/fleetlink
PORT=3000
```

## API Endpoints

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/available` - Get available vehicles
- `POST /api/vehicles` - Add a new vehicle

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings

## Contact




