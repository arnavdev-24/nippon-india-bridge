CREATE OR REPLACE FUNCTION public.guard_hub_slot() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NEW.starts_at <= now() THEN RAISE EXCEPTION 'Choose future availability'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.hub_profiles p WHERE p.id=NEW.tutor_id AND p.hub='tutoring' AND ((NEW.mode='online' AND p.online) OR (NEW.mode='in_person' AND p.in_person))) THEN RAISE EXCEPTION 'Teaching mode is not offered'; END IF;
 IF TG_OP='UPDATE' AND EXISTS(SELECT 1 FROM public.hub_requests r WHERE r.slot_id=OLD.id AND r.status NOT IN ('declined','cancelled')) THEN RAISE EXCEPTION 'Requested slots cannot be changed'; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER guard_hub_slot BEFORE INSERT OR UPDATE ON public.tutor_slots FOR EACH ROW EXECUTE FUNCTION public.guard_hub_slot();
CREATE OR REPLACE FUNCTION public.guard_hub_request() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF TG_OP='INSERT' THEN
 IF length(trim(NEW.subject)) NOT BETWEEN 1 AND 200 OR length(trim(NEW.message)) NOT BETWEEN 1 AND 4000 THEN RAISE EXCEPTION 'Add a valid subject and message'; END IF;
 IF NEW.hub='tutoring' AND NEW.slot_id IS NULL THEN RAISE EXCEPTION 'Select an available tutor slot'; END IF;
 IF NEW.hub<>'tutoring' AND NEW.slot_id IS NOT NULL THEN RAISE EXCEPTION 'Tutor slots are only for training requests'; END IF;
 IF NEW.slot_id IS NOT NULL THEN
 IF NOT EXISTS(SELECT 1 FROM public.tutor_slots s WHERE s.id=NEW.slot_id AND s.tutor_id=NEW.profile_id AND s.starts_at>now()) THEN RAISE EXCEPTION 'Slot is unavailable or in the past'; END IF;
 SELECT s.starts_at,s.mode INTO NEW.meeting_at,NEW.meeting_mode FROM public.tutor_slots s WHERE s.id=NEW.slot_id;
 ELSE NEW.meeting_at:=NULL; NEW.meeting_mode:=NULL; END IF;
 NEW.meeting_location:=NULL;
 RETURN NEW;
 END IF;
 IF NEW.from_user IS DISTINCT FROM OLD.from_user OR NEW.to_user IS DISTINCT FROM OLD.to_user OR NEW.profile_id IS DISTINCT FROM OLD.profile_id OR NEW.hub IS DISTINCT FROM OLD.hub OR NEW.slot_id IS DISTINCT FROM OLD.slot_id OR NEW.details IS DISTINCT FROM OLD.details OR NEW.subject IS DISTINCT FROM OLD.subject OR NEW.message IS DISTINCT FROM OLD.message THEN RAISE EXCEPTION 'Request details cannot be changed'; END IF;
 IF OLD.status IN ('declined','cancelled','completed','partnership_established') THEN RAISE EXCEPTION 'This request is closed'; END IF;
 IF OLD.status='pending' AND NEW.status NOT IN ('pending','accepted','declined','cancelled') THEN RAISE EXCEPTION 'Respond to the request first'; END IF;
 IF OLD.status='pending' AND NEW.status IN ('accepted','declined') AND auth.uid() IS DISTINCT FROM OLD.to_user THEN RAISE EXCEPTION 'Only the recipient can accept or decline'; END IF;
 IF OLD.status='pending' AND (NEW.meeting_at IS DISTINCT FROM OLD.meeting_at OR NEW.meeting_mode IS DISTINCT FROM OLD.meeting_mode OR NEW.meeting_location IS DISTINCT FROM OLD.meeting_location) THEN RAISE EXCEPTION 'Accept the request before arranging a meeting'; END IF;
 IF OLD.status<>'pending' AND NEW.status IN ('pending','declined') THEN RAISE EXCEPTION 'Invalid status transition'; END IF;
 IF NEW.hub='tutoring' AND NEW.status IN ('partnership_established','in_discussion') THEN RAISE EXCEPTION 'Invalid booking status'; END IF;
 IF NEW.hub<>'tutoring' AND NEW.status='completed' THEN RAISE EXCEPTION 'Invalid partnership status'; END IF;
 IF NEW.status='meeting_scheduled' AND (NEW.meeting_at IS NULL OR NEW.meeting_at<=now() OR NEW.meeting_mode IS NULL OR COALESCE(trim(NEW.meeting_location),'')='') THEN RAISE EXCEPTION 'Add a future meeting date, mode and location or link'; END IF;
 RETURN NEW; END $$;