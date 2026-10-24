-- Demo data seeder. Paste into Supabase Dashboard -> SQL Editor -> Run.
-- Safe to re-run. Bypasses RLS because the SQL editor runs as the database owner.
-- To remove demo data later: delete from auth.users where email like '%@demo.nippon2japan.test';

-- 1) Fake auth users (profiles / listings / hubs reference auth.users)
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
select v.id::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v.email, '', now(), now(), now(), '{}'::jsonb, '{}'::jsonb
from (values
  ('00000000-0001-0000-0000-000000000001', 'priya@demo.nippon2japan.test'),
  ('00000000-0002-0000-0000-000000000002', 'rajiv@demo.nippon2japan.test'),
  ('00000000-0003-0000-0000-000000000003', 'yuki@demo.nippon2japan.test'),
  ('00000000-aaaa-0000-0000-000000000001', 'bharat@demo.nippon2japan.test'),
  ('00000000-aaaa-0000-0000-000000000002', 'medequip@demo.nippon2japan.test'),
  ('00000000-aaaa-0000-0000-000000000003', 'autoparts@demo.nippon2japan.test'),
  ('00000000-aaaa-0000-0000-000000000004', 'tata@demo.nippon2japan.test'),
  ('00000000-aaaa-0000-0000-000000000005', 'greenko@demo.nippon2japan.test')
) as v(id, email)
on conflict (id) do nothing;

-- 2) Experts (CA / CS / tutor) -> shown in Advisors and Tutors directories
insert into public.profiles (id, account_type, expert_type, full_name, company_name, city, state, bio, rate_inr) values
 ('00000000-0001-0000-0000-000000000001','expert','ca','Priya Sharma','Sharma & Associates','Mumbai','Maharashtra','ICAI-certified CA, 12 years in FDI compliance, GST advisory and transfer pricing for Japanese corporates entering India.',3500),
 ('00000000-0002-0000-0000-000000000002','expert','cs','Rajiv Menon','Menon Corporate Services','Bengaluru','Karnataka','Company Secretary: WOS incorporation, RBI/FEMA compliance, India-Japan JV structuring.',4000),
 ('00000000-0003-0000-0000-000000000003','expert','japanese_tutor','Yuki Tanaka','Nihongo Bridge','Delhi','Delhi','Trilingual Japanese-English-Hindi trainer, 8 years of business Japanese for Indian executives.',2500)
on conflict (id) do update set account_type=excluded.account_type, expert_type=excluded.expert_type, full_name=excluded.full_name,
  company_name=excluded.company_name, city=excluded.city, state=excluded.state, bio=excluded.bio, rate_inr=excluded.rate_inr;

-- 3) Distributor and JV hub profiles
insert into public.hub_profiles (id, owner_id, hub, name, industry, city, state, country, service_areas, categories, capabilities, customers, technologies, bio, offers, seeking, goals, qualifications) values
 ('00000000-a001-0000-0000-000000000001','00000000-aaaa-0000-0000-000000000001','distribution','Bharat Electronics Distribution Co.','Electronics & IT','Pune','Maharashtra','India',array['Maharashtra','Goa','Gujarat'],array['Electronics','Networking & IT'],array['Warehousing','Dealer network','Import support'],array['Retailers','Enterprises'],array[]::text[],'Pan-western India distributor with 200+ dealer touchpoints and bonded warehouses in Pune MIDC.','','','',''),
 ('00000000-a002-0000-0000-000000000002','00000000-aaaa-0000-0000-000000000002','distribution','MedEquip South India','Healthcare','Chennai','Tamil Nadu','India',array['Tamil Nadu','Andhra Pradesh','Karnataka','Telangana'],array['Medical imaging'],array['After-sales service','Import support'],array['Hospitals'],array[]::text[],'Medical equipment distributor with CDSCO import licences covering 800+ hospitals in South India.','','','',''),
 ('00000000-a003-0000-0000-000000000003','00000000-aaaa-0000-0000-000000000003','distribution','AutoParts North Hub','Automotive','Delhi','Delhi','India',array['Delhi','Uttar Pradesh','Haryana','Rajasthan','Punjab'],array['Automotive components','Motors & drives'],array['Warehousing','Dealer network'],array['Manufacturers'],array[]::text[],'North India Japanese auto-component distributor supplying Tier-1 OEMs.','','','',''),
 ('00000000-b001-0000-0000-000000000001','00000000-aaaa-0000-0000-000000000004','jv','Tata Advanced Systems Ltd.','Industrial Manufacturing','Bengaluru','Karnataka','India',array['Nationwide'],array[]::text[],array[]::text[],array[]::text[],array['Precision engineering','Aerospace'],'Defence and aerospace division seeking Japanese precision-engineering partners.','Co-development under Make in India','Japanese precision-engineering partners','Defence & aerospace joint development',''),
 ('00000000-b002-0000-0000-000000000002','00000000-aaaa-0000-0000-000000000005','jv','Greenko Energy Ventures','Energy','Hyderabad','Telangana','India',array['Nationwide'],array[]::text[],array[]::text[],array[]::text[],array['Hydrogen fuel-cells','Energy storage','Solar'],'Renewable energy developer open to JVs on hydrogen, storage and solar manufacturing.','Manufacturing JV, technology transfer','Japanese technology partners for hydrogen & solar','Clean energy joint ventures','')
