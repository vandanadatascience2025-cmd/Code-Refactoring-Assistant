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
      debt_modules: {
        Row: {
          code_smells: Json | null
          complexity: number
          created_at: string
          debt_score: number
          file_path: string
          id: string
          language: string
          lines_of_code: number
          module_name: string
          scan_id: string | null
        }
        Insert: {
          code_smells?: Json | null
          complexity?: number
          created_at?: string
          debt_score?: number
          file_path: string
          id?: string
          language?: string
          lines_of_code?: number
          module_name: string
          scan_id?: string | null
        }
        Update: {
          code_smells?: Json | null
          complexity?: number
          created_at?: string
          debt_score?: number
          file_path?: string
          id?: string
          language?: string
          lines_of_code?: number
          module_name?: string
          scan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debt_modules_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "debt_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_scans: {
        Row: {
          code_smell_score: number
          complexity_score: number
          created_at: string
          duplication_score: number
          files_analyzed: number
          id: string
          project_name: string
          scan_date: string
          total_score: number
        }
        Insert: {
          code_smell_score?: number
          complexity_score?: number
          created_at?: string
          duplication_score?: number
          files_analyzed?: number
          id?: string
          project_name?: string
          scan_date?: string
          total_score?: number
        }
        Update: {
          code_smell_score?: number
          complexity_score?: number
          created_at?: string
          duplication_score?: number
          files_analyzed?: number
          id?: string
          project_name?: string
          scan_date?: string
          total_score?: number
        }
        Relationships: []
      }
      dependencies: {
        Row: {
          created_at: string
          dependency_type: string
          id: string
          scan_id: string | null
          source_module: string
          target_module: string
          weight: number
        }
        Insert: {
          created_at?: string
          dependency_type?: string
          id?: string
          scan_id?: string | null
          source_module: string
          target_module: string
          weight?: number
        }
        Update: {
          created_at?: string
          dependency_type?: string
          id?: string
          scan_id?: string | null
          source_module?: string
          target_module?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "dependencies_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "debt_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      refactoring_tasks: {
        Row: {
          created_at: string
          description: string | null
          estimated_effort: string | null
          id: string
          module_name: string
          priority: string
          risk_level: number | null
          scan_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_effort?: string | null
          id?: string
          module_name: string
          priority?: string
          risk_level?: number | null
          scan_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_effort?: string | null
          id?: string
          module_name?: string
          priority?: string
          risk_level?: number | null
          scan_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refactoring_tasks_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "debt_scans"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
