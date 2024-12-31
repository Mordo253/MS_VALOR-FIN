import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../../../context/PostContext';

const RichTextCell = ({ content, maxLength = 100 }) => {
  // No truncamos el HTML directamente para evitar romper las etiquetas
  const getPreviewText = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const fullText = tempDiv.textContent || tempDiv.innerText;
    return fullText.length > maxLength ? 
      htmlContent.substring(0, htmlContent.indexOf(' ', maxLength)) + '...' : 
      htmlContent;
  };

  return (
    <div 
      className="rich-text-preview prose prose-sm max-w-none overflow-hidden"
      style={{
        '& p': { margin: 0 },
        '& blockquote': { marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb' },
        '& ul, & ol': { margin: 0, paddingLeft: '1.5rem' },
        '& *:first-child': { marginTop: 0 },
        '& *:last-child': { marginBottom: 0 }
      }}
      dangerouslySetInnerHTML={{ __html: getPreviewText(content) }}
    />
  );
};

const PostsEditList = () => {
  const { posts, getAllPosts, deletePost, toggleAvailability } = usePosts();
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleEdit = (slug) => {
    navigate(`/admin/post/post-update/${slug}`);
  };

  const handleDelete = async (slug) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
      await deletePost(slug);
      getAllPosts();
    }
  };

  const handleToggleAvailability = async (post) => {
    await toggleAvailability(post.slug, post.disponible);
    getAllPosts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Posts</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disponibilidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-20 h-20 overflow-hidden rounded-lg">
                    <img
                      src={post.images[0]?.secure_url || '/api/placeholder/80/80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <RichTextCell content={post.title} maxLength={50} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleAvailability(post)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      post.disponible 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {post.disponible ? 'Disponible' : 'No disponible'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post.slug)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsEditList;