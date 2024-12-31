import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import addPost from "../../../../assets/addPost.jpg"; // Imagen para añadir post
import updatePost from "../../../../assets/updatePost.jpg"; // Imagen para actualizar post

const PropertyCard = ({ title, imageSrc, icon: Icon }) => (
  <div className="bg-gray-200 rounded-3xl p-4 flex flex-col items-center shadow-md">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
      <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
    </div>
    <Link to={title === "NEW POST" ? "post-new" : "post-list"}>
      <button className="w-full bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center">
        <Icon size={20} className="mr-2" />
        <span>{title === "NEW POST" ? "Add Post" : "Update Posts"}</span>
      </button>
    </Link>
  </div>
);

export const PostAU = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-700">
      <main className="flex-1 p-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">DASHBOARD POSTS</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyCard 
              title="NEW POST" 
              imageSrc={addPost}
              icon={Plus}
            />
            <PropertyCard 
              title="UPDATE POSTS" 
              imageSrc={updatePost}
              icon={RefreshCw}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostAU;
