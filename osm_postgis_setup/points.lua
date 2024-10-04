local tables = {}

tables.poi = osm2pgsql.define_table({
    name = 'planet_osm_point',
    ids = { type = 'node', id_column = 'osm_id' },
    columns = {
        { column = 'name', type = 'text' },
        { column = 'amenity', type = 'text' },
        { column = 'shop', type = 'text' },
        { column = 'tourism', type = 'text' },
        { column = 'geom', type = 'point', projection = 4326 },
    }
})

function osm2pgsql.process_node(object)
    if object.tags.amenity or object.tags.shop or object.tags.tourism then
        tables.poi:insert({
            name = object.tags.name,
            amenity = object.tags.amenity,
            shop = object.tags.shop,
            tourism = object.tags.tourism,
            geom = object:as_point()
        })
    end
end

-- Disable processing of ways and relations
function osm2pgsql.process_way(object) end
function osm2pgsql.process_relation(object) end
