import axios from 'axios';
import { API_URL } from "../config";

export const getPostsRequest = async () => {
  return await axios.get(API_URL);
};

export const createPostRequest = async (post) => {
  const formData = new FormData();
  
  Object.keys(post).forEach(key => {
    if (Array.isArray(post[key])) {
      post[key].forEach(item => formData.append(key, item));
    } else if (key === 'images') {
      post[key].forEach(image => formData.append('images', image));
    } else {
      formData.append(key, post[key]);
    }
  });

  return await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getPostBySlugRequest = async (slug) => {
  return await axios.get(`${API_URL}/${slug}`);
};

export const updatePostRequest = async (slug, updatedPost) => {
  return await axios.put(`${API_URL}/${slug}`, updatedPost);
};

export const deletePostRequest = async (slug) => {
  return await axios.delete(`${API_URL}/${slug}`);
};

export const updatePostAvailabilityRequest = async (slug, disponible) => {
  return await axios.patch(`${API_URL}/${slug}/availability`, { disponible });
};