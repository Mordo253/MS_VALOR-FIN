import React from 'react';

export const PostItem = ({ 
  title,
  content,
  images,
  disponible,
  slug
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="relative w-full pt-[60%]">
        <img
          src={images?.[0]?.secure_url || "/api/placeholder/400/300"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
            disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-bold text-xl mb-3 line-clamp-2">
          {title}
        </h2>
        
        <p className="text-sm text-gray-600 line-clamp-4">
          {content}
        </p>

        <a 
          href={`/posts/${slug}`} 
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Leer más →
        </a>
      </div>
    </div>
  );
};

export default PostItem;