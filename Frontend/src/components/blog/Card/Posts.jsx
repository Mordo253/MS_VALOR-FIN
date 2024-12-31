import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../../context/PostContext';

const RichTextPreview = ({ content, maxLength = 150 }) => {
  const getPreviewText = (htmlContent) => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    const text = temp.textContent || temp.innerText;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="text-gray-600 line-clamp-3">
      {getPreviewText(content)}
    </div>
  );
};

const LatestPosts = () => {
  const { posts, loading, error, getAllPosts } = usePosts();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  // Filtrar solo posts disponibles y luego ordenar por fecha
  const availablePosts = [...posts]
    .filter(post => post.disponible) // Filtrar solo posts disponibles
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (availablePosts.length === 0) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <p className="text-gray-600">No hay posts disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Últimos Posts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availablePosts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 flex flex-col"
              style={{ height: '500px' }}
            >
              {/* Imagen del Post */}
              <div className="h-48 overflow-hidden">
                <img
                  src={post.images?.[0]?.secure_url || '/api/placeholder/400/320'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenido del Post */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Título con Rich Text */}
                <div 
                  className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />

                {/* Contenido con Rich Text */}
                <div className="flex-grow mb-4">
                  <RichTextPreview content={post.content} />
                </div>

                {/* Badge de Disponible */}
                <div className="mb-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    Disponible
                  </span>
                </div>

                {/* Botón de Leer más */}
                <Link 
                  to={`/posts/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-auto"
                >
                  Leer más 
                  <svg 
                    className="w-4 h-4 ml-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestPosts;