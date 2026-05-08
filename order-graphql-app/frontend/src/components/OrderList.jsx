import React from 'react';

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function OrderList({ orders, onEdit, onDelete, deletingId }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Orders</h2>
        <span className="muted">{orders.length} records</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <div className="stack">
                    <strong>{order.customerName}</strong>
                    <span className="muted">{order.customerEmail}</span>
                  </div>
                </td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>{money(order.totalAmount)}</td>
                <td>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-secondary" onClick={() => onEdit(order)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(order.id)}
                      disabled={deletingId === order.id}
                    >
                      {deletingId === order.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="empty">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
