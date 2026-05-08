CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO orders (customer_name, customer_email, product_name, quantity, total_amount, status)
VALUES
  ('Aarav Sharma', 'aarav@example.com', 'Wireless Mouse', 2, 799.00, 'PENDING'),
  ('Neha Patel', 'neha@example.com', 'Mechanical Keyboard', 1, 3499.00, 'PROCESSING'),
  ('Rohan Verma', 'rohan@example.com', 'USB-C Hub', 3, 1797.00, 'SHIPPED')
ON CONFLICT DO NOTHING;
