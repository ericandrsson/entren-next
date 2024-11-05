-- Create a unique index on the materialized view
CREATE UNIQUE INDEX idx_places_view_place_id ON public.places_view (place_id);

-- Create indexes for the materialized view
CREATE INDEX idx_places_view_category_id ON public.places_view(category_id);
CREATE INDEX idx_places_view_parent_category_id ON public.places_view(parent_category_id);
CREATE INDEX idx_places_view_source ON public.places_view(source);
CREATE INDEX idx_places_view_is_active ON public.places_view(is_active);
CREATE INDEX idx_places_view_created_at ON public.places_view(created_at);
CREATE INDEX idx_places_view_updated_at ON public.places_view(updated_at);
CREATE INDEX idx_places_view_location ON public.places_view USING GIST(location);
CREATE INDEX idx_places_view_name ON public.places_view(name);
CREATE INDEX idx_places_view_category_name ON public.places_view(category_name);
CREATE INDEX idx_places_view_category_name_sv ON public.places_view(category_name_sv);
CREATE INDEX idx_places_view_parent_category_name ON public.places_view(parent_category_name);
CREATE INDEX idx_places_view_parent_category_name_sv ON public.places_view(parent_category_name_sv);
CREATE INDEX idx_places_view_lat ON public.places_view(lat);
CREATE INDEX idx_places_view_long ON public.places_view(long);

-- Create a composite index for efficient lookups
CREATE INDEX idx_entity_overrides_entity ON public.entity_overrides(entity_type, entity_id);

-- Additional indexes for common query patterns
CREATE INDEX idx_entity_overrides_expiry_date ON public.entity_overrides(expiry_date);
CREATE INDEX idx_entity_overrides_overridden_by ON public.entity_overrides(overridden_by);

-- Indexes for places table
CREATE INDEX idx_places_category_id ON public.places(category_id);
CREATE INDEX idx_places_external_id ON public.places(external_id);
CREATE INDEX idx_places_source ON public.places(source);
CREATE INDEX idx_places_is_active ON public.places(is_active);
CREATE INDEX idx_places_created_by ON public.places(created_by);
CREATE INDEX idx_places_location ON public.places USING GIST(location);

-- Indexes for entrances table
CREATE INDEX idx_entrances_place_id ON public.entrances(place_id);
CREATE INDEX idx_entrances_entrance_type_id ON public.entrances(entrance_type_id);
CREATE INDEX idx_entrances_created_by ON public.entrances(created_by);
CREATE INDEX idx_entrances_location ON public.entrances USING GIST(location);

-- Indexes for entrance_photos table
CREATE INDEX idx_entrance_photos_place_id ON public.entrance_photos(place_id);
CREATE INDEX idx_entrance_photos_entrance_id ON public.entrance_photos(entrance_id);
CREATE INDEX idx_entrance_photos_uploaded_by ON public.entrance_photos(uploaded_by);

-- Indexes for entity_changes_staging table
CREATE INDEX idx_entity_changes_staging_entity_type ON public.entity_changes_staging(entity_type);
CREATE INDEX idx_entity_changes_staging_action_type ON public.entity_changes_staging(action_type);
CREATE INDEX idx_entity_changes_staging_status ON public.entity_changes_staging(status);
CREATE INDEX idx_entity_changes_staging_submitted_by ON public.entity_changes_staging(submitted_by);
CREATE INDEX idx_entity_changes_staging_reviewed_by ON public.entity_changes_staging(reviewed_by);
CREATE INDEX idx_entity_changes_staging_source ON public.entity_changes_staging(source);

-- Indexes for entity_changes_events table
CREATE INDEX idx_entity_changes_events_entity_id ON public.entity_changes_events(entity_id);
CREATE INDEX idx_entity_changes_events_entity_type ON public.entity_changes_events(entity_type);
CREATE INDEX idx_entity_changes_events_action_type ON public.entity_changes_events(action_type);
CREATE INDEX idx_entity_changes_events_user_id ON public.entity_changes_events(user_id);
CREATE INDEX idx_entity_changes_events_event_timestamp ON public.entity_changes_events(event_timestamp);

-- Indexes for osm_tag_to_place_category table
CREATE INDEX idx_osm_tag_to_place_category_tag_key ON public.osm_tag_to_place_category(tag_key);
CREATE INDEX idx_osm_tag_to_place_category_tag_value ON public.osm_tag_to_place_category(tag_value);
CREATE INDEX idx_osm_tag_to_place_category_category_id ON public.osm_tag_to_place_category(category_id);

-- Indexes for entrance_types table
CREATE INDEX idx_entrance_types_is_active ON public.entrance_types(is_active);
