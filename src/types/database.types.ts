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
      "entity_changes_audit ": {
        Row: {
          action_type: string
          audit_timestamp: string | null
          change_data: Json
          entity_id: number
          entity_type: string
          id: number
          reviewed_at: string
          reviewed_by: string | null
          staging_change_id: number | null
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          audit_timestamp?: string | null
          change_data: Json
          entity_id: number
          entity_type: string
          id?: number
          reviewed_at: string
          reviewed_by?: string | null
          staging_change_id?: number | null
          status: string
          user_id: string
        }
        Update: {
          action_type?: string
          audit_timestamp?: string | null
          change_data?: Json
          entity_id?: number
          entity_type?: string
          id?: number
          reviewed_at?: string
          reviewed_by?: string | null
          staging_change_id?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_changes_audit _reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_changes_audit _staging_change_id_fkey"
            columns: ["staging_change_id"]
            isOneToOne: false
            referencedRelation: "entity_changes_staging"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_changes_audit _user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_changes_staging: {
        Row: {
          action_type: string
          change_data: Json
          entity_id: string | null
          entity_type: string
          id: number
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          change_data: Json
          entity_id?: string | null
          entity_type: string
          id?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          change_data?: Json
          entity_id?: string | null
          entity_type?: string
          id?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_changes_staging_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_json_schemas: {
        Row: {
          entity_type: string
          json_schema: Json
        }
        Insert: {
          entity_type: string
          json_schema: Json
        }
        Update: {
          entity_type?: string
          json_schema?: Json
        }
        Relationships: []
      }
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
          id?: number
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
          category_id: number
          created_at: string
          name: string
          name_sv: string
          parent_category_id: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number
          created_at?: string
          name: string
          name_sv: string
          parent_category_id?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string
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
            referencedColumns: ["category_id"]
          },
        ]
      }
      place_entrance_photos: {
        Row: {
          created_at: string
          description: string | null
          entrance_id: number | null
          photo_id: number
          photo_url: string | null
          place_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          photo_id?: number
          photo_url?: string | null
          place_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          entrance_id?: number | null
          photo_id?: number
          photo_url?: string | null
          place_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrance_photos_entrance_id_fkey"
            columns: ["entrance_id"]
            isOneToOne: false
            referencedRelation: "detailed_entrances_view"
            referencedColumns: ["entrance_id"]
          },
          {
            foreignKeyName: "place_entrance_photos_entrance_id_fkey"
            columns: ["entrance_id"]
            isOneToOne: false
            referencedRelation: "place_entrances"
            referencedColumns: ["entrance_id"]
          },
          {
            foreignKeyName: "place_entrance_photos_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["place_id"]
          },
        ]
      }
      place_entrances: {
        Row: {
          accessibility_info: Json | null
          created_at: string | null
          entrance_id: number
          entrance_type_id: number
          location: unknown | null
          place_id: number
          updated_at: string | null
        }
        Insert: {
          accessibility_info?: Json | null
          created_at?: string | null
          entrance_id?: number
          entrance_type_id: number
          location?: unknown | null
          place_id: number
          updated_at?: string | null
        }
        Update: {
          accessibility_info?: Json | null
          created_at?: string | null
          entrance_id?: number
          entrance_type_id?: number
          location?: unknown | null
          place_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrances_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["place_id"]
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
            referencedColumns: ["category_id"]
          },
        ]
      }
      places: {
        Row: {
          category_id: number | null
          created_at: string
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          place_id: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          place_id?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          location?: unknown | null
          name?: string | null
          osm_id?: number | null
          osm_tags?: Json | null
          place_id?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "place_categories"
            referencedColumns: ["category_id"]
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
          location: unknown | null
          long: number | null
          osm_id: number | null
          photos: Json | null
          place_id: number | null
          place_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_entrances_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["place_id"]
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
          osm_tags: Json | null
          parent_category_id: number | null
          parent_category_name: string | null
          parent_category_name_sv: string | null
          place_id: string | null
          source: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_entity_change: {
        Args: {
          p_user_id: string
          p_entity_id?: string
          p_entity_type?: string
          p_action_type?: string
          p_change_data?: Json
        }
        Returns: number
      }
      add_place_from_osm: {
        Args: {
          osm_id: number
        }
        Returns: {
          category_id: number | null
          created_at: string
          location: unknown | null
          name: string | null
          osm_id: number | null
          osm_tags: Json | null
          place_id: number
          updated_at: string
          user_id: string | null
        }
      }
      check_email_exists: {
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
      get_entrance_type_counts: {
        Args: {
          p_place_id: number
        }
        Returns: {
          entrance_type_id: number
          count: number
        }[]
      }
      get_nearest_places: {
        Args: {
          user_lat: number
          user_long: number
          limit_count?: number
          max_distance_meters?: number
        }
        Returns: {
          id: string
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
      get_place_entrances_with_pending: {
        Args: {
          p_place_id: string
          p_user_id?: string
        }
        Returns: {
          entrance_id: number
          entrance_type_id: number
          entrance_type_name: string
          entrance_type_name_sv: string
          entrance_type_description: string
          entrance_type_description_sv: string
          location: unknown
          photos: Json
          action: string
          status: string
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

