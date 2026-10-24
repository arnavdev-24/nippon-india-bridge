CREATE TABLE public.expert_profiles (
  expert_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specializations text[] NOT NULL DEFAULT '{}',
  industries text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{English}',
  qualifications text,
  years_experience integer,
  verified boolean NOT NULL DEFAULT false,
  offers_online boolean NOT NULL DEFAULT true,
  offers_in_person boolean NOT NULL DEFAULT false,
  office_address text,
  office_city text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.expert_profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.expert_profiles TO authenticated;
GRANT ALL ON public.expert_profiles TO service_role;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in browse expert profiles" ON public.expert_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Experts manage own profile" ON public.expert_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts update own profile" ON public.expert_profiles FOR UPDATE TO authenticated USING (auth.uid() = expert_id) WITH CHECK (auth.uid() = expert_id);

CREATE TABLE public.expert_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  slots text[] NOT NULL DEFAULT '{}',
  mode text NOT NULL DEFAULT 'both',
  UNIQUE (expert_id, available_date, mode)
);
GRANT SELECT ON public.expert_availability TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.expert_availability TO authenticated;
GRANT ALL ON public.expert_availability TO service_role;
ALTER TABLE public.expert_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in view availability" ON public.expert_availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "Experts add own availability" ON public.expert_availability FOR INSERT TO authenticated WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts update own availability" ON public.expert_availability FOR UPDATE TO authenticated USING (auth.uid() = expert_id) WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts delete own availability" ON public.expert_availability FOR DELETE TO authenticated USING (auth.uid() = expert_id);

CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('TC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  company_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  expert_name text NOT NULL,
  industry text NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  mode text NOT NULL,
  preferred_date date,
  preferred_time text,
  location_notes text,
  company_name text NOT NULL,
  country text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  problem_description text,
  fee_inr integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company or expert view requests" ON public.consultation_requests FOR SELECT TO authenticated USING (auth.uid() = company_id OR auth.uid() = expert_id);
CREATE POLICY "Company creates own request" ON public.consultation_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id AND status = 'pending');
CREATE POLICY "Company updates own request" ON public.consultation_requests FOR UPDATE TO authenticated USING (auth.uid() = company_id) WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Expert responds to requests" ON public.consultation_requests FOR UPDATE TO authenticated USING (auth.uid() = expert_id) WITH CHECK (auth.uid() = expert_id);