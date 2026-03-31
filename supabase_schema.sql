-- Create Tables for Medicine Inventory system

-- 1. users Table (Extending Supabase Auth if needed, or standalone)
-- Note: Supabase already has auth.users, so you can either manage roles there,
-- or create a public.users profile table. We create a simple profile table here.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. suppliers Table
CREATE TABLE public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. medicines Table
CREATE TABLE public.medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  batch_number TEXT NOT NULL,
  dosage TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  buying_price NUMERIC NOT NULL DEFAULT 0.0,
  selling_price NUMERIC NOT NULL DEFAULT 0.0,
  min_stock NUMERIC NOT NULL DEFAULT 10,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. stock_in Table
CREATE TABLE public.stock_in (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  quantity NUMERIC NOT NULL,
  batch_number TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. stock_out Table
CREATE TABLE public.stock_out (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all tables:
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_in ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_out ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all access (since it's an admin dashboard)
-- Note: In production you should bind these to the authenticated user!
CREATE POLICY "Enable all actions for authenticated users" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all actions for authenticated users" ON public.suppliers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all actions for authenticated users" ON public.medicines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all actions for authenticated users" ON public.stock_in FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all actions for authenticated users" ON public.stock_out FOR ALL USING (auth.role() = 'authenticated');
