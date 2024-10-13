export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      entrance_types: {
        Row: {
          created_at: string
          description: string | null
          description_sv: string | null
          id: number
          is_active: boolean
          max_per_place: number | null
          name: string
          name_sv: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_sv?: string | null
          id: number
          is_active?: boolean
          max_per_place?: number | null
          name: string
          name_sv: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_sv?: string | null
          id?: number
          is_active?: boolean
          max_per_place?: number | null
          name?: string
          name_sv?: string
          updated_at?: string
        }
        Relationships: []
      }
      place_categories: {
        Row: {
          created_at: string
          id: number
          name: string
          name_sv: string
          parent_category_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          name_sv: string
          parent_category_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          name_sv?: string
          parent_category_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_categories_parent_category_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "place_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      place_entrance_images: {
        Row: {
          created_at: string
          description: string | null
          entrance_id: number | null
          id: number
          image_url: string | null
          place_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          id?: number
          image_url?: string | null
          place_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          id?: number
          image_url?: string | null
          place_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrance_images_entrance_id_fkey"
            columns: ["entrance_id"]
            isOneToOne: false
            referencedRelation: "detailed_entrances_view"
            referencedColumns: ["entrance_id"]
          },
          {
            foreignKeyName: "place_entrance_images_entrance_id_fkey"
            columns: ["entrance_id"]
            isOneToOne: false
            referencedRelation: "place_entrances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_entrance_images_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_entrances: {
        Row: {
          accessibility_info: Json | null
          created_at: string | null
          id: number
          location: unknown | null
          place_id: number
          type_id: number
          updated_at: string | null
        }
        Insert: {
          accessibility_info?: Json | null
          created_at?: string | null
          id?: number
          location?: unknown | null
          place_id: number
          type_id: number
          updated_at?: string | null
        }
        Update: {
          accessibility_info?: Json | null
          created_at?: string | null
          id?: number
          location?: unknown | null
          place_id?: number
          type_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrances_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_osm_tag_to_category: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          priority: number
          tag_key: string
          tag_value: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          priority?: number
          tag_key: string
          tag_value: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          priority?: number
          tag_key?: string
          tag_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_category_mapping_place_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "place_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "place_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          place_id: number
          status: Database["public"]["Enums"]["contribution_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["contribution_action"]
          created_at?: string
          details?: Json | null
          id?: number
          place_id: number
          status?: Database["public"]["Enums"]["contribution_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["contribution_action"]
          created_at?: string
          details?: Json | null
          id?: number
          place_id?: number
          status?: Database["public"]["Enums"]["contribution_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
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
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      detailed_entrances_view: {
        Row: {
          accessibility_info: Json | null
          entrance_created_at: string | null
          entrance_id: number | null
          entrance_type_created_at: string | null
          entrance_type_description: string | null
          entrance_type_description_sv: string | null
          entrance_type_id: number | null
          entrance_type_name: string | null
          entrance_type_name_sv: string | null
          entrance_updated_at: string | null
          lat: number | null
          long: number | null
          osm_id: number | null
          place_id: number | null
          place_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrances_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      detailed_places_view: {
        Row: {
          category_id: number | null
          category_name: string | null
          category_name_sv: string | null
          created_at: string | null
          has_entrances: boolean | null
          lat: number | null
          location: unknown | null
          long: number | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          parent_category_id: number | null
          parent_category_name: string | null
          parent_category_name_sv: string | null
          place_id: number | null
          source: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_detailed_places_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_place_from_osm: {
        Args: {
          osm_id: number
        }
        Returns: {
          category_id: number | null
          created_at: string
          id: number
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          updated_at: string
          user_id: string | null
        }
      }
      email_exists: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      get_category_id_from_osm_tags: {
        Args: {
          tags: unknown
        }
        Returns: number
      }
      get_nearest_places: {
        Args: {
          user_lat: number
          user_long: number
          limit_count?: number
          max_distance_meters?: number
        }
        Returns: {
          place_id: number
          osm_id: number
          name: string
          lat: number
          long: number
          distance_meters: number
          created_at: string
          updated_at: string
          osm_tags: Json
          user_id: string
          category_name: string
          parent_category_name: string
        }[]
      }
      get_places_in_bounding_box: {
        Args: {
          min_lat: number
          min_long: number
          max_lat: number
          max_long: number
        }
        Returns: {
          place_id: number
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
          parent_category_name: string
        }[]
      }
      refresh_detailed_places_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

