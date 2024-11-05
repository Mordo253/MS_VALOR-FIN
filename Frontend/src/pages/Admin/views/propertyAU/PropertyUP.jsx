import React, { useState, useEffect } from 'react';
import { useProperties } from '../../../../context/PropertyContex';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../config';
import Cookies from 'js-cookie';
import { useAuth } from '../../../../context/AuthContext';

// Constantes para las características
const caracteristicasInternas = [
  "Admite mascotas", "Armarios Empotrados", "Baño en habitación principal", 
  "Citófono / Intercomunicador", "Depósito", "Gas domiciliario", 
  "Suelo de cerámica / mármol", "Zona de lavandería", "Aire acondicionado", 
  "Balcón", "Biblioteca/Estudio", "Clósets", "Despensa", "Hall de alcobas",
  "Trifamiliar", "Alarma", "Baño auxiliar", "Calentador", "Cocina integral", 
  "Doble Ventana", "Reformado", "Unifamiliar"
];

const caracteristicasExternas = [
  "Acceso pavimentado", "Barbacoa / Parrilla / Quincho", "Cancha de futbol", 
  "Circuito cerrado de TV", "Cochera / Garaje", "Gimnasio", "Oficina de negocios", 
  "Patio", "Portería / Recepción", "Sistema de riego", "Trans. público cercano", 
  "Vivienda unifamiliar", "Zona infantil", "Zonas verdes", "Árboles frutales",
  "Bosque nativos", "Centros comerciales", "Club House", "Colegios / Universidades", 
  "Jardín", "Parqueadero visitantes", "Piscina", "Pozo de agua natural", 
  "Sobre vía principal", "Urbanización Cerrada", "Zona campestre", "Zona residencial", 
  "Área Social", "Cancha de baloncesto", "Cerca zona urbana", "Club Social", 
  "Garaje", "Kiosko", "Parques cercanos", "Playas", "Salón Comunal", "Terraza",
  "Vigilancia", "Zona comercial", "Zonas deportivas"
];

