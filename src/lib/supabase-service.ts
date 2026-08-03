// ============================================================================
// Supabase Service Layer — CRUD Operations & Error Handling
// ============================================================================
// This service abstracts all database operations behind a clean API.
// Every page/component should import from here, not from supabase.ts directly.
// ============================================================================

import { supabase, type Customer, type Order, type Payment, type Workflow, type Notification, type AgentExecutionLog, type AiConversation, type Automation, type Profile } from "./supabase";

// ============================================================================
// Error Handling
// ============================================================================

export class ServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

function handleError(error: unknown, context: string): never {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  const code = (error as { code?: string })?.code;

  if (code === "PGRST116") {
    throw new ServiceError("The requested resource was not found.", "NOT_FOUND", { context });
  }
  if (code === "42501") {
    throw new ServiceError("You don't have permission to perform this action.", "PERMISSION_DENIED", { context });
  }
  if (code === "23505") {
    throw new ServiceError("A record with this information already exists.", "DUPLICATE", { context });
  }
  if (code === "23503") {
    throw new ServiceError("This operation references a record that doesn't exist.", "FK_VIOLATION", { context });
  }
  if (message.includes("fetch") || message.includes("network") || message.includes("Failed to fetch")) {
    throw new ServiceError("Network error — please check your connection and try again.", "NETWORK_ERROR", { context });
  }
  if (message.includes("JWT") || message.includes("jwt") || message.includes("auth")) {
    throw new ServiceError("Authentication error — please sign in again.", "AUTH_ERROR", { context });
  }

  throw new ServiceError(message, code || "UNKNOWN", { context });
}

// ============================================================================
// Pagination Helper
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// PROFILES
// ============================================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  } catch (error) {
    return handleError(error, "getProfile");
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>,
): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "updateProfile");
  }
}

// ============================================================================
// CUSTOMERS
// ============================================================================

export async function getCustomers(
  params: PaginationParams = { page: 1, limit: 50 },
  filters?: { status?: string; search?: string },
): Promise<PaginatedResult<Customer>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("customers")
      .select("*", { count: "exact" });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getCustomers");
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  } catch (error) {
    return handleError(error, "getCustomerById");
  }
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at" | "updated_at">,
): Promise<Customer> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createCustomer");
  }
}

export async function updateCustomer(
  id: string,
  updates: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>,
): Promise<Customer> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "updateCustomer");
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    return handleError(error, "deleteCustomer");
  }
}

// ============================================================================
// ORDERS
// ============================================================================

