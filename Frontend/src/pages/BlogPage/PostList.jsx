import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';

const PostItem = ({ title, content, slug, images, disponible }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={images?.[0]?.secure_url || '/api/placeholder/400/320'}
          alt=""
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2
          className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          className="prose prose-sm line-clamp-3 flex-grow mb-3"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mt-auto flex items-center justify-between">
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {disponible ? 'Disponible' : 'No disponible'}
          </span>
          <Link
            to={`/posts/${slug}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
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
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
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

  const availablePosts = posts.filter((post) => post.disponible);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-lg text-center">Cargando posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen pb-8 md:pb-12 lg:pb-16 relative top-8">
      <div className="pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-gray-50 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Nuestro Blog
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                Descubre las últimas noticias y actualizaciones de nuestra plataforma.
              </p>
            </header>
            <div>
              {availablePosts.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {availablePosts.map((post) => (
                    <div key={post.slug} className="flex justify-center">
                      <PostItem {...post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No hay posts disponibles por el momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostsList;
