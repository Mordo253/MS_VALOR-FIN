import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  axios.defaults.withCredentials = true;

  const getAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${API_URL}/post/all-posts`);
      
      if (data?.success && Array.isArray(data.data)) {
        setPosts(data.data);
        setFilteredPosts(data.data);
      } else {
        setPosts([]);
        setFilteredPosts([]);
        throw new Error(data?.message || 'Error al cargar los posts.');
      }
    } catch (err) {
      console.error('Error al obtener posts:', err);
      setError(err.message || 'Error al cargar los posts. Por favor, intenta de nuevo.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (postData) => {
    try {
      // Validar que el título y contenido no estén vacíos después de quitar el HTML
      const titleText = postData.title.replace(/<[^>]*>/g, '').trim();
      const contentText = postData.content.replace(/<[^>]*>/g, '').trim();

      if (!titleText) {
        throw new Error('El título no puede estar vacío');
      }

      if (!contentText) {
        throw new Error('El contenido no puede estar vacío');
      }

      const processedData = {
        title: postData.title,
        content: postData.content,
        disponible: Boolean(postData.disponible),
        images: (postData.images || []).map(img => ({
          public_id: img.public_id || '',
          secure_url: img.secure_url || '',
          file: img.file || null,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || '',
          resource_type: img.resource_type || 'image'
        })).filter(img => 
          (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) ||
          (img.secure_url && !img.secure_url.startsWith('blob:'))
        )
      };

      // Validar que haya al menos una imagen válida
      if (!processedData.images.length) {
        throw new Error('Debes incluir al menos una imagen');
      }

      const response = await axios.post(`${API_URL}/post/posts`, processedData, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000 // 30 segundos de timeout para manejar la subida de imágenes
      });

      if (!response.data?.data) {
        throw new Error("Respuesta del servidor incompleta");
      }

      setPosts(prev => [...prev, response.data.data]);
      setFilteredPosts(prev => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error al crear post:", err);
      throw new Error(err.response?.data?.message || err.message || "Error al crear el post");
    }
  };

  const updatePost = async (slug, postData) => {
    try {
      // Validar que el título y contenido no estén vacíos después de quitar el HTML
      if (postData.title) {
        const titleText = postData.title.replace(/<[^>]*>/g, '').trim();
        if (!titleText) {
          throw new Error('El título no puede estar vacío');
        }
      }

      if (postData.content) {
        const contentText = postData.content.replace(/<[^>]*>/g, '').trim();
        if (!contentText) {
          throw new Error('El contenido no puede estar vacío');
        }
      }

      const processedData = {
        ...postData,
        title: postData.title,
        content: postData.content,
        disponible: Boolean(postData.disponible),
        updatedAt: new Date().toISOString(),
        images: (postData.images || []).map(img => ({
          public_id: img.public_id || '',
          secure_url: img.secure_url || '',
          file: img.file || null,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || '',
          resource_type: img.resource_type || 'image'
        })).filter(img => 
          (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) ||
          (img.secure_url && !img.secure_url.startsWith('blob:'))
        ),
        imagesToDelete: (postData.imagesToDelete || []).filter(id => 
          typeof id === 'string' && !id.startsWith('temp_')
        )
      };

      // Validar que haya al menos una imagen válida después de procesar
      if (!processedData.images.length) {
        throw new Error('Debes mantener al menos una imagen');
      }

      const response = await axios.put(`${API_URL}/post/posts/${slug}`, processedData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });

      if (!response.data?.data) {
        throw new Error('Respuesta del servidor incompleta');
      }

      setPosts(prev => prev.map(p => p.slug === slug ? response.data.data : p));
      setFilteredPosts(prev => prev.map(p => p.slug === slug ? response.data.data : p));
      return response.data;
    } catch (error) {
      console.error('Error al actualizar post:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error al actualizar el post');
    }
  };

  const getPost = async (slug) => {
    try {
      const response = await axios.get(`${API_URL}/post/posts/${slug}`);
      if (!response.data?.data) {
        throw new Error('Post no encontrado');
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener post:', error);
      throw error;
    }
  };

  const deletePost = async (slug) => {
    try {
      setError(null);
      const { data } = await axios.delete(`${API_URL}/post/posts/${slug}`);
      
      if (data?.success) {
        setPosts(prev => prev.filter(post => post.slug !== slug));
        setFilteredPosts(prev => prev.filter(post => post.slug !== slug));
      } else {
        throw new Error(data?.message || 'Error al eliminar el post.');
      }
    } catch (err) {
      console.error('Error al eliminar post:', err);
      throw err;
    }
  };

  const toggleAvailability = async (slug, currentAvailability) => {
    try {
      const response = await axios.patch(`${API_URL}/post/posts/${slug}/availability`, {
        disponible: !currentAvailability
      });

      if (response.data?.data) {
        const updatedPost = response.data.data;
        setPosts(prev => prev.map(p => p.slug === slug ? updatedPost : p));
        setFilteredPosts(prev => prev.map(p => p.slug === slug ? updatedPost : p));
      }
      return response.data;
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      throw error;
    }
  };

  // Función para filtrar posts
  const filterPosts = useCallback((searchTerm = '') => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const searchRegex = new RegExp(searchTerm, 'i');
    const filtered = posts.filter(post => 
      searchRegex.test(post.title.replace(/<[^>]*>/g, '')) || 
      searchRegex.test(post.content.replace(/<[^>]*>/g, ''))
    );
    setFilteredPosts(filtered);
  }, [posts]);

  return (
    <PostContext.Provider value={{
      posts,
      filteredPosts,
      loading,
      error,
      getAllPosts,
      createPost,
      getPost,
      updatePost,
      deletePost,
      toggleAvailability,
      filterPosts,
    }}>
      {children}
    </PostContext.Provider>
  );
};