on conflict (id) do update set name=excluded.name, bio=excluded.bio, service_areas=excluded.service_areas, categories=excluded.categories, capabilities=excluded.capabilities;

-- 4) Registered providers with AI scores (shows the assessment feature)
insert into public.provider_listings (id, user_id, section, full_name, organization, specialization, experience_years, industry, city, state, email, phone, bio, score, assessed_at, assessment) values
 ('00000000-c001-0000-0000-000000000001','00000000-0001-0000-0000-000000000001','advisors','Priya Sharma','Sharma & Associates','Chartered Accountant',12,'Finance & Compliance','Mumbai','Maharashtra','priya@demo.nippon2japan.test','+91 98200 11111','Senior CA specialising in Japan-India cross-border tax, DTAA applications and FEMA compliance.',8.2,now(),'{"summary":"Strong ICAI credentials with Japan-specific engagements.","strengths":["12 years FDI advisory","Active DTAA engagements"],"gaps":["Limited WOS case studies"],"resume_considered":false}'::jsonb),
 ('00000000-c002-0000-0000-000000000002','00000000-aaaa-0000-0000-000000000005','joint-ventures','Greenko Energy Ventures','Greenko','Energy JV partner',15,'Energy','Hyderabad','Telangana','greenko@demo.nippon2japan.test','+91 98480 22222','Renewable developer seeking Japanese hydrogen and storage technology partners for manufacturing JVs.',7.6,now(),'{"summary":"Credible energy developer with clear JV intent.","strengths":["Large project pipeline","Clear technology needs"],"gaps":["No prior Japanese partnership cited"],"resume_considered":false}'::jsonb),
 ('00000000-c003-0000-0000-000000000003','00000000-aaaa-0000-0000-000000000002','distributors','MedEquip South India','MedEquip','Medical distribution',9,'Healthcare','Chennai','Tamil Nadu','medequip@demo.nippon2japan.test','+91 98400 33333','Exclusive medical equipment distributor with CDSCO import licences across four southern states.',8.8,now(),'{"summary":"Verified import licences and wide hospital reach.","strengths":["CDSCO licensed","800+ hospitals"],"gaps":["Limited northern coverage"],"resume_considered":false}'::jsonb),
 ('00000000-c004-0000-0000-000000000004','00000000-0003-0000-0000-000000000003','tutors','Yuki Tanaka','Nihongo Bridge','Japanese tutor',8,'Education','Delhi','Delhi','yuki@demo.nippon2japan.test','+91 98100 44444','Native trilingual business Japanese trainer for Indian executives and Japanese expatriates.',9.1,now(),'{"summary":"Native fluency and relevant corporate training record.","strengths":["Native Japanese","Corporate training experience"],"gaps":["No JLPT examiner certificate"],"resume_considered":false}'::jsonb)
on conflict (id) do update set score=excluded.score, assessment=excluded.assessment, bio=excluded.bio;
