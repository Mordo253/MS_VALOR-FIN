import React, { useState, useEffect, useCallback, useMemo } from "react";

const PropertyImg = ({ initialImages = [], imageLimit = 15, onImageUpdate }) => {
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [error, setError] = useState(null);

  // Validación de imágenes
  const validateImage = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Tipo de archivo no válido. Solo se permiten JPG, PNG y WEBP';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'La imagen no debe superar los 5MB';
    }
    return null;
  }, []);

  // Función para cargar nuevas imágenes
  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > imageLimit) {
      setError(`No puedes subir más de ${imageLimit} imágenes`);
      return;
    }

    for (const file of files) {
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              public_id: `temp_${Date.now()}_${file.name}`,
              secure_url: reader.result,
              file: reader.result,
              width: image.width,
              height: image.height,
              format: file.type.split("/")[1],
              resource_type: "image",
              isNew: true
            },
          ]);
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    setNewImages((prev) => [...prev, ...files]);
    setError(null);
  }, [images.length, imageLimit, validateImage]);

  // Función para eliminar una imagen
  const handleImageDelete = useCallback((publicId) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => img.public_id !== publicId);
      if (!publicId.startsWith('temp_')) {
        setImagesToDelete((prevToDelete) => [...prevToDelete, publicId]);
      }
      return updatedImages;
    });

    setNewImages((prev) =>
      prev.filter((file) => `temp_${Date.now()}_${file.name}` !== publicId)
    );

    setMainImageIndex((prevIndex) => 
      prevIndex >= images.length - 1 ? 0 : prevIndex
    );
  }, [images.length]);

  // Función para establecer la imagen principal
  const handleSetMainImage = useCallback((index) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      const [selectedImage] = updatedImages.splice(index, 1);
      updatedImages.unshift(selectedImage);
      return updatedImages;
    });
    setMainImageIndex(0);
  }, []);

  // Inicializar imágenes existentes
  useEffect(() => {
    if (initialImages?.length > 0 && images.length === 0) {
      const processedImages = initialImages.map(img => ({
        ...img,
        public_id: img.public_id || `existing_${Date.now()}`,
        secure_url: img.secure_url,
        resource_type: 'image',
        isNew: false
      }));
      setImages(processedImages);
    }
  }, [initialImages]);

  // Datos formateados para enviar al componente padre
  const formattedImages = useMemo(() =>
    images.map((img) => ({
      public_id: img.public_id,
      secure_url: img.secure_url,
      file: img.isNew ? img.file : null,
      resource_type: img.resource_type,
    })),
    [images]
  );

  // Enviar cambios al componente padre
  useEffect(() => {
    const shouldUpdate = 
      images.length > 0 || 
      imagesToDelete.length > 0 || 
      newImages.length > 0;

    if (typeof onImageUpdate === "function" && shouldUpdate) {
      const updateData = {
        images: formattedImages,
        imagesToDelete,
        newImages
      };
      onImageUpdate(updateData);
    }
  }, [formattedImages, imagesToDelete, newImages]);

  return (
    <div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Imágenes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={img.public_id} className="relative group">
              <img
                src={img.secure_url}
                alt={`Propiedad ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                <button
                  type="button"
                  onClick={() => handleImageDelete(img.public_id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetMainImage(index)}
                  className={`absolute bottom-2 right-2 px-2 py-1 rounded-md transition-all ${
                    index === 0
                      ? "bg-blue-500 text-white opacity-100"
                      : "bg-gray-500 text-white opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {index === 0 ? "Principal" : "Hacer principal"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Clic para seleccionar imágenes
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG (máx. {imageLimit} imágenes)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
          />
        </label>
        {newImages.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {newImages.length}{" "}
              {newImages.length === 1
                ? "nueva imagen seleccionada"
                : "nuevas imágenes seleccionadas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImg;