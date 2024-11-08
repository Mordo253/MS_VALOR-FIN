import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PropertyProvider } from "./context/PropertyContex";
import { PropertyPage } from "./pages/PropertyPage/PropertyPage";
import { PropertyDetails } from "./pages/PropertyPage/PropertyDetail";
import { PropertyList } from "./pages/PropertyPage/PropertyList";
import { VehicleProvider } from "./context/CarContext";
import { CarPage } from "./pages/CarPage/CarPage";
import { CarDetails } from "./pages/CarPage/CarDetail";
import { CarList } from "./pages/CarPage/CarList";
import Header from './components/Header/Header';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/Home/appD";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import './App.css';
import { ToolsPage } from "./pages/Tools/ToolsPage";
import { Admin } from "./pages/Admin/layout/Admin";
import { Footer } from "./components/Footer/Footer";
import { Indicador } from './components/ecommerI/EcommerI';

// Componente ScrollToTop separado
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <Indicador/>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/properties-list" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />  
        <Route path="/cars" element={<CarPage />} />
        <Route path="/cars-list" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/tools" element={<ToolsPage />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <VehicleProvider>
              <main>
                <AppContent />
              </main>
          </VehicleProvider>
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;