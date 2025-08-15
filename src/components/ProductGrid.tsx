import { ProductCard } from "./ProductCard";

// Mock data - En producción esto vendría de tu backend Supabase
const mockProducts = [
  {
    id: 1,
    name: "Alimento Premium para Perros Adultos",
    price: 45.99,
    originalPrice: 59.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
    category: "Comida",
    inStock: true
  },
  {
    id: 2,
    name: "Pelota Interactiva para Gatos",
    price: 12.99,
    rating: 4,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=300&fit=crop",
    category: "Juguetes",
    inStock: true
  },
  {
    id: 3,
    name: "Cama Ortopédica Grande",
    price: 89.99,
    originalPrice: 109.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    category: "Camas",
    inStock: true
  },
  {
    id: 4,
    name: "Vitaminas para Cachorros",
    price: 24.99,
    rating: 4,
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop",
    category: "Medicina",
    inStock: false
  },
  {
    id: 5,
    name: "Collar Ajustable con LED",
    price: 18.99,
    rating: 4,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    category: "Accesorios",
    inStock: true
  },
  {
    id: 6,
    name: "Shampoo Hipoalergénico",
    price: 16.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1609211079593-4b8e0cd2c2ea?w=400&h=300&fit=crop",
    category: "Higiene",
    inStock: true
  }
];

export const ProductGrid = () => {
  return (
    <section className="py-16 px-4 bg-accent/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Productos Destacados
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};