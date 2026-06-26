-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  transaction_date timestamp with time zone default timezone('utc'::text, now()) not null,
  note text,
  account text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.transactions enable row level security;

-- Create policies (Allow anonymous access for now for easy testing, or update to authenticated users if needed)
create policy "Allow anonymous read access"
  on public.transactions for select
  using ( true );

create policy "Allow anonymous insert access"
  on public.transactions for insert
  with check ( true );

create policy "Allow anonymous update access"
  on public.transactions for update
  using ( true );

create policy "Allow anonymous delete access"
  on public.transactions for delete
  using ( true );

-- Insert some dummy data
insert into public.transactions (title, amount, type, category, note, account, transaction_date)
values
  ('Mua cổ phiếu FPT', 1000000, 'income', 'Tài khoản chứng khoán', '', 'Tài khoản chứng khoán', now() - interval '2 hours'),
  ('Nạp tiền chứng khoán', 800000, 'expense', 'Tài khoản chứng khoán', '', 'Tài khoản chứng khoán', now() - interval '5 hours'),
  ('Siêu thị Co.opmart', 120000, 'expense', 'Chi tiêu sinh hoạt', 'Mua đồ chuẩn bị nấu cơm', 'Techcombank', now() - interval '1 day');
