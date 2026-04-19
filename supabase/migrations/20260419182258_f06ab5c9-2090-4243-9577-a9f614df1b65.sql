drop policy if exists "Anyone can join waitlist" on public.waitlist;

create policy "Anyone can join waitlist with valid input"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 1 and 80
    and char_length(email) between 3 and 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and (city is null or char_length(city) <= 80)
    and (type is null or char_length(type) <= 32)
  );
