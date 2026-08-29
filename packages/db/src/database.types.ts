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
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: number
          start_date: string
          status: Database["public"]["Enums"]["academic_year_status"]
          year_name: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: never
          start_date: string
          status?: Database["public"]["Enums"]["academic_year_status"]
          year_name: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: never
          start_date?: string
          status?: Database["public"]["Enums"]["academic_year_status"]
          year_name?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          image_path: string | null
          is_active: boolean
          last_login: string | null
          modified_at: string
          national_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id: string
          image_path?: string | null
          is_active?: boolean
          last_login?: string | null
          modified_at?: string
          national_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          last_login?: string | null
          modified_at?: string
          national_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      career_jobs: {
        Row: {
          account_id: string
          created_at: string
          educational_stage: string | null
          end_year: number | null
          id: number
          job_title: string
          school: string
          start_year: number
        }
        Insert: {
          account_id: string
          created_at?: string
          educational_stage?: string | null
          end_year?: number | null
          id?: never
          job_title: string
          school: string
          start_year: number
        }
        Update: {
          account_id?: string
          created_at?: string
          educational_stage?: string | null
          end_year?: number | null
          id?: never
          job_title?: string
          school?: string
          start_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "career_jobs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: number
          portfolio_id: number
          storage_path: string
          subsection_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          portfolio_id: number
          storage_path: string
          subsection_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          portfolio_id?: number
          storage_path?: string
          subsection_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_images_subsection_id_fkey"
            columns: ["subsection_id"]
            isOneToOne: false
            referencedRelation: "subsections"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          academic_year_id: number
          account_id: string
          created_at: string
          file_password_hash: string | null
          id: number
          image_path: string | null
          modified_at: string
          profile_type_id: number
          published_at: string | null
          rank_id: number | null
          status: Database["public"]["Enums"]["portfolio_status"]
          template_id: number
        }
        Insert: {
          academic_year_id: number
          account_id: string
          created_at?: string
          file_password_hash?: string | null
          id?: never
          image_path?: string | null
          modified_at?: string
          profile_type_id: number
          published_at?: string | null
          rank_id?: number | null
          status?: Database["public"]["Enums"]["portfolio_status"]
          template_id?: number
        }
        Update: {
          academic_year_id?: number
          account_id?: string
          created_at?: string
          file_password_hash?: string | null
          id?: never
          image_path?: string | null
          modified_at?: string
          profile_type_id?: number
          published_at?: string | null
          rank_id?: number | null
          status?: Database["public"]["Enums"]["portfolio_status"]
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_profile_type_id_fkey"
            columns: ["profile_type_id"]
            isOneToOne: false
            referencedRelation: "profile_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_types: {
        Row: {
          available_for: Database["public"]["Enums"]["gender_availability"]
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          modified_at: string
          type_name_female: string
          type_name_male: string
        }
        Insert: {
          available_for?: Database["public"]["Enums"]["gender_availability"]
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          modified_at?: string
          type_name_female: string
          type_name_male: string
        }
        Update: {
          available_for?: Database["public"]["Enums"]["gender_availability"]
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          modified_at?: string
          type_name_female?: string
          type_name_male?: string
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          account_id: string
          created_at: string
          degree_type: string
          graduation_date: string
          id: number
          institution: string
          major: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          degree_type: string
          graduation_date: string
          id?: never
          institution: string
          major?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          degree_type?: string
          graduation_date?: string
          id?: never
          institution?: string
          major?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qualifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          created_at: string
          display_order: number
          id: number
          title_female: string
          title_male: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: never
          title_female: string
          title_male: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: never
          title_female?: string
          title_male?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          display_order: number
          id: number
          is_active: boolean
          rating: number
          reviewer_job_title: string | null
          reviewer_name: string
          reviewer_photo_path: string | null
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          id?: never
          is_active?: boolean
          rating: number
          reviewer_job_title?: string | null
          reviewer_name: string
          reviewer_photo_path?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          id?: never
          is_active?: boolean
          rating?: number
          reviewer_job_title?: string | null
          reviewer_name?: string
          reviewer_photo_path?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          display_order: number
          id: number
          profile_type_id: number
          title: string
          weight_percent: number
        }
        Insert: {
          display_order?: number
          id?: never
          profile_type_id: number
          title: string
          weight_percent?: number
        }
        Update: {
          display_order?: number
          id?: never
          profile_type_id?: number
          title?: string
          weight_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "sections_profile_type_id_fkey"
            columns: ["profile_type_id"]
            isOneToOne: false
            referencedRelation: "profile_types"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links: {
        Row: {
          access_count: number
          created_at: string
          id: number
          portfolio_id: number
          revoked_at: string | null
          token: string
        }
        Insert: {
          access_count?: number
          created_at?: string
          id?: never
          portfolio_id: number
          revoked_at?: string | null
          token: string
        }
        Update: {
          access_count?: number
          created_at?: string
          id?: never
          portfolio_id?: number
          revoked_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_discounts: {
        Row: {
          created_at: string
          discount_percentage: number
          end_date: string
          id: number
          is_active: boolean
          title: string
        }
        Insert: {
          created_at?: string
          discount_percentage: number
          end_date: string
          id?: never
          is_active?: boolean
          title: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          end_date?: string
          id?: never
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          account_id: string
          applied_discount_id: number | null
          base_amount: number
          created_at: string
          discount_amount: number
          discount_percentage: number
          expires_at: string
          final_amount: number
          id: number
          payment_completed_at: string | null
          payment_fee: number | null
          payment_gateway_id: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_transaction_id: string | null
          subscribed_at: string
        }
        Insert: {
          account_id: string
          applied_discount_id?: number | null
          base_amount: number
          created_at?: string
          discount_amount?: number
          discount_percentage?: number
          expires_at: string
          final_amount: number
          id?: never
          payment_completed_at?: string | null
          payment_fee?: number | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_transaction_id?: string | null
          subscribed_at?: string
        }
        Update: {
          account_id?: string
          applied_discount_id?: number | null
          base_amount?: number
          created_at?: string
          discount_amount?: number
          discount_percentage?: number
          expires_at?: string
          final_amount?: number
          id?: never
          payment_completed_at?: string | null
          payment_fee?: number | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_transaction_id?: string | null
          subscribed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_applied_discount_id_fkey"
            columns: ["applied_discount_id"]
            isOneToOne: false
            referencedRelation: "subscription_discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subsections: {
        Row: {
          display_order: number
          id: number
          max_image_count: number | null
          max_image_size: number | null
          section_id: number
          title: string
          weight_percent: number
        }
        Insert: {
          display_order?: number
          id?: never
          max_image_count?: number | null
          max_image_size?: number | null
          section_id: number
          title: string
          weight_percent?: number
        }
        Update: {
          display_order?: number
          id?: never
          max_image_count?: number | null
          max_image_size?: number | null
          section_id?: number
          title?: string
          weight_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "subsections_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      system_parameters: {
        Row: {
          category: string | null
          created_at: string
          data_type: string
          description: string | null
          id: number
          is_active: boolean
          key: string
          modified_at: string
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          data_type?: string
          description?: string | null
          id?: never
          is_active?: boolean
          key: string
          modified_at?: string
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          data_type?: string
          description?: string | null
          id?: never
          is_active?: boolean
          key?: string
          modified_at?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard_stats: { Args: never; Returns: Json }
      admin_latest_portfolios: {
        Args: { row_limit?: number }
        Returns: {
          academic_year_name: string
          created_at: string
          id: number
          owner_name: string
          profile_type_name: string
          status: Database["public"]["Enums"]["portfolio_status"]
        }[]
      }
      admin_latest_subscriptions: {
        Args: { row_limit?: number }
        Returns: {
          account_image_path: string
          account_name: string
          amount: number
          id: number
          subscribed_at: string
        }[]
      }
      admin_portfolios_by_month: {
        Args: { months?: number }
        Returns: {
          bucket: string
          value: number
        }[]
      }
      admin_revenue_by_month: {
        Args: { months?: number }
        Returns: {
          bucket: string
          value: number
        }[]
      }
      current_role_is: {
        Args: { target: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      get_shared_portfolio: { Args: { share_token: string }; Returns: Json }
      has_active_subscription: { Args: { account: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      my_portfolios: {
        Args: never
        Returns: {
          academic_year_id: number
          academic_year_name: string
          created_at: string
          id: number
          image_path: string
          is_password_protected: boolean
          modified_at: string
          profile_type_id: number
          profile_type_name: string
          published_at: string
          rank_title: string
          status: Database["public"]["Enums"]["portfolio_status"]
          template_id: number
        }[]
      }
      percent_change: {
        Args: { current: number; previous: number }
        Returns: number
      }
      record_share_visit: { Args: { share_token: string }; Returns: undefined }
    }
    Enums: {
      academic_year_status: "active" | "inactive" | "archived"
      gender: "male" | "female"
      gender_availability: "male" | "female" | "both"
      payment_status:
        | "pending"
        | "processing"
        | "initiated"
        | "completed"
        | "failed"
        | "unknown"
        | "cancelled"
      portfolio_status:
        | "draft"
        | "unpublished"
        | "published"
        | "pending_subscription"
      user_role: "admin" | "teacher"
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
      academic_year_status: ["active", "inactive", "archived"],
      gender: ["male", "female"],
      gender_availability: ["male", "female", "both"],
      payment_status: [
        "pending",
        "processing",
        "initiated",
        "completed",
        "failed",
        "unknown",
        "cancelled",
      ],
      portfolio_status: [
        "draft",
        "unpublished",
        "published",
        "pending_subscription",
      ],
      user_role: ["admin", "teacher"],
    },
  },
} as const

