"use client";

import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Tablet,
  Cable,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

type CategoryWithCount = Category & { product_count: number };

const categoryStyles: Record<string, { icon: LucideIcon; gradient: string }> = {
  telefoons: { icon: Smartphone, gradient: "from-primary to-primary-light" },
  laptops: { icon: Laptop, gradient: "from-copper to-gold" },
  tablets: { icon: Tablet, gradient: "from-[#0D9488] to-[#14B8A6]" },
  accessoires: { icon: Cable, gradient: "from-[#7C3AED] to-[#A78BFA]" },
};

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <RevealGroup
      stagger={0.08}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
    >
      {categories.map((category) => {
        const style = categoryStyles[category.slug] || categoryStyles.telefoons;
        const Icon = style.icon;
        return (
          <RevealItem key={category.slug} className="h-full">
            <Link
              href={`/producten?categorie=${category.slug}`}
              className="group relative block h-full"
            >
              <div className="relative h-full flex flex-col bg-cream rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 sm:mb-6 text-white transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-soft-black mb-2 font-display">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-3 sm:mb-4 min-h-[2rem] sm:min-h-[2.5rem] flex-grow">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-muted">
                    {category.product_count} producten
                  </span>
                  <span className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
