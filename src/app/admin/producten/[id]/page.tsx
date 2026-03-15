'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProductForm } from '@/components/admin/product-form';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name, slug)')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/admin/producten');
        return;
      }

      setProduct({
        id: data.id,
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        category: data.categories,
        brand: data.brand,
        price: parseFloat(data.price),
        original_price: data.original_price ? parseFloat(data.original_price) : null,
        condition_grade: data.condition_grade,
        description: data.description,
        specifications: data.specifications || {},
        stock_quantity: data.stock_quantity,
        image_urls: data.image_urls || [],
        warranty_months: data.warranty_months,
        featured: data.featured,
        marketplace_url: data.marketplace_url,
        facebook_url: data.facebook_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
      setLoading(false);
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-slate">Product laden...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return <ProductForm product={product} mode="edit" />;
}
