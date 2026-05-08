const typeDefs = `#graphql
  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELED
  }

  type Order {
    id: ID!
    customerName: String!
    customerEmail: String!
    productName: String!
    quantity: Int!
    totalAmount: Float!
    status: OrderStatus!
    createdAt: String!
    updatedAt: String!
  }

  input CreateOrderInput {
    customerName: String!
    customerEmail: String!
    productName: String!
    quantity: Int!
    totalAmount: Float!
    status: OrderStatus = PENDING
  }

  input UpdateOrderInput {
    customerName: String
    customerEmail: String
    productName: String
    quantity: Int
    totalAmount: Float
    status: OrderStatus
  }

  type Query {
    health: String!
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
