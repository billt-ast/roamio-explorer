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
  public: {
    Tables: {
      booking_requests: {
        Row: {
          admin_reference: string | null
          admin_summary: string | null
          created_at: string
          email: string
          end_date: string | null
          full_name: string
          id: string
          itinerary_id: string
          notes: string | null
          phone: string | null
          start_date: string | null
          status: string
          travelers: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_reference?: string | null
          admin_summary?: string | null
          created_at?: string
          email: string
          end_date?: string | null
          full_name: string
          id?: string
          itinerary_id: string
          notes?: string | null
          phone?: string | null
          start_date?: string | null
          status?: string
          travelers?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_reference?: string | null
          admin_summary?: string | null
          created_at?: string
          email?: string
          end_date?: string | null
          full_name?: string
          id?: string
          itinerary_id?: string
          notes?: string | null
          phone?: string | null
          start_date?: string | null
          status?: string
          travelers?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string
          hero_image: string
          id: string
          name: string
          slug: string
          status: string
          tagline: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_image?: string
          id?: string
          name: string
          slug: string
          status?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_image?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          country_slug: string | null
          created_at: string
          id: string
          is_public: boolean
          share_token: string
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country_slug?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          share_token?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country_slug?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          share_token?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      itinerary_items: {
        Row: {
          country_slug: string
          created_at: string
          end_date: string | null
          id: string
          image: string
          itinerary_id: string
          listing_id: string | null
          listing_slug: string
          location: string
          notes: string | null
          position: number
          price: string
          service: string
          start_date: string | null
          title: string
        }
        Insert: {
          country_slug: string
          created_at?: string
          end_date?: string | null
          id?: string
          image?: string
          itinerary_id: string
          listing_id?: string | null
          listing_slug: string
          location?: string
          notes?: string | null
          position?: number
          price?: string
          service: string
          start_date?: string | null
          title: string
        }
        Update: {
          country_slug?: string
          created_at?: string
          end_date?: string | null
          id?: string
          image?: string
          itinerary_id?: string
          listing_id?: string | null
          listing_slug?: string
          location?: string
          notes?: string | null
          position?: number
          price?: string
          service?: string
          start_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          badge: string | null
          country_id: string
          created_at: string
          description: string
          id: string
          image: string
          location: string
          price: string
          price_unit: string | null
          rating: number
          service: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          country_id: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          location?: string
          price?: string
          price_unit?: string | null
          rating?: number
          service: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          country_id?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          location?: string
          price?: string
          price_unit?: string | null
          rating?: number
          service?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_tiers: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          level: number
          min_bookings: number
          name: string
          perks: Json
          slug: string
          stay_discount_pct: number
          transport_discount_pct: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          level: number
          min_bookings?: number
          name: string
          perks?: Json
          slug: string
          stay_discount_pct?: number
          transport_discount_pct?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          level?: number
          min_bookings?: number
          name?: string
          perks?: Json
          slug?: string
          stay_discount_pct?: number
          transport_discount_pct?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          bookings_count: number
          created_at: string
          points: number
          tier_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bookings_count?: number
          created_at?: string
          points?: number
          tier_slug?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bookings_count?: number
          created_at?: string
          points?: number
          tier_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_tier_slug_fkey"
            columns: ["tier_slug"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin" | "country_agent" | "operator"
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
      app_role: ["admin", "user", "super_admin", "country_agent", "operator"],
    },
  },
} as const
