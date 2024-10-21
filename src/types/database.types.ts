export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      entity_changes_events: {
        Row: {
          action_type: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data: Json | null;
          comments: string | null;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["entity_type"];
          event_timestamp: string | null;
          id: number;
          user_id: string | null;
        };
        Insert: {
          action_type: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data?: Json | null;
          comments?: string | null;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["entity_type"];
          event_timestamp?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          action_type?: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data?: Json | null;
          comments?: string | null;
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["entity_type"];
          event_timestamp?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "entity_changes_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entity_changes_staging: {
        Row: {
          __is_retired: boolean | null;
          action_type: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data: Json;
          entity_type: Database["public"]["Enums"]["entity_type"];
          id: number;
          reviewed_at: string | null;
          reviewed_by: string | null;
          source: Database["public"]["Enums"]["entity_data_source"];
          status: Database["public"]["Enums"]["entity_changes_staging_status"];
          submitted_at: string;
          submitted_by: string | null;
        };
        Insert: {
          __is_retired?: boolean | null;
          action_type: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data: Json;
          entity_type: Database["public"]["Enums"]["entity_type"];
          id?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source: Database["public"]["Enums"]["entity_data_source"];
          status?: Database["public"]["Enums"]["entity_changes_staging_status"];
          submitted_at?: string;
          submitted_by?: string | null;
        };
        Update: {
          __is_retired?: boolean | null;
          action_type?: Database["public"]["Enums"]["entity_changes_action_type"];
          change_data?: Json;
          entity_type?: Database["public"]["Enums"]["entity_type"];
          id?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source?: Database["public"]["Enums"]["entity_data_source"];
          status?: Database["public"]["Enums"]["entity_changes_staging_status"];
          submitted_at?: string;
          submitted_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "entity_changes_staging_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entity_changes_staging_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entity_json_schemas: {
        Row: {
          entity_type: Database["public"]["Enums"]["entity_type"];
          json_schema: Json;
        };
        Insert: {
          entity_type: Database["public"]["Enums"]["entity_type"];
          json_schema: Json;
        };
        Update: {
          entity_type?: Database["public"]["Enums"]["entity_type"];
          json_schema?: Json;
        };
        Relationships: [];
      };
      entity_overrides: {
        Row: {
          entity_id: number;
          entity_type: Database["public"]["Enums"]["entity_type"];
          expiry_date: string | null;
          notes: string | null;
          overridden_by: string | null;
          overridden_fields: Json;
          override_date: string | null;
          override_id: number;
        };
        Insert: {
          entity_id: number;
          entity_type: Database["public"]["Enums"]["entity_type"];
          expiry_date?: string | null;
          notes?: string | null;
          overridden_by?: string | null;
          overridden_fields: Json;
          override_date?: string | null;
          override_id?: number;
        };
        Update: {
          entity_id?: number;
          entity_type?: Database["public"]["Enums"]["entity_type"];
          expiry_date?: string | null;
          notes?: string | null;
          overridden_by?: string | null;
          overridden_fields?: Json;
          override_date?: string | null;
          override_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "entity_overrides_overridden_by_fkey";
            columns: ["overridden_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entrance_photos: {
        Row: {
          created_at: string;
          description: string | null;
          entrance_id: number | null;
          photo_filename: string | null;
          photo_id: number;
          place_id: number | null;
          updated_at: string | null;
          uploaded_by: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          entrance_id?: number | null;
          photo_filename?: string | null;
          photo_id?: number;
          place_id?: number | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          entrance_id?: number | null;
          photo_filename?: string | null;
          photo_id?: number;
          place_id?: number | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "entrance_photos_entrance_id_fkey";
            columns: ["entrance_id"];
            isOneToOne: false;
            referencedRelation: "entrances";
            referencedColumns: ["entrance_id"];
          },
          {
            foreignKeyName: "entrance_photos_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["place_id"];
          },
          {
            foreignKeyName: "entrance_photos_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places_view";
            referencedColumns: ["place_id"];
          },
          {
            foreignKeyName: "entrance_photos_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entrance_types: {
        Row: {
          created_at: string;
          description: string | null;
          description_sv: string | null;
          id: number;
          is_active: boolean;
          max_per_place: number | null;
          name: string;
          name_sv: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          description_sv?: string | null;
          id?: number;
          is_active?: boolean;
          max_per_place?: number | null;
          name: string;
          name_sv: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          description_sv?: string | null;
          id?: number;
          is_active?: boolean;
          max_per_place?: number | null;
          name?: string;
          name_sv?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      entrances: {
        Row: {
          accessibility_info: Json | null;
          created_at: string | null;
          created_by: string | null;
          entrance_id: number;
          entrance_type_id: number;
          location: unknown | null;
          place_id: number;
          updated_at: string | null;
        };
        Insert: {
          accessibility_info?: Json | null;
          created_at?: string | null;
          created_by?: string | null;
          entrance_id: number;
          entrance_type_id: number;
          location?: unknown | null;
          place_id: number;
          updated_at?: string | null;
        };
        Update: {
          accessibility_info?: Json | null;
          created_at?: string | null;
          created_by?: string | null;
          entrance_id?: number;
          entrance_type_id?: number;
          location?: unknown | null;
          place_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "entrances_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entrances_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["place_id"];
          },
          {
            foreignKeyName: "entrances_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places_view";
            referencedColumns: ["place_id"];
          },
        ];
      };
      osm_tag_to_place_category: {
        Row: {
          category_id: number | null;
          created_at: string;
          id: number;
          priority: number;
          tag_key: string;
          tag_value: string;
          updated_at: string | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string;
          id?: number;
          priority?: number;
          tag_key: string;
          tag_value: string;
          updated_at?: string | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string;
          id?: number;
          priority?: number;
          tag_key?: string;
          tag_value?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      place_categories: {
        Row: {
          category_id: number;
          created_at: string;
          name: string;
          name_sv: string;
          parent_category_id: number | null;
          updated_at: string;
        };
        Insert: {
          category_id?: number;
          created_at?: string;
          name: string;
          name_sv: string;
          parent_category_id?: number | null;
          updated_at?: string;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          name?: string;
          name_sv?: string;
          parent_category_id?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      places: {
        Row: {
          category_id: number | null;
          created_at: string;
          created_by: string | null;
          external_id: string | null;
          is_active: boolean | null;
          is_overridden: boolean | null;
          location: unknown;
          name: string;
          overridden_fields: Json | null;
          place_id: number;
          release_batch: string | null;
          source: Database["public"]["Enums"]["entity_data_source"];
          updated_at: string | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string;
          created_by?: string | null;
          external_id?: string | null;
          is_active?: boolean | null;
          is_overridden?: boolean | null;
          location: unknown;
          name: string;
          overridden_fields?: Json | null;
          place_id: number;
          release_batch?: string | null;
          source: Database["public"]["Enums"]["entity_data_source"];
          updated_at?: string | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string;
          created_by?: string | null;
          external_id?: string | null;
          is_active?: boolean | null;
          is_overridden?: boolean | null;
          location?: unknown;
          name?: string;
          overridden_fields?: Json | null;
          place_id?: number;
          release_batch?: string | null;
          source?: Database["public"]["Enums"]["entity_data_source"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "places_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "place_categories";
            referencedColumns: ["category_id"];
          },
          {
            foreignKeyName: "places_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      entrances_view: {
        Row: {
          accessibility_info: Json | null;
          created_at: string | null;
          created_by: string | null;
          entrance_id: number | null;
          entrance_type_description: string | null;
          entrance_type_description_sv: string | null;
          entrance_type_id: number | null;
          entrance_type_name: string | null;
          entrance_type_name_sv: string | null;
          location: unknown | null;
          photos: Json | null;
          place_id: number | null;
          status: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
      places_view: {
        Row: {
          category_id: number | null;
          category_name: string | null;
          category_name_sv: string | null;
          created_at: string | null;
          entrances: Json | null;
          is_active: boolean | null;
          is_overridden: boolean | null;
          lat: number | null;
          location: unknown | null;
          long: number | null;
          name: string | null;
          overridden_fields: Json | null;
          parent_category_id: number | null;
          parent_category_name: string | null;
          parent_category_name_sv: string | null;
          place_id: number | null;
          source: Database["public"]["Enums"]["entity_data_source"] | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      approve_entity: {
        Args: {
          p_entity_id: number;
          p_entity_type: string;
          p_reviewed_by: string;
        };
        Returns: undefined;
      };
      check_email_exists: {
        Args: {
          email: string;
        };
        Returns: boolean;
      };
      get_category_id_from_osm_tags: {
        Args: {
          tags: unknown;
        };
        Returns: number;
      };
      get_entrance_type_counts: {
        Args: {
          p_place_id: number;
        };
        Returns: {
          entrance_type_id: number;
          count: number;
        }[];
      };
      insert_entrance_staging: {
        Args: {
          p_change_data: Json;
          p_auto_approve?: boolean;
        };
        Returns: undefined;
      };
      insert_place_staging: {
        Args: {
          p_change_data: Json;
          p_auto_approve?: boolean;
        };
        Returns: number;
      };
      insert_place_staging_osm: {
        Args: {
          p_osm_id: number;
          p_submitted_by: string;
          p_auto_approve?: boolean;
        };
        Returns: number;
      };
    };
    Enums: {
      entity_changes_action_type:
        | "add"
        | "update"
        | "delete"
        | "approve"
        | "reject";
      entity_changes_staging_status: "pending" | "approved" | "rejected";
      entity_data_source: "osm" | "user" | "external";
      entity_type: "place" | "entrance" | "photo";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
