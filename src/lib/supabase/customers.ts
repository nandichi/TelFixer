import { createClient, isSupabaseConfigured } from "./server";
import { User } from "@/types";

export interface CustomerWithStats extends User {
  orders_count: number;
  total_spent: number;
  submissions_count: number;
}

export async function getAllCustomers(): Promise<CustomerWithStats[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  // Get all users
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !users) {
    console.error("Error fetching customers:", error);
    return [];
  }

  // Get stats for each user
  const customersWithStats = await Promise.all(
    users.map(async (user) => {
      // Get order count and total spent
      const { data: orders } = await supabase
        .from("orders")
        .select("total_price")
        .eq("user_id", user.id);

      const ordersCount = orders?.length || 0;
      const totalSpent = orders?.reduce(
        (sum, order) => sum + parseFloat(order.total_price),
        0
      ) || 0;

      // Get submissions count
      const { count: submissionsCount } = await supabase
        .from("device_submissions")
        .select("*", { count: "exact", head: true })
        .eq("customer_email", user.email);

      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        created_at: user.created_at,
        updated_at: user.updated_at,
        orders_count: ordersCount,
        total_spent: totalSpent,
        submissions_count: submissionsCount || 0,
      };
    })
  );

  return customersWithStats;
}

export async function getCustomerById(id: string): Promise<CustomerWithStats | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    console.error("Error fetching customer:", error);
    return null;
  }

  // Get order count and total spent
  const { data: orders } = await supabase
    .from("orders")
    .select("total_price")
    .eq("user_id", user.id);

  const ordersCount = orders?.length || 0;
  const totalSpent = orders?.reduce(
    (sum, order) => sum + parseFloat(order.total_price),
    0
  ) || 0;

  // Get submissions count
  const { count: submissionsCount } = await supabase
    .from("device_submissions")
    .select("*", { count: "exact", head: true })
    .eq("customer_email", user.email);

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
    orders_count: ordersCount,
    total_spent: totalSpent,
    submissions_count: submissionsCount || 0,
  };
}

export async function getCustomerOrders(userId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching customer orders:", error);
    return [];
  }

  return data.map((order) => ({
    id: order.id,
    order_number: order.order_number,
    total_price: parseFloat(order.total_price),
    status: order.status,
    payment_status: order.payment_status,
    items_count: order.order_items?.length || 0,
    created_at: order.created_at,
  }));
}

export async function getCustomerSubmissions(email: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_submissions")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching customer submissions:", error);
    return [];
  }

  return data.map((submission) => ({
    id: submission.id,
    reference_number: submission.reference_number,
    device_brand: submission.device_brand,
    device_model: submission.device_model,
    status: submission.status,
    offered_price: submission.offered_price
      ? parseFloat(submission.offered_price)
      : null,
    created_at: submission.created_at,
  }));
}

export async function getCustomerStats() {
  if (!isSupabaseConfigured()) {
    return {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      averageOrderValue: 0,
      topSpenders: [],
    };
  }

  const supabase = await createClient();

  // Total customers
  const { count: totalCustomers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // New customers this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: newCustomersThisMonth } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  // Average order value
  const { data: ordersData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("payment_status", "paid");

  const totalRevenue = ordersData?.reduce(
    (sum, order) => sum + parseFloat(order.total_price),
    0
  ) || 0;
  const averageOrderValue = ordersData?.length
    ? totalRevenue / ordersData.length
    : 0;

  return {
    totalCustomers: totalCustomers || 0,
    newCustomersThisMonth: newCustomersThisMonth || 0,
    averageOrderValue,
    topSpenders: [],
  };
}
