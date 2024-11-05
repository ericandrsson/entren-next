-- Enable RLS for all tables
ALTER TABLE "public"."place_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."places" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entrances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entrance_photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entity_changes_staging" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entity_changes_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entity_overrides" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."osm_tag_to_place_category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entrance_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entity_json_schemas" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for place_categories table
CREATE POLICY "Allow read access for all users" ON "public"."place_categories"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."place_categories"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."place_categories"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for places table
CREATE POLICY "Allow read access for all users" ON "public"."places"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."places"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."places"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entrances table
CREATE POLICY "Allow read access for all users" ON "public"."entrances"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entrances"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."entrances"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entrance_photos table
CREATE POLICY "Allow read access for all users" ON "public"."entrance_photos"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entrance_photos"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."entrance_photos"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entity_changes_staging table
CREATE POLICY "Allow read access for authenticated users" ON "public"."entity_changes_staging"
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entity_changes_staging"
FOR INSERT TO authenticated
WITH CHECK ((auth.uid() = (change_data->>'submitted_by')::uuid) OR (auth.role() = 'admin'));

CREATE POLICY "Allow update for authenticated users" ON "public"."entity_changes_staging"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entity_changes_events table
CREATE POLICY "Allow read access for authenticated users" ON "public"."entity_changes_events"
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entity_changes_events"
FOR INSERT TO authenticated
WITH CHECK (true);

-- RLS Policies for entity_overrides table
CREATE POLICY "Allow read access for authenticated users" ON "public"."entity_overrides"
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entity_overrides"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."entity_overrides"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for osm_tag_to_place_category table
CREATE POLICY "Allow read access for all users" ON "public"."osm_tag_to_place_category"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."osm_tag_to_place_category"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."osm_tag_to_place_category"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entrance_types table
CREATE POLICY "Allow read access for all users" ON "public"."entrance_types"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entrance_types"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."entrance_types"
FOR UPDATE TO authenticated
USING (true);

-- RLS Policies for entity_json_schemas table
CREATE POLICY "Allow read access for all users" ON "public"."entity_json_schemas"
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for authenticated users" ON "public"."entity_json_schemas"
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON "public"."entity_json_schemas"
FOR UPDATE TO authenticated
USING (true);


