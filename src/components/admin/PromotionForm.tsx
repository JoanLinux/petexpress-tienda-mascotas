import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Promotion {
  id?: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  banner_image_url: string | null;
  product_ids: string[];
  category_ids: string[];
}

interface Product {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PromotionForm = ({ promotion, onSuccess, onCancel }: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    start_date: '',
    end_date: '',
    is_active: true,
    banner_image_url: '',
    product_ids: [] as string[],
    category_ids: [] as string[]
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const { toast } = useToast();

  const isEditing = !!promotion;

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title,
        description: promotion.description || '',
        discount_percentage: promotion.discount_percentage?.toString() || '',
        discount_amount: promotion.discount_amount?.toString() || '',
        start_date: promotion.start_date.split('T')[0],
        end_date: promotion.end_date.split('T')[0],
        is_active: promotion.is_active,
        banner_image_url: promotion.banner_image_url || '',
        product_ids: promotion.product_ids,
        category_ids: promotion.category_ids
      });

      if (promotion.discount_percentage) {
        setDiscountType('percentage');
      } else if (promotion.discount_amount) {
        setDiscountType('amount');
      }
    }
    fetchProducts();
    fetchCategories();
  }, [promotion]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && !selectedProducts.find(p => p.id === productId)) {
      const newSelectedProducts = [...selectedProducts, product];
      setSelectedProducts(newSelectedProducts);
      setFormData(prev => ({ 
        ...prev, 
        product_ids: newSelectedProducts.map(p => p.id) 
      }));
    }
  };

  const removeProduct = (productId: string) => {
    const newSelectedProducts = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(newSelectedProducts);
    setFormData(prev => ({ 
      ...prev, 
      product_ids: newSelectedProducts.map(p => p.id) 
    }));
  };

  const addCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && !selectedCategories.find(c => c.id === categoryId)) {
      const newSelectedCategories = [...selectedCategories, category];
      setSelectedCategories(newSelectedCategories);
      setFormData(prev => ({ 
        ...prev, 
        category_ids: newSelectedCategories.map(c => c.id) 
      }));
    }
  };

  const removeCategory = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.filter(c => c.id !== categoryId);
    setSelectedCategories(newSelectedCategories);
    setFormData(prev => ({ 
      ...prev, 
      category_ids: newSelectedCategories.map(c => c.id) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promotionData = {
        title: formData.title,
        description: formData.description || null,
        discount_percentage: discountType === 'percentage' ? parseInt(formData.discount_percentage) : null,
        discount_amount: discountType === 'amount' ? parseFloat(formData.discount_amount) : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
        banner_image_url: formData.banner_image_url || null,
        product_ids: formData.product_ids,
        category_ids: formData.category_ids
      };

      let error;
      if (isEditing && promotion?.id) {
        const { error: updateError } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', promotion.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('promotions')
          .insert([promotionData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Promoción ${isEditing ? 'actualizada' : 'creada'} correctamente.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} la promoción.`,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Promoción' : 'Nueva Promoción'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Modifica los datos de la promoción' : 'Crea una nueva promoción especial'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_image_url">URL de Imagen</Label>
              <Input
                id="banner_image_url"
                name="banner_image_url"
                type="url"
                value={formData.banner_image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Tipo de Descuento</Label>
            <Select value={discountType} onValueChange={(value: 'percentage' | 'amount') => setDiscountType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                <SelectItem value="amount">Cantidad Fija ($)</SelectItem>
              </SelectContent>
            </Select>

            {discountType === 'percentage' ? (
              <div className="space-y-2">
                <Label htmlFor="discount_percentage">Porcentaje de Descuento *</Label>
                <Input
                  id="discount_percentage"
                  name="discount_percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="discount_amount">Cantidad de Descuento *</Label>
                <Input
                  id="discount_amount"
                  name="discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin *</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Productos Incluidos</Label>
              <Select onValueChange={addProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProducts.map((product) => (
                  <Badge key={product.id} variant="secondary" className="flex items-center gap-1">
                    {product.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeProduct(product.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categorías Incluidas</Label>
              <Select onValueChange={addCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((category) => (
                  <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                    {category.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCategory(category.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Promoción Activa</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Actualizar' : 'Crear'} Promoción
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};