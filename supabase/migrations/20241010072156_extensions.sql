-- Extensions
CREATE EXTENSION IF NOT EXISTS "hstore" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "postgres_fdw" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema" WITH SCHEMA "extensions";

-- Foreign Data Wrapper setup
CREATE SERVER osm_remote_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '135.181.108.171', dbname 'postgres', port '5433');
CREATE USER MAPPING FOR CURRENT_USER SERVER osm_remote_server OPTIONS (user 'postgres', password 'p4ik5IdbSwQBMaUNBUgashGjZUxBhkN9Autx9R9Yj9VeXNgOIMYzhIuapPKn8ti1');
CREATE SCHEMA IF NOT EXISTS osm_import;

-- Import specific tables
IMPORT FOREIGN SCHEMA public FROM SERVER osm_remote_server INTO osm_import;
