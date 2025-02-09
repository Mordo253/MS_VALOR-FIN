import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ title, description, imageUrl, url }) => {
  // Validación y valores por defecto
  const safeTitle = title ?? 'Título por defecto';
  const safeDescription = description ?? 'Descripción por defecto';
  const safeImageUrl = imageUrl ?? '/default-image.jpg';
  const safeUrl = url ?? window.location.href;

  // Dimensiones de la imagen (importante para OG)
  const imageWidth = '1200';
  const imageHeight = '630';

  return (
    <Helmet>
      {/* Título básico */}
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={safeUrl} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={safeImageUrl} />
      <meta property="og:image:secure_url" content={safeImageUrl} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={safeTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={safeUrl} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImageUrl} />
      <meta name="twitter:image:alt" content={safeTitle} />

      {/* Otros meta tags útiles */}
      <link rel="canonical" href={safeUrl} />
      <meta name="robots" content="index,follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default MetaTags;