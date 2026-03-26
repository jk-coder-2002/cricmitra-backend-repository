# CricMitra Backend

A modular monolith backend for a cricket scoring and tournament platform.

## Features
- JWT Authentication
- Role-Based Access Control (RBAC)
- Clean Architecture (Controllers, Services, Repositories/Schemas, DTOs)
- Real-time scoring using WebSockets
- Comprehensive match and tournament management
- RESTful API design

## Stack
- Node.js & TypeScript
- Express.js
- MongoDB & Mongoose
- Socket.io
- Zod (Validation)
- Jest (Testing)
- Docker

## Setup

1. Install dependencies:
   `npm install`

2. Set environment variables (create a `.env` file):
   `PORT=3000`
   `MONGO_URI=mongodb://localhost:27017/cricmitra`
   `JWT_SECRET=your_jwt_secret`
   `JWT_REFRESH_SECRET=your_jwt_refresh_secret`

3. Build and Start:
   `npm run build`
   `npm start`

   For dev:
   `npm run dev`

4. Seed Roles and Permissions:
   `npm run seed`

## Docker Setup

1. Build and run with Docker Compose:
   `docker-compose up --build`
