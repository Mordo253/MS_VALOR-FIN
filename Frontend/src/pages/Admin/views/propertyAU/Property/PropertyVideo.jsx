import React, { useState, useEffect } from 'react';

const PropertyVideo = ({ videos = [], onVideosChange }) => {
  const [videoUrls, setVideoUrls] = useState(videos); // URLs actuales de videos
  const [newVideo, setNewVideo] = useState("");

  useEffect(() => {
    // Actualiza el estado interno si cambia la lista de videos proporcionada
    if (videos) {
      setVideoUrls(videos);
    }
  }, [videos]);

  const handleAddVideo = () => {
    if (!newVideo) return;

    const isValidYoutubeUrl =
      /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(newVideo) ||
      /^https:\/\/youtu\.be\/[\w-]{11}$/.test(newVideo);

    if (!isValidYoutubeUrl) {
      alert("Por favor, ingresa un enlace válido de YouTube.");
      return;
    }

    const updatedVideos = [...videoUrls, newVideo];
    setVideoUrls(updatedVideos);
    onVideosChange(updatedVideos); // Notifica al componente padre
    setNewVideo(""); // Limpia el campo de entrada
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updatedVideos);
    onVideosChange(updatedVideos); // Notifica al componente padre
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4">Gestión de Videos</h3>

      <div className="mb-4">
        <input
          type="text"
          value={newVideo}
          onChange={(e) => setNewVideo(e.target.value)}
          placeholder="Añadir enlace de YouTube"
          className="border w-full p-2 rounded-md"
        />
        <button
          onClick={handleAddVideo}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Agregar Video
        </button>
      </div>

      {videoUrls.length > 0 ? (
        <ul className="space-y-4">
          {videoUrls.map((url, index) => (
            <li key={index} className="flex items-center justify-between">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {url}
              </a>
              <button
                onClick={() => handleRemoveVideo(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md shadow hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No se han agregado videos.</p>
      )}
    </div>
  );
};

export default PropertyVideo;
