'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConditionBadge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/modal';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      }
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E48]">Producten</h1>
          <p className="text-gray-600">{products.length} producten in totaal</p>
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Zoek op naam of merk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Conditie
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Prijs
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Voorraad
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        {product.image_urls?.[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#2C3E48]">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ConditionBadge grade={product.condition_grade} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#094543]">
                      {formatPrice(product.price)}
                    </p>
                    {product.original_price && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(product.original_price)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock_quantity > 5
                          ? 'bg-emerald-100 text-emerald-700'
                          : product.stock_quantity > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock_quantity} op voorraad
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Uitgelicht
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/producten/${product.id}`}>
                        <button className="p-2 text-gray-400 hover:text-[#094543] transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Geen producten gevonden</p>
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
