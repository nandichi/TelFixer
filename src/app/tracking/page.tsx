"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Wrench,
  ShoppingBag,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";

type TrackingResult =
  | {
      kind: "submission";
      reference_number: string;
      status: string;
      created_at: string;
      updated_at: string;
      details: {
        device: string;
        deviceType: string;
        condition: string;
        offeredPrice: number | null;
        offerAccepted: boolean | null;
        evaluationNotes: string | null;
      };
    }
  | {
      kind: "repair";
      reference_number: string;
      status: string;
      created_at: string;
      updated_at: string;
      details: {
        device: string;
        deviceType: string;
        repairType: string;
        problem: string;
        price: number | null;
        notes: string | null;
      };
    }
  | {
      kind: "order";
      reference_number: string;
      status: string;
      created_at: string;
      updated_at: string;
      details: {
        paymentStatus: string | null;
        totalPrice: number | null;
        trackingNumber: string | null;
        shippingAddress: Record<string, string> | null;
        items: Array<{ name: string; quantity: number; price: number }>;
      };
    };

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function TrackingInner() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const lookup = useCallback(async (rawRef: string) => {
    const ref = rawRef.trim();
    if (!ref) return;

    setError("");
    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/tracking?ref=${encodeURIComponent(ref)}`,
        { cache: "no-store" }
      );
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Er ging iets mis");
        return;
      }

      setResult(payload as TrackingResult);
    } catch (err) {
      console.error(err);
      setError("Er ging iets mis bij het ophalen van de gegevens");
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (initialRef) {
      lookup(initialRef);
    }
  }, [initialRef, lookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(referenceNumber);
  };

  const kindMeta: Record<
    TrackingResult["kind"],
    { label: string; icon: typeof Package; color: string }
  > = {
    submission: { label: "Inlevering", icon: Package, color: "#0284C7" },
    repair: { label: "Reparatie", icon: Wrench, color: "#B8946A" },
    order: { label: "Bestelling", icon: ShoppingBag, color: "#094543" },
  };

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E48]">Volg je aanvraag</h1>
            <p className="mt-2 text-gray-600">
              Voer je referentienummer in om de status van je inlevering,
              reparatie of bestelling te bekijken.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Bijv. TF-ABC123 of ORD-XYZ"
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
            {error && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>

          {result && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = kindMeta[result.kind].icon;
                      return (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: `${kindMeta[result.kind].color}1A`,
                            color: kindMeta[result.kind].color,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {kindMeta[result.kind].label}
                      </p>
                      <p className="text-xl font-bold text-[#094543]">
                        {result.reference_number}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={result.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Aangemaakt</p>
                    <p className="font-medium text-[#2C3E48]">
                      {formatDate(result.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Laatste update</p>
                    <p className="font-medium text-[#2C3E48]">
                      {formatDate(result.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {result.kind === "submission" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Apparaat</p>
                    <p className="font-medium text-[#2C3E48]">
                      {result.details.device}{" "}
                      <span className="text-gray-500 text-sm">
                        ({result.details.deviceType})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conditie</p>
                    <p className="text-[#2C3E48] whitespace-pre-line">
                      {result.details.condition}
                    </p>
                  </div>
                  {result.details.offeredPrice !== null && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-700 font-medium">
                        Ons aanbod
                      </p>
                      <p className="text-2xl font-bold text-emerald-800">
                        {formatEuro(result.details.offeredPrice)}
                      </p>
                      {result.details.offerAccepted !== null && (
                        <p className="text-xs text-emerald-700 mt-1">
                          {result.details.offerAccepted
                            ? "Geaccepteerd"
                            : "Afgewezen"}
                        </p>
                      )}
                    </div>
                  )}
                  {result.details.evaluationNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Opmerkingen</p>
                      <p className="text-[#2C3E48] whitespace-pre-line">
                        {result.details.evaluationNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.kind === "repair" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Apparaat</p>
                    <p className="font-medium text-[#2C3E48]">
                      {result.details.device}{" "}
                      <span className="text-gray-500 text-sm">
                        ({result.details.deviceType})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type reparatie</p>
                    <p className="font-medium text-[#2C3E48]">
                      {result.details.repairType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Omschrijving</p>
                    <p className="text-[#2C3E48] whitespace-pre-line">
                      {result.details.problem}
                    </p>
                  </div>
                  {result.details.price !== null && (
                    <div className="p-4 bg-copper/10 rounded-lg">
                      <p className="text-sm text-copper font-medium">
                        Reparatieprijs
                      </p>
                      <p className="text-2xl font-bold text-copper">
                        {formatEuro(result.details.price)}
                      </p>
                    </div>
                  )}
                  {result.details.notes && (
                    <div>
                      <p className="text-sm text-gray-500">Notities</p>
                      <p className="text-[#2C3E48] whitespace-pre-line">
                        {result.details.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.kind === "order" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {result.details.paymentStatus && (
                      <div>
                        <p className="text-sm text-gray-500">Betaalstatus</p>
                        <p className="font-medium text-[#2C3E48] capitalize">
                          {result.details.paymentStatus}
                        </p>
                      </div>
                    )}
                    {result.details.totalPrice !== null && (
                      <div>
                        <p className="text-sm text-gray-500">Totaal</p>
                        <p className="font-medium text-[#094543]">
                          {formatEuro(result.details.totalPrice)}
                        </p>
                      </div>
                    )}
                  </div>

                  {result.details.items.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Producten ({result.details.items.length})
                      </p>
                      <ul className="divide-y divide-gray-100">
                        {result.details.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between py-2"
                          >
                            <span className="text-[#2C3E48]">
                              {item.name}{" "}
                              <span className="text-gray-500 text-sm">
                                × {item.quantity}
                              </span>
                            </span>
                            <span className="font-medium text-[#094543]">
                              {formatEuro(item.price * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.details.trackingNumber && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Track &amp; trace
                      </p>
                      <p className="font-mono text-emerald-800 mt-1">
                        {result.details.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E48] mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Vragen over de status?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Neem gerust contact met ons op via e-mail, telefoon of WhatsApp.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Contact opnemen
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/31644642162"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      style={{ backgroundColor: "#25D366", color: "#ffffff" }}
                    >
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}

          {!result && !error && !initialRef && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
                <Wrench className="h-8 w-8 text-gray-400" />
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Werkt voor inleveringen, reparaties en bestellingen
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#094543] border-t-transparent animate-spin" />
        </div>
      }
    >
      <TrackingInner />
    </Suspense>
  );
}
