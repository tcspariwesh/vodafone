# Apollo + GraphQL + React + PostgreSQL CRUD Orders App

A full-stack GraphQL project for managing **orders** with:
- **Backend:** Node.js, Express, Apollo Server, GraphQL, PostgreSQL
- **Frontend:** React, Apollo Client
- **Containerization:** Docker Compose

## Features
- Create order
- Read all orders
- Read single order
- Update order
- Delete order
- PostgreSQL persistence
- Dockerized development and production-style setup
- React UI with Apollo Client

## Project Structure
```text
order-graphql-app/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Run with Docker Compose

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:8080
- GraphQL API: http://localhost:4000/graphql
- PostgreSQL: localhost:5432

## Run Backend locally

```bash
cd backend
npm install
npm start
```

Set environment variables using `backend/.env.example`.

## Run Frontend locally

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/graphql` to `http://localhost:4000/graphql`.

## Sample GraphQL Operations

### Query all orders
```graphql
query Orders {
  orders {
    id
    customerName
    customerEmail
    productName
    quantity
    totalAmount
    status
    createdAt
    updatedAt
  }
}
```

### Create order
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    customerName
    productName
    status
  }
}
```

### Update order
```graphql
mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
  updateOrder(id: $id, input: $input) {
    id
    customerName
    status
  }
}
```

### Delete order
```graphql
mutation DeleteOrder($id: ID!) {
  deleteOrder(id: $id)
}
```
