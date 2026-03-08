import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import ZaloChatButton from "@/components/ZaloChatButton";
import DevRoleToggle from "@/components/DevRoleToggle";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";

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
                  <Route path="/" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <HomePage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/products" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <ProductsPage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/product/:id" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <ProductDetailPage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/cart" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <CartPage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/checkout" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <CheckoutPage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/wishlist" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <WishlistPage />
                      <ZaloChatButton />
                      <BottomNav />
                    </div>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
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

export default App;
