import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
const ScrollHandler = () => {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  const scrollTimeout = useRef(null);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      const mainElement = document.querySelector('main');
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      // Disable scroll temporarily
      htmlElement.style.scrollBehavior = 'auto';
      bodyElement.style.scrollBehavior = 'auto';
      
      if (mainElement) {
        mainElement.style.overflow = 'hidden';
      }

      // Force scroll to top
      window.scrollTo(0, 0);
      if (mainElement) {
        mainElement.scrollTop = 0;
      }

      // Re-enable smooth scrolling after a brief delay
      scrollTimeout.current = setTimeout(() => {
        htmlElement.style.scrollBehavior = 'smooth';
        bodyElement.style.scrollBehavior = 'smooth';
        if (mainElement) {
          mainElement.style.overflow = 'auto';
          mainElement.style.scrollBehavior = 'smooth';
        }
      }, 100);
    };

    if (pathname !== lastPathRef.current) {
      handleScroll();
      lastPathRef.current = pathname;
    }

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [pathname]);

  return null;
};


const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
 
  return (
    <>
      <ScrollHandler />
      <Indicador/>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/properties-list" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />  
        <Route path="/cars" element={<CarPage />} />
        <Route path="/cars-list" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/tools" element={<ToolsPage />} />
 
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