"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Battery,
  Droplets,
  Cpu,
  Camera,
  Volume2,
  Wifi,
  HardDrive,
  Zap,
  Shield,
  Clock,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { generateReferenceNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { brandsByType, modelsByTypeAndBrand, getModelsForBrand, hasPredefinedModels } from "@/lib/device-data";

// Form validation schema
const repairSchema = z.object({
  deviceType: z.string().min(1, "Selecteer een apparaat type"),
  deviceBrand: z.string().min(1, "Selecteer een merk"),
  deviceModel: z.string().min(2, "Model is verplicht"),
  repairType: z.string().min(1, "Selecteer een reparatie type"),
  problemDescription: z.string().min(20, "Beschrijf het probleem in minimaal 20 tekens"),
  customerName: z.string().min(2, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig e-mailadres"),
  customerPhone: z.string().min(10, "Telefoonnummer is verplicht"),
  customerAddress: z.string().optional(),
  preferredDate: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Je moet akkoord gaan met de voorwaarden",
  }),
});

type RepairFormData = z.infer<typeof repairSchema>;

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
    value: "tablet",
    label: "Tablet",
    icon: Tablet,
    description: "iPad, Galaxy Tab, etc.",
    gradient: "from-[#0D9488] to-[#14B8A6]",
  },
  {
    value: "laptop",
    label: "Laptop",
    icon: Laptop,
    description: "MacBook, Windows, etc.",
    gradient: "from-copper to-gold",
  },
];

// brandsByType and modelsByTypeAndBrand are imported from @/lib/device-data

// Repair types with icons
const repairTypes = [
  {
    value: "scherm",
    label: "Scherm reparatie",
    icon: Monitor,
    description: "Gebroken of beschadigd scherm",
  },
  {
    value: "batterij",
    label: "Batterij vervangen",
    icon: Battery,
    description: "Slechte batterijduur",
  },
  {
    value: "waterschade",
    label: "Waterschade",
    icon: Droplets,
    description: "Contact met vloeistof",
  },
  {
    value: "software",
    label: "Software probleem",
    icon: Cpu,
    description: "Traag of crasht",
  },
  {
    value: "camera",
    label: "Camera reparatie",
    icon: Camera,
    description: "Defecte camera",
  },
  {
    value: "geluid",
    label: "Geluid/Speaker",
    icon: Volume2,
    description: "Audio problemen",
  },
  {
    value: "opladen",
    label: "Oplaadpoort",
    icon: Zap,
    description: "Laadt niet op",
  },
  {
    value: "anders",
    label: "Anders",
    icon: Wrench,
    description: "Ander probleem",
  },
];