export const PropertyUP = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getProperty, updateProperty } = useProperties();

  // Estados principales
  const [formData, setFormData] = useState({
    title: '',
    pais: 'Colombia',
    departamento: '',
    ciudad: '',
    zona: '',
    areaConstruida: 0,
    areaTerreno: 0,
    areaPrivada: 0,
    alcobas: 0,
    costo: 0,
    banos: 0,
    garaje: 0,
    estrato: 1,
    piso: 0,
    tipoInmueble: '',
    tipoNegocio: '',
    estado: '',
    valorAdministracion: 0,
    anioConstruccion: new Date().getFullYear(),
    description: '',
    caracteristicas: []
  });

  // Estados para características
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState({
    internas: [],
    externas: []
  });

  // Estados para imágenes
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Verificar ID y autenticación
  useEffect(() => {
    if (!id) {
      setError('ID de propiedad no proporcionado');
      navigate('/properties');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadProperty = async () => {
      try {
        if (!id) {
          setError('ID de propiedad no proporcionado');
          setLoading(false);
          return;
        }

        const response = await getProperty(id);
        
        if (response && response.data) {
          console.log('Datos de propiedad cargados:', response.data);
          setFormData(response.data);
          setImages(response.data.images || []);
          
          // Separar características
          const internas = response.data.caracteristicas
            .filter(c => c.type === 'interna')
            .map(c => c.name);
          const externas = response.data.caracteristicas
            .filter(c => c.type === 'externa')
            .map(c => c.name);
          
          setSelectedCaracteristicas({
            internas,
            externas
          });
        } else {
          setError('No se encontraron datos de la propiedad');
        }
      } catch (err) {
        console.error('Error al cargar la propiedad:', err);
        setError('Error al cargar la propiedad');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, getProperty]);

  // Limpiar URLs de objetos al desmontar
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.public_id?.startsWith('blob:')) {
          URL.revokeObjectURL(img.public_id);
        }
      });
    };
  }, [images]);

  // Manejadores de cambios
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCaracteristicaChange = (caracteristica, tipo) => {
    setSelectedCaracteristicas(prev => {
      const tipoKey = tipo === 'interna' ? 'internas' : 'externas';
      const updated = prev[tipoKey].includes(caracteristica)
        ? prev[tipoKey].filter(c => c !== caracteristica)
        : [...prev[tipoKey], caracteristica];

      return {
        ...prev,
        [tipoKey]: updated
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > (formData?.imageLimit || 15)) {
      setError(`No puedes subir más de ${formData?.imageLimit || 15} imágenes`);
      return;
    }

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Algunas imágenes son demasiado grandes. Máximo 5MB por imagen');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          public_id: URL.createObjectURL(file),
          secure_url: URL.createObjectURL(file),
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });

    setNewImages(prev => [...prev, ...files]);
    setError(null);
  };

  const handleImageDelete = (publicId) => {
    if (publicId.startsWith('blob:')) {
      setImages(prev => prev.filter(img => img.public_id !== publicId));
      setNewImages(prev => prev.filter(file => URL.createObjectURL(file) !== publicId));
      URL.revokeObjectURL(publicId);
    } else {
      setImagesToDelete(prev => [...prev, publicId]);
      setImages(prev => prev.filter(img => img.public_id !== publicId));
    }

    // Ajustar mainImageIndex si es necesario
    if (mainImageIndex >= images.length - 1) {
      setMainImageIndex(0);
    }
  };

  const handleSetMainImage = (index) => {
    if (index >= 0 && index < images.length) {
      // Crear una copia del array de imágenes
      const updatedImages = [...images];
      // Remover la imagen seleccionada de su posición actual
      const [selectedImage] = updatedImages.splice(index, 1);
      // Insertar la imagen seleccionada al inicio del array (posición 0)
      updatedImages.unshift(selectedImage);
      // Actualizar el estado de las imágenes con el nuevo orden
      setImages(updatedImages);
      // Actualizar el índice de la imagen principal a 0
      setMainImageIndex(0);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (!isAuthenticated) {
        navigate('/login');
        throw new Error('No hay sesión activa. Por favor, inicie sesión.');
      }

      if (!id) {
        throw new Error('ID de propiedad no encontrado');
      }

      // Formatear las características según el modelo
      const caracteristicasFormateadas = [
        ...selectedCaracteristicas.internas.map(name => ({
          name: name,
          type: 'interna'
        })),
        ...selectedCaracteristicas.externas.map(name => ({
          name: name,
          type: 'externa'
        }))
      ];

      // Preparar los datos para enviar - ahora las imágenes ya están en el orden correcto
      const updatedFormData = {
        ...formData,
        caracteristicas: caracteristicasFormateadas,
        images: images // Ya no necesitamos reorganizar las imágenes aquí porque se mantienen ordenadas
      };

      console.log('Datos a enviar:', updatedFormData);

      const response = await fetch(`${API_URL}/property/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la propiedad');
      }

      const result = await response.json();
      setSuccess(true);
      console.log('Propiedad actualizada:', result);
      
      setTimeout(() => {
        navigate('/properties');
      }, 2000);

    } catch (error) {
      setError(error.message);
      console.error('Error en la actualización:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional para el estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">Propiedad actualizada exitosamente</p>
          </div>
        )}

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Inmueble
            </label>
            <select
              name="tipoInmueble"
              value={formData.tipoInmueble}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione...</option>
              {['Apartamento', 'Casa', 'Local', 'Oficina', 'Bodega', 'Lote', 'Finca'].map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Negocio
            </label>
            <select
              name="tipoNegocio"
              value={formData.tipoNegocio}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione...</option>
              {['Venta', 'Arriendo'].map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">País</label>
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700">
              Departamento
            </label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zona
            </label>
            <input
              type="text"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Características numéricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'areaConstruida', label: 'Área Construida (m²)' },
            { name: 'areaPrivada', label: 'Área Privada (m²)' },
            { name: 'areaTerreno', label: 'Área Terreno (m²)' },
            { name: 'alcobas', label: 'Alcobas' },
            { name: 'banos', label: 'Baños' },
            { name: 'garaje', label: 'Garajes' },
            { name: 'estrato', label: 'Estrato' },
            { name: 'piso', label: 'Piso' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          ))}
        </div>

        {/* Información financiera y estado */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              name="costo"
              value={formData.costo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valor Administración
            </label>
            <input
              type="number"
              name="valorAdministracion"
              value={formData.valorAdministracion}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Año Construcción
            </label>
            <input
              type="number"
              name="anioConstruccion"
              value={formData.anioConstruccion}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione...</option>
              {['Nuevo', 'Usado'].map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Características Internas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Características Internas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {caracteristicasInternas.map(caracteristica => (
              <div key={caracteristica} className="flex items-center">
                <input
                  type="checkbox"
                  id={`interna-${caracteristica}`}
                  checked={selectedCaracteristicas.internas.includes(caracteristica)}
                  onChange={() => handleCaracteristicaChange(caracteristica, 'interna')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`interna-${caracteristica}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {caracteristica}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Características Externas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Características Externas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {caracteristicasExternas.map(caracteristica => (
              <div key={caracteristica} className="flex items-center">
                <input
                  type="checkbox"
                  id={`externa-${caracteristica}`}
                  checked={selectedCaracteristicas.externas.includes(caracteristica)}
                  onChange={() => handleCaracteristicaChange(caracteristica, 'externa')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`externa-${caracteristica}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {caracteristica}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Imágenes */}
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetMainImage(index)}
                    className={`absolute bottom-2 right-2 px-2 py-1 rounded-md transition-all ${
                      index === 0
                        ? 'bg-blue-500 text-white opacity-100'
                        : 'bg-gray-500 text-white opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {index === 0 ? 'Principal' : 'Hacer principal'}
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
                PNG, JPG (máx. {formData?.imageLimit || 15} imágenes)
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
                {newImages.length} {newImages.length === 1 ? 'nueva imagen seleccionada' : 'nuevas imágenes seleccionadas'}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Actualizando...' : 'Actualizar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
};