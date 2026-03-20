# Spardha Backend

REST API backend for the Spardha application built with Express and TypeScript.

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── userController.ts
│   │   └── index.ts
│   ├── middlewares/      # Express middlewares
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   ├── validateRequest.ts
│   │   └── index.ts
│   ├── models/          # TypeScript interfaces/types
│   │   ├── User.ts
│   │   └── index.ts
│   ├── routes/          # API routes
│   │   ├── userRoutes.ts
│   │   └── index.ts
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

### Development

```bash
# Build and run
npm run dev

# Watch mode (rebuild on changes)
npm run watch

# Then in another terminal
npm start
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

## API Endpoints

### Health Check

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (development only)"
}
```

## Middlewares

- **logger** - Logs all incoming requests with timestamp
- **validateRequest** - Validates Content-Type for POST/PUT/PATCH requests
- **errorHandler** - Global error handler for uncaught exceptions

## Next Steps

- Add database integration (PostgreSQL/MongoDB)
- Add authentication & authorization
- Add input validation (e.g., Zod, Joi)
- Add rate limiting
- Add CORS configuration
- Add proper environment configuration
- Add API documentation (Swagger)
