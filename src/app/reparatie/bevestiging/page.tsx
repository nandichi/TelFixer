"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Mail, 
  Clock, 
  ArrowRight, 
  Home, 
  Phone,
  FileText,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const referenceNumber = searchParams.get("ref") || "REP-XXXXXX";

  return (
    <div className="min-h-screen bg-cream py-16 lg:py-24">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.1 
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Outer ring animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute inset-0 rounded-full bg-primary/20"
              />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-xl">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.3 
                  }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black mb-4">
              Aanvraag ontvangen!
            </h1>
            <p className="text-lg text-muted max-w-md mx-auto">
              Bedankt voor je reparatie aanvraag. We nemen zo snel mogelijk contact met je op.
            </p>
          </motion.div>

          {/* Reference Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-sand p-6 sm:p-8 mb-8 text-center"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Referentienummer</span>
            </div>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-soft-black tracking-wider">
              {referenceNumber}
            </p>
            <p className="text-sm text-muted mt-3">
              Bewaar dit nummer om je aanvraag te kunnen volgen
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl border border-sand p-6 sm:p-8 mb-8"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
          >
            <h2 className="text-xl font-display font-semibold text-soft-black mb-6 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-copper" />
              Wat gebeurt er nu?
            </h2>
            
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Bevestigingsmail",
                  description: "Je ontvangt binnen enkele minuten een bevestigingsmail met alle details van je aanvraag.",
                  time: "Nu",
                },
                {
                  icon: Phone,
                  title: "Contact opnemen",
                  description: "Een van onze technici neemt binnen 24 uur contact met je op om een afspraak te maken.",
                  time: "Binnen 24 uur",
                },
                {
                  icon: Clock,
                  title: "Reparatie",
                  description: "Na ontvangst van je apparaat starten we direct met de reparatie. Meestal is deze binnen 24-48 uur klaar.",
                  time: "1-2 werkdagen",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    {index < 2 && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-sand" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-soft-black">{step.title}</h3>
                      <span className="text-xs font-medium text-copper bg-copper/10 px-2 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" />
                Terug naar home
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Neem contact op
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted">
              Vragen? Neem contact op via{" "}
              <a href="mailto:info@telfixer.nl" className="text-primary hover:underline">
                info@telfixer.nl
              </a>{" "}
              of bel{" "}
              <a href="tel:+31612345678" className="text-primary hover:underline">
                06 12345678
              </a>
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default function RepairConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
