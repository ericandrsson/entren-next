local tables = {}

tables.poi = osm2pgsql.define_table({
    name = 'planet_osm_point',
    ids = { type = 'node', id_column = 'osm_id' },
    columns = {
        { column = 'name', type = 'text' },
        { column = 'category', type = 'text' },           -- Specific type (e.g., 'Bakery', 'Bank')
        { column = 'parent_category', type = 'text' },    -- Parent category (e.g., 'Shopping', 'Finance')
        { column = 'extra_info', type = 'hstore' },       -- Changed column type to hstore
        { column = 'geom', type = 'point', projection = 4326 },
    }
})

function determine_category(tags)
    -- ATM
    if tags.amenity == "atm" then
        return {type = "ATM", parent_category = "Finance"}
    end

    -- Bank
    if tags.amenity == "bank" or tags.amenity == "bureau_de_change" then
        return {type = "Bank", parent_category = "Finance"}
    end

    -- Bar/Pub
    if tags.amenity == "bar" or tags.amenity == "pub" or tags.amenity == "nightclub" then
        return {type = "Bar/Pub", parent_category = "Food & Drink"}
    end

    -- Hairdresser/Barbershop
    if tags.shop == "hairdresser" or tags.shop == "barbershop" then
        return {type = "Hairdresser/Barbershop", parent_category = "Leisure"}
    end

    -- Beauty Salon
    if tags.shop == "beauty" or tags.shop == "cosmetics" or tags.shop == "massage" then
        return {type = "Beauty Salon", parent_category = "Leisure"}
    end

    -- Bakery
    if tags.shop == "bakery" then
        return {type = "Bakery", parent_category = "Food & Drink"}
    end

    -- Cafe
    if tags.amenity == "cafe" or tags.shop == "coffee" then
        return {type = "Cafe", parent_category = "Food & Drink"}
    end

    if tags.amenity == "cinema" then
        return {type = "Cinema", parent_category = "Culture"}
    end

    if tags.amenity == "club" then
        return {type = "Club", parent_category = "Leisure"}
    end

    if tags.amenity == "dentist" then
        return {type = "Dentist", parent_category = "Health"}
    end

    -- Cinema/Theatre
    if tags.amenity == "theatre" then
        return {type = "Theatre", parent_category = "Culture"}
    end

    -- Clinic/Doctor
    if tags.amenity == "clinic" or tags.healthcare == "doctor" or tags.healthcare == "clinic" then
        return {type = "Clinic/Doctor", parent_category = "Health"}
    end

    -- Convenience Store
    if tags.shop == "convenience" or tags.shop == "kiosk" or tags.shop == "newsagent" then
        return {type = "Convenience Store", parent_category = "Shopping"}
    end

    -- Education Facilities
    if tags.amenity == "school" then
        return {type = "School", parent_category = "Education"}
    end
    if tags.amenity == "university" or tags.amenity == "college" then
        return {type = "University", parent_category = "Education"}
    end
    if tags.amenity == "college" then
        return {type = "College", parent_category = "Education"}
    end
    if tags.amenity == "library" then
        return {type = "Library", parent_category = "Culture"}
    end
    if tags.amenity == "kindergarten" then
        return {type = "Kindergarten", parent_category = "Education"}
    end

    -- Fast Food Specifics
    if tags.amenity == "fast_food" then
        if tags.cuisine == "burger" then
            return {type = "Burger Restaurant", parent_category = "Food & Drink"}
        elseif tags.cuisine == "pizza" then
            return {type = "Pizzeria", parent_category = "Food & Drink"}
        elseif tags.cuisine == "kebab" then
            return {type = "Kebab Shop", parent_category = "Food & Drink"}
        elseif tags.cuisine == "sushi" then
            return {type = "Sushi Bar", parent_category = "Food & Drink"}
        elseif tags.cuisine == "ice_cream" then
            return {type = "Ice Cream Parlor", parent_category = "Food & Drink"}
        else
            return {type = "Fast Food", parent_category = "Food & Drink"}
        end
    end

    -- Fitness Center/Gym
    if tags.leisure == "gym" then
        return {type = "Gym", parent_category = "Sport"}
    end
    if tags.leisure == "fitness_centre" or tags.sport then
        return {type = "Fitness Center", parent_category = "Sport"}
    end

    -- Grocery Store/Supermarket
    if tags.shop == "supermarket" or tags.shop == "grocery" then
        return {type = "Supermarket", parent_category = "Shopping"}
    end

    -- Hospital
    if tags.amenity == "hospital" or tags.healthcare == "hospital" then
        return {type = "Hospital", parent_category = "Health"}
    end

    -- Accommodation
    if tags.tourism == "hotel" or tags.tourism == "motel" or tags.tourism == "hostel" or tags.tourism == "guest_house" then
        return {type = "Accommodation", parent_category = "Hotel"}
    end

    -- Leisure/Park
    if tags.leisure == "park" or tags.leisure == "playground" or tags.leisure == "garden" then
        return {type = "Park/Leisure", parent_category = "Leisure"}
    end

    -- Parking
    if tags.amenity == "parking" or tags.parking then
        return {type = "Parking", parent_category = "Transport"}
    end

    -- Pharmacy
    if tags.amenity == "pharmacy" or tags.shop == "chemist" then
        return {type = "Pharmacy", parent_category = "Health"}
    end

    -- Post Office
    if tags.amenity == "post_office" then
        return {type = "Post Office", parent_category = "Authorities"}
    end

    -- Restaurant with Cuisine Specifics
    if tags.amenity == "restaurant" then
        if tags.cuisine == "italian" then
            return {type = "Italian Restaurant", parent_category = "Food & Drink"}
        elseif tags.cuisine == "chinese" then
            return {type = "Chinese Restaurant", parent_category = "Food & Drink"}
        elseif tags.cuisine == "indian" then
            return {type = "Indian Restaurant", parent_category = "Food & Drink"}
        elseif tags.cuisine == "mexican" then
            return {type = "Mexican Restaurant", parent_category = "Food & Drink"}
        elseif tags.cuisine == "japanese" then
            return {type = "Japanese Restaurant", parent_category = "Food & Drink"}
        else
            return {type = "Restaurant", parent_category = "Food & Drink"}
        end
    end

    -- Retail Shops
    if tags.shop then
        if tags.shop == "clothes" then
            return {type = "Clothing Store", parent_category = "Shopping"}
        elseif tags.shop == "electronics" then
            return {type = "Electronics Store", parent_category = "Shopping"}
        elseif tags.shop == "furniture" then
            return {type = "Furniture Store", parent_category = "Shopping"}
        elseif tags.shop == "jewelry" then
            return {type = "Jewelry Store", parent_category = "Shopping"}
        elseif tags.shop == "mobile_phone" then
            return {type = "Mobile Phone Store", parent_category = "Shopping"}
        elseif tags.shop == "bookstore" or tags.shop == "books" then
            return {type = "Bookstore", parent_category = "Shopping"}
        elseif tags.shop == "florist" then
            return {type = "Florist", parent_category = "Shopping"}
        elseif tags.shop == "gift" then
            return {type = "Gift Shop", parent_category = "Shopping"}
        elseif tags.shop == "sports" then
            return {type = "Sports Store", parent_category = "Shopping"}
        else
            return {type = "Shop", parent_category = "Shopping"}
        end
    end

    -- Sports Facility
    if tags.leisure == "sports_centre" or tags.leisure == "stadium" or tags.leisure == "golf_course" or tags.leisure == "swimming_pool" then
        return {type = "Sports Facility", parent_category = "Sport"}
    end

    -- Taxi Stand
    if tags.amenity == "taxi" then
        return {type = "Taxi Stand", parent_category = "Transport"}
    end

    -- Public Restroom
    if tags.amenity == "toilets" or tags.amenity == "restroom" then
        return {type = "Public Restroom", parent_category = "Toilets"}
    end

    -- Tourist Attraction
    if tags.tourism then
        if tags.tourism == "museum" then
            return {type = "Museum", parent_category = "Culture"}
        elseif tags.tourism == "theme_park" then
            return {type = "Theme Park", parent_category = "Leisure"}
        elseif tags.tourism == "zoo" then
            return {type = "Zoo", parent_category = "Tourism"}
        else
            return {type = "Tourist Attraction", parent_category = "Tourism"}
        end
    end

    -- Transportation
    if tags.public_transport or tags.railway or tags.aeroway or tags.highway == "bus_stop" then
        return {type = "Transportation", parent_category = "Transport"}
    end

    -- Government Services
    if tags.amenity == "police" or tags.amenity == "fire_station" or tags.amenity == "townhall" or tags.amenity == "embassy" then
        return {type = "Government Services", parent_category = "Authorities"}
    end

    -- Automotive Services
    if tags.amenity == "car_rental" or tags.amenity == "car_wash" or tags.amenity == "fuel" then
        return {type = "Automotive Services", parent_category = "Transport"}
    end

    -- Place of Worship
    if tags.amenity == "place_of_worship" then
        if tags.religion == "christian" then
            return {type = "Church", parent_category = "Culture"}
        elseif tags.religion == "muslim" then
            return {type = "Mosque", parent_category = "Culture"}
        elseif tags.religion == "jewish" then
            return {type = "Synagogue", parent_category = "Culture"}
        else
            return {type = "Place of Worship", parent_category = "Culture"}
        end
    end

    -- Charging Station
    if tags.amenity == "charging_station" then
        return {type = "Charging Station", parent_category = "Transport"}
    end

    -- Post Box
    if tags.amenity == "post_box" then
        return {type = "Post Box", parent_category = "Authorities"}
    end

    -- Veterinary Clinic
    if tags.amenity == "veterinary" then
        return {type = "Veterinary Clinic", parent_category = "Health"}
    end

    -- Recycling Facility
    if tags.amenity == "recycling" then
        return {type = "Recycling Facility", parent_category = "Authorities"}
    end

    -- Childcare Center
    if tags.amenity == "childcare" then
        return {type = "Childcare Center", parent_category = "Education"}
    end

    -- Elderly Care Facility
    if tags.amenity == "social_facility" and tags.social_facility == "assisted_living" then
        return {type = "Elderly Care Facility", parent_category = "Health"}
    end

    -- Miscellaneous Amenity
    if tags.amenity then
        return {type = "Amenity", parent_category = "Other"}
    end

    -- Miscellaneous Shop
    if tags.shop then
        return {type = "Shop", parent_category = "Shopping"}
    end

    -- Default Category
    return {type = "Other", parent_category = "Other"}
end

function get_extra_info(tags)
    local extra_info = {}

    -- Collect relevant tags
    local fields = {
        'opening_hours',
        'addr:housenumber',
        'addr:street',
        'addr:city',
        'addr:postcode',
        'phone',
        'website',
        'cuisine',
        'wheelchair',
        'internet_access'
    }

    for _, field in ipairs(fields) do
        if tags[field] then
            -- Replace ':' with '_' in keys because hstore keys can't contain ':'
            local key = field:gsub(':', '_')
            extra_info[key] = tags[field]
        end
    end

    return extra_info
end

function osm2pgsql.process_node(object)
    if object.tags.name then
        local category_info = determine_category(object.tags)
        local extra_info = get_extra_info(object.tags)
        if category_info then
            tables.poi:insert({
                name = object.tags.name,
                category = category_info.type,
                parent_category = category_info.parent_category,
                extra_info = extra_info,  -- Insert the table directly
                geom = object:as_point()
            })
        end
    end
end

-- Disable processing of ways and relations
function osm2pgsql.process_way(object) end
function osm2pgsql.process_relation(object) end
