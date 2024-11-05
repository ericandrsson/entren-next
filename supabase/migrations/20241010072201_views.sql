 -- Create view for consolidated places data for frontend and Martin
CREATE MATERIALIZED VIEW public.places_view AS
WITH entrance_details AS (
  -- Aggregate entrance information into a JSON array
  SELECT 
    pe.place_id,
    json_agg(
      json_build_object(
        'entrance_id', pe.entrance_id,
        'location', ST_AsGeoJSON(pe.location)::json,
        'accessibility_info', pe.accessibility_info,
        'created_at', pe.created_at,
        'updated_at', pe.updated_at,
        'images', (
          SELECT json_agg(
            json_build_object(
              'photo_id', pep.photo_id,
              'photo_url', pep.photo_filename,
              'description', pep.description
            )
          )
          FROM public.entrance_photos pep
          WHERE pep.entrance_id = pe.entrance_id
        )
      )
    ) AS entrances
  FROM public.entrances pe
  GROUP BY pe.place_id
),
place_with_overrides AS (
  SELECT 
    p.place_id,
    COALESCE(eo.overridden_fields->>'name', p.name) AS name,
    COALESCE(
      ST_SetSRID(ST_GeomFromGeoJSON((eo.overridden_fields->>'location')::text), 4326),
      p.location
    ) AS location,
    COALESCE((eo.overridden_fields->>'category_id')::BIGINT, p.category_id) AS category_id,
    p.source,
    COALESCE((eo.overridden_fields->>'is_active')::BOOLEAN, p.is_active, TRUE) AS is_active,
    p.created_at,
    p.updated_at,
    p.is_overridden,
    p.overridden_fields
  FROM public.places p
  LEFT JOIN public.entity_overrides eo ON eo.entity_type = 'place'::"public"."entity_type" AND eo.entity_id = p.place_id
  WHERE (eo.expiry_date IS NULL OR eo.expiry_date > NOW()) OR eo.entity_id IS NULL
)
SELECT 
  pwo.place_id,
  pwo.name,
  pwo.location,
  ST_Y(pwo.location::geometry) AS lat,
  ST_X(pwo.location::geometry) AS long,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pwo.category_id
    ELSE NULL
  END AS category_id,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pc.name
    ELSE NULL
  END AS category_name,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pc.name_sv
    ELSE NULL
  END AS category_name_sv,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pc.parent_category_id
    ELSE pwo.category_id
  END AS parent_category_id,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pc2.name
    ELSE pc.name
  END AS parent_category_name,
  CASE
    WHEN pc.parent_category_id IS NOT NULL THEN pc2.name_sv
    ELSE pc.name_sv
  END AS parent_category_name_sv,
  pwo.source,
  pwo.is_active,
  pwo.created_at,
  pwo.updated_at,
  pwo.is_overridden,
  pwo.overridden_fields,
  COALESCE(ed.entrances, '[]'::json) AS entrances -- Get entrance JSON data
FROM place_with_overrides pwo
LEFT JOIN public.place_categories pc ON pwo.category_id = pc.category_id
LEFT JOIN public.place_categories pc2 ON pc.parent_category_id = pc2.category_id
LEFT JOIN entrance_details ed ON pwo.place_id = ed.place_id
WHERE pwo.is_active = true;  -- Only include active places

CREATE OR REPLACE VIEW public.entrances_view AS
WITH verified_entrances AS (
  SELECT 
    se.entrance_id,
    se.place_id,
    se.entrance_type_id,
    et.name AS entrance_type_name,
    et.name_sv AS entrance_type_name_sv,
    et.description AS entrance_type_description,
    et.description_sv AS entrance_type_description_sv,
    se.location,
    se.accessibility_info,
    json_agg(json_build_object(
      'photo_id', pep.photo_id,
      'photo_filename', pep.photo_filename,
      'description', pep.description
    )) FILTER (WHERE pep.photo_id IS NOT NULL) AS photos,
    'approved' AS status,
    se.created_by,
    se.created_at,
    se.updated_at
  FROM public.entrances se
  JOIN public.entrance_types et ON et.id = se.entrance_type_id
  LEFT JOIN public.entrance_photos pep ON pep.entrance_id = se.entrance_id
  GROUP BY se.entrance_id, se.place_id, se.entrance_type_id, et.name, et.name_sv, et.description, et.description_sv, se.location, se.accessibility_info, se.created_by, se.created_at, se.updated_at
),
pending_entrances AS (
  SELECT 
    ecs.id AS entrance_id,
    (ecs.change_data->>'place_id')::bigint AS place_id,
    (ecs.change_data->>'entrance_type_id')::integer AS entrance_type_id,
    et.name AS entrance_type_name,
    et.name_sv AS entrance_type_name_sv,
    et.description AS entrance_type_description,
    et.description_sv AS entrance_type_description_sv,
    ST_SetSRID(ST_MakePoint(
      (ecs.change_data->'location'->>'long')::float,
      (ecs.change_data->'location'->>'lat')::float
    ), 4326) AS location,
    (ecs.change_data->>'accessibility_info')::jsonb AS accessibility_info,
    json_build_array(json_build_object(
      'photo_id', NULL,
      'photo_filename', ecs.change_data->>'photo_filename',
      'description', NULL
    )) AS photos,
    ecs.status::text,
    ecs.submitted_by AS created_by,
    ecs.submitted_at AS created_at,
    ecs.submitted_at AS updated_at
  FROM public.entity_changes_staging ecs
  LEFT JOIN public.entrance_types et ON et.id = (ecs.change_data->>'entrance_type_id')::integer
  WHERE ecs.entity_type = 'entrance'::"public"."entity_type"
)
-- Combine verified and pending entrances
SELECT * FROM verified_entrances
UNION ALL
SELECT * FROM pending_entrances;


CREATE OR REPLACE VIEW public.entity_changes_events_view AS
SELECT 
    ece.id,
    ece.entity_type,
    ece.entity_id,
    ece.action_type,
    ece.change_data,
    ece.user_id,
    u.email AS user_email,
    COALESCE(u.first_name || ' ' || u.last_name, u.email) AS user_name,
    ece.event_timestamp
FROM 
    public.entity_changes_events ece
LEFT JOIN 
    public.users u ON ece.user_id = u.id;

CREATE OR REPLACE VIEW public.entity_changes_staging_view AS
SELECT 
    ecs.id,
    ecs.entity_type,
    ecs.action_type,
    ecs.change_data,
    ecs.status,
    ecs.submitted_by,
    ecs.submitted_at,
    ecs.reviewed_by,
    ecs.reviewed_at,
    ecs.source,
    ecs.is_retired,
    -- Submitter information
    sub.email AS submitted_by_email,
    COALESCE(sub.first_name || ' ' || sub.last_name, sub.email) AS submitted_by_name,
    -- Reviewer information (if exists)
    rev.email AS reviewed_by_email,
    COALESCE(rev.first_name || ' ' || rev.last_name, rev.email) AS reviewed_by_name
FROM 
    public.entity_changes_staging ecs
LEFT JOIN 
    public.users sub ON ecs.submitted_by = sub.id
LEFT JOIN 
    public.users rev ON ecs.reviewed_by = rev.id;
