"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  return (
    <RevealGroup
      stagger={0.09}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <RevealItem key={product.id} className="h-full">
          <ProductCard product={product} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
