import React from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { Share2, Facebook, Twitter, Link } from 'lucide-react';

const RichTextDisplay = ({ content }) => {
  return (
    <div 
      className="rich-text-content w-full"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        '& a': { color: '#3b82f6', textDecoration: 'underline' },
        '& blockquote': { 
          borderLeft: '4px solid #e5e7eb',
          paddingLeft: '1rem',
          margin: '1rem 0',
          color: '#4b5563'
        },
        '& ul': { listStyleType: 'disc', paddingLeft: '1.5rem' },
        '& ol': { listStyleType: 'decimal', paddingLeft: '1.5rem' },
        '& sup': { fontSize: '75%', lineHeight: '0', position: 'relative', verticalAlign: 'baseline', top: '-0.5em' },
        '& sub': { fontSize: '75%', lineHeight: '0', position: 'relative', verticalAlign: 'baseline', bottom: '-0.25em' }
      }}
    />
  );
};

const PostDetails = () => {
  const { slug } = useParams();
  const { getPost } = usePosts();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const imageRef = React.useRef(null);
  const [imageWidth, setImageWidth] = React.useState('100%');

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

  React.useEffect(() => {
    const updateWidth = () => {
      if (imageRef.current) {
        setImageWidth(imageRef.current.offsetWidth + 'px');
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [post]);

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
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Post no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 relative top-12">
      <div className="flex flex-col items-center gap-8">
        {/* 1. Image Section - This will set the reference width */}
        <div 
          ref={imageRef}
          className="w-full max-w-4xl px-4"
        >
          {post.images?.[0] && (
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-[400px]">
                <img
                  src={post.images[0].secure_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Title Section - Match image width */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-6"
          style={{ width: imageWidth }}
        >
          <div className="mb-4">
            <RichTextDisplay content={post.title} />
          </div>
          <div className="flex justify-center">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${
              post.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {post.disponible ? 'Disponible' : 'No disponible'}
            </span>
          </div>
        </div>

        {/* 3. Content Section - Match image width */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-8"
          style={{ width: imageWidth }}
        >
          <RichTextDisplay content={post.content} />
        </div>

        {/* 4. Share Section - Match image width */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-6"
          style={{ width: imageWidth }}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Compartir
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={copyLink}
                className="p-3 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                <Link className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;