// Step labels
const stepLabels = ["Apparaat", "Probleem", "Gegevens", "Bevestiging"];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const cardVariants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  tap: { scale: 0.98 },
  selected: { 
    scale: 1,
    transition: { duration: 0.2 }
  },
};

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 25 }
  },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function ReparatiePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const selectedType = watch("deviceType");
  const selectedBrand = watch("deviceBrand");
  const selectedModel = watch("deviceModel");
  const selectedRepairType = watch("repairType");
  const brands = selectedType ? brandsByType[selectedType] || [] : [];
  const models = selectedType && selectedBrand 
    ? getModelsForBrand(selectedType, selectedBrand) 
    : [];
  const showCustomModelInput = selectedBrand === "anders" || selectedModel === "anders";

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof RepairFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["deviceType", "deviceBrand", "deviceModel"];
    } else if (step === 2) {
      fieldsToValidate = ["repairType", "problemDescription"];
    } else if (step === 3) {
      fieldsToValidate = ["customerName", "customerEmail", "customerPhone", "termsAccepted"];
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

  const onSubmit = async (data: RepairFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const referenceNumber = generateReferenceNumber();
      success("Reparatie aanvraag ingediend!", `Referentienummer: ${referenceNumber}`);
      
      // Navigate to confirmation or reset
      router.push(`/reparatie/bevestiging?ref=${referenceNumber}`);
    } catch (err) {
      console.error("Submission error:", err);
      showError("Er ging iets mis", "Probeer het opnieuw");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"
          />
          <motion.div
            variants={pulseVariants}
            animate="animate"
            style={{ animationDelay: "1.5s" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"
          />
        </div>

        <Container>
          <motion.div 
            initial="initial"
            animate="animate"
            variants={pageVariants}
            className="relative z-10 text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-8"
            >
              <Wrench className="w-4 h-4 text-copper" />
              <span className="text-sm font-medium text-primary">Professionele Reparatie Service</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-soft-black mb-6 leading-[1.1]"
            >
              Laat je apparaat
              <br />
              <span className="text-gradient-primary">repareren</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg lg:text-xl text-slate max-w-2xl mx-auto mb-10"
            >
              Snel, betrouwbaar en vakkundig. Wij repareren je telefoon, tablet of laptop 
              met originele onderdelen en bieden garantie op elke reparatie.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              {[
                { icon: Shield, text: "12 maanden garantie" },
                { icon: Clock, text: "Vaak dezelfde dag klaar" },
                { icon: Sparkles, text: "Gratis diagnose" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-sand shadow-sm"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-soft-black">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating Device Illustrations */}
          <div className="hidden lg:block absolute top-1/2 left-8 -translate-y-1/2">
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="w-20 h-20 rounded-2xl bg-white border border-sand shadow-lg flex items-center justify-center"
            >
              <Smartphone className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          <div className="hidden lg:block absolute top-1/3 right-12">
            <motion.div
              variants={floatVariants}
              animate="animate"
              style={{ animationDelay: "1s" }}
              className="w-16 h-16 rounded-2xl bg-white border border-sand shadow-lg flex items-center justify-center"
            >
              <Laptop className="w-8 h-8 text-copper" />
            </motion.div>
          </div>
          <div className="hidden lg:block absolute bottom-1/4 right-24">
            <motion.div
              variants={floatVariants}
              animate="animate"
              style={{ animationDelay: "2s" }}
              className="w-14 h-14 rounded-xl bg-white border border-sand shadow-lg flex items-center justify-center"
            >
              <Tablet className="w-7 h-7 text-[#0D9488]" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Wizard Section */}
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
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary via-copper to-gold"
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
                          backgroundColor: isCompleted || isCurrent ? "var(--color-primary)" : "#fff",
                          borderColor: isCompleted || isCurrent ? "var(--color-primary)" : "var(--color-sand)",
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
                          isCurrent ? "text-primary" : isCompleted ? "text-soft-black" : "text-muted"
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-copper to-gold" />

              <form onSubmit={handleSubmit(onSubmit)}>
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
                          Welk apparaat wil je laten repareren?
                        </h2>
                        <p className="text-muted">Selecteer je apparaat type, merk en model</p>
                      </div>

                      {/* Device Type Cards */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-soft-black mb-4">
                          Type apparaat *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                }}
                                className={cn(
                                  "relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-colors overflow-hidden",
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-sand bg-white hover:border-primary/30"
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
                                      className="absolute top-3 right-3"
                                    >
                                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <div
                                  className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                                    isSelected
                                      ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                                      : "bg-champagne text-muted"
                                  )}
                                >
                                  <IconComponent className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                  <span className={cn(
                                    "block text-base font-semibold transition-colors",
                                    isSelected ? "text-primary" : "text-soft-black"
                                  )}>
                                    {type.label}
                                  </span>
                                  <span className="text-xs text-muted mt-1 block">
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

                      {/* Custom Model Input (shown when brand is "anders" or model is "anders") */}
                      <AnimatePresence mode="wait">
                        {(selectedBrand === "anders" || (selectedBrand && models.length === 0) || showCustomModelInput) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Input
                              label={showCustomModelInput ? "Voer je model in" : "Model"}
                              placeholder="bijv. iPhone 15 Pro, Galaxy S24, MacBook Pro M3"
                              {...register(showCustomModelInput ? "deviceModel" : "deviceModel")}
                              error={errors.deviceModel?.message}
                              required
                              helperText={showCustomModelInput ? "Typ het exacte model van je apparaat" : undefined}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Step 2: Problem Selection */}
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
                          Wat is het probleem?
                        </h2>
                        <p className="text-muted">Selecteer het type reparatie en beschrijf het probleem</p>
                      </div>

                      {/* Repair Type Grid */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-soft-black mb-4">
                          Type reparatie *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {repairTypes.map((type, index) => {
                            const isSelected = selectedRepairType === type.value;
                            const IconComponent = type.icon;

                            return (
                              <motion.button
                                key={type.value}
                                type="button"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setValue("repairType", type.value)}
                                className={cn(
                                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-sand bg-white hover:border-primary/30 hover:shadow-sm"
                                )}
                              >
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      variants={checkmarkVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="hidden"
                                      className="absolute -top-2 -right-2"
                                    >
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    isSelected ? "bg-primary text-white" : "bg-champagne text-muted"
                                  )}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                  "text-xs font-semibold text-center transition-colors",
                                  isSelected ? "text-primary" : "text-soft-black"
                                )}>
                                  {type.label}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        {errors.repairType && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm text-[#DC2626] flex items-center gap-2"
                          >
                            {errors.repairType.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Problem Description */}
                      <Textarea
                        label="Beschrijving van het probleem"
                        placeholder="Beschrijf zo gedetailleerd mogelijk wat er mis is met je apparaat. Wanneer is het begonnen? Wat heb je al geprobeerd?"
                        rows={5}
                        {...register("problemDescription")}
                        error={errors.problemDescription?.message}
                        required
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Contact Details */}
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
                        <p className="text-muted">Vul je gegevens in zodat we contact kunnen opnemen</p>
                      </div>

                      <div className="space-y-5">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Input
                            label="Volledige naam"
                            placeholder="Jan Jansen"
                            {...register("customerName")}
                            error={errors.customerName?.message}
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Input
                            label="E-mailadres"
                            type="email"
                            placeholder="jan@voorbeeld.nl"
                            {...register("customerEmail")}
                            error={errors.customerEmail?.message}
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Input
                            label="Telefoonnummer"
                            type="tel"
                            placeholder="06 12345678"
                            {...register("customerPhone")}
                            error={errors.customerPhone?.message}
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Input
                            label="Adres (optioneel)"
                            placeholder="Straatnaam 123, 1234 AB Stad"
                            {...register("customerAddress")}
                          />
                        </motion.div>

                        {/* Terms */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="pt-4"
                        >
                          <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                {...register("termsAccepted")}
                                className="w-5 h-5 rounded-md border-2 border-sand text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer transition-colors hover:border-primary"
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
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Confirmation */}
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
                          Controleer je aanvraag
                        </h2>
                        <p className="text-muted">Bekijk de gegevens en verstuur je reparatie aanvraag</p>
                      </div>

                      {/* Summary Cards */}
                      <div className="space-y-4">
                        {/* Device Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-cream rounded-2xl p-5 border border-sand"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              {selectedType === "telefoon" && <Smartphone className="w-5 h-5 text-primary" />}
                              {selectedType === "tablet" && <Tablet className="w-5 h-5 text-primary" />}
                              {selectedType === "laptop" && <Laptop className="w-5 h-5 text-primary" />}
                            </div>
                            <h3 className="font-semibold text-soft-black">Apparaat</h3>
                          </div>
                          <dl className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <dt className="text-muted">Type</dt>
                              <dd className="font-medium text-soft-black">
                                {deviceTypes.find((t) => t.value === selectedType)?.label}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted">Merk</dt>
                              <dd className="font-medium text-soft-black">
                                {brands.find((b) => b.value === watch("deviceBrand"))?.label}
                              </dd>
                            </div>
                            <div className="col-span-2">
                              <dt className="text-muted">Model</dt>
                              <dd className="font-medium text-soft-black">{watch("deviceModel")}</dd>
                            </div>
                          </dl>
                        </motion.div>

                        {/* Problem Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-cream rounded-2xl p-5 border border-sand"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center">
                              <Wrench className="w-5 h-5 text-copper" />
                            </div>
                            <h3 className="font-semibold text-soft-black">Probleem</h3>
                          </div>
                          <dl className="space-y-3 text-sm">
                            <div>
                              <dt className="text-muted">Type reparatie</dt>
                              <dd className="font-medium text-soft-black">
                                {repairTypes.find((t) => t.value === selectedRepairType)?.label}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted mb-1">Beschrijving</dt>
                              <dd className="font-medium text-soft-black bg-white rounded-xl p-3 border border-sand">
                                {watch("problemDescription")}
                              </dd>
                            </div>
                          </dl>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-cream rounded-2xl p-5 border border-sand"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-[#0D9488]" />
                            </div>
                            <h3 className="font-semibold text-soft-black">Contactgegevens</h3>
                          </div>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted" />
                              <span className="font-medium text-soft-black">{watch("customerName")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted" />
                              <span className="font-medium text-soft-black">{watch("customerEmail")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted" />
                              <span className="font-medium text-soft-black">{watch("customerPhone")}</span>
                            </div>
                            {watch("customerAddress") && (
                              <div className="flex items-center gap-2 col-span-2">
                                <MapPin className="w-4 h-4 text-muted" />
                                <span className="font-medium text-soft-black">{watch("customerAddress")}</span>
                              </div>
                            )}
                          </dl>
                        </motion.div>
                      </div>

                      {/* Info Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 bg-primary/5 rounded-2xl p-5 flex gap-4 border border-primary/10"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-soft-black mb-1">Wat gebeurt er na het versturen?</p>
                          <p className="text-sm text-slate">
                            We nemen binnen 24 uur contact met je op om een afspraak te maken. 
                            Je ontvangt een bevestigingsmail met alle details en een referentienummer.
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
                  <div className="flex items-center justify-between pt-6 border-t border-sand">
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
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="gap-2"
                      >
                        Volgende
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="gap-2 bg-gradient-to-r from-primary to-primary-light hover:shadow-xl"
                      >
                        Verstuur aanvraag
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Shield,
                  title: "Garantie",
                  description: "12 maanden garantie op elke reparatie",
                },
                {
                  icon: Clock,
                  title: "Snel klaar",
                  description: "De meeste reparaties binnen 24 uur",
                },
                {
                  icon: Sparkles,
                  title: "Kwaliteit",
                  description: "Originele of hoogwaardige onderdelen",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-sand"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-soft-black mb-1">{item.title}</h4>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
