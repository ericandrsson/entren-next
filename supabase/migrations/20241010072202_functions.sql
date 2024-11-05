-- General functions
CREATE OR REPLACE FUNCTION public.check_email_exists(email character varying)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    val VARCHAR;
BEGIN
    SELECT u.email INTO val FROM users u
    WHERE u.email = LOWER($1);  -- Use function argument explicitly to avoid ambiguity

    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.insert_place_staging(
  p_change_data JSONB,
  p_auto_approve BOOLEAN DEFAULT FALSE
) RETURNS BIGINT AS $$
DECLARE
  v_source public.entity_data_source;
  v_staging_id BIGINT;
  v_json_schema JSONB;
  v_is_valid BOOLEAN;
  v_submitted_by UUID;
BEGIN
  -- Extract submitted_by from p_change_data
  v_submitted_by := (p_change_data->>'submitted_by')::UUID;

  -- Ensure submitted_by is provided
  IF v_submitted_by IS NULL THEN
    RAISE EXCEPTION 'submitted_by must be provided in change_data';
  END IF;

  -- Convert source to entity_data_source enum
  v_source := (p_change_data->>'source')::public.entity_data_source;

  -- Check if the provided source is valid
  IF v_source NOT IN ('osm', 'user', 'external') THEN
    RAISE EXCEPTION 'Invalid source value: %. Valid values are: osm, user, external.', v_source;
  END IF;

  -- If source is 'osm', external_id should be provided, otherwise it's NULL
  IF v_source = 'osm' AND (p_change_data->>'external_id') IS NULL THEN
      RAISE EXCEPTION 'External ID must be provided for OSM places.';
  END IF;

  -- Fetch the schema for the place entity type
  SELECT json_schema INTO v_json_schema
  FROM public.entity_json_schemas
  WHERE entity_type = 'place'::"public"."entity_type";

  -- Validate the change_data against the schema
  SELECT extensions.json_matches_schema(v_json_schema::json, p_change_data::json) INTO v_is_valid;

  -- If validation fails, raise an error
  IF NOT v_is_valid THEN
    RAISE EXCEPTION 'Invalid change_data for entity_type place, expected %, got %', v_json_schema, p_change_data;
  END IF;

  -- Insert into entity_changes_staging table for approval without generating place_id
  INSERT INTO public.entity_changes_staging (
    entity_type,
    action_type,
    change_data,
    status,
    source,
    submitted_by
  ) VALUES (
    'place',
    'add',
    p_change_data,
    'pending'::"public"."entity_changes_staging_status",
    v_source,
    v_submitted_by
  ) RETURNING id INTO v_staging_id;

  -- Log this action in the event/audit table
  INSERT INTO public.entity_changes_events (
    entity_id,
    entity_type,
    action_type,
    user_id,
    change_data
  ) VALUES (
    v_staging_id::text,
    'place'::"public"."entity_type",
    'add'::"public"."entity_changes_action_type",
    v_submitted_by,
    p_change_data
  );

  IF p_auto_approve THEN
    PERFORM public.approve_entity(v_staging_id, 'place', v_submitted_by);
  END IF;

  RETURN v_staging_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.insert_place_staging_osm(
  p_osm_id BIGINT,
  p_submitted_by UUID,
  p_auto_approve BOOLEAN DEFAULT FALSE
) RETURNS BIGINT AS $$
DECLARE
  v_osm_id BIGINT;
  v_name TEXT;
  v_tags HSTORE;
  v_category_id BIGINT;
  v_location GEOMETRY(Point, 4326);
  v_staging_id BIGINT;
  v_change_data JSONB;
