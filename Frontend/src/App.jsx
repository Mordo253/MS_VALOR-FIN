import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PropertyProvider } from "./context/PropertyContex";
import { PropertyPage } from "./pages/PropertyPage/PropertyPage";
import { PropertyDetails } from "./pages/PropertyPage/PropertyDetail";
import { PropertyList } from "./pages/PropertyPage/PropertyList";
import { VehicleProvider } from "./context/CarContext";
import { CarPage } from "./pages/CarPage/CarPage";
import CarDetails  from "./pages/CarPage/CarDetail";
import { CarList } from "./pages/CarPage/CarList";
import Header from './components/Header/Header';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/Home/appD";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { ToolsPage } from "./pages/Tools/ToolsPage";
import { Admin } from "./pages/Admin/layout/Admin";
import { Footer } from "./components/Footer/Footer";
import { Indicador } from './components/ecommerI/EcommerI';
import './App.css';
import { BlogPage } from './pages/BlogPage/BlogPage';
import { PostProvider } from './context/PostContext';
import PostsList from './pages/BlogPage/PostList';
import PostDetails from './pages/BlogPage/PostDetails';
// Componente mejorado para manejar el scroll
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Usar useLayoutEffect para ejecutar antes del render
  useLayoutEffect(() => {
    const scrollToTopSmooth = () => {
      // Primero desactivamos el scroll suave
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';

      // Forzar el scroll al inicio en todos los elementos relevantes
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);

      // Reactivar el scroll suave después de un pequeño delay
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';
      }, 50);
    };

    scrollToTopSmooth();

    // Asegurarnos de que el scroll se mantiene arriba
    const timeoutId = setTimeout(scrollToTopSmooth, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

// Componente de página wrapper
const PageWrapper = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <Indicador />
      <Header />
      <div className="content-wrapper">
        <Routes>
          {/* Envolver cada ruta con PageWrapper */}
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/properties" element={<PageWrapper><PropertyPage /></PageWrapper>} />
          <Route path="/properties-list" element={<PageWrapper><PropertyList /></PageWrapper>} />
          <Route path="/properties/:id" element={<PageWrapper><PropertyDetails /></PageWrapper>} />
          <Route path="/cars" element={<PageWrapper><CarPage /></PageWrapper>} />
          <Route path="/cars-list" element={<PageWrapper><CarList /></PageWrapper>} />
          <Route path="/cars/:id" element={<PageWrapper><CarDetails /></PageWrapper>} />
          <Route path="/tools" element={<PageWrapper><ToolsPage /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
          <Route path="/posts-list" element={<PageWrapper><PostsList /></PageWrapper>} />
          <Route path="/posts/:slug" element={<PageWrapper><PostDetails/></PageWrapper>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<PageWrapper><Admin /></PageWrapper>} />
          </Route>
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  // Asegurar scroll al inicio cuando se monta la aplicación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <VehicleProvider>
            <PostProvider>
              <main className="app-main">
                <AppContent />
              </main>
            </PostProvider>
          </VehicleProvider>
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;