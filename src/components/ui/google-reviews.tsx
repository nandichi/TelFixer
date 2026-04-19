import Link from "next/link";
import { Container } from "@/components/layout/container";
import type { GoogleReview } from "@/lib/supabase/settings";

interface GoogleReviewsProps {
  reviews: GoogleReview[];
  overallRating: number;
  totalReviews: number;
  reviewUrl: string;
  writeReviewUrl?: string;
  businessName?: string;
}

const PALETTE = [
  "from-primary to-primary-light",
  "from-copper to-gold",
  "from-[#0D9488] to-[#14B8A6]",
  "from-[#7C3AED] to-[#A78BFA]",
  "from-[#F97316] to-[#FB923C]",
  "from-[#0EA5E9] to-[#38BDF8]",
];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function gradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length]!;
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const px = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} van 5 sterren`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating > i && rating < i + 1;
        return (
          <span key={i} className={`relative inline-block ${px}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={`${px} text-sand`}>
              <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            {(filled || half) && (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`${px} text-[#FBBC04] absolute inset-0`}
                style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
              >
                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}

function GoogleGlyph({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.86 13.86 0 0 1 10.94 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z"
      />
    </svg>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initials = initialsFromName(review.author_name);
  const gradient = gradientForName(review.author_name);

  return (
    <article className="relative h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-sand transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
      <div className="absolute top-5 right-5 opacity-90">
        <GoogleGlyph className="w-5 h-5" />
      </div>

      <div className="flex items-center gap-3 pr-8">
        {review.author_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={review.author_photo_url}
            alt={review.author_name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-12 h-12 rounded-full object-cover border border-sand bg-gradient-to-br ${gradient}`}
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-display font-semibold text-base shadow-sm`}
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-soft-black truncate">
            {review.author_name}
          </p>
          <p className="text-xs text-muted truncate">{review.date}</p>
        </div>
      </div>

      <div className="mt-4">
        <StarRow rating={review.rating} size="md" />
      </div>

      <p className="mt-4 text-sm sm:text-[15px] text-slate leading-relaxed line-clamp-6 whitespace-pre-line">
        {review.text}
      </p>
    </article>
  );
}

export function GoogleReviews({
  reviews,
  overallRating,
  totalReviews,
  reviewUrl,
  writeReviewUrl,
  businessName = "TelFixer",
}: GoogleReviewsProps) {
  if (!reviews || reviews.length === 0) return null;

  const computedTotal = totalReviews > 0 ? totalReviews : reviews.length;
  const computedAvg =
    overallRating > 0
      ? overallRating
      : reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  const ratingLabel = computedAvg.toFixed(1).replace(".", ",");

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <Container>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 lg:gap-16 items-start mb-10 sm:mb-14">
          <div>
            <span className="inline-block text-sm font-semibold text-copper uppercase tracking-widest mb-4">
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-soft-black leading-tight">
              Wat klanten over
              <br />
              <span className="text-gradient-primary">{businessName}</span> zeggen
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-md">
              Echte ervaringen van klanten op Google.
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
            <div className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-sand bg-cream/60">
              <GoogleGlyph className="w-9 h-9 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-soft-black leading-none">
                    {ratingLabel}
                  </span>
                  <span className="text-sm text-muted">/ 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRow rating={computedAvg} size="md" />
                  {computedTotal > 0 && (
                    <span className="text-xs text-muted">
                      {computedTotal} {computedTotal === 1 ? "review" : "reviews"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {reviewUrl && (
                <Link
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-sand text-sm font-medium text-soft-black hover:border-primary/30 hover:bg-cream transition-all"
                >
                  Alle reviews
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              )}
              {writeReviewUrl && (
                <Link
                  href={writeReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-soft-black text-white text-sm font-medium hover:bg-charcoal transition-all hover:shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  Schrijf een review
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: scroll-snap carousel */}
        <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hidden">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="snap-start shrink-0 w-[85%] xs:w-[80%]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
