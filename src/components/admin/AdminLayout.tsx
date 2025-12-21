import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Package, Tags, LayoutDashboard, LogOut, Percent, ClipboardList, Truck, Users, Menu, ArrowLeft, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/products', icon: Package },
    { name: 'Categorías', href: '/admin/categories', icon: Tags },
    { name: 'Promociones', href: '/admin/promotions', icon: Percent },
    { name: 'Pedidos', href: '/admin/orders', icon: ClipboardList },
    { name: 'Entregas', href: '/admin/delivery', icon: Truck },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
  ];

  const handleBack = () => {
    // Si estamos en el dashboard, ir al inicio
    if (location.pathname === '/admin/dashboard') {
      navigate('/');
    } else {
      // Si estamos en otra página de admin, ir al dashboard
      navigate('/admin/dashboard');
    }
  };

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <ul className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <li key={item.name}>
            <Link
              to={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-smooth ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          </li>
        );
      })}
      {/* Link to home */}
      <li>
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-sm font-medium rounded-md transition-smooth text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Home className="mr-3 h-5 w-5 flex-shrink-0" />
          Ir al Sitio
        </Link>
      </li>
    </ul>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              {/* Mobile: Back button and Menu */}
              {isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="h-9 w-9"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  
                  <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                      <SheetHeader className="p-4 border-b border-border">
                        <SheetTitle className="text-left text-primary">Admin</SheetTitle>
                      </SheetHeader>
                      <div className="p-4">
                        <NavLinks onClose={() => setSidebarOpen(false)} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            signOut();
                            setSidebarOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Salir
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
              
              <h1 className="text-base sm:text-xl font-bold text-primary truncate">
                {isMobile ? 'Admin' : 'Casa Beatricita Admin'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {!isMobile && (
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {user?.email}
                </span>
              )}
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <nav className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] sticky top-16">
            <div className="p-4">
              <NavLinks />
            </div>
          </nav>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
