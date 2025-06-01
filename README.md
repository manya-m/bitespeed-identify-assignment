# Bitespeed Identity Reconciliation API

> Node.js service for consolidating customer contact information across multiple purchases

## 🚀 Live API Endpoints

* **Base URL:** `https://bitespeed-identify-assignment.onrender.com`
* **Identify:** `POST /identify`
* **Health Check:** `GET /health`

## 📖 Overview

This TypeScript/Express service identifies and links customer contacts (email/phone) to provide personalized experiences. It maintains primary-secondary relationships between related contact records, automatically consolidating customer information across different purchases.

## 🛠️ Tech Stack

* **Backend:** Node.js + TypeScript + Express.js
* **Database:** PostgreSQL + Prisma ORM
* **Validation:** Zod schemas
* **Deployment:** Render.com
* **Features:** CORS enabled, graceful shutdown, comprehensive error handling

## 📡 API Documentation

### `POST /identify`

Consolidates contact information and returns unified customer profile.

**Request:**

```json
{
  "email": "customer@example.com",
  "phoneNumber": "123456789"
}
```

**Success Response (200):**

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["customer@example.com", "alt@example.com"],
    "phoneNumbers": ["123456789", "987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

**Error Response (400):**

```json
{
  "error": "Invalid input",
  "details": [/* Zod validation errors */]
}
```

### `GET /health`

System health check for monitoring and uptime verification.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🏗️ How It Works

The service implements intelligent contact linking logic:

1. **New Contact:** Creates primary contact if no matches found
2. **Exact Match:** Returns existing consolidated contact information
3. **Partial Match:** Creates secondary contact with new information (email or phone)
4. **Multiple Primaries:** Automatically links them with oldest as primary contact

**Key Features:**

* ✅ Automatic contact deduplication
* ✅ Primary-secondary relationship management
* ✅ Dynamic contact consolidation
* ✅ Soft deletion support (`deletedAt` field)
* ✅ Input validation with Zod
* ✅ Comprehensive error handling

## 🚀 Quick Setup & Testing

### Local Development

```bash
# Clone and install
git clone https://github.com/yourusername/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
npm install

# Setup environment
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/bitespeed_db"' > .env
echo 'PORT=3000' >> .env

# Database setup
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev  # Development with hot reload
npm start    # Production mode
```

## 🚀 Deployment on Render

### Quick Deploy Steps

1. **Connect GitHub** repository to Render
2. **Service Type:** Web Service
3. **Build Command:** `npm install && npx prisma generate && npm run build`
4. **Start Command:** `npm start`
5. **Environment Variables:**

   ```
   DATABASE_URL=postgresql://[your-render-db-url]
   NODE_ENV=production
   ```

## 📂 Project Structure

```
src/
├── app.ts        # Express setup, routes, middleware
├── server.ts     # Server startup & graceful shutdown  
├── db.ts         # Business logic & database operations
├── types.ts      # Zod schemas & TypeScript interfaces
└── prisma/
    └── schema.prisma  # Database schema
```

## 🔧 Available Scripts

```bash
npm run dev         # Development with hot reload
npm run build       # TypeScript compilation  
npm start           # Production server
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Prisma Studio GUI
```

## ⚡ Performance Notes

* Includes database connection pooling via Prisma
* Implements graceful shutdown on SIGINT
* CORS enabled for cross-origin requests
* Input validation prevents malformed requests
* Soft deletion support with `deletedAt` field

---

**🔗 Links:** [Live API](https://bitespeed-identify-assignment.onrender.com/identify) • [Health Check](https://bitespeed-identify-assignment.onrender.com/health)

---

