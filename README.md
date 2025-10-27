# Countries API

A RESTful API service that provides comprehensive country data including GDP estimates, exchange rates, population, and regional information. The API fetches data from external sources, processes it, and stores it in a database for efficient querying.

## Features

- 🌍 **Country Data Management** - Fetch, store, and query country information
- 💱 **Exchange Rates** - Real-time currency exchange rate integration
- 📊 **GDP Estimates** - Calculated estimated GDP based on population and exchange rates
- 🖼️ **Visual Summaries** - Auto-generated PNG images with country statistics
- 🔍 **Filtering & Sorting** - Filter by region/currency, sort by GDP
- 📝 **Database** - Prisma ORM with MySQL support


## Prerequisites

- Node.js >= 20.0.0
- pnpm (or npm/yarn)
- MySQL database

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend-2
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/countries_db"
   COUNTRIES_API_URL="https://restcountries.com/v2/all"
   CURRENCIES_API_URL="https://open.er-api.com/v6/latest/USD"
   PORT=3000
   NODE_ENV=development
   ```

4. **Run database migrations:**
   ```bash
    npx prisma migrate dev --name <dbname>
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

## Usage

### Development Mode
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. **Get API Status**
```http
GET /status
```
Returns the total number of countries in the database and the last refresh timestamp.

**Response:**
```json
{
  "total_countries": 195,
  "last_refreshed_at": "2024-10-27T10:30:00.000Z"
}
```

---

#### 2. **Get All Countries**
```http
GET /countries
```

**Query Parameters:**
- `region` (optional) - Filter by region (e.g., Africa, Europe, Asia)
- `currency` (optional) - Filter by currency code (e.g., USD, EUR)
- `sort` (optional) - Sort by `gdp_desc` for descending GDP order

**Example:**
```http
GET /countries?region=Africa&sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "region": "Africa",
    "population": 206139589,
    "flag_url": "https://flagcdn.com/ng.svg",
    "capital": "Abuja",
    "exchange_rate": 411.5,
    "estimated_gdp": 501234567.89,
    "currency_code": "NGN",
    "last_refreshed_at": "2024-10-27T10:30:00.000Z"
  }
]
```

---

#### 3. **Get Single Country**
```http
GET /countries/:name
```

**Example:**
```http
GET /countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "region": "Africa",
  "population": 206139589,
  "flag_url": "https://flagcdn.com/ng.svg",
  "capital": "Abuja",
  "exchange_rate": 411.5,
  "estimated_gdp": 501234567.89,
  "currency_code": "NGN",
  "last_refreshed_at": "2024-10-27T10:30:00.000Z"
}
```

---

#### 4. **Refresh Countries Data**
```http
POST /countries/refresh
```
Fetches latest data from external APIs and updates the database.

**Response:**
```json
[
  {
    "name": "Nigeria",
    "region": "Africa",
    "population": 206139589,
    "flag_url": "https://flagcdn.com/ng.svg",
    "capital": "Abuja",
    "exchange_rate": 411.5,
    "estimated_gdp": 501234567.89,
    "currency_code": "NGN",
    "last_refreshed_at": "2024-10-27T10:30:00.000Z"
  }
]
```

---

#### 5. **Get Summary Image**
```http
GET /countries/image
```
Returns a PNG image with statistics about the top 5 countries by GDP.

**Response:** `image/png`

---

#### 6. **Delete Country**
```http
DELETE /countries/:name
```

**Example:**
```http
DELETE /countries/Nigeria
```