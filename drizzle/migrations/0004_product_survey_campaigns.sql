CREATE TABLE public.survey_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_name_en text NOT NULL,
  product_name_jp text NOT NULL DEFAULT '',
  industry text NOT NULL,
  description text NOT NULL DEFAULT '',
  photo_path text,
  target_price_jpy integer,
  mrp_inr integer,
  target_states text[] NOT NULL DEFAULT '{}',
  dealer_types text[] NOT NULL DEFAULT '{}',
  target_responses integer NOT NULL DEFAULT 10 CHECK (target_responses BETWEEN 1 AND 1000),
  deadline date,
  bis_status text NOT NULL DEFAULT 'not_started',
  custom_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','quoted','accepted','fieldwork_live','data_review','report_ready','delivered')),
  public_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  quote_price_inr integer,
  quote_timeline_days integer,
  quote_note text,
  vendor_commentary text NOT NULL DEFAULT '',
  clarification_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.survey_campaigns TO authenticated;
GRANT ALL ON public.survey_campaigns TO service_role;
ALTER TABLE public.survey_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SME or assigned vendor reads campaign" ON public.survey_campaigns FOR SELECT TO authenticated
  USING (auth.uid() = sme_id OR (auth.uid() = vendor_id AND status <> 'draft'));
CREATE POLICY "SME creates campaign" ON public.survey_campaigns FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sme_id AND status IN ('draft','submitted'));
CREATE POLICY "Participants update campaign" ON public.survey_campaigns FOR UPDATE TO authenticated
  USING (auth.uid() = sme_id OR auth.uid() = vendor_id) WITH CHECK (auth.uid() = sme_id OR auth.uid() = vendor_id);
CREATE POLICY "SME deletes draft" ON public.survey_campaigns FOR DELETE TO authenticated
  USING (auth.uid() = sme_id AND status = 'draft');

