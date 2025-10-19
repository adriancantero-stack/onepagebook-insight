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
      ab_test_config: {
        Row: {
          ended_at: string | null
          id: string
          is_active: boolean | null
          split_percentage: number | null
          started_at: string | null
          winner_variant: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          split_percentage?: number | null
          started_at?: string | null
          winner_variant?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          split_percentage?: number | null
          started_at?: string | null
          winner_variant?: string | null
        }
        Relationships: []
      }
      ab_test_conversions: {
        Row: {
          conversion_type: string
          created_at: string | null
          id: string
          language: string
          session_id: string
          variant: string
        }
        Insert: {
          conversion_type: string
          created_at?: string | null
          id?: string
          language: string
          session_id: string
          variant: string
        }
        Update: {
          conversion_type?: string
          created_at?: string | null
          id?: string
          language?: string
          session_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_conversions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ab_test_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      ab_test_sessions: {
        Row: {
          created_at: string | null
          id: string
          language: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          variant: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          variant: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          variant?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number | null
        }
        Relationships: []
      }
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
      book_categories: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_es: string | null
          description_pt: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          key: string
          name_en: string
          name_es: string
          name_pt: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          key: string
          name_en: string
          name_es: string
          name_pt: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          key?: string
          name_en?: string
          name_es?: string
          name_pt?: string
        }
        Relationships: []
      }
      book_flashcards: {
        Row: {
          answer: string
          book_summary_id: string
          card_order: number
          created_at: string
          id: string
          question: string
        }
        Insert: {
          answer: string
          book_summary_id: string
          card_order?: number
          created_at?: string
          id?: string
          question: string
        }
        Update: {
          answer?: string
          book_summary_id?: string
          card_order?: number
          created_at?: string
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_flashcards_book_summary_id_fkey"
            columns: ["book_summary_id"]
            isOneToOne: false
            referencedRelation: "book_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      book_import_history: {
        Row: {
          books_imported: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          books_imported?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          books_imported?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      book_summaries: {
        Row: {
          actions: string[] | null
          asin: string | null
          book_author: string | null
          book_title: string
          canonical_author: string | null
          canonical_title: string | null
          closing: string | null
          cover_url: string | null
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
          practical_examples: Json | null
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
          asin?: string | null
          book_author?: string | null
          book_title: string
          canonical_author?: string | null
          canonical_title?: string | null
          closing?: string | null
          cover_url?: string | null
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
          practical_examples?: Json | null
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
          asin?: string | null
          book_author?: string | null
          book_title?: string
          canonical_author?: string | null
          canonical_title?: string | null
          closing?: string | null
          cover_url?: string | null
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
          practical_examples?: Json | null
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
          asin: string | null
          author: string
          author_normalized: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          google_books_id: string | null
          id: string
          is_active: boolean | null
          isbn: string | null
          lang: string
          page_count: number | null
          popularity: number | null
          published_year: number | null
          summary: string | null
          summary_generated_at: string | null
          tags: string[] | null
          title: string
          title_normalized: string | null
          updated_at: string
        }
        Insert: {
          asin?: string | null
          author: string
          author_normalized?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          google_books_id?: string | null
          id?: string
          is_active?: boolean | null
          isbn?: string | null
          lang: string
          page_count?: number | null
          popularity?: number | null
          published_year?: number | null
          summary?: string | null
          summary_generated_at?: string | null
          tags?: string[] | null
          title: string
          title_normalized?: string | null
          updated_at?: string
        }
        Update: {
          asin?: string | null
          author?: string
          author_normalized?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          google_books_id?: string | null
          id?: string
          is_active?: boolean | null
          isbn?: string | null
          lang?: string
          page_count?: number | null
          popularity?: number | null
          published_year?: number | null
          summary?: string | null
          summary_generated_at?: string | null
          tags?: string[] | null
          title?: string
          title_normalized?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cron_schedules: {
        Row: {
          created_at: string | null
          cron_expression: string
          description: string | null
          id: string
          job_name: string
          last_run_at: string | null
          next_run_at: string | null
        }
        Insert: {
          created_at?: string | null
          cron_expression: string
          description?: string | null
          id?: string
          job_name: string
          last_run_at?: string | null
          next_run_at?: string | null
        }
        Update: {
          created_at?: string | null
          cron_expression?: string
          description?: string | null
          id?: string
          job_name?: string
          last_run_at?: string | null
          next_run_at?: string | null
        }
        Relationships: []
      }
      daily_reminder_log: {
        Row: {
          created_at: string
          email: string
          error_message: string | null
          id: string
          sent_at: string
          sent_date: string
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          sent_at?: string
          sent_date?: string
          success?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          sent_date?: string
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      people_book_picks: {
        Row: {
          book_id: string | null
          confidence: string
          created_at: string | null
          id: string
          person_id: string
          reason_en: string | null
          reason_es: string | null
          reason_pt: string | null
          source_url: string
        }
        Insert: {
          book_id?: string | null
          confidence: string
          created_at?: string | null
          id?: string
          person_id: string
          reason_en?: string | null
          reason_es?: string | null
          reason_pt?: string | null
          source_url: string
        }
        Update: {
          book_id?: string | null
          confidence?: string
          created_at?: string | null
          id?: string
          person_id?: string
          reason_en?: string | null
          reason_es?: string | null
          reason_pt?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_book_picks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_book_picks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people_picks"
            referencedColumns: ["person_id"]
          },
        ]
      }
      people_picks: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          display_name_en: string | null
          display_name_es: string | null
          display_name_pt: string | null
          id: string
          is_featured: boolean | null
          person_id: string
          role: string | null
          role_en: string | null
          role_es: string | null
          role_pt: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          display_name_en?: string | null
          display_name_es?: string | null
          display_name_pt?: string | null
          id?: string
          is_featured?: boolean | null
          person_id: string
          role?: string | null
          role_en?: string | null
          role_es?: string | null
          role_pt?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          display_name_en?: string | null
          display_name_es?: string | null
          display_name_pt?: string | null
          id?: string
          is_featured?: boolean | null
          person_id?: string
          role?: string | null
          role_en?: string | null
          role_es?: string | null
          role_pt?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_conversion_emails: {
        Row: {
          created_at: string
          email_type: string
          id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_type: string
          id?: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_type?: string
          id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          last_read_date: string | null
          level: string | null
          nickname: string | null
          notification_email: boolean | null
          notification_enabled: boolean | null
          notification_time: string | null
          photo_url: string | null
          preferred_language: string
          signup_country: string | null
          signup_language: string | null
          signup_path: string | null
          streak_days: number | null
          timezone: string | null
          total_books_read: number | null
          total_summaries_generated: number
          updated_at: string
          xp: number | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          last_read_date?: string | null
          level?: string | null
          nickname?: string | null
          notification_email?: boolean | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          photo_url?: string | null
          preferred_language?: string
          signup_country?: string | null
          signup_language?: string | null
          signup_path?: string | null
          streak_days?: number | null
          timezone?: string | null
          total_books_read?: number | null
          total_summaries_generated?: number
          updated_at?: string
          xp?: number | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          last_read_date?: string | null
          level?: string | null
          nickname?: string | null
          notification_email?: boolean | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          photo_url?: string | null
          preferred_language?: string
          signup_country?: string | null
          signup_language?: string | null
          signup_path?: string | null
          streak_days?: number | null
          timezone?: string | null
          total_books_read?: number | null
          total_summaries_generated?: number
          updated_at?: string
          xp?: number | null
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
      summary_feedback: {
        Row: {
          book_summary_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          book_summary_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          book_summary_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summary_feedback_book_summary_id_fkey"
            columns: ["book_summary_id"]
            isOneToOne: false
            referencedRelation: "book_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_audio_plays: {
        Row: {
          book_summary_id: string
          id: string
          played_at: string
          user_id: string
        }
        Insert: {
          book_summary_id: string
          id?: string
          played_at?: string
          user_id: string
        }
        Update: {
          book_summary_id?: string
          id?: string
          played_at?: string
          user_id?: string
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
      welcome_emails_queue: {
        Row: {
          created_at: string
          email: string
          error_message: string | null
          full_name: string | null
          id: string
          language: string | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          error_message?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          error_message?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      xp_log: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          user_id: string
          xp_earned: number
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "xp_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      add_xp: {
        Args: { p_event_type: string; p_user_id: string; p_xp: number }
        Returns: {
          leveled_up: boolean
          new_level: string
          new_xp: number
        }[]
      }
      calculate_next_cron_run: {
        Args: { cron_expr: string; from_time?: string }
        Returns: string
      }
      check_achievements: {
        Args: { p_user_id: string }
        Returns: {
          achievement_id: string
          achievement_name: string
          xp_reward: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_book_read: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      increment_summaries_generated: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      merge_duplicate_books: {
        Args: Record<PropertyKey, never>
        Returns: {
          book_author: string
          book_title: string
          deleted_count: number
          kept_book_id: string
        }[]
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
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      upsert_book: {
        Args: {
          p_asin?: string
          p_author: string
          p_category?: string
          p_cover_url?: string
          p_description?: string
          p_lang: string
          p_tags?: string[]
          p_title: string
        }
        Returns: string
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
