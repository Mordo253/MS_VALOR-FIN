import React from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { Share2, Facebook, Twitter, Link } from 'lucide-react';

const RichTextDisplay = ({ content }) => (
  <div
    className="rich-text-content w-full"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

const PostDetails = () => {
  const { slug } = useParams();
  const { getPost } = usePosts();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(slug);
        setPost(data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, getPost]);

  const shareUrl = `${window.location.origin}/posts/${slug}`;

  const handleShare = (platform) => {
    const text = encodeURIComponent(post.title);
    const url = encodeURIComponent(shareUrl);

    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };

    window.open(links[platform], '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Enlace copiado al portapapeles');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-theme(spacing.48))] md:min-h-[calc(100vh-theme(spacing.56))] lg:min-h-[calc(100vh-theme(spacing.64))] flex items-center justify-center mt-[calc(3rem+48px)] md:mt-[calc(2rem+64px)] lg:mt-[calc(2rem+80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-theme(spacing.48))] md:min-h-[calc(100vh-theme(spacing.56))] lg:min-h-[calc(100vh-theme(spacing.64))] flex items-center justify-center mt-[calc(3rem+48px)] md:mt-[calc(2rem+64px)] lg:mt-[calc(2rem+80px)]">
        <h2 className="text-2xl font-bold text-gray-800">Post no encontrado</h2>
      </div>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-theme(spacing.48))] md:min-h-[calc(100vh-theme(spacing.56))] lg:min-h-[calc(100vh-theme(spacing.64))] bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Spacing - Considera el Indicador (h-12) + navBarSection (top-2rem + padding) */}
      <div className="h-[calc(3rem+48px)] md:h-[calc(2rem+64px)] lg:h-[calc(2rem+80px)]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Imagen principal */}
          {post.images?.[0] && (
            <div className="w-full rounded-lg md:rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-48 sm:h-64 md:h-96 lg:h-[400px]">
                <img
                  src={post.images[0].secure_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* TÃ­tulo */}
          <div className="w-full bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6">
            <div className="mb-4">
              <RichTextDisplay content={post.title} />
            </div>
            <div className="flex justify-center">
              <span
                className={`px-3 md:px-4 py-1 rounded-full text-sm font-medium ${
                  post.disponible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {post.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="w-full bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-8">
            <RichTextDisplay content={post.content} />
          </div>

          {/* Compartir */}
          <div className="w-full bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 mb-8 md:mb-12 lg:mb-16">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Compartir
              </h3>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 md:p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 md:p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={copyLink}
                  className="p-2 md:p-3 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <Link className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-16 md:h-20 lg:h-24" />
    </main>
  );
};

export default PostDetails;