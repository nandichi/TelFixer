'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Package, Star } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FilterBar } from '@/components/admin/ui/filter-bar';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill, ConditionPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
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
            original_price: item.original_price
              ? parseFloat(item.original_price)
              : null,
            condition_grade: item.condition_grade,
            description: item.description,
            specifications: item.specifications,
            stock_quantity: item.stock_quantity,
            image_urls: item.image_urls,
            warranty_months: item.warranty_months,
            featured: item.featured,
            in_stock: item.in_stock ?? true,
            active: item.active ?? true,
            marketplace_url: item.marketplace_url,
            facebook_url: item.facebook_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }))
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const counts = useMemo(() => {
    const c = {
      all: products.length,
      in_stock: 0,
      low_stock: 0,
      out_of_stock: 0,
      featured: 0,
    };
    products.forEach((p) => {
      if (p.stock_quantity === 0) c.out_of_stock++;
      else if (p.stock_quantity <= 3) c.low_stock++;
      else c.in_stock++;
      if (p.featured) c.featured++;
    });
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchesStock =
        stockFilter === 'all'
          ? true
          : stockFilter === 'in_stock'
            ? p.stock_quantity > 3
            : stockFilter === 'low_stock'
              ? p.stock_quantity > 0 && p.stock_quantity <= 3
              : stockFilter === 'out_of_stock'
                ? p.stock_quantity === 0
                : stockFilter === 'featured'
                  ? p.featured
                  : true;
      return matches && matchesStock;
    });
  }, [products, searchQuery, stockFilter]);

  const handleDelete = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const stockTone = (qty: number) => {
    if (qty === 0) return 'danger';
    if (qty <= 3) return 'warning';
    return 'success';
  };

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[var(--a-surface-2)] rounded-md flex items-center justify-center shrink-0 overflow-hidden">
            {r.image_urls?.[0] ? (
              <Image
                src={r.image_urls[0]}
                alt={r.name}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            ) : (
              <Package className="h-4 w-4 text-[var(--a-text-4)]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-[var(--a-text)] truncate">
              {r.name}
            </div>
            <div className="text-[11.5px] text-[var(--a-text-3)] truncate">
              {r.brand}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'condition',
      header: 'Conditie',
      cell: (r) => <ConditionPill grade={r.condition_grade} size="xs" />,
    },
    {
      key: 'price',
      header: 'Prijs',
      align: 'right',
      sortable: true,
      sortValue: (r) => r.price,
      cell: (r) => (
        <div className="text-right">
          <div className="text-[13px] font-semibold text-[var(--a-text)] admin-num">
            {formatPrice(r.price)}
          </div>
          {r.original_price && r.original_price > r.price && (
            <div className="text-[11px] text-[var(--a-text-4)] line-through admin-num">
              {formatPrice(r.original_price)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Voorraad',
      sortable: true,
      sortValue: (r) => r.stock_quantity,
      cell: (r) => (
        <StatusPill
          status="custom"
          tone={stockTone(r.stock_quantity)}
          label={`${r.stock_quantity} stuks`}
          size="xs"
        />
      ),
    },
    {
      key: 'flags',
      header: 'Status',
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          {r.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--a-warning)]">
              <Star className="h-3 w-3 fill-current" />
              Uitgelicht
            </span>
          )}
          {!r.active && (
            <StatusPill
              status="inactive"
              tone="neutral"
              label="Inactief"
              size="xs"
            />
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      cell: (r) => (
        <div className="flex items-center justify-end gap-0.5">
          <Link
            href={`/admin/producten/${r.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-text)] hover:bg-[var(--a-surface-3)] transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={(e) => handleDelete(r, e)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Producten"
        description={`${products.length} producten in catalogus`}
        actions={
          <Link href="/admin/producten/nieuw">
            <AdminButton variant="primary">
              <Plus className="h-3.5 w-3.5" />
              Nieuw product
            </AdminButton>
          </Link>
        }
      />

      <FilterBar
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Zoek op naam of merk...',
        }}
        filters={{
          value: stockFilter,
          onChange: setStockFilter,
          options: [
            { value: 'all', label: 'Alle', count: counts.all },
            { value: 'in_stock', label: 'Op voorraad', count: counts.in_stock },
            { value: 'low_stock', label: 'Lage voorraad', count: counts.low_stock },
            { value: 'out_of_stock', label: 'Uitverkocht', count: counts.out_of_stock },
            { value: 'featured', label: 'Uitgelicht', count: counts.featured },
          ],
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        loading={loading}
        onRowClick={(r) => router.push(`/admin/producten/${r.id}`)}
        empty={
          <EmptyState
            icon={Package}
            title="Geen producten gevonden"
            description={
              searchQuery || stockFilter !== 'all'
                ? 'Pas je zoekfilters aan om resultaten te zien.'
                : 'Voeg je eerste product toe om te beginnen.'
            }
            action={
              !searchQuery && stockFilter === 'all' ? (
                <Link href="/admin/producten/nieuw">
                  <AdminButton variant="primary">
                    <Plus className="h-3.5 w-3.5" />
                    Nieuw product
                  </AdminButton>
                </Link>
              ) : undefined
            }
            variant="compact"
          />
        }
      />

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
