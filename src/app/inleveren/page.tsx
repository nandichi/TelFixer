"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Tablet,
  Key,
  Shield,
  Clock,
  Leaf,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Package,
  ArrowRight,
  Phone,
  Mail,
  User,
  Camera,
  X,
  Upload,
  Info,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { BaxxBuybackSection } from "@/components/baxx/baxx-buyback-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { brandsByType, getModelsForBrand } from "@/lib/device-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const submissionSchema = z.object({
  deviceType: z.string().min(1, "Selecteer een apparaat type"),
  deviceBrand: z.string().min(1, "Selecteer een merk"),
  deviceModel: z.string().min(2, "Model is verplicht"),
  conditionDescription: z
    .string()
    .min(20, "Beschrijf de conditie in minimaal 20 tekens"),
  customerName: z.string().min(2, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig e-mailadres"),
  customerPhone: z.string().min(10, "Telefoonnummer is verplicht"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Je moet akkoord gaan met de voorwaarden",
  }),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

// Device types with Lucide icons
const deviceTypes = [
  {
    value: "telefoon",
    label: "Telefoon",
    icon: Smartphone,
    description: "iPhone, Samsung, etc.",
    gradient: "from-primary to-primary-light",
  },
  {
    value: "laptop",
    label: "Laptop",
    icon: Laptop,
    description: "MacBook, Windows, etc.",
    gradient: "from-copper to-gold",
  },
  {
    value: "tablet",
    label: "Tablet",
    icon: Tablet,
    description: "iPad, Galaxy Tab, etc.",
    gradient: "from-[#0D9488] to-[#14B8A6]",
  },
  {
    value: "accessoire",
    label: "Accessoire",
    icon: Key,
    description: "Opladers, hoesjes, etc.",
    gradient: "from-[#7C3AED] to-[#A78BFA]",
  },
];

const stepLabels = ["Apparaat", "Conditie", "Gegevens", "Overzicht"];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

const cardVariants = {
  idle: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
  selected: { scale: 1, y: 0 },
};

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 30 },
  },
};

const DEFAULT_FOLLOWUP_TEXT =
  "Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail en WhatsApp. Als je akkoord gaat, ontvang je gratis verzendlabels om het apparaat naar ons toe te sturen.";

