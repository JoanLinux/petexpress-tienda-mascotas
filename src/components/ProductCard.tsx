import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useProductViews } from "@/hooks/useProductViews";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
  inStock: boolean;
  maxStock?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { trackProductView } = useProductViews();

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(product.id);
  }, [product.id, trackProductView]);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      maxStock: product.maxStock || 10
    });
    
    toast({
      title: "Producto agregado",
      description: `${product.name} se ha agregado al carrito.`,
    });
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-card border-0">
      <CardContent className="p-4">
        {/* Image Container */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">
                Agotado
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{product.category}</div>
          
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-3 w-3 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          variant="pet" 
          className="w-full"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
        </Button>
      </CardFooter>
    </Card>
  );
};