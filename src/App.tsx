import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { VoucherProvider } from "@/context/VoucherContext";

import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import ZaloChatButton from "@/components/ZaloChatButton";
import DevRoleToggle from "@/components/DevRoleToggle";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import OrdersByStatusPage from "./pages/OrdersByStatusPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AccountInfoPage from "./pages/AccountInfoPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import AppSettingsPage from "./pages/AppSettingsPage";
import CollectionPage from "./pages/CollectionPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AddressManagementPage from "./pages/AddressManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <VoucherProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DevRoleToggle />
                <Routes>
                  {/* User storefront routes */}
                  <Route path="/" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <HomePage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/collection/:type" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <CollectionPage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/products" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <ProductsPage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/categories" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <CategoryPage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/product/:id" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <ProductDetailPage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <CartPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <CheckoutPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <OrderSuccessPage />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <WishlistPage />
                      <BottomNav />
                    </div>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <ProfilePage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:status" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <OrdersByStatusPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/order-history" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <OrderHistoryPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/order/:orderCode" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <OrderDetailPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/account-info" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <AccountInfoPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/addresses" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <AddressManagementPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/payment-methods" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <PaymentMethodsPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <div className="mx-auto max-w-md min-h-screen bg-background relative">
                        <AppSettingsPage />
                        <BottomNav />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={
                    <div className="mx-auto max-w-md min-h-screen bg-background relative">
                      <LoginPage />
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
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="inventory" element={<AdminInventoryPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
