import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { Promotions } from "@/components/Promotions";
import { Footer } from "@/components/Footer";
import { ImageUploader } from "@/components/admin/ImageUploader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <ImageUploader />
        </div>
        <Categories />
        <ProductGrid />
        <Promotions />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
