// Supabase MCP `generate_typescript_types` ile üretildi (proje: sqlcodex,
// aeudeltvovpihicqbtbq). Şema değiştiğinde elle yeniden üretilmeli — bkz.
// lib/supabase/client.ts / server.ts (createClient<Database>).
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      certificates: {
        Row: {
          cert_type: string;
          display_code: string;
          id: string;
          issued_at: string;
          recipient_name: string;
          user_id: string;
        };
        Insert: {
          cert_type: string;
          display_code: string;
          id?: string;
          issued_at?: string;
          recipient_name: string;
          user_id: string;
        };
        Update: {
          cert_type?: string;
          display_code?: string;
          id?: string;
          issued_at?: string;
          recipient_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      completed_interview_questions: {
        Row: {
          completed_at: string;
          question_slug: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          question_slug: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          question_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completed_interview_questions_question_slug_fkey";
            columns: ["question_slug"];
            isOneToOne: false;
            referencedRelation: "interview_catalog";
            referencedColumns: ["slug"];
          },
        ];
      };
      completed_lessons: {
        Row: {
          completed_at: string;
          lesson_slug: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          lesson_slug: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          lesson_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completed_lessons_lesson_slug_fkey";
            columns: ["lesson_slug"];
            isOneToOne: false;
            referencedRelation: "lesson_catalog";
            referencedColumns: ["slug"];
          },
        ];
      };
      exercise_catalog: {
        Row: {
          exercise_id: string;
          parent_slug: string;
          source: string;
          title: string;
        };
        Insert: {
          exercise_id: string;
          parent_slug: string;
          source: string;
          title: string;
        };
        Update: {
          exercise_id?: string;
          parent_slug?: string;
          source?: string;
          title?: string;
        };
        Relationships: [];
      };
      exercise_progress: {
        Row: {
          exercise_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          exercise_id: string;
          status: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          exercise_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_progress_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercise_catalog";
            referencedColumns: ["exercise_id"];
          },
        ];
      };
      interview_catalog: {
        Row: {
          slug: string;
          title: string;
        };
        Insert: {
          slug: string;
          title: string;
        };
        Update: {
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      lesson_catalog: {
        Row: {
          slug: string;
          title: string;
          unit_id: number;
        };
        Insert: {
          slug: string;
          title: string;
          unit_id: number;
        };
        Update: {
          slug?: string;
          title?: string;
          unit_id?: number;
        };
        Relationships: [];
      };
      mini_quiz_results: {
        Row: {
          correct_count: number;
          lesson_slug: string;
          total_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          correct_count: number;
          lesson_slug: string;
          total_count: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          correct_count?: number;
          lesson_slug?: string;
          total_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mini_quiz_results_lesson_slug_fkey";
            columns: ["lesson_slug"];
            isOneToOne: false;
            referencedRelation: "lesson_catalog";
            referencedColumns: ["slug"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_certificate_by_id: {
        Args: { p_id: string };
        Returns: {
          cert_type: string;
          display_code: string;
          id: string;
          issued_at: string;
          recipient_name: string;
        }[];
      };
      issue_certificate: {
        Args: { p_cert_type: string };
        Returns: {
          cert_type: string;
          display_code: string;
          id: string;
          issued_at: string;
          recipient_name: string;
          user_id: string;
        };
        SetofOptions: {
          from: "*";
          to: "certificates";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      mulakat_tamamlandi_mi: { Args: never; Returns: boolean };
      pratik_tamamlandi_mi: { Args: never; Returns: boolean };
      set_exercise_progress: {
        Args: { p_exercise_id: string; p_status: string };
        Returns: undefined;
      };
      unite_tamamlandi_mi: { Args: { p_unite_id: number }; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
