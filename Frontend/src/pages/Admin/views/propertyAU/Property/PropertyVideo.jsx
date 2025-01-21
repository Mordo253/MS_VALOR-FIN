import React, { useState, useEffect, useCallback, useMemo } from "react";

const PropertyVideo = ({ initialVideos = [], onVideoUpdate }) => {
  const [videos, setVideos] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [error, setError] = useState(null);

  // Validar la URL del video
  const validateVideoUrl = useCallback((url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})$/;
    return youtubeRegex.test(url);
  }, []);

  // Obtener el ID del video de YouTube
  const extractYoutubeId = useCallback((url) => {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }, []);

  // Agregar un nuevo video
  const handleAddVideo = useCallback(() => {
    if (!validateVideoUrl(newVideoUrl)) {
      setError("La URL no es válida. Solo se aceptan enlaces de YouTube.");
      return;
    }

    const videoId = extractYoutubeId(newVideoUrl);
    if (!videoId) {
      setError("No se pudo obtener el ID del video de YouTube.");
      return;
    }

    setVideos((prev) => [
      ...prev,
      {
        id: videoId,
        url: newVideoUrl,
        isNew: true,
        public_id: `temp_${Date.now()}_${videoId}`
      }
    ]);
    setNewVideoUrl("");
    setError(null);
  }, [newVideoUrl, validateVideoUrl, extractYoutubeId]);

  // Eliminar un video
  const handleDeleteVideo = useCallback((publicId) => {
    setVideos((prev) => {
      const updatedVideos = prev.filter((video) => video.public_id !== publicId);
      if (!publicId.startsWith('temp_')) {
        setVideosToDelete((prevToDelete) => [...prevToDelete, publicId]);
      }
      return updatedVideos;
    });
  }, []);

  // Inicializar videos existentes
  useEffect(() => {
    if (initialVideos?.length > 0 && videos.length === 0) {
      const processedVideos = initialVideos.map(video => ({
        ...video,
        public_id: video.public_id || `existing_${Date.now()}_${video.id}`,
        isNew: false
      }));
      setVideos(processedVideos);
    }
  }, [initialVideos]);

  // Datos formateados para enviar al componente padre
  const formattedVideos = useMemo(() =>
    videos.map((video) => ({
      public_id: video.public_id,
      id: video.id,
      url: video.url,
      isNew: video.isNew
    })),
    [videos]
  );

  // Enviar actualizaciones al componente padre
  useEffect(() => {
    const shouldUpdate = 
      videos.length > 0 || 
      videosToDelete.length > 0;

    if (typeof onVideoUpdate === "function" && shouldUpdate) {
      const updateData = {
        videos: formattedVideos,
        videosToDelete
      };
      onVideoUpdate(updateData);
    }
  }, [formattedVideos, videosToDelete, onVideoUpdate]);

  return (
    <div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Videos de YouTube</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video.public_id} className="relative group">
              <iframe
                className="w-full h-48 rounded-lg"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={`Video ${video.id}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <button
                type="button"
                onClick={() => handleDeleteVideo(video.public_id)}
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
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Agregar URL de video de YouTube
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://www.youtube.com/watch?v=ID"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyVideo;