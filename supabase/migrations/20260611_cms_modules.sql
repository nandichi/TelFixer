-- CMS-uitbreiding admin dashboard
-- Tabellen: faq_items, notifications, discount_codes, audit_log
-- Plus: kortingskolommen op orders, notificatie- en audit-triggers.
-- Idempotent opgezet zodat hij veilig opnieuw kan draaien.

-- ============================================================
-- 1. FAQ-items (beheerd in admin, live op /faq)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "FAQ public read active" ON public.faq_items;
CREATE POLICY "FAQ public read active" ON public.faq_items
  FOR SELECT TO public USING (active = true);

DROP POLICY IF EXISTS "FAQ admin read all" ON public.faq_items;
CREATE POLICY "FAQ admin read all" ON public.faq_items
  FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "FAQ admin insert" ON public.faq_items;
CREATE POLICY "FAQ admin insert" ON public.faq_items
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "FAQ admin update" ON public.faq_items;
CREATE POLICY "FAQ admin update" ON public.faq_items
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "FAQ admin delete" ON public.faq_items;
CREATE POLICY "FAQ admin delete" ON public.faq_items
  FOR DELETE TO authenticated USING (is_admin());

-- Standaardinhoud alleen plaatsen wanneer de tabel nog leeg is.
INSERT INTO public.faq_items (category, question, answer, sort_order, active)
SELECT * FROM (VALUES
  ('Refurbished producten', 'Wat betekent refurbished?', 'Refurbished betekent dat een product is gecontroleerd, gerepareerd indien nodig, en grondig schoongemaakt. Alle refurbished producten bij TelFixer worden getest en komen met garantie.', 10, true),
  ('Refurbished producten', 'Wat is het verschil tussen de conditie grades?', 'Als nieuw: nauwelijks of geen zichtbare gebruikssporen.
Zeer goed: minimale gebruikssporen, nauwelijks zichtbaar.
Goed: lichte gebruikssporen zichtbaar.
Sterk gebruikt: duidelijke gebruikssporen, maar volledig functioneel.', 20, true),
  ('Refurbished producten', 'Hoeveel garantie krijg ik?', 'Refurbished telefoons: {garantie_telefoons} garantie.
Refurbished laptops: {garantie_laptops} garantie.
Refurbished tablets: {garantie_tablets} garantie.
Reparaties: {garantie_reparaties} garantie.
Accessoires (nieuw): {garantie_accessoires_nieuw} garantie.
Accessoires (gebruikt): {garantie_accessoires_gebruikt} garantie.
Nieuwe apparaten: {garantie_nieuwe_apparaten} garantie.', 30, true),
  ('Refurbished producten', 'Is de batterij ook getest?', 'Ja, bij telefoons en laptops controleren we de batterijconditie. Telefoons hebben minimaal {batterij_min}% batterijcapaciteit en laptops minder dan {laptop_cycli} laadcycli (tenzij anders vermeld).', 40, true),
  ('Bestellen & Betalen', 'Welke betaalmethodes accepteren jullie?', 'iDEAL
Creditcard (Visa, Mastercard, American Express)
Klarna (achteraf betalen of gespreid)
Bankafschrift (handmatige overboeking)', 50, true),
  ('Bestellen & Betalen', 'Hoe lang duurt de levering?', 'Je bestelling wordt zo snel mogelijk verzonden. Je ontvangt een track & trace code zodra je bestelling is verzonden.', 60, true),
  ('Bestellen & Betalen', 'Zijn er verzendkosten?', 'Verzending kost EUR 6,95. Bij bestellingen vanaf EUR 50 is verzending gratis.', 70, true),
  ('Bestellen & Betalen', 'Kan ik mijn bestelling annuleren?', 'Ja, je kunt je bestelling annuleren zolang deze nog niet is verzonden. Neem contact op met onze klantenservice.', 80, true),
  ('Retourneren', 'Kan ik mijn aankoop retourneren?', 'Ja, je hebt 14 dagen bedenktijd. Het product moet in originele staat zijn en onbeschadigd. De verzendkosten voor het retourneren zijn voor rekening van de klant. Neem contact op voor de retourgegevens.', 90, true),
  ('Retourneren', 'Hoe werkt het retourproces?', 'Neem contact op met onze klantenservice. Je ontvangt de retourgegevens per e-mail. De verzendkosten voor het terugsturen zijn voor rekening van de klant. Na ontvangst en controle wordt het aankoopbedrag binnen 5 werkdagen teruggestort.', 100, true),
  ('Retourneren', 'Wat als mijn product defect is?', 'Bij defecten binnen de garantieperiode repareren of vervangen wij het product gratis. Neem contact op voor een oplossing.', 110, true),
  ('Inleveren & Verkopen', 'Hoe werkt apparaat inleveren?', 'Vul het inleverformulier in met details over je apparaat. Binnen 2 werkdagen ontvang je een prijsaanbod per e-mail en WhatsApp. Bij akkoord ontvang je gratis verzendlabels.', 120, true),
  ('Inleveren & Verkopen', 'Welke apparaten kunnen jullie inkopen?', 'We kopen telefoons, laptops en tablets in van populaire merken zoals Apple, Samsung, Google, Lenovo en meer.', 130, true),
  ('Inleveren & Verkopen', 'Hoe wordt de prijs bepaald?', 'De prijs hangt af van het model, de conditie en de huidige marktwaarde. Je krijgt altijd een eerlijk en transparant aanbod.', 140, true),
  ('Inleveren & Verkopen', 'Hoe word ik uitbetaald?', 'Na ontvangst en goedkeuring van je apparaat wordt het bedrag binnen 3 werkdagen overgemaakt naar je bankrekening.', 150, true)
) AS seed(category, question, answer, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM public.faq_items);

-- ============================================================
-- 2. Notificaties (admin-bel) + auto-trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT,
  body TEXT,
  link TEXT,
  entity_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read
  ON public.notifications(read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications admin read" ON public.notifications;
CREATE POLICY "Notifications admin read" ON public.notifications
  FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Notifications admin update" ON public.notifications;
CREATE POLICY "Notifications admin update" ON public.notifications
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Notifications admin delete" ON public.notifications;
CREATE POLICY "Notifications admin delete" ON public.notifications
  FOR DELETE TO authenticated USING (is_admin());

CREATE OR REPLACE FUNCTION public.create_notification_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  begin
    if TG_TABLE_NAME = 'orders' then
      insert into public.notifications (type, title, body, link, entity_id)
      values ('order', coalesce(NEW.order_number, 'Nieuwe bestelling'),
              coalesce(NEW.customer_name, NEW.customer_email, ''),
              '/admin/bestellingen/' || NEW.id::text, NEW.id);
    elsif TG_TABLE_NAME = 'device_submissions' then
      insert into public.notifications (type, title, body, link, entity_id)
      values ('submission', nullif(trim(coalesce(NEW.device_brand,'') || ' ' || coalesce(NEW.device_model,'')), ''),
              trim(coalesce(NEW.reference_number, '') || ' ' || coalesce(NEW.customer_name, '')),
              '/admin/inleveringen/' || NEW.id::text, NEW.id);
    end if;
  exception when others then
    null;
  end;
  return NEW;
end;
$function$;

DROP TRIGGER IF EXISTS trg_notify_order ON public.orders;
CREATE TRIGGER trg_notify_order
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.create_notification_on_insert();

DROP TRIGGER IF EXISTS trg_notify_submission ON public.device_submissions;
CREATE TRIGGER trg_notify_submission
  AFTER INSERT ON public.device_submissions
  FOR EACH ROW EXECUTE FUNCTION public.create_notification_on_insert();

-- ============================================================
-- 3. Kortingscodes + kolommen op orders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Discounts admin read" ON public.discount_codes;
CREATE POLICY "Discounts admin read" ON public.discount_codes
  FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Discounts admin insert" ON public.discount_codes;
CREATE POLICY "Discounts admin insert" ON public.discount_codes
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Discounts admin update" ON public.discount_codes;
CREATE POLICY "Discounts admin update" ON public.discount_codes
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Discounts admin delete" ON public.discount_codes;
CREATE POLICY "Discounts admin delete" ON public.discount_codes
  FOR DELETE TO authenticated USING (is_admin());

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- ============================================================
-- 4. Audit-log (admin-acties) + triggers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at
  ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_type
  ON public.audit_log(entity_type);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Audit admin read" ON public.audit_log;
CREATE POLICY "Audit admin read" ON public.audit_log
  FOR SELECT TO authenticated USING (is_admin());

CREATE OR REPLACE FUNCTION public.record_audit_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_actor uuid;
  v_email text;
  v_entity_id text;
  v_label text;
begin
  begin
    v_actor := auth.uid();
    if v_actor is not null then
      select email into v_email from public.admins where user_id = v_actor limit 1;
      if v_email is null then
        begin
          select email into v_email from auth.users where id = v_actor limit 1;
        exception when others then v_email := null; end;
      end if;
    end if;

    if TG_OP = 'DELETE' then v_entity_id := OLD.id::text; else v_entity_id := NEW.id::text; end if;

    if TG_TABLE_NAME = 'products' then
      v_label := (case when TG_OP='DELETE' then OLD.name else NEW.name end);
    elsif TG_TABLE_NAME = 'categories' then
      v_label := (case when TG_OP='DELETE' then OLD.name else NEW.name end);
    elsif TG_TABLE_NAME = 'faq_items' then
      v_label := (case when TG_OP='DELETE' then OLD.question else NEW.question end);
    elsif TG_TABLE_NAME = 'discount_codes' then
      v_label := (case when TG_OP='DELETE' then OLD.code else NEW.code end);
    elsif TG_TABLE_NAME = 'admins' then
      v_label := (case when TG_OP='DELETE' then OLD.email else NEW.email end);
    elsif TG_TABLE_NAME = 'site_settings' then
      v_label := (case when TG_OP='DELETE' then OLD.key else NEW.key end);
    else
      v_label := null;
    end if;

    insert into public.audit_log (actor_id, actor_email, action, entity_type, entity_id, summary)
    values (v_actor, coalesce(v_email, 'systeem'), lower(TG_OP), TG_TABLE_NAME, v_entity_id, v_label);
  exception when others then
    null;
  end;
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end;
$function$;

DROP TRIGGER IF EXISTS trg_audit_products ON public.products;
CREATE TRIGGER trg_audit_products
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

DROP TRIGGER IF EXISTS trg_audit_categories ON public.categories;
CREATE TRIGGER trg_audit_categories
  AFTER INSERT OR UPDATE OR DELETE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

DROP TRIGGER IF EXISTS trg_audit_faq ON public.faq_items;
CREATE TRIGGER trg_audit_faq
  AFTER INSERT OR UPDATE OR DELETE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

DROP TRIGGER IF EXISTS trg_audit_discounts ON public.discount_codes;
CREATE TRIGGER trg_audit_discounts
  AFTER INSERT OR UPDATE OR DELETE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

DROP TRIGGER IF EXISTS trg_audit_admins ON public.admins;
CREATE TRIGGER trg_audit_admins
  AFTER INSERT OR UPDATE OR DELETE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

DROP TRIGGER IF EXISTS trg_audit_settings ON public.site_settings;
CREATE TRIGGER trg_audit_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();
