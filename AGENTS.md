<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Connect hubs
- Keep distributor, company collaboration and tutor listings in shared hub profiles with hub-specific fields; this provides consistent discovery without changing existing compliance profiles.
- Keep hub requests and conversations separate from legacy connections; participant-only RLS and database transition triggers protect private communication and response ownership.
- Tutor slots have a partial unique active-request index; the database, not a filtered browser view, prevents concurrent double booking.
- Qualification verification is protected from owner edits; self-reported qualifications must never become verified through registration.
- Company pitch files use private storage and expiring signed playback URLs; member discovery does not make uploaded media public.
- Product survey campaigns (survey_campaigns + campaign_responses + campaign_response_contacts) are separate from legacy paid surveys; a DB trigger enforces SME/vendor field ownership and the status flow, and contacts live in their own table so RLS can hide them from the SME until delivery.
- Public dealer survey links use security-definer RPCs (get_public_campaign / submit_public_response) keyed by an unguessable token, so anonymous dealers never get table grants.
- Report numbers are computed client-side from saved responses via pure functions in src/lib/campaigns.ts (tested), never stored or hardcoded.
