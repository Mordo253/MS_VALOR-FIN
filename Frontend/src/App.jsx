import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PropertyProvider } from "./context/PropertyContex";
import { PropertyPage } from "./pages/PropertyPage/PropertyPage";
import { PropertyDetails } from "./pages/PropertyPage/PropertyDetail";
import { PropertyList } from "./pages/PropertyPage/PropertyList";
import { VehicleProvider } from "./context/CarContext";
import { CarPage } from "./pages/CarPage/CarPage";
import CarDetails from "./pages/CarPage/CarDetail";
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
import MetaTags from './components/ui/Otter/MetaTags'; // Importar el componente MetaTags
import './App.css';
import { BlogPage } from './pages/BlogPage/BlogPage';
import { PostProvider } from './context/PostContext';
import PostsList from './pages/BlogPage/PostList';
import PostDetails from './pages/BlogPage/PostDetails';

// Componente para manejar el scroll al inicio
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const scrollToTopSmooth = () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';
      }, 50);
    };

    scrollToTopSmooth();
    const timeoutId = setTimeout(scrollToTopSmooth, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

// Componente para envolver páginas con meta tags por defecto
const PageWrapper = ({ children, title, description, imageUrl }) => {
  const defaultTitle = 'MS DE VALOR';
  const defaultDescription = 'Tu mejor opción en propiedades y vehículos';
  const defaultImage = 'URL_DE_TU_IMAGEN_POR_DEFECTO'; // Reemplaza con tu URL por defecto
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MetaTags
        title={title || defaultTitle}
        description={description || defaultDescription}
        imageUrl={imageUrl || defaultImage}
        url={window.location.href}
      />
      {children}
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Meta tags por defecto para la página principal
  const defaultMeta = {
    title: 'MS DE VALOR - Inicio',
    description: 'Tu mejor opción en propiedades y vehículos',
    imageUrl: '' // Reemplaza con tu URL por defecto
  };

  return (
    <>
      <ScrollToTop />
      <Indicador />
      <Header />
      <div className="content-wrapper">
        <Routes>
          <Route 
            path="/" 
            element={
              <PageWrapper {...defaultMeta}>
                <HomePage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <PageWrapper 
                title="Iniciar Sesión - MS DE VALOR"
                description="Accede a tu cuenta de MS DE VALOR"
              >
                <LoginPage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/properties" 
            element={
              <PageWrapper 
                title="Propiedades - MS DE VALOR"
                description="Explora nuestra selección de propiedades"
              >
                <PropertyPage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/properties-list" 
            element={
              <PageWrapper 
                title="Listado de Propiedades - MS DE VALOR"
                description="Lista completa de nuestras propiedades disponibles"
              >
                <PropertyList />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/properties/:id" 
            element={<PropertyDetails />} // Los meta tags se manejan dentro del componente
          />
          
          <Route 
            path="/cars" 
            element={
              <PageWrapper 
                title="Vehículos - MS DE VALOR"
                description="Descubre nuestra selección de vehículos"
              >
                <CarPage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/cars-list" 
            element={
              <PageWrapper 
                title="Listado de Vehículos - MS DE VALOR"
                description="Lista completa de nuestros vehículos disponibles"
              >
                <CarList />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/cars/:id" 
            element={<CarDetails />} // Los meta tags se manejan dentro del componente
          />
          
          <Route 
            path="/tools" 
            element={
              <PageWrapper 
                title="Herramientas - MS DE VALOR"
                description="Herramientas útiles para tus decisiones inmobiliarias"
              >
                <ToolsPage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/blog" 
            element={
              <PageWrapper 
                title="Blog - MS DE VALOR"
                description="Noticias y artículos sobre el mercado inmobiliario"
              >
                <BlogPage />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/posts-list" 
            element={
              <PageWrapper 
                title="Artículos del Blog - MS DE VALOR"
                description="Lee todos nuestros artículos y noticias"
              >
                <PostsList />
              </PageWrapper>
            } 
          />
          
          <Route 
            path="/posts/:slug" 
            element={<PostDetails />} // Los meta tags se manejan dentro del componente
          />
          
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/admin/*" 
              element={
                <PageWrapper 
                  title="Administración - MS DE VALOR"
                  description="Panel de administración"
                >
                  <Admin />
                </PageWrapper>
              } 
            />
          </Route>

          <Route 
            path="*" 
            element={
              <PageWrapper {...defaultMeta}>
                <HomePage />
              </PageWrapper>
            } 
          />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
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