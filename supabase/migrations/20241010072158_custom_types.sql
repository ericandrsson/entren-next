-- Custom types
CREATE TYPE "public"."entity_type" AS ENUM ('place', 'entrance', 'photo');
CREATE TYPE "public"."entity_data_source" AS ENUM ('osm', 'user', 'external');
CREATE TYPE "public"."entity_changes_staging_status" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE "public"."entity_changes_action_type" AS ENUM ('add', 'update', 'delete', 'approve', 'reject');
