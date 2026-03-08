import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import DevRoleToggle from "@/components/DevRoleToggle";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import ShopeeBottomNav from "@/components/storefront/ShopeeBottomNav";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const UserLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-md min-h-screen bg-background relative">
    {children}
    <ShopeeBottomNav />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DevRoleToggle />
                <Routes>
                  {/* User storefront routes */}
                  <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
                  <Route path="/products" element={<UserLayout><ProductsPage /></UserLayout>} />
                  <Route path="/product/:id" element={<UserLayout><ProductDetailPage /></UserLayout>} />
                  <Route path="/cart" element={<UserLayout><CartPage /></UserLayout>} />
                  <Route path="/checkout" element={<UserLayout><CheckoutPage /></UserLayout>} />
                  <Route path="/wishlist" element={<UserLayout><WishlistPage /></UserLayout>} />
                  {/* Placeholder routes for new tabs */}
                  <Route path="/live" element={<UserLayout><PlaceholderPage title="Live" /></UserLayout>} />
                  <Route path="/notifications" element={<UserLayout><PlaceholderPage title="Thông báo" /></UserLayout>} />
                  <Route path="/profile" element={<UserLayout><PlaceholderPage title="Tôi" /></UserLayout>} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={
                    <ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>
                  }>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="inventory" element={<AdminInventoryPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center pb-16">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="font-body text-xs text-muted-foreground">Tính năng đang phát triển</p>
      </div>
    </div>
  );
}

export default App;
