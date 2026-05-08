const pool = require('./db');

const mapOrder = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  productName: row.product_name,
  quantity: row.quantity,
  totalAmount: Number(row.total_amount),
  status: row.status,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

const resolvers = {
  Query: {
    health: () => 'ok',

    orders: async () => {
      const { rows } = await pool.query(
        'SELECT * FROM orders ORDER BY created_at DESC, id DESC'
      );
      return rows.map(mapOrder);
    },

    order: async (_, { id }) => {
      const { rows } = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );
      return rows[0] ? mapOrder(rows[0]) : null;
    },
  },

  Mutation: {
    createOrder: async (_, { input }) => {
      const {
        customerName,
        customerEmail,
        productName,
        quantity,
        totalAmount,
        status = 'PENDING',
      } = input;

      const { rows } = await pool.query(
        `INSERT INTO orders (
          customer_name,
          customer_email,
          product_name,
          quantity,
          total_amount,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [customerName, customerEmail, productName, quantity, totalAmount, status]
      );

      return mapOrder(rows[0]);
    },

    updateOrder: async (_, { id, input }) => {
      const existing = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );

      if (!existing.rows[0]) {
        throw new Error(`Order with id ${id} not found`);
      }

      const current = existing.rows[0];

      const next = {
        customerName: input.customerName ?? current.customer_name,
        customerEmail: input.customerEmail ?? current.customer_email,
        productName: input.productName ?? current.product_name,
        quantity: input.quantity ?? current.quantity,
        totalAmount: input.totalAmount ?? current.total_amount,
        status: input.status ?? current.status,
      };

      const { rows } = await pool.query(
        `UPDATE orders
         SET customer_name = $1,
             customer_email = $2,
             product_name = $3,
             quantity = $4,
             total_amount = $5,
             status = $6,
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          next.customerName,
          next.customerEmail,
          next.productName,
          next.quantity,
          next.totalAmount,
          next.status,
          id,
        ]
      );

      return mapOrder(rows[0]);
    },

    deleteOrder: async (_, { id }) => {
      const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
      return result.rowCount > 0;
    },
  },
};

module.exports = resolvers;
