import { useEffect, useState } from 'react';
import { useProperties } from '../../context/PropertyContex';
import { Searchbar } from '../../components/property/Searhbar/Searchbar';
import { Item } from '../../components/property/Item/Item';

export const PropertyList = () => {
  const { properties, loading, error, getAllProperties } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    zona: '',
    tipoInmueble: '',
    precioMin: '',
    precioMax: '',
    alcobas: '',
    banos: ''
  });

  useEffect(() => {
    getAllProperties();
  }, [getAllProperties]);

  const minPrice = Math.min(...properties.map(p => p.costo));
  const maxPrice = Math.max(...properties.map(p => p.costo));
  const uniqueTiposInmueble = [...new Set(properties.map(property => property.tipoInmueble))];

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProperties = properties.filter((property) => {
    if (!property.disponible) return false;

    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesSearchTerm = 
      property.title?.toLowerCase().includes(lowerCaseSearch) ||
      property.ciudad?.toLowerCase().includes(lowerCaseSearch) ||
      property.costo?.toString().includes(searchTerm) ||
      property.codigo?.toLowerCase().includes(lowerCaseSearch);

    return (
      matchesSearchTerm &&
      (!filters.zona || property.zona?.toLowerCase() === filters.zona.toLowerCase()) &&
      (!filters.tipoInmueble || property.tipoInmueble?.toLowerCase() === filters.tipoInmueble.toLowerCase()) &&
      (!filters.precioMin || property.costo >= parseInt(filters.precioMin)) &&
      (!filters.precioMax || property.costo <= parseInt(filters.precioMax)) &&
      (!filters.alcobas || property.alcobas >= parseInt(filters.alcobas)) &&
      (!filters.banos || property.banos >= parseInt(filters.banos))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-lg text-center">Cargando propiedades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen pb-8 md:pb-12 lg:pb-16 relative top-8">
      <div className="pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-yellow-50 rounded-lg md:rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <Searchbar
              setSearchTerm={setSearchTerm}
              setFilters={handleSetFilters}
              tiposInmueble={uniqueTiposInmueble}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
            
            <div className="mt-6 md:mt-8">
              {filteredProperties.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProperties.map((property) => (
                    <div key={property._id} className="flex justify-center">
                      <Item {...property} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-base md:text-lg">
                    No se encontraron propiedades
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};