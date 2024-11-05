// src/components/ImageUpload.js
import React, { useState } from 'react';

export const ImageUpload = ({ images, setImages }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...images, ...files.map(file => URL.createObjectURL(file))];
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="flex flex-wrap mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative mr-4 mb-4">
            <img src={image} alt={`upload-${index}`} className="w-24 h-24 object-cover rounded" />
            <button onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 text-red-500">X</button>
          </div>
        ))}
      </div>
    </div>
  );
};
