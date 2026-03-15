-- Voeg naoufal.exe@gmail.com toe als admin
-- Deze SQL moet worden uitgevoerd in Supabase Dashboard

-- Optie 1: Als de gebruiker al bestaat in auth.users
INSERT INTO public.admins (user_id, email, role)
SELECT 
  id,
  email,
  'admin'::admin_role
FROM auth.users 
WHERE email = 'naoufal.exe@gmail.com'
ON CONFLICT (user_id) DO UPDATE 
SET role = 'admin',
    updated_at = NOW();

-- Optie 2: Handmatig toevoegen (vervang USER_ID met de echte user_id)
-- INSERT INTO public.admins (user_id, email, role)
-- VALUES (
--   'USER_ID_HIER',
--   'naoufal.exe@gmail.com',
--   'admin'
-- )
-- ON CONFLICT (user_id) DO UPDATE 
-- SET role = 'admin',
--     updated_at = NOW();

-- Verifieer dat het gelukt is
SELECT 
  a.user_id,
  a.email, 
  a.role, 
  a.created_at,
  u.email as auth_email
FROM public.admins a
LEFT JOIN auth.users u ON a.user_id = u.id
WHERE a.email = 'naoufal.exe@gmail.com';
