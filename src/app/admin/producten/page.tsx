'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConditionBadge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          category_id: item.category_id,
          category: item.categories,
          brand: item.brand,
          price: parseFloat(item.price),
          original_price: item.original_price ? parseFloat(item.original_price) : null,
          condition_grade: item.condition_grade,
          description: item.description,
          specifications: item.specifications,
          stock_quantity: item.stock_quantity,
          image_urls: item.image_urls,
          warranty_months: item.warranty_months,
          featured: item.featured,
          marketplace_url: item.marketplace_url,
          facebook_url: item.facebook_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }))
      );
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);

      if (!error) {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        success('Product verwijderd');
      } else {
        showError('Fout bij verwijderen');
      }
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-champagne rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-champagne rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-soft-black">Producten</h1>
          <p className="text-slate">{products.length} producten in totaal</p>
        </div>
        <Link href="/admin/producten/nieuw">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nieuw product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <Input
          placeholder="Zoek op naam of merk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-champagne/50 border-b border-sand">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Conditie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Prijs
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Voorraad
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-champagne/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-champagne rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {product.image_urls?.[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-soft-black">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ConditionBadge grade={product.condition_grade} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">
                      {formatPrice(product.price)}
                    </p>
                    {product.original_price && (
                      <p className="text-sm text-muted line-through">
                        {formatPrice(product.original_price)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock_quantity > 5
                          ? 'bg-success/10 text-success'
                          : product.stock_quantity > 0
                          ? 'bg-warning/10 text-warning'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {product.stock_quantity} op voorraad
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-copper/10 text-copper">
                        <Star className="h-3 w-3 fill-current" />
                        Uitgelicht
                      </span>
                    ) : (
                      <span className="text-sm text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/producten/${product.id}`}>
                        <button className="p-2 text-slate hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-slate hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted" />
            </div>
            <p className="text-slate mb-4">Geen producten gevonden</p>
            <Link href="/admin/producten/nieuw">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nieuw product toevoegen
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Product verwijderen"
        message={`Weet je zeker dat je "${selectedProduct?.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        variant="danger"
      />
    </div>
  );
}
