import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { CREATE_ORDER, DELETE_ORDER, GET_ORDERS, UPDATE_ORDER } from './queries';

export default function App() {
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  const [editingOrder, setEditingOrder] = useState(null);
  const [message, setMessage] = useState('');

  const orders = useMemo(() => data?.orders ?? [], [data]);

  const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
    awaitRefetchQueries: true,
  });

  const [updateOrder, { loading: updating }] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
    awaitRefetchQueries: true,
  });

  const [deleteOrder, { loading: deleting }] = useMutation(DELETE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
    awaitRefetchQueries: true,
  });

  const submitting = creating || updating;

  const showMessage = (text) => {
    setMessage(text);
    window.clearTimeout(window.__messageTimer);
    window.__messageTimer = window.setTimeout(() => setMessage(''), 2500);
  };

  const handleSubmit = async (input) => {
    try {
      if (editingOrder) {
        await updateOrder({
          variables: {
            id: editingOrder.id,
            input,
          },
        });
        setEditingOrder(null);
        showMessage(`Order #${editingOrder.id} updated`);
      } else {
        await createOrder({
          variables: {
            input,
          },
        });
        showMessage('Order created');
      }
    } catch (err) {
      console.error(err);
      showMessage('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Delete order #${id}?`);
    if (!confirmed) return;

    try {
      await deleteOrder({ variables: { id } });
      if (editingOrder?.id === id) setEditingOrder(null);
      showMessage(`Order #${id} deleted`);
    } catch (err) {
      console.error(err);
      showMessage('Delete failed');
    }
  };

  return (
    <div className="app-shell">
      <header className="hero card">
        <div>
          <p className="eyebrow">Apollo • GraphQL • React • PostgreSQL</p>
          <h1>Orders CRUD Dashboard</h1>
          <p className="lead">
            Create, view, edit, and delete order records through a GraphQL API backed by PostgreSQL.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => refetch()}>
          Refresh Data
        </button>
      </header>

      {message && <div className="toast">{message}</div>}

      <OrderForm
        initialOrder={editingOrder}
        onSubmit={handleSubmit}
        onCancel={() => setEditingOrder(null)}
        submitting={submitting}
      />

      {loading && <div className="card">Loading orders...</div>}
      {error && <div className="card error">Failed to load orders: {error.message}</div>}

      <OrderList
        orders={orders}
        onEdit={(order) => setEditingOrder(order)}
        onDelete={handleDelete}
        deletingId={deleting ? 'pending' : null}
      />
    </div>
  );
}
