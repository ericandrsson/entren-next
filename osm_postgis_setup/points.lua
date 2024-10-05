local tables = {}

tables.poi = osm2pgsql.define_table({
    name = 'planet_osm_point',
    ids = { type = 'node', id_column = 'osm_id' },
    columns = {
        { column = 'name', type = 'text' },
        { column = 'tags', type = 'hstore' },  -- Store all tags here
        { column = 'geom', type = 'point', projection = 4326 },
    }
})

function osm2pgsql.process_node(object)
    if object.tags.name then
        tables.poi:insert({
            name = object.tags.name,
            tags = object.tags,  -- Store all tags
            geom = object:as_point()
        })
    end
end

-- Disable processing of ways and relations
function osm2pgsql.process_way(object) end
function osm2pgsql.process_relation(object) end
