# Real-Time Order Management System

A web application for managing customers, products, and orders with real-time updates using WebSockets and PostgreSQL.

## Features

- 🚀 Real-time order processing with WebSocket integration
- 👨💻 Admin dashboard for order approval/rejection
- 📦 Product inventory management with stock adjustments
- 👥 Customer management with priority scoring
- 📊 Order tracking and history
- 🔐 JWT-based authentication
- 📝 Activity logging system
- 📱 Responsive UI with modern components
- 🔄 PostgreSQL database integration

## Technologies

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Real-Time**: WebSockets, PostgreSQL LISTEN/NOTIFY
- **Authentication**: JWT, bcrypt
- **UI Components**: Shadcn/ui

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmadalhomsi/your-repo.git
   cd your-repo

2. Install dependencies:
   ```bash
   npm install
3. Set up PostgreSQL database and create the following tables:
    ```bash
    CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

    CREATE TABLE Customers (
    customerID SERIAL PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    customerType VARCHAR(50) CHECK (customerType IN ('Premium', 'Regular')),
    budget DECIMAL(10,2),
    totalSpent DECIMAL(10,2) DEFAULT 0,
    lastOrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Products (
    productID SERIAL PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    stock INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE Orders (
    orderID SERIAL PRIMARY KEY,
    customerID INT REFERENCES Customers(customerID),
    productID INT REFERENCES Products(productID),
    quantity INT NOT NULL,
    totalprice DECIMAL(10,2) NOT NULL,
    orderstatus VARCHAR(50) DEFAULT 'Pending',
    orderdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

## Configuration

1. Create .env file:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
    JWT_SECRET="your-secret-key"

2. Environment variables:

* DATABASE_URL: PostgreSQL connection string
* JWT_SECRET: Secret key for JWT tokens

## Running the Application

1. Start the Next.js development server:
    ```
    npm run dev
2. Access the application at http://localhost:3000

## Project Structure

        ├── app/               # Next.js application routes
    │   ├── admin/         # Admin dashboard
    │   ├── api/           # API endpoints
    │   ├── components/    # Reusable components
    │   └── ...            # Other application pages
    ├── lib/               # Database and utility functions
    ├── hooks/             # Custom React hooks
    ├── public/            # Static assets
    └── components/        # UI components library

Key API Endpoints  
Endpoint	Method	Description  
/api/auth/signin	POST	User authentication  
/api/auth/signup	POST	User registration  
/api/customers	GET	Get all customers  
/api/orders	POST	Create new order  
/api/orders/process	POST	Process order status  
/api/products	GET	Get all products  

