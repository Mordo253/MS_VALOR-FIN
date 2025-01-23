import React, { useEffect } from 'react';

const MetaTags = ({ title, description, imageUrl, url }) => {
  useEffect(() => {
    const head = document.head;

    // Función para crear o actualizar una meta tag
    const setMetaTag = (name, content, property = false) => {
      let tag = document.querySelector(property ? meta[property="${name}"] : meta[name="${name}"]);
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Insertar las meta tags necesarias
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:image:secure_url', imageUrl, true);  // Añadido secure_url
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageUrl);

    // También actualizamos el título del documento
    document.title = title;

    return () => {
      // Opcional: limpiar las etiquetas meta cuando el componente se desmonta
    };
  }, [title, description, imageUrl, url]);

  return null; // Este componente no renderiza nada visualmente
};

export default MetaTags;