import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
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
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
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
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;
