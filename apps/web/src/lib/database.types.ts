export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  villekulla: {
    Tables: {
      castings: {
        Row: {
          cast_slot: string
          character_id: string
          child_id: string
          created_at: string
          id: string
        }
        Insert: {
          cast_slot?: string
          character_id: string
          child_id: string
          created_at?: string
          id?: string
        }
        Update: {
          cast_slot?: string
          character_id?: string
          child_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "castings_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          production_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          production_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          production_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      child_aliases: {
        Row: {
          alias: string
          child_id: string
          id: string
        }
        Insert: {
          alias: string
          child_id: string
          id?: string
        }
        Update: {
          alias?: string
          child_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_aliases_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      child_groups: {
        Row: {
          child_id: string
          group_id: string
        }
        Insert: {
          child_id: string
          group_id: string
        }
        Update: {
          child_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_groups_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      content_blog_post_comments: {
        Row: {
          author_id: string
          blog_post_id: string
          body: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          blog_post_id: string
          body: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          blog_post_id?: string
          body?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blog_post_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "content_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blog_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_characters: {
        Row: {
          character_id: string
          event_id: string
        }
        Insert: {
          character_id: string
          event_id: string
        }
        Update: {
          character_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_characters_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_children: {
        Row: {
          child_id: string
          event_id: string
          note: string | null
        }
        Insert: {
          child_id: string
          event_id: string
          note?: string | null
        }
        Update: {
          child_id?: string
          event_id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_children_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_children_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_groups: {
        Row: {
          event_id: string
          group_id: string
        }
        Insert: {
          event_id: string
          group_id: string
        }
        Update: {
          event_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          comment: string | null
          created_at: string
          ends_at: string | null
          id: string
          location: string | null
          production_id: string
          raw_note: string | null
          starts_at: string
          title: string | null
          type: Database["villekulla"]["Enums"]["event_type"]
        }
        Insert: {
          comment?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          location?: string | null
          production_id: string
          raw_note?: string | null
          starts_at: string
          title?: string | null
          type?: Database["villekulla"]["Enums"]["event_type"]
        }
        Update: {
          comment?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          location?: string | null
          production_id?: string
          raw_note?: string | null
          starts_at?: string
          title?: string | null
          type?: Database["villekulla"]["Enums"]["event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "events_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          name: string
          production_id: string
          weekday: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          production_id: string
          weekday?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          production_id?: string
          weekday?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          child_id: string
          created_at: string
          id: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_casts: {
        Row: {
          character_id: string
          child_id: string
          created_at: string
          event_id: string
          id: string
        }
        Insert: {
          character_id: string
          child_id: string
          created_at?: string
          event_id: string
          id?: string
        }
        Update: {
          character_id?: string
          child_id?: string
          created_at?: string
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_casts_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_casts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_casts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      private_items: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: []
      }
      productions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_approved: boolean
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_approved?: boolean
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_approved?: boolean
        }
        Relationships: []
      }
      scene_characters: {
        Row: {
          character_id: string
          scene_id: string
        }
        Insert: {
          character_id: string
          scene_id: string
        }
        Update: {
          character_id?: string
          scene_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scene_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scene_characters_scene_id_fkey"
            columns: ["scene_id"]
            isOneToOne: false
            referencedRelation: "scenes"
            referencedColumns: ["id"]
          },
        ]
      }
      scenes: {
        Row: {
          act: string | null
          created_at: string
          id: string
          page_number: number | null
          production_id: string
          scene_number: string
          sort_order: number
          title: string | null
        }
        Insert: {
          act?: string | null
          created_at?: string
          id?: string
          page_number?: number | null
          production_id: string
          scene_number: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          act?: string | null
          created_at?: string
          id?: string
          page_number?: number | null
          production_id?: string
          scene_number?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scenes_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      child_performance_roles: {
        Row: {
          character_name: string | null
          child_id: string | null
          event_id: string | null
          location: string | null
          starts_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_casts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_casts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      child_schedule: {
        Row: {
          character_name: string | null
          child_id: string | null
          comment: string | null
          ends_at: string | null
          event_id: string | null
          group_name: string | null
          location: string | null
          production_id: string | null
          source: string | null
          starts_at: string | null
          title: string | null
          type: Database["villekulla"]["Enums"]["event_type"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_approved: { Args: never; Returns: boolean }
    }
    Enums: {
      event_type: "rehearsal" | "performance" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  villekulla: {
    Enums: {
      event_type: ["rehearsal", "performance", "other"],
    },
  },
} as const
