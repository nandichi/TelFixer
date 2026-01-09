"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Check,
  AlertCircle,
  AlertTriangle,
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
  { value: "telefoon", label: "Telefoon", icon: Smartphone },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "accessoire", label: "Accessoire", icon: Headphones },
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
                apparaten in te kunnen leveren.
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
              Apparaat Inleveren
            </h1>
            <p className="mt-2 text-gray-600">
              Lever je oude apparaat in en ontvang een eerlijk bod
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium",
                      step >= s
                        ? "bg-[#094543] text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={cn(
                        "w-full h-1 mx-2",
                        step > s ? "bg-[#094543]" : "bg-gray-200"
                      )}
                      style={{ width: "60px" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Apparaat</span>
              <span>Conditie</span>
              <span>Gegevens</span>
              <span>Bevestig</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Device Selection */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
                  Wat voor apparaat wil je inleveren?
                </h2>

                {/* Device Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2C3E48] mb-3">
                    Type apparaat *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {deviceTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setValue("deviceType", type.value);
                          setValue("deviceBrand", "");
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                          selectedType === type.value
                            ? "border-[#094543] bg-[#094543]/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <type.icon
                          className={cn(
                            "h-8 w-8",
                            selectedType === type.value
                              ? "text-[#094543]"
                              : "text-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            selectedType === type.value
                              ? "text-[#094543]"
                              : "text-gray-600"
                          )}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.deviceType && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.deviceType.message}
                    </p>
                  )}
                </div>

                {/* Brand Selection */}
                {selectedType && (
                  <div className="mb-6">
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
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
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
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#2C3E48] mb-3">
                    Foto's uploaden (optioneel, max 5)
                  </label>

                  {/* Upload Area */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#094543] transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Klik om foto's te uploaden
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG of WebP (max 5MB)
                    </span>
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="h-4 w-4" />
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
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
                  Je gegevens
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Volledige naam"
                    {...register("customerName")}
                    error={errors.customerName?.message}
                    required
                  />
                  <Input
                    label="E-mailadres"
                    type="email"
                    {...register("customerEmail")}
                    error={errors.customerEmail?.message}
                    required
                  />
                  <Input
                    label="Telefoonnummer"
                    type="tel"
                    {...register("customerPhone")}
                    error={errors.customerPhone?.message}
                    required
                  />

                  {/* Terms */}
                  <div className="pt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("termsAccepted")}
                        className="w-5 h-5 rounded text-[#094543] focus:ring-[#094543] mt-0.5"
                      />
                      <span className="text-sm text-gray-600">
                        Ik ga akkoord met de{" "}
                        <a
                          href="/voorwaarden"
                          className="text-[#094543] underline"
                        >
                          algemene voorwaarden
                        </a>{" "}
                        en het{" "}
                        <a href="/privacy" className="text-[#094543] underline">
                          privacybeleid
                        </a>
                        . *
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-[#2C3E48] mb-6">
                    Controleer je gegevens
                  </h2>

                  <dl className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Apparaat</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {
                          deviceTypes.find(
                            (t) => t.value === watch("deviceType")
                          )?.label
                        }
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Merk</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {
                          brands.find((b) => b.value === watch("deviceBrand"))
                            ?.label
                        }
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Model</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {watch("deviceModel")}
                      </dd>
                    </div>
                    <div className="py-2 border-b border-gray-100">
                      <dt className="text-gray-500 mb-1">Conditie</dt>
                      <dd className="text-[#2C3E48]">
                        {watch("conditionDescription")}
                      </dd>
                    </div>
                    {photos.length > 0 && (
                      <div className="py-2 border-b border-gray-100">
                        <dt className="text-gray-500 mb-2">Foto's</dt>
                        <dd className="flex gap-2">
                          {photos.map((photo, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Naam</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {watch("customerName")}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">E-mail</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {watch("customerEmail")}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-gray-500">Telefoon</dt>
                      <dd className="font-medium text-[#2C3E48]">
                        {watch("customerPhone")}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">
                      Wat gebeurt er na het indienen?
                    </p>
                    <p className="mt-1">
                      Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail.
                      Als je akkoord gaat, ontvang je verzendlabels om het
                      apparaat naar ons toe te sturen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug
                </Button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <Button type="button" onClick={handleNextStep}>
                  Volgende
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting}>
                  Inlevering indienen
                </Button>
              )}
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