export default function SubmitDevicePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followupText, setFollowupText] = useState(DEFAULT_FOLLOWUP_TEXT);
  const [baxx, setBaxx] = useState<{ enabled: boolean; widget_code: string }>({
    enabled: false,
    widget_code: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["content", "baxx"]);
        if (!active || !data) return;
        for (const row of data) {
          if (row.key === "content" && row.value?.submission_followup) {
            setFollowupText(row.value.submission_followup);
          }
          if (row.key === "baxx" && row.value) {
            setBaxx({
              enabled: Boolean(row.value.enabled),
              widget_code:
                typeof row.value.widget_code === "string"
                  ? row.value.widget_code
                  : "",
            });
          }
        }
      } catch {
        // silently fall back to default
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const baxxActive = baxx.enabled && baxx.widget_code.trim().length > 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const selectedType = watch("deviceType");
  const selectedBrand = watch("deviceBrand");
  const selectedModel = watch("deviceModel");
  const brands = selectedType ? brandsByType[selectedType] || [] : [];
  const models = selectedType && selectedBrand 
    ? getModelsForBrand(selectedType, selectedBrand) 
    : [];
  const showCustomModelInput = selectedBrand === "anders" || selectedModel === "anders";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        showError("Bestand te groot", `${file.name} is groter dan 5MB`);
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        showError(
          "Ongeldig bestandstype",
          "Alleen JPG, PNG en WebP zijn toegestaan"
        );
        return false;
      }
      return true;
    });

    setPhotos((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof SubmissionFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["deviceType", "deviceBrand", "deviceModel"];
    } else if (step === 2) {
      fieldsToValidate = ["conditionDescription"];
    } else if (step === 3) {
      fieldsToValidate = [
        "customerName",
        "customerEmail",
        "customerPhone",
        "termsAccepted",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SubmissionFormData) => {
    // Prevent accidental submits via Enter on earlier steps
    if (step !== 4) return;

    setIsSubmitting(true);

    try {
      // Upload photos client-side to Supabase Storage first (if any)
      const photoUrls: string[] = [];
      if (photos.length > 0) {
        try {
          const supabase = createClient();
          const folder = `submissions/${Date.now()}`;
          for (const photo of photos) {
            const fileName = `${folder}/${photo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("submissions")
              .upload(fileName, photo, { upsert: false });

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from("submissions")
                .getPublicUrl(uploadData.path);
              if (urlData?.publicUrl) {
                photoUrls.push(urlData.publicUrl);
              }
            }
          }
        } catch (uploadErr) {
          console.warn("Photo upload failed, continuing without photos:", uploadErr);
        }
      }

      const brandLabel =
        brands.find((b) => b.value === data.deviceBrand)?.label || data.deviceBrand;
      const deviceTypeLabel =
        deviceTypes.find((t) => t.value === data.deviceType)?.label || data.deviceType;

      const response = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: data.deviceType,
          deviceTypeLabel,
          deviceBrand: data.deviceBrand,
          deviceBrandLabel: brandLabel,
          deviceModel: data.deviceModel,
          conditionDescription: data.conditionDescription,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          photoUrls,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Serverfout");
      }

      const result = await response.json();
      const referenceNumber: string = result.referenceNumber;

      success(
        "Inlevering ingediend!",
        `Referentienummer: ${referenceNumber}. Je ontvangt een bevestiging per e-mail.`
      );

      router.push(`/inleveren/bevestiging?ref=${referenceNumber}`);
    } catch (err) {
      console.error("Submission error:", err);
      showError(
        "Er ging iets mis",
        err instanceof Error ? err.message : "Probeer het opnieuw"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === "Enter" && target.tagName !== "TEXTAREA" && step !== 4) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft-black">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#04201f] to-primary-dark" />
          <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-copper/15 blur-3xl" />
          <div className="absolute -bottom-48 -right-32 w-[460px] h-[460px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_65%)]" />
        </div>

        <Container>
          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-14 sm:py-20 lg:py-24">
            {/* Tekst */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={pageVariants}
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6"
              >
                <Package className="w-4 h-4 text-copper-light" strokeWidth={1.75} />
                <span className="text-sm font-medium text-on-dark-muted">
                  Apparaat inleveren
                </span>
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.08] tracking-tight mb-6 heading-balance"
              >
                Oud toestel?
                <br />
                Wij geven het een{" "}
                <span className="whitespace-nowrap text-accent-on-dark">tweede leven</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg lg:text-xl text-on-dark-muted max-w-md leading-relaxed mb-8"
              >
                Lever je oude apparaat in en ontvang een eerlijk bod. Wij
                zorgen voor duurzame verwerking en snelle uitbetaling.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: Shield, text: "Eerlijk bod" },
                  { icon: Clock, text: "Snelle uitbetaling" },
                  { icon: Leaf, text: "Duurzaam" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 backdrop-blur-sm"
                  >
                    <item.icon className="w-4 h-4 text-copper-light shrink-0" strokeWidth={1.75} />
                    <span className="text-sm font-medium text-on-dark-muted">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Beeld */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden sm:block"
            >
              <div className="relative aspect-[4/3] rounded-3xl lg:rounded-[2.5rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <Image
                  src="/images/home/inleveren.jpg"
                  alt="Samsung Galaxy toestel klaar om ingeleverd te worden"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-soft-black/50 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Glas-chip */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
                  <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 shadow-lg">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-copper shrink-0">
                      <Leaf className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-white">
                        Gratis waardebepaling
                      </p>
                      <p className="text-xs text-on-dark-muted">
                        Binnen 2 werkdagen een bod
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Baxx Buyback widget zodra Baxx is ingeschakeld en de widget-code is
          ingevuld via Admin -> Instellingen -> Baxx, anders de eigen wizard */}
      {baxxActive ? (
        <BaxxBuybackSection widgetCode={baxx.widget_code} />
      ) : (
      <section className="py-12 lg:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center justify-between relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-sand" />
                {/* Progress Line Fill */}
                <motion.div
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-copper via-gold to-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {stepLabels.map((label, index) => {
                  const stepNum = index + 1;
                  const isCompleted = step > stepNum;
                  const isCurrent = step === stepNum;

                  return (
                    <div key={label} className="relative z-10 flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.1 : 1,
                          backgroundColor: isCompleted || isCurrent ? "var(--color-copper)" : "#fff",
                          borderColor: isCompleted || isCurrent ? "var(--color-copper)" : "var(--color-sand)",
                        }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-shadow",
                          (isCompleted || isCurrent) ? "text-white shadow-lg" : "text-muted bg-white"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <motion.span
                              key="number"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              {stepNum}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <span
                        className={cn(
                          "mt-2 text-xs font-medium transition-colors",
                          isCurrent ? "text-copper-text" : isCompleted ? "text-soft-black" : "text-slate"
                        )}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Container with Glass Effect */}
            <motion.div
              layout
              className="relative bg-white rounded-3xl border border-sand overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
            >
              {/* Decorative gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper via-gold to-primary" />

              <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
                <AnimatePresence mode="wait" custom={direction}>
                  {/* Step 1: Device Selection */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-6 sm:p-8 lg:p-10"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black mb-3">
                          Wat voor apparaat wil je inleveren?
                        </h2>
                        <p className="text-muted">Selecteer je apparaat type, merk en model</p>
                      </div>

                      {/* Device Type Cards */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-soft-black mb-4">
                          Type apparaat *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {deviceTypes.map((type) => {
                            const isSelected = selectedType === type.value;
                            const IconComponent = type.icon;

                            return (
                              <motion.button
                                key={type.value}
                                type="button"
                                variants={cardVariants}
                                initial="idle"
                                whileHover="hover"
                                whileTap="tap"
                                animate={isSelected ? "selected" : "idle"}
                                onClick={() => {
                                  setValue("deviceType", type.value);
                                  setValue("deviceBrand", "");
                                  setValue("deviceModel", "");
                                }}
                                className={cn(
                                  "relative flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-colors overflow-hidden",
                                  isSelected
                                    ? "border-copper bg-copper/5"
                                    : "border-sand bg-white hover:border-copper/30"
                                )}
                              >
                                {/* Selected indicator */}
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      variants={checkmarkVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="hidden"
                                      className="absolute top-2 right-2"
                                    >
                                      <div className="w-5 h-5 rounded-full bg-copper flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <div
                                  className={cn(
                                    "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all",
                                    isSelected
                                      ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                                      : "bg-champagne text-muted"
                                  )}
                                >
                                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div className="text-center">
                                  <span className={cn(
                                    "block text-sm font-semibold transition-colors",
                                    isSelected ? "text-copper" : "text-soft-black"
                                  )}>
                                    {type.label}
                                  </span>
                                  <span className="text-[10px] sm:text-xs text-muted mt-0.5 block">
                                    {type.description}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                        {errors.deviceType && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm text-[#DC2626] flex items-center gap-2"
                          >
                            {errors.deviceType.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Brand Selection */}
                      <AnimatePresence mode="wait">
                        {selectedType && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6"
                          >
                            <Select
                              label="Merk"
                              options={brands}
                              placeholder="Selecteer een merk"
                              {...register("deviceBrand")}
                              error={errors.deviceBrand?.message}
                              required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Model Selection */}
                      <AnimatePresence mode="wait">
                        {selectedBrand && selectedBrand !== "anders" && models.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6"
                          >
                            <Select
                              label="Model"
                              options={[
                                ...models.map(model => ({ value: model, label: model })),
                                { value: "anders", label: "Mijn model staat er niet bij" }
                              ]}
                              placeholder="Selecteer je model"
                              {...register("deviceModel")}
                              error={errors.deviceModel?.message}
                              required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Custom Model Input */}
                      <AnimatePresence mode="wait">
                        {(selectedBrand === "anders" || (selectedBrand && models.length === 0) || showCustomModelInput) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Input
                              label={showCustomModelInput && selectedModel === "anders" ? "Voer je model in" : "Model"}
                              placeholder="bijv. iPhone 14 Pro, MacBook Air M2"
                              {...register("deviceModel")}
                              error={errors.deviceModel?.message}
                              required
                              helperText={showCustomModelInput ? "Typ het exacte model van je apparaat" : undefined}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Step 2: Condition & Photos */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-6 sm:p-8 lg:p-10"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black mb-3">
                          Beschrijf de conditie
                        </h2>
                        <p className="text-muted">Vertel ons over de staat van je apparaat</p>
                      </div>

                      <Textarea
                        label="Conditie beschrijving"
                        placeholder="Beschrijf de staat van je apparaat. Zijn er krassen, deuken of defecten? Werkt alles naar behoren?"
                        rows={5}
                        {...register("conditionDescription")}
                        error={errors.conditionDescription?.message}
                        required
                      />

                      {/* Photo Upload */}
                      <div className="mt-8">
                        <label className="block text-sm font-medium text-soft-black mb-4">
                          Foto&apos;s uploaden (optioneel, max 5)
                        </label>

                        {/* Upload Area */}
                        <label className={cn(
                          "flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
                          photos.length >= 5
                            ? "border-sand bg-champagne/50 cursor-not-allowed"
                            : "border-sand bg-cream hover:border-copper hover:bg-copper/5"
                        )}>
                          <div className="flex flex-col items-center">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="w-14 h-14 rounded-xl bg-copper/10 flex items-center justify-center mb-3"
                            >
                              <Upload className="w-7 h-7 text-copper" />
                            </motion.div>
                            <span className="text-sm font-medium text-soft-black">
                              Klik om foto&apos;s te uploaden
                            </span>
                            <span className="text-xs text-muted mt-1">
                              JPG, PNG of WebP (max 5MB per bestand)
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={photos.length >= 5}
                          />
                        </label>

                        {/* Photo Preview */}
                        <AnimatePresence>
                          {photos.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 flex flex-wrap gap-3"
                            >
                              {photos.map((photo, index) => (
                                <motion.div 
                                  key={index} 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="relative group"
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-xl border border-sand"
                                  />
                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </motion.button>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Personal Info */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-6 sm:p-8 lg:p-10"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black mb-3">
                          Je contactgegevens
                        </h2>
                        <p className="text-muted">We nemen contact met je op over het bod</p>
                      </div>

                      <div className="space-y-5">
                        <Input
                          label="Volledige naam"
                          placeholder="Jan Jansen"
                          {...register("customerName")}
                          error={errors.customerName?.message}
                          required
                        />
                        <Input
                          label="E-mailadres"
                          type="email"
                          placeholder="jan@voorbeeld.nl"
                          {...register("customerEmail")}
                          error={errors.customerEmail?.message}
                          required
                        />
                        <Input
                          label="Telefoonnummer"
                          type="tel"
                          placeholder="06 12345678"
                          {...register("customerPhone")}
                          error={errors.customerPhone?.message}
                          required
                        />

                        {/* Terms */}
                        <div className="pt-4">
                          <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                {...register("termsAccepted")}
                                className="w-5 h-5 rounded-md border-2 border-sand text-copper focus:ring-copper focus:ring-offset-0 cursor-pointer"
                              />
                            </div>
                            <span className="text-sm text-slate group-hover:text-soft-black transition-colors">
                              Ik ga akkoord met de{" "}
                              <a
                                href="/voorwaarden"
                                className="text-primary underline underline-offset-2 hover:text-primary-light"
                              >
                                algemene voorwaarden
                              </a>{" "}
                              en het{" "}
                              <a 
                                href="/privacy" 
                                className="text-primary underline underline-offset-2 hover:text-primary-light"
                              >
                                privacybeleid
                              </a>
                              . *
                            </span>
                          </label>
                          {errors.termsAccepted && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 text-sm text-[#DC2626] flex items-center gap-2"
                            >
                              {errors.termsAccepted.message}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-6 sm:p-8 lg:p-10"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-soft-black mb-3">
                          Controleer je gegevens
                        </h2>
                        <p className="text-muted">Bekijk de informatie voordat je indient</p>
                      </div>

                      <dl className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-sand">
                          <dt className="text-muted flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Apparaat
                          </dt>
                          <dd className="font-semibold text-soft-black">
                            {deviceTypes.find((t) => t.value === watch("deviceType"))?.label}
                          </dd>
                        </div>
                        <div className="flex justify-between py-3 border-b border-sand">
                          <dt className="text-muted">Merk</dt>
                          <dd className="font-semibold text-soft-black">
                            {brands.find((b) => b.value === watch("deviceBrand"))?.label || watch("deviceBrand")}
                          </dd>
                        </div>
                        <div className="flex justify-between py-3 border-b border-sand">
                          <dt className="text-muted">Model</dt>
                          <dd className="font-semibold text-soft-black">
                            {watch("deviceModel")}
                          </dd>
                        </div>
                        <div className="py-3 border-b border-sand">
                          <dt className="text-muted mb-2">Conditie</dt>
                          <dd className="text-soft-black bg-cream rounded-xl p-4 text-sm">
                            {watch("conditionDescription")}
                          </dd>
                        </div>
                        {photos.length > 0 && (
                          <div className="py-3 border-b border-sand">
                            <dt className="text-muted mb-3 flex items-center gap-2">
                              <Camera className="w-4 h-4" />
                              Foto&apos;s ({photos.length})
                            </dt>
                            <dd className="flex gap-3 flex-wrap">
                              {photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={URL.createObjectURL(photo)}
                                  alt={`Upload ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-sand"
                                />
                              ))}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between py-3 border-b border-sand">
                          <dt className="text-muted flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Naam
                          </dt>
                          <dd className="font-semibold text-soft-black">
                            {watch("customerName")}
                          </dd>
                        </div>
                        <div className="flex justify-between py-3 border-b border-sand">
                          <dt className="text-muted flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            E-mail
                          </dt>
                          <dd className="font-semibold text-soft-black">
                            {watch("customerEmail")}
                          </dd>
                        </div>
                        <div className="flex justify-between py-3">
                          <dt className="text-muted flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefoon
                          </dt>
                          <dd className="font-semibold text-soft-black">
                            {watch("customerPhone")}
                          </dd>
                        </div>
                      </dl>

                      {/* Info Box */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-copper/5 rounded-2xl p-5 flex gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                          <Info className="w-6 h-6 text-copper" />
                        </div>
                        <div>
                          <p className="font-semibold text-soft-black mb-1">
                            Wat gebeurt er na het indienen?
                          </p>
                          <p className="text-sm text-slate whitespace-pre-line">
                            {followupText}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between p-6 sm:p-8 lg:p-10 pt-0 sm:pt-0 lg:pt-0 border-t border-sand mt-6">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Terug
                    </Button>
                  ) : (
                    <div />
                  )}
                  {step < 4 ? (
                    <Button type="button" onClick={handleNextStep} className="gap-2">
                      Volgende
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="submit" isLoading={isSubmitting} className="gap-2">
                      Inlevering indienen
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
      )}
    </div>
  );
}
