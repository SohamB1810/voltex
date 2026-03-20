🛒 Voltex – Full-Stack E-Commerce Platform

Voltex is a modern full-stack e-commerce system built using Next.js for the frontend and Spring Boot for the backend. The platform supports product management, user authentication, order lifecycle handling, payments, and warehouse operations through a modular dashboard.

This project demonstrates real-world enterprise architecture with clear separation between presentation, business logic, and persistence layers.

🚀 Tech Stack
Frontend

Next.js 14 (App Router)

React 18

Tailwind CSS

NextAuth.js (Authentication)

Stripe.js (Payments)

Backend

Spring Boot

Spring Web (REST APIs)

Spring Data JPA

Hibernate ORM

Maven

Database

MySQL / PostgreSQL

## 📁 Project Structure

```text
voltex/
│
├── ecommerce-frontend/                # Next.js frontend application
│   ├── public/                        # Static assets
│   │
│   ├── src/
│   │   ├── app/                       # App Router pages & layouts
│   │   │   ├── layout.js              # Root layout
│   │   │   ├── page.js                # Landing / login page
│   │   │   │
│   │   │   └── dashboard/             # Admin dashboard routes
│   │   │       ├── layout.js
│   │   │       ├── page.js            # Overview dashboard
│   │   │       ├── products/page.js
│   │   │       ├── orders/page.js
│   │   │       ├── cart/page.js
│   │   │       ├── users/page.js
│   │   │       ├── payments/page.js
│   │   │       ├── shipments/page.js
│   │   │       ├── inventory/page.js
│   │   │       └── warehouse/page.js
│   │   │
│   │   └── components/                # Reusable React components
│   │       └── Navbar.js
│   │
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── ecommerce-backend/                 # Spring Boot backend service
│   │
│   ├── src/main/java/
│   │   └── com/voltex/
│   │       ├── controller/            # REST controllers
│   │       ├── service/               # Service interfaces
│   │       ├── service/impl/          # Service implementations
│   │       ├── repository/            # JPA repositories
│   │       ├── entity/                # Database entities
│   │       ├── dto/                   # Request/response DTOs
│   │       └── config/                # Security & configuration
│   │
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/
│   │
│   ├── src/test/java/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
└── README.md
```
🧭 System Architecture
[ Next.js Frontend ]
        │
        │ HTTP / JSON
        ▼
[ Spring Boot REST API ]
        │
        ▼
[ Relational Database ]

This architecture ensures:

independent deployment

scalable backend services

clean separation of concerns

🖥️ Frontend Overview (ecommerce-frontend)

The frontend is built using Next.js App Router, enabling nested layouts, server components, and fast navigation.

Key Features

Responsive admin dashboard

Product and inventory management UI

Order tracking interface

Stripe payment integration

Secure authentication flow

Important Routes
/
└── dashboard/
    ├── products
    ├── orders
    ├── cart
    ├── users
    ├── payments
    ├── shipments
    ├── inventory
    └── warehouse
⚙️ Running the Project Locally
1. Clone the Repository
git clone https://github.com/SohamB1810/voltex.git
cd voltex
🧩 Running the Backend
cd ecommerce-backend
mvn spring-boot:run

Backend runs at:

http://localhost:8080
🎨 Running the Frontend
cd ecommerce-frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000
🔐 Environment Variables
Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
Backend application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/voltex
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
server.port=8080
🔌 API Communication

The frontend communicates with backend endpoints such as:

POST /api/auth/login
GET  /api/products
POST /api/orders
GET  /api/shipments
GET  /api/inventory

All protected routes require:

Authorization: Bearer <JWT_TOKEN>
💳 Payment Integration

Voltex integrates Stripe for secure payment processing:

Frontend uses Stripe Elements

Backend manages payment intents and verification

🏗️ Backend Architecture

The Spring Boot backend follows a layered architecture:

Controller → Service → Repository → Database
Layer Responsibilities
Layer	Description
Controller	Handles HTTP requests
Service	Business logic
Repository	Database access
Entity	Table mappings
DTO	API data transfer
Config	Security & JWT setup
📦 Production Build
Backend
mvn clean package
java -jar target/*.jar
Frontend
npm run build
npm start
🧪 Example User Workflow

Admin creates products 🧾

Customer browses and adds items to cart 🛍️

Customer completes payment via Stripe 💳

Order is created and stored 📦

Shipment is tracked 🚚

Inventory updates automatically 📊

🎯 Project Purpose

This project was developed to demonstrate:

enterprise-grade Spring Boot architecture

modern React and Next.js UI patterns

secure authentication and payment flows

real-world e-commerce domain modeling

It is suitable for:

portfolio presentation

system design discussions

full-stack development demonstrations

👨‍💻 Author

Soham Biswas
GitHub: https://github.com/SohamB1810

📄 License

This project is licensed under the MIT License.

If you’d like, I can also add badges, a system diagram image, or a short project description optimized for LinkedIn and resume use to make this even stronger for job applications.

add badges, a system diagram image

Below is an enhanced README version with:

🏷️ Badges (tech stack, license, build)

🧭 System architecture diagram using Mermaid (renders directly on GitHub)

Clean, professional formatting suitable for portfolio and recruiters

You can replace your current README.md with this.

🛒 Voltex – Full-Stack E-Commerce Platform












Voltex is a full-stack e-commerce platform built with a modern Next.js dashboard frontend and an enterprise-grade Spring Boot backend.
It supports authentication, product management, order lifecycle, payments, shipment tracking, and inventory monitoring in a modular architecture.

🧭 System Architecture

This architecture provides:

clear separation between UI and business logic

scalable backend services

secure payment handling through Stripe

📁 Project Structure
voltex/
│
├── ecommerce-frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   └── dashboard/
│   │   │       ├── layout.js
│   │   │       ├── products/page.js
│   │   │       ├── orders/page.js
│   │   │       ├── cart/page.js
│   │   │       ├── users/page.js
│   │   │       ├── payments/page.js
│   │   │       ├── shipments/page.js
│   │   │       ├── inventory/page.js
│   │   │       └── warehouse/page.js
│   │   └── components/
│   │       └── Navbar.js
│   ├── tailwind.config.js
│   └── package.json
│
├── ecommerce-backend/
│   ├── src/main/java/com/voltex/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── service/impl/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── config/
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── README.md
🚀 Tech Stack
Frontend

Next.js 14

React 18

Tailwind CSS

NextAuth

Stripe.js

Backend

Spring Boot

Spring Data JPA

Hibernate

Maven

Database

MySQL / PostgreSQL

🖥️ Running the Project
Backend
cd ecommerce-backend
mvn spring-boot:run

Runs on:

http://localhost:8080
Frontend
cd ecommerce-frontend
npm install
npm run dev

Runs on:

http://localhost:3000
🔐 Environment Variables
Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
Backend application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/voltex
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
🔌 API Flow
💳 Payment Flow (Stripe)
🎯 Features

Admin dashboard

Product CRUD

Order lifecycle tracking

Shipment monitoring

Inventory management

Secure JWT authentication

Stripe payment integration

📦 Production Build
Backend
mvn clean package
java -jar target/*.jar
Frontend
npm run build
npm start
👨‍💻 Author

Soham Biswas
GitHub: https://github.com/SohamB1810

📄 License

MIT License
