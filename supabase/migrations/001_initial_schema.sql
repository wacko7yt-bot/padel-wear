-- ============================================
-- PADELWEAR — ESQUEMA DE BASE DE DATOS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLA: profiles (extiende auth.users)
-- ============================================
create table public.profiles (
  id        uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role      text default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  phone     text,
  created_at timestamptz default now()
);

-- Trigger: crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TABLA: products
-- ============================================
create table public.products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text unique not null,
  description         text,
  price               numeric(10,2) not null,
  images              text[] default '{}',
  category            text default 'camiseta',
  stripe_product_id   text,
  stripe_price_id     text,
  is_active           boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ============================================
-- TABLA: product_variants (talla + stock)
-- ============================================
create table public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  size       text not null check (size in ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  stock      int not null default 0 check (stock >= 0),
  sku        text unique,
  created_at timestamptz default now()
);

-- ============================================
-- TABLA: orders
-- ============================================
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  stripe_session_id text unique,
  status            text default 'pending'
                    check (status in ('pending','paid','shipped','delivered','cancelled')),
  total             numeric(10,2),
  shipping_address  jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ============================================
-- TABLA: order_items
-- ============================================
create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid references public.orders(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete restrict not null,
  quantity   int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

-- ============================================
-- FUNCIÓN: decrementar stock
-- ============================================
create or replace function public.decrement_stock(p_variant_id uuid, p_quantity int)
returns void as $$
begin
  update public.product_variants
  set stock = stock - p_quantity
  where id = p_variant_id and stock >= p_quantity;

  if not found then
    raise exception 'Stock insuficiente para la variante %', p_variant_id;
  end if;
end;
$$ language plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Products: lectura pública, escritura solo admin
alter table public.products enable row level security;
create policy "Productos visibles públicamente" on public.products
  for select using (is_active = true);
create policy "Admin gestiona productos" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Variants: lectura pública
alter table public.product_variants enable row level security;
create policy "Variantes visibles públicamente" on public.product_variants
  for select using (true);
create policy "Admin gestiona variantes" on public.product_variants
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Orders: solo el propietario o admin
alter table public.orders enable row level security;
create policy "Usuario ve sus pedidos" on public.orders
  for select using (auth.uid() = user_id);
create policy "Webhook inserta pedidos" on public.orders
  for insert with check (true);
create policy "Admin ve todos los pedidos" on public.orders
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Order items
alter table public.order_items enable row level security;
create policy "Usuario ve sus items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );
create policy "Webhook inserta items" on public.order_items
  for insert with check (true);

-- Profiles
alter table public.profiles enable row level security;
create policy "Perfil propio" on public.profiles
  for all using (auth.uid() = id);
create policy "Admin ve todos los perfiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- DATOS DE EJEMPLO (seed)
-- ============================================
insert into public.products (name, slug, description, price, images, category) values
('Camiseta Pro Court', 'camiseta-pro-court', 'Camiseta técnica de alto rendimiento para pádel, tejido transpirable DryFit.', 39.99, ARRAY['https://placehold.co/600x800/111/fff?text=Pro+Court'], 'camiseta'),
('Camiseta Smash Elite', 'camiseta-smash-elite', 'Diseño moderno con tecnología anti-olor y protección UV.', 44.99, ARRAY['https://placehold.co/600x800/222/fff?text=Smash+Elite'], 'camiseta'),
('Camiseta Net Master', 'camiseta-net-master', 'Corte slim fit, perfecta para competición y entrenamiento intenso.', 49.99, ARRAY['https://placehold.co/600x800/333/fff?text=Net+Master'], 'camiseta');
