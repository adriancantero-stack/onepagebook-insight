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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      book_audio: {
        Row: {
          audio_url: string
          book_summary_id: string
          created_at: string | null
          duration_seconds: number | null
          file_size: number | null
          id: string
          language: string
        }
        Insert: {
          audio_url: string
          book_summary_id: string
          created_at?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          id?: string
          language: string
        }
        Update: {
          audio_url?: string
          book_summary_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          id?: string
          language?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_audio_book_summary_id_fkey"
            columns: ["book_summary_id"]
            isOneToOne: false
            referencedRelation: "book_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      book_summaries: {
        Row: {
          actions: string[] | null
          book_author: string | null
          book_title: string
          canonical_author: string | null
          canonical_title: string | null
          closing: string | null
          created_at: string
          id: string
          key_ideas: string[] | null
          language: string
          main_ideas: string[]
          metrics: string | null
          norm_key: string | null
          one_liner: string | null
          pitfalls: string | null
          plan_7_days: string | null
          practical_applications: string
          routine: string | null
          source: string | null
          summary_text: string
          theme: string | null
          user_author: string | null
          user_id: string
          user_title: string | null
          year: number | null
        }
        Insert: {
          actions?: string[] | null
          book_author?: string | null
          book_title: string
          canonical_author?: string | null
          canonical_title?: string | null
          closing?: string | null
          created_at?: string
          id?: string
          key_ideas?: string[] | null
          language?: string
          main_ideas: string[]
          metrics?: string | null
          norm_key?: string | null
          one_liner?: string | null
          pitfalls?: string | null
          plan_7_days?: string | null
          practical_applications: string
          routine?: string | null
          source?: string | null
          summary_text: string
          theme?: string | null
          user_author?: string | null
          user_id: string
          user_title?: string | null
          year?: number | null
        }
        Update: {
          actions?: string[] | null
          book_author?: string | null
          book_title?: string
          canonical_author?: string | null
          canonical_title?: string | null
          closing?: string | null
          created_at?: string
          id?: string
          key_ideas?: string[] | null
          language?: string
          main_ideas?: string[]
          metrics?: string | null
          norm_key?: string | null
          one_liner?: string | null
          pitfalls?: string | null
          plan_7_days?: string | null
          practical_applications?: string
          routine?: string | null
          source?: string | null
          summary_text?: string
          theme?: string | null
          user_author?: string | null
          user_id?: string
          user_title?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "book_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_url: string | null
          created_at: string
          id: string
          is_active: boolean | null
          lang: string
          popularity: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          cover_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lang: string
          popularity?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lang?: string
          popularity?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          preferred_language: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number | null
          summaries_per_month: number | null
          type: Database["public"]["Enums"]["subscription_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price?: number | null
          summaries_per_month?: number | null
          type: Database["public"]["Enums"]["subscription_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number | null
          summaries_per_month?: number | null
          type?: Database["public"]["Enums"]["subscription_type"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_cache_text: {
        Args: { text_input: string }
        Returns: string
      }
      normalize_text: {
        Args: { "": string }
        Returns: string
      }
      search_books: {
        Args: {
          result_limit?: number
          search_lang: string
          search_query: string
        }
        Returns: {
          author: string
          cover_url: string
          id: string
          lang: string
          popularity: number
          title: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_type: "free" | "premium"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
      subscription_type: ["free", "premium"],
    },
  },
} as const
