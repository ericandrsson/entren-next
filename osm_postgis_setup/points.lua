local tables = {}

-- Keep only the POIs table
tables.pois = osm2pgsql.define_table({
    name = 'sweden_osm_poi',
    ids = { type = 'node', id_column = 'osm_id' },
    columns = {
        { column = 'name', type = 'text' },
        { column = 'tags', type = 'hstore' },
        { column = 'geom', type = 'point', projection = 4326 },
    }
})

-- Process only nodes, as POIs are typically represented as nodes in OSM
function osm2pgsql.process_node(object)
    -- Check if the node has any tags that make it a POI
    if next(object.tags) then
        tables.pois:insert({
            name = object.tags.name,
            tags = object.tags,
            geom = object:as_point()
        })
    end
end

-- Disable processing of ways and relations
function osm2pgsql.process_way(object) end
function osm2pgsql.process_relation(object) end