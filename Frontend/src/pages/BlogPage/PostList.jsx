import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';

const PostItem = ({ title, content, slug, images, disponible }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden h-[500px] flex flex-col">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images?.[0]?.secure_url || '/api/placeholder/400/320'}
          alt=""
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Título con Rich Text */}
        <div className="mb-4">
          <h2 
            className="text-xl font-semibold text-gray-800 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>

        {/* Contenido con Rich Text */}
        <div className="mb-4 flex-grow overflow-hidden">
          <div 
            className="prose prose-sm line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: content 
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
              Disponible
            </span>
            
            <Link
              to={`/posts/${slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
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
      </div>
    </article>
  );
};

const PostsList = () => {
  const { posts, loading, error, getAllPosts } = usePosts();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  // Filtrar solo posts disponibles
  const availablePosts = posts.filter(post => post.disponible);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] grid place-items-center bg-red-50">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-red-600 font-semibold mb-2">Error al cargar los posts</h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12 relative top-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Nuestro Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre las últimas noticias y actualizaciones de nuestra plataforma
          </p>
        </header>

        {availablePosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availablePosts.map((post) => (
              <div 
                key={post.slug}
                className="transform hover:-translate-y-1 transition-all duration-300"
              >
                <PostItem {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[200px] grid place-items-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No hay posts disponibles
              </h3>
              <p className="text-gray-600">
                Vuelve más tarde para ver nuevo contenido
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;