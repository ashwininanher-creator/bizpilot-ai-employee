
-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  sku text,
  unit text DEFAULT 'pcs',
  price numeric(12,2) NOT NULL DEFAULT 0,
  cost numeric(12,2) NOT NULL DEFAULT 0,
  stock numeric(12,2) NOT NULL DEFAULT 0,
  min_stock numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own products" ON public.products FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- CUSTOMERS
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own customers" ON public.customers FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- SALES
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_no text NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  paid numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'Cash',
  status text NOT NULL DEFAULT 'Paid',
  notes text,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sales" ON public.sales FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- SALE ITEMS
CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  line_total numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sale_items" ON public.sale_items FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- EXPENSES
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  note text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own expenses" ON public.expenses FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- INVENTORY MOVEMENTS
CREATE TABLE public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change numeric(12,2) NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_movements TO authenticated;
GRANT ALL ON public.inventory_movements TO service_role;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own movements" ON public.inventory_movements FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- updated_at triggers
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sales_updated BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER expenses_updated BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX idx_products_user ON public.products(user_id);
CREATE INDEX idx_customers_user ON public.customers(user_id);
CREATE INDEX idx_sales_user_date ON public.sales(user_id, sale_date DESC);
CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, expense_date DESC);
CREATE INDEX idx_movements_product ON public.inventory_movements(product_id);
