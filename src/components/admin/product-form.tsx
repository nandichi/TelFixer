'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  X,
  Plus,
  Trash2,
  Loader2,
  Package,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Product, Category, ConditionGrade } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

interface Specification {
  key: string;
  value: string;
}

const conditionOptions = [
  { value: 'als_nieuw', label: 'Als nieuw' },
  { value: 'zeer_goed', label: 'Zeer goed' },
  { value: 'goed', label: 'Goed' },
  { value: 'sterk_gebruikt', label: 'Sterk gebruikt' },
];

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();

  // Form state
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [brand, setBrand] = useState(product?.brand || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price?.toString() || ''
  );
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>(
    product?.condition_grade || 'goed'
  );
  const [description, setDescription] = useState(product?.description || '');
  const [stockQuantity, setStockQuantity] = useState(
    product?.stock_quantity?.toString() || '1'
  );
  const [warrantyMonths, setWarrantyMonths] = useState(
    product?.warranty_months?.toString() || '6'
  );
  const [featured, setFeatured] = useState(product?.featured || false);
  const [inStock, setInStock] = useState(
    product?.in_stock === undefined ? true : product.in_stock
  );
  const [marketplaceUrl, setMarketplaceUrl] = useState(
    product?.marketplace_url || ''
  );
  const [facebookUrl, setFacebookUrl] = useState(product?.facebook_url || '');

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>(() => {
    if (product?.specifications) {
      return Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [{ key: '', value: '' }];
  });

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.image_urls || []
  );
  const [uploadingImages, setUploadingImages] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data) {
      setCategories(data);
    }
    setLoadingCategories(false);
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (mode === 'create') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('products').getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (err) {
      showError('Fout bij uploaden van afbeeldingen');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle specifications
  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const updateSpecification = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Build specifications object
      const specsObj: Record<string, string> = {};
      specifications.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          specsObj[spec.key.trim()] = spec.value.trim();
        }
      });

      const productData = {
        name,
        slug,
        brand,
        category_id: categoryId || null,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        condition_grade: conditionGrade,
        description,
        specifications: specsObj,
        stock_quantity: parseInt(stockQuantity),
        warranty_months: parseInt(warrantyMonths),
        featured,
        in_stock: inStock,
        image_urls: imageUrls,
        marketplace_url: marketplaceUrl || null,
        facebook_url: facebookUrl || null,
        active: true,
      };

      if (mode === 'create') {
        const { error } = await supabase.from('products').insert(productData);

        if (error) throw error;
        success('Product toegevoegd');
      } else if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
        success('Product bijgewerkt');
      }

      router.push('/admin/producten');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Onbekende fout';
      showError(`Fout bij opslaan: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/producten"
            className="p-2 text-slate hover:text-soft-black hover:bg-champagne rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-soft-black">
              {mode === 'create' ? 'Nieuw product' : 'Product bewerken'}
            </h1>
            <p className="text-slate">
              {mode === 'create'
                ? 'Voeg een nieuw product toe aan de webshop'
                : `Bewerk ${product?.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/producten">
            <Button type="button" variant="outline">
              Annuleren
            </Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Toevoegen' : 'Opslaan'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black">Basisgegevens</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Productnaam"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="bijv. iPhone 14 Pro"
                required
              />
              <Input
                label="Merk"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="bijv. Apple"
                required
              />
            </div>

            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="bijv. iphone-14-pro"
              helperText="Wordt gebruikt in de URL"
              required
            />

            <Textarea
              label="Beschrijving"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschrijf het product..."
              rows={4}
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black">Afbeeldingen</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-champagne rounded-xl overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      Hoofd
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Button */}
              <label
                className={cn(
                  'aspect-square bg-champagne rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors',
                  uploadingImages && 'pointer-events-none opacity-50'
                )}
              >
                {uploadingImages ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted mb-2" />
                    <span className="text-xs text-muted">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-soft-black">Specificaties</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
              >
                <Plus className="h-4 w-4 mr-1" />
                Toevoegen
              </Button>
            </div>

            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    placeholder="bijv. Opslag"
                    value={spec.key}
                    onChange={(e) =>
                      updateSpecification(index, 'key', e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="bijv. 256GB"
                    value={spec.value}
                    onChange={(e) =>
                      updateSpecification(index, 'value', e.target.value)
                    }
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-muted hover:text-error transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black">Prijs & Voorraad</h2>

            <Input
              label="Verkoopprijs"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />

            <Input
              label="Originele prijs (optioneel)"
              type="number"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="0.00"
              helperText="Wordt doorgestreept getoond"
            />

            {(() => {
              const priceNum = parseFloat(price);
              const originalNum = parseFloat(originalPrice);
              if (
                Number.isFinite(priceNum) &&
                Number.isFinite(originalNum) &&
                originalNum > priceNum
              ) {
                const discount = Math.round(
                  ((originalNum - priceNum) / originalNum) * 100
                );
                return (
                  <div className="rounded-xl border border-copper/30 bg-copper/5 px-4 py-3 text-sm text-copper">
                    Korting: <span className="font-semibold">-{discount}%</span>{' '}
                    (bespaart &euro;{(originalNum - priceNum).toFixed(2)})
                  </div>
                );
              }
              return null;
            })()}

            <Input
              label="Voorraad"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5 rounded border-sand text-primary focus:ring-primary"
              />
              <span className="text-sm text-soft-black">
                Direct uit voorraad leverbaar
              </span>
            </label>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black">Details</h2>

            <Select
              label="Categorie"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="">Selecteer categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Select
              label="Conditie"
              value={conditionGrade}
              onChange={(e) =>
                setConditionGrade(e.target.value as ConditionGrade)
              }
            >
              {conditionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <Input
              label="Garantie (maanden)"
              type="number"
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(e.target.value)}
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-sand text-primary focus:ring-primary"
              />
              <span className="text-sm text-soft-black">Uitgelicht product</span>
            </label>
          </div>

          {/* External Links */}
          <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
            <h2 className="font-semibold text-soft-black">Externe links</h2>

            <Input
              label="Marktplaats URL"
              value={marketplaceUrl}
              onChange={(e) => setMarketplaceUrl(e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Facebook URL"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}
