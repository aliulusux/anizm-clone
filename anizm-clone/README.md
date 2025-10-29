# Anizm Clone (Next.js + AniDB + Supabase)

- No local terminal required. Deploy on Vercel.
- Register an AniDB HTTP API client (`client`, `clientver`) and respect 1 request / 2s.
- Create Supabase tables:

```sql
create table if not exists public.favorites (
  user_id uuid not null,
  aid int not null,
  created_at timestamptz default now(),
  primary key (user_id, aid)
);

create table if not exists public.anidb_index (
  aid int primary key,
  title text not null
);
```
