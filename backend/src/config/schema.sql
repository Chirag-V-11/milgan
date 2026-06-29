-- Table schema for database-backed carts

CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_product_size_key UNIQUE (user_id, product_id, size)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated/anonymous requests
-- If you want more restrictive policies, you can adjust this to check auth.uid() = user_id
CREATE POLICY "Allow all operations for cart_items" ON public.cart_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Table schema for customer orders
CREATE TABLE public.orders (
  id text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  pincode text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  items text NOT NULL,
  declared_value numeric NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'Pending Booking'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for orders table
CREATE POLICY "Allow all operations for orders" ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
