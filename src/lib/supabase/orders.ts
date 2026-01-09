import { createClient, isSupabaseConfigured } from "./server";
import { Order, OrderStatus, PaymentStatus } from "@/types";

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, users(id, email, first_name, last_name)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    order_number: item.order_number,
    user_id: item.user_id,
    user: item.users,
    total_price: parseFloat(item.total_price),
    shipping_cost: parseFloat(item.shipping_cost || "0"),
    tax: parseFloat(item.tax || "0"),
    status: item.status as OrderStatus,
    shipping_address: item.shipping_address,
    billing_address: item.billing_address,
    payment_status: item.payment_status as PaymentStatus,
    payment_method: item.payment_method,
    tracking_number: item.tracking_number,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, users(id, email, first_name, last_name), order_items(*, products(id, name, slug, image_urls))"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching order:", error);
    return null;
  }

  return {
    id: data.id,
    order_number: data.order_number,
    user_id: data.user_id,
    user: data.users,
    total_price: parseFloat(data.total_price),
    shipping_cost: parseFloat(data.shipping_cost || "0"),
    tax: parseFloat(data.tax || "0"),
    status: data.status as OrderStatus,
    shipping_address: data.shipping_address,
    billing_address: data.billing_address,
    payment_status: data.payment_status as PaymentStatus,
    payment_method: data.payment_method,
    tracking_number: data.tracking_number,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
    items:
      data.order_items?.map((item: Record<string, unknown>) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product: item.products,
        product_name: item.product_name,
        quantity: item.quantity,
        price_at_purchase: parseFloat(item.price_at_purchase as string),
        created_at: item.created_at,
      })) || [],
  };
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(id, name, slug, image_urls))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    order_number: item.order_number,
    user_id: item.user_id,
    total_price: parseFloat(item.total_price),
    shipping_cost: parseFloat(item.shipping_cost || "0"),
    tax: parseFloat(item.tax || "0"),
    status: item.status as OrderStatus,
    shipping_address: item.shipping_address,
    billing_address: item.billing_address,
    payment_status: item.payment_status as PaymentStatus,
    payment_method: item.payment_method,
    tracking_number: item.tracking_number,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,
    items:
      item.order_items?.map((orderItem: Record<string, unknown>) => ({
        id: orderItem.id,
        order_id: orderItem.order_id,
        product_id: orderItem.product_id,
        product: orderItem.products,
        product_name: orderItem.product_name,
        quantity: orderItem.quantity,
        price_at_purchase: parseFloat(orderItem.price_at_purchase as string),
        created_at: orderItem.created_at,
      })) || [],
  }));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };
  if (trackingNumber !== undefined) {
    updateData.tracking_number = trackingNumber;
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating order:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function getOrderStats() {
  if (!isSupabaseConfigured()) {
    return {
      totalRevenue: 0,
      orderCount: 0,
      customerCount: 0,
      submissionCount: 0,
    };
  }

  const supabase = await createClient();

  // Get total revenue
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("payment_status", "paid");

  const totalRevenue = (revenueData || []).reduce(
    (sum, order) => sum + parseFloat(order.total_price),
    0
  );

  // Get order count
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Get customer count
  const { count: customerCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get submission count
  const { count: submissionCount } = await supabase
    .from("device_submissions")
    .select("*", { count: "exact", head: true });

  return {
    totalRevenue,
    orderCount: orderCount || 0,
    customerCount: customerCount || 0,
    submissionCount: submissionCount || 0,
  };
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, users(id, email, first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    order_number: item.order_number,
    user_id: item.user_id,
    user: item.users,
    total_price: parseFloat(item.total_price),
    shipping_cost: parseFloat(item.shipping_cost || "0"),
    tax: parseFloat(item.tax || "0"),
    status: item.status as OrderStatus,
    shipping_address: item.shipping_address,
    billing_address: item.billing_address,
    payment_status: item.payment_status as PaymentStatus,
    payment_method: item.payment_method,
    tracking_number: item.tracking_number,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}
