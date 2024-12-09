import React, { useState } from "react";

const PropertyImg = ({ initialImages = [], imageLimit = 15, onImageUpdate }) => {
  const [images, setImages] = useState(initialImages); // Imágenes actuales
  const [imagesToDelete, setImagesToDelete] = useState([]); // Imágenes a eliminar
  const [newImages, setNewImages] = useState([]); // Nuevas imágenes
  const [mainImageIndex, setMainImageIndex] = useState(0); // Índice de imagen principal
  const [error, setError] = useState(null); // Manejo de errores

  // Función para cargar nuevas imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > imageLimit) {
      setError(`No puedes subir más de ${imageLimit} imágenes`);
      return;
    }

    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("Algunas imágenes son demasiado grandes. Máximo 5MB por imagen");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              public_id: URL.createObjectURL(file),
              secure_url: URL.createObjectURL(file),
              file,
              width: image.width,
              height: image.height,
              format: file.type.split("/")[1],
              resource_type: "image",
            },
          ]);
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    setNewImages((prev) => [...prev, ...files]);
    setError(null);
  };

  // Función para eliminar una imagen
  const handleImageDelete = (publicId) => {
    if (publicId.startsWith("blob:")) {
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
      setNewImages((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== publicId)
      );
      URL.revokeObjectURL(publicId);
    } else {
      setImagesToDelete((prev) => [...prev, publicId]);
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    }

    if (mainImageIndex >= images.length - 1) {
      setMainImageIndex(0);
    }
  };

  // Función para establecer la imagen principal
  const handleSetMainImage = (index) => {
    if (index >= 0 && index < images.length) {
      const updatedImages = [...images];
      const [selectedImage] = updatedImages.splice(index, 1);
      updatedImages.unshift(selectedImage);
      setImages(updatedImages);
      setMainImageIndex(0);
    }
  };

  // Enviar cambios al componente padre
  React.useEffect(() => {
    onImageUpdate && onImageUpdate({ images, imagesToDelete, newImages });
  }, [images, imagesToDelete, newImages, onImageUpdate]);

  return (
    <div>
      {/* Manejo de errores */}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {/* Galería de imágenes */}
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

      {/* Input para nuevas imágenes */}
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
            accept="image/*"
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
