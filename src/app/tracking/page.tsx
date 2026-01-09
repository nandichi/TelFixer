"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DeviceSubmission, SubmissionStatus } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const statusIcons: Record<string, typeof CheckCircle> = {
  ontvangen: Package,
  evaluatie: Clock,
  aanbieding_gemaakt: AlertCircle,
  aanbieding_geaccepteerd: CheckCircle,
  aanbieding_afgewezen: XCircle,
  afgehandeld: CheckCircle,
};

const statusLabels: Record<SubmissionStatus, string> = {
  ontvangen: "Inlevering ontvangen",
  evaluatie: "Apparaat wordt beoordeeld",
  aanbieding_gemaakt: "Prijsaanbod gemaakt",
  aanbieding_geaccepteerd: "Aanbod geaccepteerd",
  aanbieding_afgewezen: "Aanbod afgewezen",
  afgehandeld: "Afgehandeld",
};

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [submission, setSubmission] = useState<DeviceSubmission | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (configured && initialRef) {
      handleSearch(new Event("submit") as unknown as React.FormEvent);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    if (!isSupabaseConfigured()) {
      setError("Database niet geconfigureerd");
      return;
    }

    setError("");
    setIsSearching(true);

    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("device_submissions")
        .select("*")
        .eq("reference_number", referenceNumber.toUpperCase())
        .single();

      if (fetchError || !data) {
        setSubmission(null);
        setError("Geen inlevering gevonden met dit referentienummer");
      } else {
        setSubmission({
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
          offered_price: data.offered_price
            ? parseFloat(data.offered_price)
            : null,
          offer_accepted: data.offer_accepted,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch {
      setSubmission(null);
      setError("Er ging iets mis bij het ophalen van de gegevens");
    }

    setIsSearching(false);
  };

  const handleAcceptOffer = async () => {
    if (!submission || !isSupabaseConfigured()) return;
    setIsAccepting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("device_submissions")
        .update({
          offer_accepted: true,
          status: "aanbieding_geaccepteerd",
        })
        .eq("id", submission.id);

      if (!updateError) {
        setSubmission({
          ...submission,
          offer_accepted: true,
          status: "aanbieding_geaccepteerd",
        });
      }
    } catch {
      setError("Er ging iets mis bij het accepteren van het aanbod");
    }

    setIsAccepting(false);
  };

  const handleRejectOffer = async () => {
    if (!submission || !isSupabaseConfigured()) return;
    setIsRejecting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("device_submissions")
        .update({
          offer_accepted: false,
          status: "aanbieding_afgewezen",
        })
        .eq("id", submission.id);

      if (!updateError) {
        setSubmission({
          ...submission,
          offer_accepted: false,
          status: "aanbieding_afgewezen",
        });
      }
    } catch {
      setError("Er ging iets mis bij het afwijzen van het aanbod");
    }

    setIsRejecting(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Generate timeline based on current status
  const getTimeline = (sub: DeviceSubmission) => {
    const timeline: {
      status: SubmissionStatus;
      date: string;
      description: string;
      completed: boolean;
    }[] = [];

    // Always show ontvangen
    timeline.push({
      status: "ontvangen",
      date: sub.created_at,
      description: statusLabels.ontvangen,
      completed: true,
    });

    const currentIndex = [
      "ontvangen",
      "evaluatie",
      "aanbieding_gemaakt",
      "aanbieding_geaccepteerd",
      "afgehandeld",
    ].indexOf(sub.status);

    // Add other statuses up to current
    if (currentIndex >= 1) {
      timeline.push({
        status: "evaluatie",
        date: sub.updated_at,
        description: statusLabels.evaluatie,
        completed: true,
      });
    }

    if (
      sub.status === "aanbieding_gemaakt" ||
      sub.status === "aanbieding_geaccepteerd" ||
      sub.status === "aanbieding_afgewezen"
    ) {
      timeline.push({
        status: "aanbieding_gemaakt",
        date: sub.updated_at,
        description: sub.offered_price
          ? `${statusLabels.aanbieding_gemaakt}: ${new Intl.NumberFormat(
              "nl-NL",
              { style: "currency", currency: "EUR" }
            ).format(sub.offered_price)}`
          : statusLabels.aanbieding_gemaakt,
        completed: true,
      });
    }

    if (sub.status === "aanbieding_geaccepteerd") {
      timeline.push({
        status: "aanbieding_geaccepteerd",
        date: sub.updated_at,
        description: statusLabels.aanbieding_geaccepteerd,
        completed: true,
      });
    }

    if (sub.status === "aanbieding_afgewezen") {
      timeline.push({
        status: "aanbieding_afgewezen",
        date: sub.updated_at,
        description: statusLabels.aanbieding_afgewezen,
        completed: true,
      });
    }

    if (sub.status === "afgehandeld") {
      timeline.push({
        status: "afgehandeld",
        date: sub.updated_at,
        description: statusLabels.afgehandeld,
        completed: true,
      });
    }

    return timeline;
  };

  if (!isConfigured) {
    return (
      <div className="py-8 lg:py-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-amber-50 rounded-xl p-8">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-[#2C3E48] mb-2">
                Database niet geconfigureerd
              </h1>
              <p className="text-gray-600">
                Configureer je Supabase credentials in de .env.local file om
                deze functie te gebruiken.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E48]">
              Inlevering Volgen
            </h1>
            <p className="mt-2 text-gray-600">
              Voer je referentienummer in om de status van je inlevering te
              bekijken
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Bijv. TF-ABC123"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button type="submit" isLoading={isSearching}>
                <Search className="h-5 w-5 mr-2" />
                Zoeken
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </form>

          {/* Results */}
          {submission && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Referentienummer</p>
                    <p className="text-xl font-bold text-[#094543]">
                      {submission.reference_number}
                    </p>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Apparaat</p>
                    <p className="font-medium text-[#2C3E48]">
                      {submission.device_brand} {submission.device_model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ingediend op</p>
                    <p className="font-medium text-[#2C3E48]">
                      {formatDate(submission.created_at)}
                    </p>
                  </div>
                </div>

                {submission.offered_price && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">
                      Ons aanbod
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {new Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(submission.offered_price)}
                    </p>
                    {submission.status === "aanbieding_gemaakt" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAcceptOffer}
                          isLoading={isAccepting}
                        >
                          Accepteren
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRejectOffer}
                          isLoading={isRejecting}
                        >
                          Afwijzen
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2C3E48] mb-6">
                  Status Timeline
                </h2>
                <div className="space-y-6">
                  {getTimeline(submission).map((item, index, arr) => {
                    const Icon = statusIcons[item.status] || Clock;
                    const isLast = index === arr.length - 1;

                    return (
                      <div key={index} className="flex gap-4">
                        <div className="relative">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              isLast
                                ? "bg-[#094543] text-white"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < arr.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-medium text-[#2C3E48]">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E48] mb-2">
                  Vragen over je inlevering?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Neem contact met ons op als je vragen hebt over je inlevering
                  of het aanbod.
                </p>
                <Button variant="outline" size="sm">
                  Contact opnemen
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!submission && !error && !initialRef && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Voer je referentienummer in om de status te bekijken
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
