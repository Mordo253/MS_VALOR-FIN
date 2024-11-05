import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProperties } from '../../context/PropertyContex';
import { Searchbar } from '../../components/property/Searhbar/Searchbar';
import { Item } from '../../components/property/Item/Item';
import { useEffect, useState } from 'react';

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

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const uniqueTiposInmueble = [...new Set(properties.map(property => property.tipoInmueble))];

  const filteredProperties = properties.filter((property) => {
    // Primero verificamos si la propiedad estÃ¡ disponible
    if (!property.disponible) {
      return false;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    const matchesSearchTerm = property.title.toLowerCase().includes(lowerCaseSearch) ||
                              property.ciudad.toLowerCase().includes(lowerCaseSearch) ||
                              (property.costo && property.costo.toString().includes(searchTerm)) ||
                              (property.codigo && property.codigo.toLowerCase().includes(lowerCaseSearch));

    const matchesZona = filters.zona ? property.zona.toLowerCase() === filters.zona.toLowerCase() : true;
    const matchesTipoInmueble = filters.tipoInmueble ? property.tipoInmueble.toLowerCase() === filters.tipoInmueble.toLowerCase() : true;
    const matchesPrecio = (
      (!filters.precioMin || property.costo >= parseInt(filters.precioMin)) &&
      (!filters.precioMax || property.costo <= parseInt(filters.precioMax))
    );
    const matchesAlcobas = filters.alcobas ? property.alcobas >= parseInt(filters.alcobas) : true;
    const matchesBanos = filters.banos ? property.banos >= parseInt(filters.banos) : true;

    return (
      matchesSearchTerm &&
      matchesZona &&
      matchesTipoInmueble &&
      matchesPrecio &&
      matchesAlcobas &&
      matchesBanos
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando propiedades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen pb-16 sm:pb-20 lg:pb-24">
      <div className="max-padd-container relative top-28">
        <div className="max-padd-container py-6 sm:py-8 lg:py-10 xl:py-22 bg-yellow-50 rounded-3xl">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Searchbar
              setSearchTerm={setSearchTerm}
              setFilters={handleSetFilters}
              tiposInmueble={uniqueTiposInmueble}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:mt-8 lg:mt-10">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <div key={property._id} className="flex justify-center">
                    <Item {...property} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center py-8">
                  <p className="text-gray-500 text-lg">No se encontraron propiedades</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};