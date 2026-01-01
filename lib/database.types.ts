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
      admin_audit: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_credentials: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          approved: boolean | null
          areas: string[] | null
          bio: string | null
          brokerage: string | null
          certifications: string[] | null
          commission_rate: number | null
          created_at: string | null
          experience_years: number | null
          id: string
          instagram_handle: string | null
          languages: string[] | null
          license_no: string | null
          linkedin_url: string | null
          location: string | null
          office: string | null
          profile_image: string | null
          profile_images: string[] | null
          rating: number | null
          review_count: number | null
          social: Json | null
          specializations: string[] | null
          telegram: string | null
          title: string | null
          total_sales: number | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          approved?: boolean | null
          areas?: string[] | null
          bio?: string | null
          brokerage?: string | null
          certifications?: string[] | null
          commission_rate?: number | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          instagram_handle?: string | null
          languages?: string[] | null
          license_no?: string | null
          linkedin_url?: string | null
          location?: string | null
          office?: string | null
          profile_image?: string | null
          profile_images?: string[] | null
          rating?: number | null
          review_count?: number | null
          social?: Json | null
          specializations?: string[] | null
          telegram?: string | null
          title?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          approved?: boolean | null
          areas?: string[] | null
          bio?: string | null
          brokerage?: string | null
          certifications?: string[] | null
          commission_rate?: number | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          instagram_handle?: string | null
          languages?: string[] | null
          license_no?: string | null
          linkedin_url?: string | null
          location?: string | null
          office?: string | null
          profile_image?: string | null
          profile_images?: string[] | null
          rating?: number | null
          review_count?: number | null
          social?: Json | null
          specializations?: string[] | null
          telegram?: string | null
          title?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          referrer: string | null
          session_id: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          referrer?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          referrer?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      application_activities: {
        Row: {
          activity_type: string
          application_id: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_activities_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          additional_documents: string[] | null
          annual_income: number | null
          application_type: string
          approved_at: string | null
          assigned_agent_id: string | null
          bank_name: string | null
          budget_max: number | null
          budget_min: number | null
          completion_date: string | null
          contact_count: number | null
          cover_letter: string | null
          created_at: string | null
          credit_score: number | null
          down_payment: number | null
          email: string
          employer: string | null
          enquiry_id: string | null
          financing_amount: number | null
          financing_needed: boolean | null
          follow_up_date: string | null
          full_name: string
          id: string
          internal_notes: string | null
          last_contacted: string | null
          last_updated_by: string | null
          monthly_income: number | null
          mortgage_preferred: boolean | null
          nationality: string | null
          notes: string | null
          occupation: string | null
          phone: string
          preferred_contact_method: string | null
          priority: string | null
          property_id: string | null
          property_requirements: Json | null
          rejected_at: string | null
          rejection_reason: string | null
          residency_status: string | null
          reviewed_at: string | null
          special_requests: string | null
          status: string | null
          submitted_at: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_documents?: string[] | null
          annual_income?: number | null
          application_type: string
          approved_at?: string | null
          assigned_agent_id?: string | null
          bank_name?: string | null
          budget_max?: number | null
          budget_min?: number | null
          completion_date?: string | null
          contact_count?: number | null
          cover_letter?: string | null
          created_at?: string | null
          credit_score?: number | null
          down_payment?: number | null
          email: string
          employer?: string | null
          enquiry_id?: string | null
          financing_amount?: number | null
          financing_needed?: boolean | null
          follow_up_date?: string | null
          full_name: string
          id?: string
          internal_notes?: string | null
          last_contacted?: string | null
          last_updated_by?: string | null
          monthly_income?: number | null
          mortgage_preferred?: boolean | null
          nationality?: string | null
          notes?: string | null
          occupation?: string | null
          phone: string
          preferred_contact_method?: string | null
          priority?: string | null
          property_id?: string | null
          property_requirements?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          residency_status?: string | null
          reviewed_at?: string | null
          special_requests?: string | null
          status?: string | null
          submitted_at?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_documents?: string[] | null
          annual_income?: number | null
          application_type?: string
          approved_at?: string | null
          assigned_agent_id?: string | null
          bank_name?: string | null
          budget_max?: number | null
          budget_min?: number | null
          completion_date?: string | null
          contact_count?: number | null
          cover_letter?: string | null
          created_at?: string | null
          credit_score?: number | null
          down_payment?: number | null
          email?: string
          employer?: string | null
          enquiry_id?: string | null
          financing_amount?: number | null
          financing_needed?: boolean | null
          follow_up_date?: string | null
          full_name?: string
          id?: string
          internal_notes?: string | null
          last_contacted?: string | null
          last_updated_by?: string | null
          monthly_income?: number | null
          mortgage_preferred?: boolean | null
          nationality?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string
          preferred_contact_method?: string | null
          priority?: string | null
          property_id?: string | null
          property_requirements?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          residency_status?: string | null
          reviewed_at?: string | null
          special_requests?: string | null
          status?: string | null
          submitted_at?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_questions: {
        Row: {
          admin_id: string | null
          admin_response: string | null
          admin_response_at: string | null
          category: string
          created_at: string | null
          id: string
          message: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          admin_response?: string | null
          admin_response_at?: string | null
          category?: string
          created_at?: string | null
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          admin_response?: string | null
          admin_response_at?: string | null
          category?: string
          created_at?: string | null
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string | null
          date_recorded: string
          id: string
          metric_type: string
          metric_value: Json
        }
        Insert: {
          created_at?: string | null
          date_recorded: string
          id?: string
          metric_type: string
          metric_value: Json
        }
        Update: {
          created_at?: string | null
          date_recorded?: string
          id?: string
          metric_type?: string
          metric_value?: Json
        }
        Relationships: []
      }
      developers: {
        Row: {
          active_projects: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          logo_url: string | null
          name: string
          social_links: Json | null
          total_projects: number | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          active_projects?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          social_links?: Json | null
          total_projects?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          active_projects?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          social_links?: Json | null
          total_projects?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          agent_id: string | null
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          contact_count: number | null
          created_at: string | null
          down_payment: number | null
          email: string
          employer: string | null
          financing_amount: number | null
          financing_needed: boolean | null
          follow_up_date: string | null
          id: string
          last_contacted: string | null
          message: string | null
          monthly_income: number | null
          mortgage_preferred: boolean | null
          name: string
          nationality: string | null
          notes: string | null
          occupation: string | null
          phone: string | null
          priority: string | null
          property_id: string | null
          property_requirements: Json | null
          residency_status: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          timeline: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          contact_count?: number | null
          created_at?: string | null
          down_payment?: number | null
          email: string
          employer?: string | null
          financing_amount?: number | null
          financing_needed?: boolean | null
          follow_up_date?: string | null
          id?: string
          last_contacted?: string | null
          message?: string | null
          monthly_income?: number | null
          mortgage_preferred?: boolean | null
          name: string
          nationality?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          priority?: string | null
          property_id?: string | null
          property_requirements?: Json | null
          residency_status?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          contact_count?: number | null
          created_at?: string | null
          down_payment?: number | null
          email?: string
          employer?: string | null
          financing_amount?: number | null
          financing_needed?: boolean | null
          follow_up_date?: string | null
          id?: string
          last_contacted?: string | null
          message?: string | null
          monthly_income?: number | null
          mortgage_preferred?: boolean | null
          name?: string
          nationality?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          priority?: string | null
          property_id?: string | null
          property_requirements?: Json | null
          residency_status?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_activities: {
        Row: {
          activity_type: string
          agent_id: string | null
          created_at: string | null
          description: string | null
          enquiry_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
        }
        Insert: {
          activity_type: string
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          enquiry_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
        }
        Update: {
          activity_type?: string
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          enquiry_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_activities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_activities_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          enquiry_id: string | null
          id: string
          message: string
          message_type: string | null
          read_at: string | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          enquiry_id?: string | null
          id?: string
          message: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          enquiry_id?: string | null
          id?: string
          message?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_messages_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          agent_id: string | null
          agent_reply: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          property_id: string | null
          replied_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_reply?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          property_id?: string | null
          replied_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_reply?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          property_id?: string | null
          replied_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          area: string
          created_at: string | null
          data_source: string | null
          id: string
          metric_type: string
          period_end: string
          period_start: string
          property_type: string
          value: number
        }
        Insert: {
          area: string
          created_at?: string | null
          data_source?: string | null
          id?: string
          metric_type: string
          period_end: string
          period_start: string
          property_type: string
          value: number
        }
        Update: {
          area?: string
          created_at?: string | null
          data_source?: string | null
          id?: string
          metric_type?: string
          period_end?: string
          period_start?: string
          property_type?: string
          value?: number
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          active: boolean | null
          content: string
          created_at: string | null
          id: string
          name: string
          subject: string | null
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          content: string
          created_at?: string | null
          id?: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          images: string[] | null
          likes_count: number | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          likes_count?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          likes_count?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          last_login: string | null
          location: string | null
          login_count: number | null
          phone: string | null
          phone_verified: boolean | null
          preferences: Json | null
          role: string
          social_links: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          last_login?: string | null
          location?: string | null
          login_count?: number | null
          phone?: string | null
          phone_verified?: boolean | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          location?: string | null
          login_count?: number | null
          phone?: string | null
          phone_verified?: boolean | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: string | null
          available_units: number | null
          brochure_url: string | null
          city: string | null
          completion_date: string | null
          coords: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          developer_id: string | null
          district: string | null
          facilities: string[] | null
          featured: boolean | null
          handover_date: string | null
          hero_image_url: string | null
          id: string
          images: string[] | null
          inquiries_count: number | null
          launch_date: string | null
          max_price: number | null
          min_price: number | null
          name: string
          payment_plan: string | null
          payment_terms: Json | null
          property_types: string[] | null
          published: boolean | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string | null
          sold_units: number | null
          starting_price: number | null
          status: string | null
          total_units: number | null
          updated_at: string | null
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area?: string | null
          available_units?: number | null
          brochure_url?: string | null
          city?: string | null
          completion_date?: string | null
          coords?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          developer_id?: string | null
          district?: string | null
          facilities?: string[] | null
          featured?: boolean | null
          handover_date?: string | null
          hero_image_url?: string | null
          id?: string
          images?: string[] | null
          inquiries_count?: number | null
          launch_date?: string | null
          max_price?: number | null
          min_price?: number | null
          name: string
          payment_plan?: string | null
          payment_terms?: Json | null
          property_types?: string[] | null
          published?: boolean | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string | null
          sold_units?: number | null
          starting_price?: number | null
          status?: string | null
          total_units?: number | null
          updated_at?: string | null
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: string | null
          available_units?: number | null
          brochure_url?: string | null
          city?: string | null
          completion_date?: string | null
          coords?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          developer_id?: string | null
          district?: string | null
          facilities?: string[] | null
          featured?: boolean | null
          handover_date?: string | null
          hero_image_url?: string | null
          id?: string
          images?: string[] | null
          inquiries_count?: number | null
          launch_date?: string | null
          max_price?: number | null
          min_price?: number | null
          name?: string
          payment_plan?: string | null
          payment_terms?: Json | null
          property_types?: string[] | null
          published?: boolean | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string | null
          sold_units?: number | null
          starting_price?: number | null
          status?: string | null
          total_units?: number | null
          updated_at?: string | null
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          agent_id: string | null
          amenities: string[] | null
          area: string | null
          baths: number | null
          beds: number | null
          built_up_area: number | null
          city: string | null
          category_id: string | null
          coords: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          developer_id: string | null
          district: string | null
          expires_at: string | null
          favorites_count: number | null
          featured: boolean | null
          features: string[] | null
          floor_number: number | null
          floorplans: string[] | null
          furnishing: string | null
          id: string
          image_url: string | null
          images: string[] | null
          inquiries_count: number | null
          landmark: string | null
          last_viewed: string | null
          location: string | null
          meta_data: Json | null
          neighborhood: string | null
          original_price: number | null
          parking_spaces: number | null
          plot_size: number | null
          premium: boolean | null
          price: number
          price_per_sqft: number | null
          project_id: string | null
          property_status: string | null
          published: boolean | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          short_description: string | null
          slug: string | null
          sqft: number | null
          status: string | null
          title: string
          total_floors: number | null
          type: string | null
          updated_at: string | null
          urgent: boolean | null
          verified: boolean | null
          video_url: string | null
          views_count: number | null
          virtual_tour_url: string | null
          year_built: number | null
        }
        Insert: {
          address?: string | null
          agent_id?: string | null
          amenities?: string[] | null
          area?: string | null
          baths?: number | null
          beds?: number | null
          built_up_area?: number | null
          city?: string | null
          category_id?: string | null
          coords?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          developer_id?: string | null
          district?: string | null
          expires_at?: string | null
          favorites_count?: number | null
          featured?: boolean | null
          features?: string[] | null
          floor_number?: number | null
          floorplans?: string[] | null
          furnishing?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inquiries_count?: number | null
          landmark?: string | null
          last_viewed?: string | null
          location?: string | null
          meta_data?: Json | null
          neighborhood?: string | null
          original_price?: number | null
          parking_spaces?: number | null
          plot_size?: number | null
          premium?: boolean | null
          price: number
          price_per_sqft?: number | null
          project_id?: string | null
          property_status?: string | null
          published?: boolean | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string | null
          sqft?: number | null
          status?: string | null
          title: string
          total_floors?: number | null
          type?: string | null
          updated_at?: string | null
          urgent?: boolean | null
          verified?: boolean | null
          video_url?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
          year_built?: number | null
        }
        Update: {
          address?: string | null
          agent_id?: string | null
          amenities?: string[] | null
          area?: string | null
          baths?: number | null
          beds?: number | null
          built_up_area?: number | null
          city?: string | null
          category_id?: string | null
          coords?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          developer_id?: string | null
          district?: string | null
          expires_at?: string | null
          favorites_count?: number | null
          featured?: boolean | null
          features?: string[] | null
          floor_number?: number | null
          floorplans?: string[] | null
          furnishing?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inquiries_count?: number | null
          landmark?: string | null
          last_viewed?: string | null
          location?: string | null
          meta_data?: Json | null
          neighborhood?: string | null
          original_price?: number | null
          parking_spaces?: number | null
          plot_size?: number | null
          premium?: boolean | null
          price?: number
          price_per_sqft?: number | null
          project_id?: string | null
          property_status?: string | null
          published?: boolean | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string | null
          sqft?: number | null
          status?: string | null
          title?: string
          total_floors?: number | null
          type?: string | null
          updated_at?: string | null
          urgent?: boolean | null
          verified?: boolean | null
          video_url?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      property_valuations: {
        Row: {
          additional_features: string | null
          admin_notes: string | null
          bathrooms: number | null
          bedrooms: number | null
          condition: string | null
          contact_method: string | null
          created_at: string | null
          estimated_value: number | null
          id: string
          location: string
          property_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          size_sqm: number | null
          status: string
          updated_at: string | null
          urgency: string | null
          user_id: string | null
          valuation_notes: string | null
          year_built: number | null
        }
        Insert: {
          additional_features?: string | null
          admin_notes?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          contact_method?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          location: string
          property_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_sqm?: number | null
          status?: string
          updated_at?: string | null
          urgency?: string | null
          user_id?: string | null
          valuation_notes?: string | null
          year_built?: number | null
        }
        Update: {
          additional_features?: string | null
          admin_notes?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          contact_method?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          location?: string
          property_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_sqm?: number | null
          status?: string
          updated_at?: string | null
          urgency?: string | null
          user_id?: string | null
          valuation_notes?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      property_views: {
        Row: {
          duration_seconds: number | null
          id: string
          ip_address: unknown
          property_id: string | null
          referrer: string | null
          session_id: string | null
          source: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          last_run: string | null
          name: string
          notification_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          last_run?: string | null
          name: string
          notification_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          last_run?: string | null
          name?: string
          notification_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_backlinks: {
        Row: {
          anchor_text: string | null
          created_at: string | null
          domain_authority: number | null
          first_seen: string | null
          id: string
          last_seen: string | null
          link_type: string | null
          source_url: string
          status: string | null
          target_url: string
        }
        Insert: {
          anchor_text?: string | null
          created_at?: string | null
          domain_authority?: number | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          link_type?: string | null
          source_url: string
          status?: string | null
          target_url: string
        }
        Update: {
          anchor_text?: string | null
          created_at?: string | null
          domain_authority?: number | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          link_type?: string | null
          source_url?: string
          status?: string | null
          target_url?: string
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          competition: number | null
          cpc: number | null
          id: string
          keyword: string
          last_updated: string | null
          search_volume: number | null
          trend: string | null
        }
        Insert: {
          competition?: number | null
          cpc?: number | null
          id?: string
          keyword: string
          last_updated?: string | null
          search_volume?: number | null
          trend?: string | null
        }
        Update: {
          competition?: number | null
          cpc?: number | null
          id?: string
          keyword?: string
          last_updated?: string | null
          search_volume?: number | null
          trend?: string | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          created_at: string | null
          external_links: number | null
          h1_tags: string[] | null
          id: string
          images_count: number | null
          internal_links: number | null
          issues: string[] | null
          last_crawled: string | null
          meta_description: string | null
          seo_score: number | null
          title: string | null
          updated_at: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          created_at?: string | null
          external_links?: number | null
          h1_tags?: string[] | null
          id?: string
          images_count?: number | null
          internal_links?: number | null
          issues?: string[] | null
          last_crawled?: string | null
          meta_description?: string | null
          seo_score?: number | null
          title?: string | null
          updated_at?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          created_at?: string | null
          external_links?: number | null
          h1_tags?: string[] | null
          id?: string
          images_count?: number | null
          internal_links?: number | null
          issues?: string[] | null
          last_crawled?: string | null
          meta_description?: string | null
          seo_score?: number | null
          title?: string | null
          updated_at?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          last_check: string | null
          response_time: number | null
          service_name: string
          status: string
          uptime_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          last_check?: string | null
          response_time?: number | null
          service_name: string
          status: string
          uptime_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          last_check?: string | null
          response_time?: number | null
          service_name?: string
          status?: string
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          ip_address: unknown
          level: string
          message: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          level: string
          message: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          level?: string
          message?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      viewings: {
        Row: {
          agent_id: string | null
          created_at: string | null
          enquiry_id: string | null
          feedback: string | null
          id: string
          notes: string | null
          property_id: string | null
          rating: number | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          enquiry_id?: string | null
          feedback?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          rating?: number | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          enquiry_id?: string | null
          feedback?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          rating?: number | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "viewings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewings_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      download_interests: {
        Row: {
          additional_notes: string | null
          assigned_agent_id: string | null
          budget_range: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          download_type: string
          email: string
          employer: string | null
          full_name: string
          id: string
          interested_in_financing: boolean | null
          ip_address: unknown
          monthly_income: number | null
          nationality: string | null
          occupation: string | null
          phone: string
          property_id: string
          status: string
          timeline: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          additional_notes?: string | null
          assigned_agent_id?: string | null
          budget_range?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          download_type: string
          email: string
          employer?: string | null
          full_name: string
          id?: string
          interested_in_financing?: boolean | null
          ip_address?: unknown
          monthly_income?: number | null
          nationality?: string | null
          occupation?: string | null
          phone: string
          property_id: string
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          additional_notes?: string | null
          assigned_agent_id?: string | null
          budget_range?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          download_type?: string
          email?: string
          employer?: string | null
          full_name?: string
          id?: string
          interested_in_financing?: boolean | null
          ip_address?: unknown
          monthly_income?: number | null
          nationality?: string | null
          occupation?: string | null
          phone?: string
          property_id?: string
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_interests_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_interests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
