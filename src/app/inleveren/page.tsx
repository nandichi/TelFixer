"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { generateReferenceNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

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

const deviceTypes = [
  { 
    value: "telefoon", 
    label: "Telefoon", 
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    value: "laptop", 
    label: "Laptop", 
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    value: "tablet", 
    label: "Tablet", 
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    value: "accessoire", 
    label: "Accessoire", 
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    )
  },
];

const brandsByType: Record<string, { value: string; label: string }[]> = {
  telefoon: [
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "google", label: "Google" },
    { value: "oneplus", label: "OnePlus" },
    { value: "xiaomi", label: "Xiaomi" },
    { value: "huawei", label: "Huawei" },
    { value: "anders", label: "Anders" },
  ],
  laptop: [
    { value: "apple", label: "Apple" },
    { value: "lenovo", label: "Lenovo" },
    { value: "hp", label: "HP" },
    { value: "dell", label: "Dell" },
    { value: "asus", label: "ASUS" },
    { value: "microsoft", label: "Microsoft" },
    { value: "anders", label: "Anders" },
  ],
  tablet: [
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "microsoft", label: "Microsoft" },
    { value: "lenovo", label: "Lenovo" },
    { value: "anders", label: "Anders" },
  ],
  accessoire: [
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "anders", label: "Anders" },
  ],
};

const stepLabels = ["Apparaat", "Conditie", "Gegevens", "Overzicht"];