CREATE OR REPLACE FUNCTION public.guard_survey_campaign() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  sme_keys text[] := ARRAY['vendor_id','product_name_en','product_name_jp','industry','description','photo_path','target_price_jpy','mrp_inr','target_states','dealer_types','target_responses','deadline','bis_status','custom_questions','status','clarification_note','updated_at'];
  vendor_keys text[] := ARRAY['quote_price_inr','quote_timeline_days','quote_note','vendor_commentary','status','updated_at'];
  content_keys text[] := ARRAY['vendor_id','product_name_en','product_name_jp','industry','description','photo_path','target_price_jpy','mrp_inr','target_states','dealer_types','target_responses','deadline','bis_status','custom_questions'];
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF jsonb_array_length(NEW.custom_questions) > 10 THEN RAISE EXCEPTION 'At most 10 custom questions'; END IF;
    IF NEW.status = 'submitted' AND NEW.vendor_id IS NULL THEN RAISE EXCEPTION 'Choose a vendor before submitting'; END IF;
    NEW.quote_price_inr := NULL; NEW.quote_timeline_days := NULL; NEW.quote_note := NULL; NEW.vendor_commentary := ''; NEW.clarification_note := NULL;
    RETURN NEW;
  END IF;
  NEW.updated_at := now();
  IF uid IS NULL THEN RETURN NEW; END IF;
  IF NEW.id <> OLD.id OR NEW.sme_id <> OLD.sme_id OR NEW.public_token <> OLD.public_token OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Immutable campaign fields';
  END IF;
  IF jsonb_array_length(NEW.custom_questions) > 10 THEN RAISE EXCEPTION 'At most 10 custom questions'; END IF;
  IF uid = OLD.sme_id THEN
    IF (to_jsonb(NEW) - sme_keys) <> (to_jsonb(OLD) - sme_keys) THEN RAISE EXCEPTION 'Not allowed to change vendor fields'; END IF;
    IF OLD.status <> 'draft' AND (to_jsonb(NEW) - (ARRAY(SELECT jsonb_object_keys(to_jsonb(NEW))) ) ) IS NULL THEN NULL; END IF;
    IF OLD.status <> 'draft' AND (SELECT jsonb_object_agg(k, to_jsonb(NEW)->k) FROM unnest(content_keys) k) <> (SELECT jsonb_object_agg(k, to_jsonb(OLD)->k) FROM unnest(content_keys) k) THEN
      RAISE EXCEPTION 'Campaign details are locked after submission';
    END IF;
    IF NEW.status <> OLD.status AND NOT (
      (OLD.status = 'draft' AND NEW.status = 'submitted' AND NEW.vendor_id IS NOT NULL) OR
      (OLD.status = 'quoted' AND NEW.status IN ('accepted','submitted')) OR
      (OLD.status = 'report_ready' AND NEW.status IN ('delivered','data_review'))
    ) THEN RAISE EXCEPTION 'Status change not allowed'; END IF;
    IF NEW.status = 'data_review' AND OLD.status = 'report_ready' AND coalesce(trim(NEW.clarification_note),'') = '' THEN
      RAISE EXCEPTION 'Describe the clarification needed';
    END IF;
  ELSIF uid = OLD.vendor_id THEN
    IF (to_jsonb(NEW) - vendor_keys) <> (to_jsonb(OLD) - vendor_keys) THEN RAISE EXCEPTION 'Not allowed to change campaign details'; END IF;
    IF (NEW.quote_price_inr IS DISTINCT FROM OLD.quote_price_inr OR NEW.quote_timeline_days IS DISTINCT FROM OLD.quote_timeline_days OR NEW.quote_note IS DISTINCT FROM OLD.quote_note)
       AND NOT (OLD.status = 'submitted' AND NEW.status = 'quoted') THEN RAISE EXCEPTION 'Quote can only be sent for new requests'; END IF;
    IF NEW.status = 'quoted' AND (NEW.quote_price_inr IS NULL OR NEW.quote_price_inr < 0 OR NEW.quote_timeline_days IS NULL OR NEW.quote_timeline_days < 1) THEN
      RAISE EXCEPTION 'Quote needs price and timeline';
    END IF;
    IF NEW.vendor_commentary IS DISTINCT FROM OLD.vendor_commentary AND OLD.status NOT IN ('data_review','report_ready') THEN
      RAISE EXCEPTION 'Commentary can be edited during data review';
    END IF;
    IF NEW.status <> OLD.status AND NOT (
      (OLD.status = 'submitted' AND NEW.status = 'quoted') OR
      (OLD.status = 'accepted' AND NEW.status = 'fieldwork_live') OR
      (OLD.status = 'fieldwork_live' AND NEW.status = 'data_review') OR
      (OLD.status = 'data_review' AND NEW.status IN ('report_ready','fieldwork_live'))
    ) THEN RAISE EXCEPTION 'Status change not allowed'; END IF;
  ELSE
    RAISE EXCEPTION 'Not a participant';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER guard_survey_campaign BEFORE INSERT OR UPDATE ON public.survey_campaigns FOR EACH ROW EXECUTE FUNCTION public.guard_survey_campaign();

CREATE TABLE public.campaign_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.survey_campaigns(id) ON DELETE CASCADE,
  dealer_name text NOT NULL CHECK (length(dealer_name) BETWEEN 1 AND 200),
  territory text NOT NULL DEFAULT '',
  gstin text NOT NULL CHECK (gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  price_rating integer CHECK (price_rating BETWEEN 1 AND 5),
  margin text NOT NULL DEFAULT '',
  pilot_volume text NOT NULL DEFAULT '',
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('link','upload','manual')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.campaign_responses(campaign_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_responses TO authenticated;
GRANT ALL ON public.campaign_responses TO service_role;
ALTER TABLE public.campaign_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read responses" ON public.campaign_responses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND (c.vendor_id = auth.uid() OR (c.sme_id = auth.uid() AND c.status IN ('report_ready','delivered')))));
CREATE POLICY "Vendor adds responses" ON public.campaign_responses FOR INSERT TO authenticated
  WITH CHECK (source <> 'link' AND EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND c.vendor_id = auth.uid() AND c.status IN ('fieldwork_live','data_review')));
CREATE POLICY "Vendor edits responses" ON public.campaign_responses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND c.vendor_id = auth.uid() AND c.status IN ('fieldwork_live','data_review')));
CREATE POLICY "Vendor deletes responses" ON public.campaign_responses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND c.vendor_id = auth.uid() AND c.status IN ('fieldwork_live','data_review')));

