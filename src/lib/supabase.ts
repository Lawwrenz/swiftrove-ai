// ============================================================================
// Supabase Client — Centralized Singleton
// ============================================================================
// DO NOT import this file and create multiple clients. Import the `supabase`
// export from this file everywhere in the application.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Ensure these are defined in your environment or vite.config.ts.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ============================================================================
// Type Helpers
// ============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Customer, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Payment, "id">>;
      };
      workflows: {
        Row: Workflow;
        Insert: Omit<Workflow, "id" | "created_at">;
        Update: Partial<Omit<Workflow, "id">>;
      };
      ai_conversations: {
        Row: AiConversation;
        Insert: Omit<AiConversation, "id" | "created_at">;
        Update: Partial<Omit<AiConversation, "id">>;
      };
      agent_execution_logs: {
        Row: AgentExecutionLog;
        Insert: Omit<AgentExecutionLog, "id" | "created_at">;
        Update: Partial<Omit<AgentExecutionLog, "id">>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Omit<Notification, "id">>;
      };
      automations: {
        Row: Automation;
        Insert: Omit<Automation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Automation, "id">>;
      };
    };
  };
}

// ============================================================================
// Row Types
// ============================================================================

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  business_logo_url: string | null;
  company_name: string | null;
  business_tagline: string | null;
  business_description: string | null;
  company_email: string | null;
  phone: string | null;
  website: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: "active" | "inactive" | "lead";
  relationship_score: number | null;
  health_score: number | null;
  preferred_channel: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  product_name: string;
  quantity: number;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  workflow_stage: string | null;
  due_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  payment_reference: string | null;
  payment_method: string;
  status: "verified" | "pending" | "failed";
  verified_by_ai: boolean;
  confidence_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  workflow_name: string;
  current_stage: string;
  status: "active" | "completed" | "paused" | "failed";
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface AiConversation {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  session_id: string;
  role: "user" | "assistant" | "system";
  message: string;
  model: string;
  created_at: string;
}

export interface AgentExecutionLog {
  id: string;
  agent_name: string;
  workflow_id: string | null;
  action: string;
  status: "pending" | "running" | "completed" | "failed";
  execution_time: number | null;
  confidence_score: number | null;
  metadata: Json;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  created_at: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  workflow_definition: Json;
  status: "active" | "inactive" | "draft";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}