export async function getOrders(
  params: PaginationParams = { page: 1, limit: 50 },
  filters?: { status?: string; customer_id?: string; search?: string },
): Promise<PaginatedResult<Order>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("orders")
      .select("*, customers(full_name, email)", { count: "exact" });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.customer_id) {
      query = query.eq("customer_id", filters.customer_id);
    }

    if (filters?.search) {
      query = query.or(
        `order_number.ilike.%${filters.search}%,product_name.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getOrders");
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  } catch (error) {
    return handleError(error, "getOrderById");
  }
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, "getOrdersByCustomer");
  }
}

export async function createOrder(
  order: Omit<Order, "id" | "created_at" | "updated_at">,
): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createOrder");
  }
}

export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, "id" | "created_at" | "updated_at">>,
): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "updateOrder");
  }
}

// ============================================================================
// PAYMENTS
// ============================================================================

export async function getPayments(
  params: PaginationParams = { page: 1, limit: 50 },
  filters?: { status?: string; customer_id?: string },
): Promise<PaginatedResult<Payment>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("payments")
      .select("*, orders(order_number, product_name), customers(full_name)", { count: "exact" });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.customer_id) {
      query = query.eq("customer_id", filters.customer_id);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getPayments");
  }
}

export async function getPaymentsByOrder(orderId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, "getPaymentsByOrder");
  }
}

export async function createPayment(
  payment: Omit<Payment, "id" | "created_at" | "updated_at">,
): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert(payment)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createPayment");
  }
}

export async function updatePayment(
  id: string,
  updates: Partial<Omit<Payment, "id" | "created_at" | "updated_at">>,
): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "updatePayment");
  }
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export async function getWorkflows(
  params: PaginationParams = { page: 1, limit: 50 },
  filters?: { status?: string; customer_id?: string },
): Promise<PaginatedResult<Workflow>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("workflows")
      .select("*, customers(full_name), orders(order_number)", { count: "exact" });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.customer_id) {
      query = query.eq("customer_id", filters.customer_id);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getWorkflows");
  }
}

export async function getWorkflowsByCustomer(customerId: string): Promise<Workflow[]> {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, "getWorkflowsByCustomer");
  }
}

export async function createWorkflow(
  workflow: Omit<Workflow, "id" | "created_at">,
): Promise<Workflow> {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .insert(workflow)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createWorkflow");
  }
}

export async function updateWorkflow(
  id: string,
  updates: Partial<Omit<Workflow, "id" | "created_at">>,
): Promise<Workflow> {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "updateWorkflow");
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function getNotifications(
  params: PaginationParams = { page: 1, limit: 20 },
  unreadOnly = false,
): Promise<PaginatedResult<Notification>> {
  try {
    const { page = 1, limit = 20 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" });

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getNotifications");
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    return handleError(error, "markNotificationRead");
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) throw error;
  } catch (error) {
    return handleError(error, "markAllNotificationsRead");
  }
}

export async function createNotification(
  notification: Omit<Notification, "id" | "created_at">,
): Promise<Notification> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createNotification");
  }
}

// ============================================================================
// AGENT EXECUTION LOGS
// ============================================================================

export async function getAgentExecutionLogs(
  params: PaginationParams = { page: 1, limit: 50 },
  filters?: { agent_name?: string; status?: string; workflow_id?: string },
): Promise<PaginatedResult<AgentExecutionLog>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("agent_execution_logs")
      .select("*", { count: "exact" });

    if (filters?.agent_name) {
      query = query.eq("agent_name", filters.agent_name);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.workflow_id) {
      query = query.eq("workflow_id", filters.workflow_id);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getAgentExecutionLogs");
  }
}

export async function createAgentExecutionLog(
  log: Omit<AgentExecutionLog, "id" | "created_at">,
): Promise<AgentExecutionLog> {
  try {
    const { data, error } = await supabase
      .from("agent_execution_logs")
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createAgentExecutionLog");
  }
}

// ============================================================================
// AI CONVERSATIONS
// ============================================================================

export async function getConversationsBySession(
  sessionId: string,
): Promise<AiConversation[]> {
  try {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, "getConversationsBySession");
  }
}

export async function saveConversationMessage(
  message: Omit<AiConversation, "id" | "created_at">,
): Promise<AiConversation> {
  try {
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "saveConversationMessage");
  }
}

// ============================================================================
// AUTOMATIONS
// ============================================================================

export async function getAutomations(
  params: PaginationParams = { page: 1, limit: 50 },
): Promise<PaginatedResult<Automation>> {
  try {
    const { page = 1, limit = 50 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("automations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    return handleError(error, "getAutomations");
  }
}

export async function createAutomation(
  automation: Omit<Automation, "id" | "created_at" | "updated_at">,
): Promise<Automation> {
  try {
    const { data, error } = await supabase
      .from("automations")
      .insert(automation)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, "createAutomation");
  }
}

// ============================================================================
// DASHBOARD AGGREGATES
// ============================================================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingPayments: number;
  activeCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("amount, status, created_at");

    if (ordersError) throw ordersError;

    const { data: customersData, error: customersError } = await supabase
      .from("customers")
      .select("status");

    if (customersError) throw customersError;

    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("amount, status");

    if (paymentsError) throw paymentsError;

    const orders = ordersData || [];
    const customers = customersData || [];
    const payments = paymentsData || [];

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.amount), 0);

    const totalOrders = orders.length;

    const pendingPayments = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const activeCustomers = customers.filter(
      (c) => c.status === "active",
    ).length;

    // Calculate changes (mock: compare to a fixed baseline)
    const revenueChange = 12.5;
    const ordersChange = 8.1;

    return {
      totalRevenue,
      totalOrders,
      pendingPayments,
      activeCustomers,
      revenueChange,
      ordersChange,
    };
  } catch (error) {
    return handleError(error, "getDashboardStats");
  }
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToOrders(
  callback: (payload: { new: Order | null; old: Order | null; eventType: "INSERT" | "UPDATE" | "DELETE" }) => void,
) {
  return supabase
    .channel("orders-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        callback({
          new: payload.new as Order,
          old: payload.old as Order,
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
        });
      },
    )
    .subscribe();
}

export function subscribeToPayments(
  callback: (payload: { new: Payment | null; old: Payment | null; eventType: "INSERT" | "UPDATE" | "DELETE" }) => void,
) {
  return supabase
    .channel("payments-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "payments" },
      (payload) => {
        callback({
          new: payload.new as Payment,
          old: payload.old as Payment,
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
        });
      },
    )
    .subscribe();
}

export function subscribeToNotifications(
  callback: (payload: { new: Notification | null; eventType: "INSERT" }) => void,
) {
  return supabase
    .channel("notifications-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        callback({
          new: payload.new as Notification,
          eventType: "INSERT",
        });
      },
    )
    .subscribe();
}

export function subscribeToWorkflows(
  callback: (payload: { new: Workflow | null; old: Workflow | null; eventType: "INSERT" | "UPDATE" | "DELETE" }) => void,
) {
  return supabase
    .channel("workflows-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "workflows" },
      (payload) => {
        callback({
          new: payload.new as Workflow,
          old: payload.old as Workflow,
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
        });
      },
    )
    .subscribe();
}

export function subscribeToAgentLogs(
  callback: (payload: { new: AgentExecutionLog | null; eventType: "INSERT" }) => void,
) {
  return supabase
    .channel("agent-logs-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "agent_execution_logs" },
      (payload) => {
        callback({
          new: payload.new as AgentExecutionLog,
          eventType: "INSERT",
        });
      },
    )
    .subscribe();
}