CREATE TABLE public.campaign_response_contacts (
  response_id uuid PRIMARY KEY REFERENCES public.campaign_responses(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES public.survey_campaigns(id) ON DELETE CASCADE,
  contact_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_response_contacts TO authenticated;
GRANT ALL ON public.campaign_response_contacts TO service_role;
ALTER TABLE public.campaign_response_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendor or delivered SME reads contacts" ON public.campaign_response_contacts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND (c.vendor_id = auth.uid() OR (c.sme_id = auth.uid() AND c.status = 'delivered'))));
CREATE POLICY "Vendor writes contacts" ON public.campaign_response_contacts FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaign_responses r JOIN public.survey_campaigns c ON c.id = r.campaign_id WHERE r.id = response_id AND c.id = campaign_id AND c.vendor_id = auth.uid() AND c.status IN ('fieldwork_live','data_review')));
CREATE POLICY "Vendor updates contacts" ON public.campaign_response_contacts FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND c.vendor_id = auth.uid() AND c.status IN ('fieldwork_live','data_review')));

CREATE TABLE public.campaign_dealer_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.survey_campaigns(id) ON DELETE CASCADE,
  response_id uuid NOT NULL REFERENCES public.campaign_responses(id) ON DELETE CASCADE,
  sme_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('shortlist','sample')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (response_id, kind)
);
GRANT SELECT, INSERT, DELETE ON public.campaign_dealer_actions TO authenticated;
GRANT ALL ON public.campaign_dealer_actions TO service_role;
ALTER TABLE public.campaign_dealer_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read dealer actions" ON public.campaign_dealer_actions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.id = campaign_id AND (c.sme_id = auth.uid() OR c.vendor_id = auth.uid())));
CREATE POLICY "SME records dealer actions" ON public.campaign_dealer_actions FOR INSERT TO authenticated
  WITH CHECK (sme_id = auth.uid() AND EXISTS (SELECT 1 FROM public.survey_campaigns c JOIN public.campaign_responses r ON r.campaign_id = c.id WHERE c.id = campaign_id AND r.id = response_id AND c.sme_id = auth.uid() AND c.status IN ('report_ready','delivered')));
CREATE POLICY "SME removes dealer actions" ON public.campaign_dealer_actions FOR DELETE TO authenticated
  USING (sme_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_public_campaign(_token uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('product_name_en', product_name_en, 'product_name_jp', product_name_jp, 'industry', industry,
    'description', description, 'mrp_inr', mrp_inr, 'deadline', deadline, 'custom_questions', custom_questions, 'open', status = 'fieldwork_live')
  FROM public.survey_campaigns WHERE public_token = _token AND status IN ('fieldwork_live','data_review','report_ready','delivered');
$$;
CREATE OR REPLACE FUNCTION public.submit_public_response(_token uuid, payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.survey_campaigns; rid uuid;
BEGIN
  SELECT * INTO c FROM public.survey_campaigns WHERE public_token = _token;
  IF c.id IS NULL OR c.status <> 'fieldwork_live' THEN RAISE EXCEPTION 'This survey is not accepting responses'; END IF;
  IF (SELECT count(*) FROM public.campaign_responses WHERE campaign_id = c.id) >= c.target_responses * 3 THEN RAISE EXCEPTION 'Response limit reached'; END IF;
  INSERT INTO public.campaign_responses(campaign_id, dealer_name, territory, gstin, price_rating, margin, pilot_volume, answers, source)
  VALUES (c.id, left(trim(payload->>'dealer_name'),200), left(coalesce(payload->>'territory',''),200), upper(trim(payload->>'gstin')),
    NULLIF(payload->>'price_rating','')::int, left(coalesce(payload->>'margin',''),100), left(coalesce(payload->>'pilot_volume',''),200),
    coalesce(payload->'answers','{}'::jsonb), 'link')
  RETURNING id INTO rid;
  INSERT INTO public.campaign_response_contacts(response_id, campaign_id, contact_name, phone, email)
  VALUES (rid, c.id, left(coalesce(payload->>'contact_name',''),200), left(coalesce(payload->>'phone',''),40), left(coalesce(payload->>'email',''),200));
  RETURN rid;
END $$;
REVOKE ALL ON FUNCTION public.get_public_campaign(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_public_response(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_campaign(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_public_response(uuid, jsonb) TO anon, authenticated;

CREATE POLICY "Campaign photo upload by owner" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'campaign-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Campaign photo read by participants" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'campaign-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR EXISTS (SELECT 1 FROM public.survey_campaigns c WHERE c.photo_path = name AND c.vendor_id = auth.uid())));