import React, { useEffect, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import { Share2, Check } from 'lucide-react';

// Componente ShareButton optimizado
const ShareButton = ({ component: ShareButtonComponent, icon: IconComponent, color, property }) => {
  const shareUrl = window.location.href;
  const mainImageUrl = property.images[0]?.secure_url;
  const shareTitle = `${property.title} - ${property.codigo}`;
  const shareDescription = property.description || `${property.tipoInmueble} en ${property.ciudad}`;
  const priceFormatted = property.costo.toLocaleString();
  const locationFormatted = `${property.zona}, ${property.ciudad}, ${property.departamento}`;

  // Mensajes personalizados por plataforma
  const customMessages = {
    facebook: `${shareTitle}\n${shareDescription}\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}`,
    twitter: `${shareTitle} - MS DE VALOR`,
    whatsapp: `¡Mira esta propiedad!\n\n${shareTitle}\n${shareDescription}\n\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}\n\nMás información:`,
    email: `${shareTitle}\n\n${shareDescription}\n\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}\n\nVer más detalles en:`
  };

  return (
    <ShareButtonComponent 
      url={shareUrl}
      title={shareTitle}
      description={shareDescription}
      quote={customMessages.facebook}
      subject={`Propiedad ${property.codigo} - MS DE VALOR`}
      body={customMessages.email}
      image={mainImageUrl}
      hashtag="#MSDeValor"
      via="msdevalor"
    >
      <div className="p-2 rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color }}>
        <IconComponent size={20} round bgStyle={{ fill: 'transparent' }} iconFillColor="white" />
      </div>
    </ShareButtonComponent>
  );
};

// Componente CustomShareButton con soporte de previsualización mejorado
const CustomShareButton = ({ property }) => {
  const [copied, setCopied] = useState(false);
  const mainImageUrl = property.images[0]?.secure_url;
  const shareUrl = window.location.href;

  useEffect(() => {
    const setupMetaTags = () => {
      // Limpiar meta tags existentes
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]')
        .forEach(tag => tag.remove());

      // Agregar link canónico
      const linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = shareUrl;
      document.head.appendChild(linkCanonical);

      // Configurar meta tags para previsualización
      const metaTags = [
        // Meta tags básicos
        { name: 'description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { name: 'author', content: 'MS DE VALOR' },
        { name: 'keywords', content: `${property.tipoInmueble}, ${property.ciudad}, ${property.zona}, inmuebles, propiedades` },
        
        // Open Graph / Facebook
        { property: 'og:url', content: shareUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${property.title} - ${property.codigo}` },
        { property: 'og:description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { property: 'og:image', content: mainImageUrl },
        { property: 'og:image:secure_url', content: mainImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:alt', content: property.title },
        { property: 'og:site_name', content: 'MS DE VALOR' },
        { property: 'og:locale', content: 'es_CO' },
        { property: 'og:price:amount', content: property.costo.toString() },
        { property: 'og:price:currency', content: 'COP' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@msdevalor' },
        { name: 'twitter:creator', content: '@msdevalor' },
        { name: 'twitter:title', content: `${property.title} - ${property.codigo}` },
        { name: 'twitter:description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { name: 'twitter:image', content: mainImageUrl },
        { name: 'twitter:image:alt', content: property.title },
        { name: 'twitter:label1', content: 'Precio' },
        { name: 'twitter:data1', content: `$${property.costo.toLocaleString()} COP` },
        { name: 'twitter:label2', content: 'Ubicación' },
        { name: 'twitter:data2', content: `${property.zona}, ${property.ciudad}` }
      ];

      // Crear y añadir meta tags
      metaTags.forEach(({ property, name, content }) => {
        if (!content) return;
        
        const meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        if (name) meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });
    };

    setupMetaTags();

    // Cleanup al desmontar
    return () => {
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]')
        .forEach(tag => tag.remove());
    };
  }, [property, mainImageUrl, shareUrl]);

  const handleShare = async () => {
    const shareData = {
      title: `${property.title} - ${property.codigo}`,
      text: `${property.description || `${property.tipoInmueble} en ${property.ciudad}`}\nPrecio: $${property.costo.toLocaleString()}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors w-full"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            <span>¡Copiado!</span>
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            <span>Compartir enlace</span>
          </>
        )}
      </button>

      <div className="flex justify-center gap-4 pt-4">
        <ShareButton 
          component={FacebookShareButton} 
          icon={FacebookIcon} 
          color="#1877F2" 
          property={property}
        />
        <ShareButton 
          component={TwitterShareButton} 
          icon={TwitterIcon} 
          color="#1DA1F2" 
          property={property}
        />
        <ShareButton 
          component={WhatsappShareButton} 
          icon={WhatsappIcon} 
          color="#25D366" 
          property={property}
        />
        <ShareButton 
          component={EmailShareButton} 
          icon={EmailIcon} 
          color="#D44638" 
          property={property}
        />
      </div>
    </div>
  );
};

export { ShareButton, CustomShareButton };