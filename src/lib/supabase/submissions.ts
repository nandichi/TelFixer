import { createClient, isSupabaseConfigured } from "./server";
import { DeviceSubmission, SubmissionStatus } from "@/types";

export async function getSubmissionByReference(
  referenceNumber: string
): Promise<DeviceSubmission | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_submissions")
    .select("*")
    .eq("reference_number", referenceNumber.toUpperCase())
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    reference_number: data.reference_number,
    user_id: data.user_id,
    device_type: data.device_type,
    device_brand: data.device_brand,
    device_model: data.device_model,
    condition_description: data.condition_description,
    photos_urls: data.photos_urls || [],
    status: data.status as SubmissionStatus,
    evaluation_notes: data.evaluation_notes,
    offered_price: data.offered_price ? parseFloat(data.offered_price) : null,
    offer_accepted: data.offer_accepted,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function createSubmission(submission: {
  reference_number: string;
  device_type: string;
  device_brand: string;
  device_model: string;
  condition_description: string;
  photos_urls?: string[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id?: string;
}): Promise<{ data: DeviceSubmission | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_submissions")
    .insert({
      reference_number: submission.reference_number,
      device_type: submission.device_type,
      device_brand: submission.device_brand,
      device_model: submission.device_model,
      condition_description: submission.condition_description,
      photos_urls: submission.photos_urls || [],
      customer_name: submission.customer_name,
      customer_email: submission.customer_email,
      customer_phone: submission.customer_phone,
      user_id: submission.user_id || null,
      status: "ontvangen",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating submission:", error);
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: {
      id: data.id,
      reference_number: data.reference_number,
      user_id: data.user_id,
      device_type: data.device_type,
      device_brand: data.device_brand,
      device_model: data.device_model,
      condition_description: data.condition_description,
      photos_urls: data.photos_urls || [],
      status: data.status as SubmissionStatus,
      evaluation_notes: data.evaluation_notes,
      offered_price: data.offered_price ? parseFloat(data.offered_price) : null,
      offer_accepted: data.offer_accepted,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
    error: null,
  };
}

export async function getSubmissionsByEmail(
  email: string
): Promise<DeviceSubmission[]> {
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
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    reference_number: item.reference_number,
    user_id: item.user_id,
    device_type: item.device_type,
    device_brand: item.device_brand,
    device_model: item.device_model,
    condition_description: item.condition_description,
    photos_urls: item.photos_urls || [],
    status: item.status as SubmissionStatus,
    evaluation_notes: item.evaluation_notes,
    offered_price: item.offered_price ? parseFloat(item.offered_price) : null,
    offer_accepted: item.offer_accepted,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    customer_phone: item.customer_phone,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function getAllSubmissions(): Promise<DeviceSubmission[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    reference_number: item.reference_number,
    user_id: item.user_id,
    device_type: item.device_type,
    device_brand: item.device_brand,
    device_model: item.device_model,
    condition_description: item.condition_description,
    photos_urls: item.photos_urls || [],
    status: item.status as SubmissionStatus,
    evaluation_notes: item.evaluation_notes,
    offered_price: item.offered_price ? parseFloat(item.offered_price) : null,
    offer_accepted: item.offer_accepted,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    customer_phone: item.customer_phone,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  offeredPrice?: number,
  evaluationNotes?: string
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };
  if (offeredPrice !== undefined) {
    updateData.offered_price = offeredPrice;
  }
  if (evaluationNotes !== undefined) {
    updateData.evaluation_notes = evaluationNotes;
  }

  const { error } = await supabase
    .from("device_submissions")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating submission:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function acceptOffer(
  id: string
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("device_submissions")
    .update({
      offer_accepted: true,
      status: "aanbieding_geaccepteerd",
    })
    .eq("id", id);

  if (error) {
    console.error("Error accepting offer:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function rejectOffer(
  id: string
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error("Supabase is niet geconfigureerd") };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("device_submissions")
    .update({
      offer_accepted: false,
      status: "aanbieding_afgewezen",
    })
    .eq("id", id);

  if (error) {
    console.error("Error rejecting offer:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}
