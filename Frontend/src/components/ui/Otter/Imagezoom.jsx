import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ElegantImageViewer = ({ 
  isOpen, 
  onClose, 
  images, 
  currentImageIndex,
  onImageChange 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      onImageChange(currentImageIndex - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      onImageChange(currentImageIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevImage(e);
    } else if (e.key === 'ArrowRight') {
      handleNextImage(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-all duration-200"
        >
          <X size={24} />
        </button>

        {/* Área principal de la imagen */}
        <div className="relative max-w-[90vw] max-h-[85vh] overflow-hidden">
          <div
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
          >
            <img
              ref={imageRef}
              src={images[currentImageIndex].secure_url}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Navegación */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
            <button
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 ${
                currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === images.length - 1}
              className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 ${
                currentImageIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>

          {/* Indicador de imágenes */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onImageChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantImageViewer;