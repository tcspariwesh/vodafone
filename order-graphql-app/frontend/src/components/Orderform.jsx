import React, { useEffect, useState } from 'react';

const emptyForm = {
  customerName: '',
  customerEmail: '',
  productName: '',
  quantity: 1,
  totalAmount: '',
  status: 'PENDING',
};

export default function OrderForm({ initialOrder, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialOrder) {
      setForm({
        customerName: initialOrder.customerName,
        customerEmail: initialOrder.customerEmail,
        productName: initialOrder.productName,
        quantity: initialOrder.quantity,
        totalAmount: initialOrder.totalAmount,
        address: initialOrder.address,
        status: initialOrder.status,
        status: initialOrder.status,

      });
    } else {
      setForm(emptyForm);
    }
  }, [initialOrder]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      productName: form.productName.trim(),
      address: form.address.trim(),
      quantity: Number(form.quantity),
      totalAmount: Number(form.totalAmount),
      status: form.status,
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="card-header">
        <h2>{initialOrder ? 'Edit Order' : 'Create Order'}</h2>
        {initialOrder && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel Edit
          </button>
        )}
      </div>

      <div className="grid">
        <label>
          Customer Name
          <input
            value={form.customerName}
            onChange={(e) => updateField('customerName', e.target.value)}
            required
          />
        </label>

        <label>
          Customer Email
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => updateField('customerEmail', e.target.value)}
            required
          />
        </label>

        <label>
          Product Name
          <input
            value={form.productName}
            onChange={(e) => updateField('productName', e.target.value)}
            required
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => updateField('quantity', e.target.value)}
            required
          />
        </label>

        <label>
          Total Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.totalAmount}
            onChange={(e) => updateField('totalAmount', e.target.value)}
            required
          />
        </label>
        <label>
          Address<input value={form.address}
            onChange={(e) => updateField('address', e.target.value)} required
          />
        </label>
        <label>
          Status
          <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialOrder ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}
