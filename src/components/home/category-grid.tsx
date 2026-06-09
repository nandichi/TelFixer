"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

type CategoryWithCount = Category & { product_count: number };

const categoryImages: Record<string, string> = {
  telefoons: "/images/home/categorie-telefoons.jpg",
  laptops: "/images/home/categorie-laptops.jpg",
  tablets: "/images/home/categorie-tablets.jpg",
  accessoires: "/images/home/categorie-accessoires.jpg",
};

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <RevealGroup
      stagger={0.09}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
    >
      {categories.map((category) => {
        const image =
          categoryImages[category.slug] ?? categoryImages.telefoons;

        return (
          <RevealItem key={category.slug} className="h-full">
            <Link
              href={`/producten?categorie=${category.slug}`}
              className="group relative block aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
            >
              <Image
                src={image}
                alt={category.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-soft-black/85 via-soft-black/25 to-transparent transition-opacity duration-500 group-hover:from-soft-black/90"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-on-dark-subtle mb-1">
                    {category.product_count}{" "}
                    {category.product_count === 1 ? "product" : "producten"}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-display font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
                <span className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-sm text-white shrink-0 transition-all duration-300 group-hover:bg-white group-hover:text-soft-black">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
