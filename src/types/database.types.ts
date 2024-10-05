export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  osm_import: {
    Tables: {
      osm2pgsql_properties: {
        Row: {
          property: string
          value: string
        }
        Insert: {
          property: string
          value: string
        }
        Update: {
          property?: string
          value?: string
        }
        Relationships: []
      }
      planet_osm_line: {
        Row: {
          access: string | null
          "addr:housename": string | null
          "addr:housenumber": string | null
          "addr:interpolation": string | null
          admin_level: string | null
          aerialway: string | null
          aeroway: string | null
          amenity: string | null
          area: string | null
          barrier: string | null
          bicycle: string | null
          boundary: string | null
          brand: string | null
          bridge: string | null
          building: string | null
          construction: string | null
          covered: string | null
          culvert: string | null
          cutting: string | null
          denomination: string | null
          disused: string | null
          embankment: string | null
          foot: string | null
          "generator:source": string | null
          harbour: string | null
          highway: string | null
          historic: string | null
          horse: string | null
          intermittent: string | null
          junction: string | null
          landuse: string | null
          layer: string | null
          leisure: string | null
          lock: string | null
          man_made: string | null
          military: string | null
          motorcar: string | null
          name: string | null
          natural: string | null
          office: string | null
          oneway: string | null
          operator: string | null
          osm_id: number | null
          place: string | null
          population: string | null
          power: string | null
          power_source: string | null
          public_transport: string | null
          railway: string | null
          ref: string | null
          religion: string | null
          route: string | null
          service: string | null
          shop: string | null
          sport: string | null
          surface: string | null
          toll: string | null
          tourism: string | null
          "tower:type": string | null
          tracktype: string | null
          tunnel: string | null
          water: string | null
          waterway: string | null
          way_area: number | null
          wetland: string | null
          width: string | null
          wood: string | null
          z_order: number | null
        }
        Insert: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Update: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Relationships: []
      }
      planet_osm_nodes: {
        Row: {
          changeset_id: number | null
          created: string | null
          id: number
          lat: number
          lon: number
          tags: Json | null
          user_id: number | null
          version: number | null
        }
        Insert: {
          changeset_id?: number | null
          created?: string | null
          id: number
          lat: number
          lon: number
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Update: {
          changeset_id?: number | null
          created?: string | null
          id?: number
          lat?: number
          lon?: number
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Relationships: []
      }
      planet_osm_point: {
        Row: {
          geom: unknown | null
          name: string | null
          osm_id: number
          tags: unknown | null
        }
        Insert: {
          geom?: unknown | null
          name?: string | null
          osm_id: number
          tags?: unknown | null
        }
        Update: {
          geom?: unknown | null
          name?: string | null
          osm_id?: number
          tags?: unknown | null
        }
        Relationships: []
      }
      planet_osm_polygon: {
        Row: {
          access: string | null
          "addr:housename": string | null
          "addr:housenumber": string | null
          "addr:interpolation": string | null
          admin_level: string | null
          aerialway: string | null
          aeroway: string | null
          amenity: string | null
          area: string | null
          barrier: string | null
          bicycle: string | null
          boundary: string | null
          brand: string | null
          bridge: string | null
          building: string | null
          construction: string | null
          covered: string | null
          culvert: string | null
          cutting: string | null
          denomination: string | null
          disused: string | null
          embankment: string | null
          foot: string | null
          "generator:source": string | null
          harbour: string | null
          highway: string | null
          historic: string | null
          horse: string | null
          intermittent: string | null
          junction: string | null
          landuse: string | null
          layer: string | null
          leisure: string | null
          lock: string | null
          man_made: string | null
          military: string | null
          motorcar: string | null
          name: string | null
          natural: string | null
          office: string | null
          oneway: string | null
          operator: string | null
          osm_id: number | null
          place: string | null
          population: string | null
          power: string | null
          power_source: string | null
          public_transport: string | null
          railway: string | null
          ref: string | null
          religion: string | null
          route: string | null
          service: string | null
          shop: string | null
          sport: string | null
          surface: string | null
          toll: string | null
          tourism: string | null
          "tower:type": string | null
          tracktype: string | null
          tunnel: string | null
          water: string | null
          waterway: string | null
          way_area: number | null
          wetland: string | null
          width: string | null
          wood: string | null
          z_order: number | null
        }
        Insert: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Update: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Relationships: []
      }
      planet_osm_rels: {
        Row: {
          changeset_id: number | null
          created: string | null
          id: number
          members: Json
          tags: Json | null
          user_id: number | null
          version: number | null
        }
        Insert: {
          changeset_id?: number | null
          created?: string | null
          id: number
          members: Json
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Update: {
          changeset_id?: number | null
          created?: string | null
          id?: number
          members?: Json
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Relationships: []
      }
      planet_osm_roads: {
        Row: {
          access: string | null
          "addr:housename": string | null
          "addr:housenumber": string | null
          "addr:interpolation": string | null
          admin_level: string | null
          aerialway: string | null
          aeroway: string | null
          amenity: string | null
          area: string | null
          barrier: string | null
          bicycle: string | null
          boundary: string | null
          brand: string | null
          bridge: string | null
          building: string | null
          construction: string | null
          covered: string | null
          culvert: string | null
          cutting: string | null
          denomination: string | null
          disused: string | null
          embankment: string | null
          foot: string | null
          "generator:source": string | null
          harbour: string | null
          highway: string | null
          historic: string | null
          horse: string | null
          intermittent: string | null
          junction: string | null
          landuse: string | null
          layer: string | null
          leisure: string | null
          lock: string | null
          man_made: string | null
          military: string | null
          motorcar: string | null
          name: string | null
          natural: string | null
          office: string | null
          oneway: string | null
          operator: string | null
          osm_id: number | null
          place: string | null
          population: string | null
          power: string | null
          power_source: string | null
          public_transport: string | null
          railway: string | null
          ref: string | null
          religion: string | null
          route: string | null
          service: string | null
          shop: string | null
          sport: string | null
          surface: string | null
          toll: string | null
          tourism: string | null
          "tower:type": string | null
          tracktype: string | null
          tunnel: string | null
          water: string | null
          waterway: string | null
          way_area: number | null
          wetland: string | null
          width: string | null
          wood: string | null
          z_order: number | null
        }
        Insert: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Update: {
          access?: string | null
          "addr:housename"?: string | null
          "addr:housenumber"?: string | null
          "addr:interpolation"?: string | null
          admin_level?: string | null
          aerialway?: string | null
          aeroway?: string | null
          amenity?: string | null
          area?: string | null
          barrier?: string | null
          bicycle?: string | null
          boundary?: string | null
          brand?: string | null
          bridge?: string | null
          building?: string | null
          construction?: string | null
          covered?: string | null
          culvert?: string | null
          cutting?: string | null
          denomination?: string | null
          disused?: string | null
          embankment?: string | null
          foot?: string | null
          "generator:source"?: string | null
          harbour?: string | null
          highway?: string | null
          historic?: string | null
          horse?: string | null
          intermittent?: string | null
          junction?: string | null
          landuse?: string | null
          layer?: string | null
          leisure?: string | null
          lock?: string | null
          man_made?: string | null
          military?: string | null
          motorcar?: string | null
          name?: string | null
          natural?: string | null
          office?: string | null
          oneway?: string | null
          operator?: string | null
          osm_id?: number | null
          place?: string | null
          population?: string | null
          power?: string | null
          power_source?: string | null
          public_transport?: string | null
          railway?: string | null
          ref?: string | null
          religion?: string | null
          route?: string | null
          service?: string | null
          shop?: string | null
          sport?: string | null
          surface?: string | null
          toll?: string | null
          tourism?: string | null
          "tower:type"?: string | null
          tracktype?: string | null
          tunnel?: string | null
          water?: string | null
          waterway?: string | null
          way_area?: number | null
          wetland?: string | null
          width?: string | null
          wood?: string | null
          z_order?: number | null
        }
        Relationships: []
      }
      planet_osm_users: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      planet_osm_ways: {
        Row: {
          changeset_id: number | null
          created: string | null
          id: number
          nodes: number[]
          tags: Json | null
          user_id: number | null
          version: number | null
        }
        Insert: {
          changeset_id?: number | null
          created?: string | null
          id: number
          nodes: number[]
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Update: {
          changeset_id?: number | null
          created?: string | null
          id?: number
          nodes?: number[]
          tags?: Json | null
          user_id?: number | null
          version?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string | null
          is_read: boolean | null
          message: string
          notification_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          is_read?: boolean | null
          message: string
          notification_id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          is_read?: boolean | null
          message?: string
          notification_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "detailed_spots_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      osm_tag_to_category: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          tag_key: string
          tag_value: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          tag_key: string
          tag_value: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          tag_key?: string
          tag_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_category_mapping_spot_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "spot_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          name: string
          parent_category_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          name: string
          parent_category_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
          parent_category_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_categories_parent_category_fkey"
            columns: ["parent_category_id"]
            referencedRelation: "spot_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_entrances: {
        Row: {
          accessibility_info: Json | null
          created_at: string | null
          id: number
          location: unknown | null
          name: string | null
          spot_id: number
          updated_at: string | null
        }
        Insert: {
          accessibility_info?: Json | null
          created_at?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          spot_id: number
          updated_at?: string | null
        }
        Update: {
          accessibility_info?: Json | null
          created_at?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          spot_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_entrances_spot_id_fkey"
            columns: ["spot_id"]
            referencedRelation: "detailed_spots_view"
            referencedColumns: ["spot_id"]
          },
          {
            foreignKeyName: "spot_entrances_spot_id_fkey"
            columns: ["spot_id"]
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_images: {
        Row: {
          created_at: string
          description: string | null
          entrance_id: number | null
          id: number
          image_url: string | null
          spot_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          id?: number
          image_url?: string | null
          spot_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          id?: number
          image_url?: string | null
          spot_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_images_entrance_id_fkey"
            columns: ["entrance_id"]
            referencedRelation: "spot_entrances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_images_spot_id_fkey"
            columns: ["spot_id"]
            referencedRelation: "detailed_spots_view"
            referencedColumns: ["spot_id"]
          },
          {
            foreignKeyName: "spot_images_spot_id_fkey"
            columns: ["spot_id"]
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
        ]
      }
      spots: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          is_verified: boolean
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          is_verified?: boolean
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          updated_at?: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          is_verified?: boolean
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spots_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "spot_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contributions: {
        Row: {
          action_type: Database["public"]["Enums"]["contribution_action"]
          created_at: string
          details: Json | null
          id: number
          spot_id: number
          status: Database["public"]["Enums"]["contribution_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["contribution_action"]
          created_at?: string
          details?: Json | null
          id?: number
          spot_id: number
          status?: Database["public"]["Enums"]["contribution_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["contribution_action"]
          created_at?: string
          details?: Json | null
          id?: number
          spot_id?: number
          status?: Database["public"]["Enums"]["contribution_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_contributions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "detailed_spots_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_contributions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      detailed_spots_view: {
        Row: {
          category_icon: string | null
          category_name: string | null
          created_at: string | null
          lat: number | null
          location: unknown | null
          long: number | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          parent_category_icon: string | null
          parent_category_name: string | null
          spot_id: number | null
          updated_at: string | null
          user_created_at: string | null
          user_id: string | null
          user_updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_spot_from_osm: {
        Args: {
          osm_id: number
        }
        Returns: {
          category_id: number | null
          created_at: string
          id: number
          is_verified: boolean
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          updated_at: string
        }
      }
      get_category_id_from_osm_tags: {
        Args: {
          tags: unknown
        }
        Returns: number
      }
      get_spots_in_bounding_box: {
        Args: {
          min_lat: number
          min_long: number
          max_lat: number
          max_long: number
        }
        Returns: {
          spot_id: number
          osm_id: number
          name: string
          lat: number
          long: number
          created_at: string
          updated_at: string
          osm_tags: Json
          user_id: string
          user_created_at: string
          user_updated_at: string
          category_name: string
          category_icon: string
          parent_category_name: string
          parent_category_icon: string
        }[]
      }
    }
    Enums: {
      contribution_action: "ADD" | "UPDATE" | "REPORT" | "PHOTO_UPLOAD"
      contribution_status: "PENDING" | "APPROVED" | "REJECTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  utils: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never