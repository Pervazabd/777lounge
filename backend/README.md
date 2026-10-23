# 777 Lounge API

Express and MongoDB backend for reservation requests.

## Requirements

- Node.js 20 or newer
- MongoDB Atlas or a local MongoDB instance

## Setup

From this directory, install dependencies and create your environment file:

```powershell
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI` in `.env` to your MongoDB connection string. For MongoDB Atlas, create a database user and allow the development machine's IP address in Network Access. Do not commit `.env`.
Set `MONGODB_DB_NAME` to the application database name (defaults to MongoDB's URI-selected database when omitted).

Start the API in development mode:

```powershell
npm run dev
```

On startup, the API seeds the initial menu into MongoDB only when the menu collection is empty. After that, menu reads and admin changes use MongoDB; restarting or redeploying the API does not replace stored products. To manually populate or refresh the catalog:

```powershell
npm run seed
```

The seed is idempotent: it inserts or updates the listed products without deleting other records. The files under `src/data` are only the initial catalog used to seed MongoDB, not a runtime data store. Prices are stored as numeric Turkish lira amounts (`currency: "TRY"`), with category/order, description, listed ingredients, and a category-matched Unsplash stock image URL. The catalog is available at `GET /api/products`; use `GET /api/products?category=burgerler` to filter by category slug.

The API listens on `http://localhost:5000` by default. The Vite development server proxies `/api` requests to it.
For a separately hosted frontend, set `VITE_API_URL` to the API's public base URL in the frontend environment and set `CORS_ORIGIN` to the frontend's origin.

## Production deployment

For the deployed frontend and API, configure these values (use your actual public frontend origin if it changes):

- Vercel frontend environment variable: `VITE_API_URL=https://seven77lounge-8.onrender.com`
- Render API environment variable: `CORS_ORIGIN=https://777lounge-hozl.vercel.app`

Set `MONGODB_URI` on Render to a MongoDB Atlas connection string and allow the Render service to connect in Atlas Network Access. Set `ADMIN_API_KEY` to a long random secret. Set the Vercel variable for every environment used to deploy the site, then redeploy so Vite can include the public API URL in the frontend build. The frontend falls back to the same Render API URL in production if `VITE_API_URL` is unset or points to a local address; local development continues to use the Vite `/api` proxy when the variable is unset.

## Endpoints

- `GET /api/health` — API and MongoDB readiness.
- `GET /api/products` — active menu products with prices, descriptions, ingredients, and image metadata.
- `POST /api/reservations` — validate and save a reservation request.

Example request:

```json
{
  "name": "Jane Doe",
  "phone": "+90 555 123 4567",
  "date": "2026-10-20",
  "time": "19:30",
  "guests": "2",
  "area": "garden",
  "notes": "Birthday"
}
```

Reservation requests are stored as `pending`; the venue still needs to confirm them.
