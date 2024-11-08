-- Place categories table
CREATE TABLE "public"."place_categories" (
    "category_id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "name_sv" text NOT NULL,
    "parent_category_id" bigint,
    "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text)
);

-- Example data insertion for place categories
INSERT INTO "public"."place_categories" ("name", "name_sv", "parent_category_id", "created_at", "updated_at") VALUES
    ('Finance', 'Finans', NULL, NOW(), NOW()),
    ('Food & Drink', 'Mat & Dryck', NULL, NOW(), NOW()),
    ('Leisure', 'Fritid', NULL, NOW(), NOW()),
    ('Culture', 'Kultur', NULL, NOW(), NOW()),
    ('Health', 'Hälsa och Vård', NULL, NOW(), NOW()),
    ('Shopping', 'Affär', NULL, NOW(), NOW()),
    ('Education', 'Utbildning', NULL, NOW(), NOW()),
    ('Sport', 'Sport', NULL, NOW(), NOW()),
    ('Accommodation', 'Boende och Hotell', NULL, NOW(), NOW()),
    ('Transport', 'Transport', NULL, NOW(), NOW()),
    ('Authorities', 'Myndigheter och Service', NULL, NOW(), NOW()),
    ('Tourism', 'Turism', NULL, NOW(), NOW()),
    ('Toilets', 'Toaletter', NULL, NOW(), NOW()),
    ('Other', 'Övrigt', NULL, NOW(), NOW());

-- Insert child categories for demonstration
INSERT INTO "public"."place_categories" ("name", "name_sv", "parent_category_id", "created_at", "updated_at") VALUES
    ('ATM', 'Bankomat', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Finance'), NOW(), NOW()),
    ('Bank', 'Bank', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Finance'), NOW(), NOW()),
    ('Bar/Pub', 'Bar/Pub', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Food & Drink'), NOW(), NOW()),
    ('Restaurant', 'Restaurang', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Food & Drink'), NOW(), NOW());

-- Places table
CREATE TABLE "public"."places" (
    "place_id" BIGINT NOT NULL PRIMARY KEY,
    "external_id" TEXT UNIQUE,
    "name" TEXT NOT NULL,
    "location" GEOMETRY(Point, 4326) NOT NULL,
    "category_id" BIGINT REFERENCES public.place_categories(category_id),
    "source" "public"."entity_data_source" NOT NULL,
    "is_active" BOOLEAN DEFAULT false,
    "release_batch" TEXT,
    "created_by" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
    "is_overridden" BOOLEAN DEFAULT FALSE,
    "overridden_fields" JSONB
);

-- Place entrances table
CREATE TABLE "public"."entrances" (
    "entrance_id" BIGINT NOT NULL PRIMARY KEY,
    "place_id" BIGINT NOT NULL REFERENCES public.places(place_id),
    "entrance_type_id" integer NOT NULL,
    "location" geometry,
    "accessibility_info" jsonb,
    "created_by" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Place entrance photos table
CREATE TABLE "public"."entrance_photos" (
    "photo_id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    "place_id" BIGINT REFERENCES public.places(place_id),
    "photo_filename" character varying,
    "description" text,
    "entrance_id" integer REFERENCES public.entrances(entrance_id),
    "uploaded_by" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);

-- Entity changes staging table
CREATE TABLE "public"."entity_changes_staging" (
    "id" serial PRIMARY KEY,
    "entity_type" "public"."entity_type" NOT NULL,
    "action_type" "public"."entity_changes_action_type" NOT NULL,
    "change_data" jsonb NOT NULL,
    "status" "public"."entity_changes_staging_status" NOT NULL DEFAULT 'pending',
    "submitted_by" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "submitted_at" timestamp with time zone NOT NULL DEFAULT now(),
    "reviewed_by" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "reviewed_at" timestamp with time zone,
    "source" "public"."entity_data_source" NOT NULL,
    "is_retired" boolean DEFAULT false
);

-- Entity changes events table
CREATE TABLE "public"."entity_changes_events" (
    "id" serial PRIMARY KEY,
    "entity_id" text NOT NULL,
    "entity_type" "public"."entity_type" NOT NULL,
    "action_type" "public"."entity_changes_action_type" NOT NULL,
    "user_id" uuid REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "event_timestamp" timestamp with time zone DEFAULT now(),
    "change_data" jsonb,
    "comments" text
);

CREATE TABLE "public"."entity_overrides" (
    "override_id" SERIAL PRIMARY KEY,
    "entity_type" "public"."entity_type" NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "overridden_fields" JSONB NOT NULL,
    "override_date" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "expiry_date" TIMESTAMP WITH TIME ZONE,
    "overridden_by" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
    "notes" TEXT
);

-- Place OSM tag to category mapping
CREATE TABLE "public"."osm_tag_to_place_category" (
    "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    "tag_key" text NOT NULL,
    "tag_value" text NOT NULL,
    "category_id" bigint,
    "priority" integer NOT NULL DEFAULT 0,
    "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);

-- Entrance types table
CREATE TABLE "public"."entrance_types" (
    "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "name_sv" text NOT NULL,
    "description" text,
    "description_sv" text,
    "is_active" boolean NOT NULL DEFAULT true,
    "max_per_place" integer DEFAULT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text)
);

CREATE TABLE public.entity_json_schemas (
  entity_type "public"."entity_type" PRIMARY KEY,
  json_schema jsonb NOT NULL
);

-- Insert JSON schemas for entity types
INSERT INTO public.entity_json_schemas (entity_type, json_schema) VALUES
  ('place'::"public"."entity_type", '{
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "location": { 
        "type": "object", 
        "properties": {
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": { "type": "number" },
              "long": { "type": "number" }
            },
            "required": ["lat", "long"]
          }
        },
        "required": ["coordinates"]
      },
      "category_id": { "type": "integer" },
      "source": { "type": "string" },
      "external_id": { "type": "string" },
      "submitted_by": { "type": "string", "format": "uuid" },
      "is_active": { "type": "boolean" },
      "overridden_fields": { "type": "object" }
    },
    "required": ["name", "location", "category_id", "source", "submitted_by"]
  }'::jsonb),

  ('entrance'::"public"."entity_type", '{
    "type": "object",
    "properties": {
      "place_id": { "type": "integer" },
      "entrance_type_id": { "type": "integer" },
      "photo_filename": { "type": "string" },
      "location": { 
        "type": "object", 
        "properties": {
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": { "type": "number" },
              "long": { "type": "number" }
            },
            "required": ["lat", "long"]
          }
        },
        "required": ["coordinates"] 
      },
      "accessibility_info": { "type": "object" },
      "source": { "type": "string" },
      "submitted_by": { "type": "string", "format": "uuid" }
    },
    "required": ["place_id", "entrance_type_id", "location", "source", "submitted_by"]
  }'::jsonb),

  ('photo'::"public"."entity_type", '{
    "type": "object",
    "properties": {
      "photo_filename": { "type": "string" },
      "description": { "type": "string" },
      "place_id": { "type": "integer" },
      "submitted_by": { "type": "string", "format": "uuid" },
      "source": { "type": "string" }
    },
    "required": ["photo_filename", "place_id", "submitted_by", "source"]
  }'::jsonb);
