-- Row-level security for Gradmire.
--
-- IMPORTANT: the Next.js app connects through Drizzle as the Postgres owner,
-- which BYPASSES these policies. Authorization for app queries is enforced in
-- application code — requireStaff() for /admin, and the portal filtering
-- applications by the signed-in user's email.
--
-- These policies are defence in depth: they protect the tables from anything
-- reaching them through the Supabase anon/authenticated API keys (the client
-- SDK, the auto-generated REST endpoint, or a leaked anon key).
--
-- Apply once, after the initial migration:
--   psql "$DIRECT_URL" -f drizzle/rls.sql

alter table destinations             enable row level security;
alter table course_hubs              enable row level security;
alter table universities             enable row level security;
alter table deadlines                enable row level security;
alter table applicants               enable row level security;
alter table applications             enable row level security;
alter table application_events       enable row level security;
alter table leads                    enable row level security;
alter table newsletter_subscribers   enable row level security;
alter table staff                    enable row level security;

-- ---------------------------------------------------------------
-- Published content is world-readable; only the server writes it.
-- ---------------------------------------------------------------
create policy "content is public" on destinations
  for select using (status = 'live');

create policy "live hubs are public" on course_hubs
  for select using (status = 'live');

create policy "universities follow their hub" on universities
  for select using (
    exists (select 1 from course_hubs ch
            where ch.id = universities.course_hub_id and ch.status = 'live')
  );

create policy "deadlines follow their hub" on deadlines
  for select using (
    exists (select 1 from course_hubs ch
            where ch.id = deadlines.course_hub_id and ch.status = 'live')
  );

-- ---------------------------------------------------------------
-- An applicant may read only their own record and applications.
-- Nobody may write through the API; the server owns all writes.
-- ---------------------------------------------------------------
create policy "applicants read self" on applicants
  for select using (auth_user_id = auth.uid());

create policy "applications readable by owner" on applications
  for select using (
    exists (select 1 from applicants a
            where a.id = applications.applicant_id and a.auth_user_id = auth.uid())
  );

create policy "events readable by owner" on application_events
  for select using (
    exists (
      select 1 from applications app
      join applicants a on a.id = app.applicant_id
      where app.id = application_events.application_id and a.auth_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------
-- Leads, subscribers and staff are never readable through the API.
-- No select policy is defined, so RLS denies by default.
-- ---------------------------------------------------------------