BEGIN
  -- Fetch the OSM data
  SELECT osm_id, name, tags, geom
  INTO v_osm_id, v_name, v_tags, v_location
  FROM osm_import.osm_poi_places
  WHERE osm_id = p_osm_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'OSM point with ID % not found', p_osm_id;
  END IF;

  v_category_id := public.get_category_id_from_osm_tags(v_tags);

  -- If no category is found, use a default category
  IF v_category_id IS NULL THEN
    SELECT category_id INTO v_category_id
    FROM public.place_categories
    WHERE name = 'Other'
    LIMIT 1;
  END IF;

  -- Checks that the place does not already exist
  IF EXISTS (SELECT 1 FROM public.places WHERE external_id = p_osm_id::TEXT AND source = 'osm') THEN
    RAISE EXCEPTION 'Place with external ID % already exists', p_osm_id;
  END IF;

  -- Prepare change data
  v_change_data := jsonb_build_object(
    'name', v_name,
    'location', jsonb_build_object(
      'coordinates', json_build_object(
        'lat', ST_Y(v_location),
        'long', ST_X(v_location)
      )
    ),
    'category_id', v_category_id,
    'source', 'osm',
    'external_id', p_osm_id::TEXT,
    'submitted_by', p_submitted_by::TEXT
  );

  -- Call the insert_place_staging function
  v_staging_id := public.insert_place_staging(
    p_change_data := v_change_data,
    p_auto_approve := p_auto_approve
  );

  RETURN v_staging_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.insert_entrance_staging(
  p_change_data JSONB,
  p_auto_approve BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
DECLARE
  v_source public.entity_data_source;
  v_json_schema JSONB;
  v_is_valid BOOLEAN;
  v_submitted_by UUID;
  v_staging_id BIGINT;
BEGIN
  -- Extract submitted_by from p_change_data
  v_submitted_by := (p_change_data->>'submitted_by')::UUID;

  -- Ensure submitted_by is provided
  IF v_submitted_by IS NULL THEN
    RAISE EXCEPTION 'submitted_by must be provided in change_data';
  END IF;

  -- Fetch the schema for the entrance entity type
  SELECT json_schema INTO v_json_schema
  FROM public.entity_json_schemas
  WHERE entity_type = 'entrance'::"public"."entity_type";

  -- Validate the change_data against the schema
  SELECT extensions.json_matches_schema(v_json_schema::json, p_change_data::json) INTO v_is_valid;

  -- If validation fails, raise an error
  IF NOT v_is_valid THEN
    RAISE EXCEPTION 'Invalid change_data for entity_type entrance, expected %, got %', v_json_schema, p_change_data;
  END IF;

  -- Determine the source (assuming it's provided in p_change_data, otherwise default to 'user')
  v_source := COALESCE((p_change_data->>'source')::public.entity_data_source, 'user'::public.entity_data_source);

  -- Insert into entity_changes_staging table for approval
  INSERT INTO public.entity_changes_staging (
    entity_type,
    action_type,
    change_data,
    status,
    source,
    submitted_by
  ) VALUES (
    'entrance'::"public"."entity_type",
    'add'::"public"."entity_changes_action_type",
    p_change_data,
    'pending'::"public"."entity_changes_staging_status",
    v_source,
    v_submitted_by
  ) RETURNING id INTO v_staging_id;

  -- Log this action in the event/audit table
  INSERT INTO public.entity_changes_events (
    entity_id,
    entity_type,
    action_type,
    user_id,
    change_data
  ) VALUES (
    v_staging_id::text,
    'entrance'::"public"."entity_type",
    'add'::"public"."entity_changes_action_type",
    v_submitted_by,
    p_change_data

  );

  IF p_auto_approve THEN
    PERFORM public.approve_entity(v_staging_id, 'entrance', v_submitted_by);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.approve_entity(
  p_entity_id BIGINT,
  p_entity_type TEXT,
  p_reviewed_by UUID
) RETURNS VOID AS $$
DECLARE
  v_change_data JSONB;
  v_location GEOMETRY(Point, 4326);
  v_new_place_id BIGINT;
  v_new_entrance_id BIGINT;
  v_submitted_by UUID;
  v_source public.entity_data_source;
  v_entity_type public.entity_type;
BEGIN
  -- Convert p_entity_type to entity_type enum
  v_entity_type := p_entity_type::public.entity_type;

  -- Fetch the pending change data from staging
  SELECT change_data, submitted_by, source INTO v_change_data, v_submitted_by, v_source
  FROM public.entity_changes_staging 
  WHERE id = p_entity_id AND entity_type = v_entity_type AND status = 'pending'::"public"."entity_changes_staging_status";

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending % entity found with ID: %', p_entity_type, p_entity_id;
  END IF;

  IF v_entity_type = 'place'::"public"."entity_type" THEN
    -- Generate a new place ID using the sequence
    v_new_place_id := nextval('places_place_id_seq'::regclass);
    
    -- Create the location point
    v_location := ST_SetSRID(ST_MakePoint(
      (v_change_data->'location'->'coordinates'->>'long')::float,
      (v_change_data->'location'->'coordinates'->>'lat')::float
    ), 4326);

    -- Insert the approved place into the actual places table
    INSERT INTO public.places (
      place_id, external_id, name, location, category_id, source, created_by, is_active, created_at
    ) 
    VALUES (
      v_new_place_id,
      v_change_data->>'external_id',
      v_change_data->>'name',
      v_location,
      (v_change_data->>'category_id')::BIGINT,
      v_source,
      v_submitted_by,
      TRUE,
      NOW()
    );

  ELSIF v_entity_type = 'entrance'::"public"."entity_type" THEN
    v_new_entrance_id := nextval('entrances_entrance_id_seq'::regclass);
    -- Insert the approved entrance into the entrances table
    INSERT INTO public.entrances (
      entrance_id, place_id, entrance_type_id, location, accessibility_info, created_by, created_at
    ) 
    VALUES (
      v_new_entrance_id,
      (v_change_data->>'place_id')::BIGINT,
      (v_change_data->>'entrance_type_id')::INTEGER,
      ST_SetSRID(ST_MakePoint(
        (v_change_data->'location'->'coordinates'->>'long')::float,
        (v_change_data->'location'->'coordinates'->>'lat')::float
      ), 4326),
      (v_change_data->>'accessibility_info')::jsonb,
      v_submitted_by,
      NOW()
    );
  END IF;

  -- Mark the entity as approved in the staging table
  UPDATE public.entity_changes_staging
  SET status = 'approved'::"public"."entity_changes_staging_status", reviewed_by = p_reviewed_by, reviewed_at = NOW(), is_retired = TRUE
  WHERE id = p_entity_id AND entity_type = v_entity_type;

  -- Log this approval action in the event/audit table
  INSERT INTO public.entity_changes_events (
    entity_id,
    entity_type,
    action_type,
    user_id,
    change_data
  ) VALUES (
    CASE 
      WHEN v_entity_type = 'place'::"public"."entity_type" THEN v_new_place_id::text
      WHEN v_entity_type = 'entrance'::"public"."entity_type" THEN v_new_entrance_id::text
      ELSE p_entity_id::text
    END,
    v_entity_type,
    'approve'::"public"."entity_changes_action_type",
    p_reviewed_by,
    v_change_data
  );
  
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION public.get_entrance_type_counts(p_place_id BIGINT)
RETURNS TABLE (entrance_type_id INTEGER, count BIGINT) 
LANGUAGE SQL
AS $$
    SELECT entrance_type_id, COUNT(*) as count
    FROM entrances
    WHERE place_id = p_place_id
    GROUP BY entrance_type_id;
$$;

CREATE OR REPLACE FUNCTION public.get_category_id_from_osm_tags(tags hstore)
RETURNS integer
LANGUAGE plpgsql
STABLE
AS $function$
DECLARE
    cat_id INTEGER;
    other_category_id INTEGER;
    current_key TEXT;
    current_value TEXT;
BEGIN
    -- First, try to find an exact match
    SELECT category_id INTO cat_id
    FROM osm_tag_to_place_category
    WHERE (tag_key, tag_value) IN (SELECT key, value FROM each(tags))
    ORDER BY priority DESC
    LIMIT 1;

    -- If no exact match, try wildcard matches
    IF cat_id IS NULL THEN
        FOR current_key, current_value IN SELECT key, value FROM each(tags)
        LOOP
            -- Try to match the specific key with a wildcard value
            SELECT category_id INTO cat_id
            FROM osm_tag_to_place_category
            WHERE tag_key = current_key AND tag_value = '*'
            ORDER BY priority DESC
            LIMIT 1;

            EXIT WHEN cat_id IS NOT NULL;
        END LOOP;
    END IF;

    -- If a category is found, log it and return
    IF cat_id IS NOT NULL THEN
        RAISE NOTICE 'Category found: %', cat_id;
        RETURN cat_id;
    END IF;

    -- If no category is found, return the 'Other' category
    SELECT category_id INTO other_category_id
    FROM place_categories
    WHERE name = 'Other'
    LIMIT 1;

    IF other_category_id IS NULL THEN
        RAISE EXCEPTION 'Default "Other" category not found';
    END IF;

    RAISE NOTICE 'No specific category found, using "Other" category: %', other_category_id;
    RETURN other_category_id;
END;
$function$;