export default function SubmitDevicePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
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
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const selectedType = watch("deviceType");
  const brands = selectedType ? brandsByType[selectedType] || [] : [];

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
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SubmissionFormData) => {
    if (!isSupabaseConfigured()) {
      showError(
        "Database niet geconfigureerd",
        "Neem contact op met de beheerder"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const referenceNumber = generateReferenceNumber();

      // Upload photos if any
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `${referenceNumber}/${Date.now()}-${photo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("submissions")
          .upload(fileName, photo);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("submissions")
            .getPublicUrl(uploadData.path);
          if (urlData) {
            photoUrls.push(urlData.publicUrl);
          }
        }
      }

      // Get brand label
      const brandLabel =
        brands.find((b) => b.value === data.deviceBrand)?.label ||
        data.deviceBrand;

      // Create submission in database
      const { error: insertError } = await supabase
        .from("device_submissions")
        .insert({
          reference_number: referenceNumber,
          device_type: data.deviceType,
          device_brand: brandLabel,
          device_model: data.deviceModel,
          condition_description: data.conditionDescription,
          photos_urls: photoUrls,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
          status: "ontvangen",
        });

      if (insertError) {
        throw insertError;
      }

      success("Inlevering ingediend!", `Referentienummer: ${referenceNumber}`);
      router.push(`/inleveren/bevestiging?ref=${referenceNumber}`);
    } catch (err) {
      console.error("Submission error:", err);
      showError("Er ging iets mis", "Probeer het opnieuw");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="py-16 lg:py-24 bg-cream">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl border border-sand p-12">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-display font-bold text-soft-black mb-3">
                Database niet geconfigureerd
              </h1>
              <p className="text-muted">
                Configureer je Supabase credentials in de .env.local file om
                apparaten in te kunnen leveren.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 bg-cream min-h-[80vh]">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Inleveren
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-soft-black mb-4">
              Apparaat inleveren
            </h1>
            <p className="text-lg text-muted max-w-lg mx-auto">
              Lever je oude apparaat in en ontvang een eerlijk bod.
              Wij zorgen voor duurzame verwerking.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-sand">
                <div 
                  className="h-full bg-gradient-to-r from-copper to-gold transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
              
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300",
                      step > s
                        ? "bg-gradient-to-br from-copper to-gold text-white"
                        : step === s
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-sand text-muted"
                    )}
                  >
                    {step > s ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s
                    )}
                  </div>
                  <span className={cn(
                    "mt-2 text-xs font-medium transition-colors",
                    step >= s ? "text-soft-black" : "text-muted"
                  )}>
                    {stepLabels[s - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Device Selection */}
            {step === 1 && (
              <div className="bg-white rounded-3xl border border-sand p-8 lg:p-10 animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-soft-black mb-8">
                  Wat voor apparaat wil je inleveren?
                </h2>

                {/* Device Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-soft-black mb-4">
                    Type apparaat *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {deviceTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setValue("deviceType", type.value);
                          setValue("deviceBrand", "");
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200",
                          selectedType === type.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-sand bg-white hover:border-primary/30 hover:shadow-sm"
                        )}
                      >
                        <span
                          className={cn(
                            "transition-colors",
                            selectedType === type.value
                              ? "text-primary"
                              : "text-muted"
                          )}
                        >
                          {type.icon}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            selectedType === type.value
                              ? "text-primary"
                              : "text-soft-black"
                          )}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.deviceType && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.deviceType.message}
                    </p>
                  )}
                </div>

                {/* Brand Selection */}
                {selectedType && (
                  <div className="mb-6 animate-fade-in">
                    <Select
                      label="Merk"
                      options={brands}
                      placeholder="Selecteer een merk"
                      {...register("deviceBrand")}
                      error={errors.deviceBrand?.message}
                      required
                    />
                  </div>
                )}

                {/* Model Input */}
                <Input
                  label="Model"
                  placeholder="bijv. iPhone 14 Pro, MacBook Air M2"
                  {...register("deviceModel")}
                  error={errors.deviceModel?.message}
                  required
                />
              </div>
            )}

            {/* Step 2: Condition & Photos */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border border-sand p-8 lg:p-10 animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-soft-black mb-8">
                  Beschrijf de conditie
                </h2>

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
                    "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
                    photos.length >= 5
                      ? "border-sand bg-champagne/50 cursor-not-allowed"
                      : "border-sand bg-cream hover:border-primary hover:bg-primary/5"
                  )}>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
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
                  {photos.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-xl border border-sand"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
              <div className="bg-white rounded-3xl border border-sand p-8 lg:p-10 animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-soft-black mb-8">
                  Je contactgegevens
                </h2>

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
                          className="w-5 h-5 rounded-md border-2 border-sand text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
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
                      <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-3xl border border-sand p-8 lg:p-10">
                  <h2 className="text-2xl font-display font-semibold text-soft-black mb-8">
                    Controleer je gegevens
                  </h2>

                  <dl className="space-y-5">
                    <div className="flex justify-between py-3 border-b border-sand">
                      <dt className="text-muted">Apparaat</dt>
                      <dd className="font-semibold text-soft-black">
                        {deviceTypes.find((t) => t.value === watch("deviceType"))?.label}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3 border-b border-sand">
                      <dt className="text-muted">Merk</dt>
                      <dd className="font-semibold text-soft-black">
                        {brands.find((b) => b.value === watch("deviceBrand"))?.label}
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
                        <dt className="text-muted mb-3">Foto&apos;s ({photos.length})</dt>
                        <dd className="flex gap-3">
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
                      <dt className="text-muted">Naam</dt>
                      <dd className="font-semibold text-soft-black">
                        {watch("customerName")}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3 border-b border-sand">
                      <dt className="text-muted">E-mail</dt>
                      <dd className="font-semibold text-soft-black">
                        {watch("customerEmail")}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-muted">Telefoon</dt>
                      <dd className="font-semibold text-soft-black">
                        {watch("customerPhone")}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Info Box */}
                <div className="bg-primary/5 rounded-2xl p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-soft-black mb-1">
                      Wat gebeurt er na het indienen?
                    </p>
                    <p className="text-sm text-slate">
                      Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail.
                      Als je akkoord gaat, ontvang je gratis verzendlabels om het
                      apparaat naar ons toe te sturen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Terug
                </Button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <Button type="button" onClick={handleNextStep} className="gap-2">
                  Volgende
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting} className="gap-2">
                  Inlevering indienen
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Button>
              )}
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
