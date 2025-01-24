import { useEffect, useState } from 'react';
import { useVehicles } from '../../context/CarContext';  // Asumimos que tienes un contexto similar al de Properties
import { Item } from '../../components/car/Item/ItemC'; // Asumimos que tienes un componente Item similar para mostrar los detalles del vehículo
import { SearchbarC } from "../../components/car/searchbar/SearchBar.jsx";
export const CarList = () => {
  const { vehicles, loading, error, getAllVehicles } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    fuel: '',
    disponible: true,
  });

  useEffect(() => {
    getAllVehicles();
  }, [getAllVehicles]);

  const minPrice = Math.min(...vehicles.map(v => v.price));
  const maxPrice = Math.max(...vehicles.map(v => v.price));
  const uniqueBrands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  const uniqueFuelTypes = [...new Set(vehicles.map(vehicle => vehicle.fuel))];

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!vehicle.disponible) return false;

    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesSearchTerm =
      vehicle.title?.toLowerCase().includes(lowerCaseSearch) ||
      vehicle.color?.toLowerCase().includes(lowerCaseSearch) ||
      vehicle.price?.toString().includes(searchTerm) ||
      vehicle.codigo?.toLowerCase().includes(lowerCaseSearch);

    return (
      matchesSearchTerm &&
      (!filters.brand || vehicle.brand?.toLowerCase() === filters.brand.toLowerCase()) &&
      (!filters.model || vehicle.model?.toString() === filters.model.toString()) &&
      (!filters.priceMin || vehicle.price >= parseInt(filters.priceMin)) &&
      (!filters.priceMax || vehicle.price <= parseInt(filters.priceMax)) &&
      (!filters.yearMin || vehicle.registrationYear >= parseInt(filters.yearMin)) &&
      (!filters.yearMax || vehicle.registrationYear <= parseInt(filters.yearMax)) &&
      (!filters.fuel || vehicle.fuel?.toLowerCase() === filters.fuel.toLowerCase()) &&
      vehicle.disponible === filters.disponible
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-lg text-center">Cargando vehículos...</div>
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
            <SearchbarC
              setSearchTerm={setSearchTerm}
              setFilters={handleSetFilters}
              brands={uniqueBrands}
              fuelTypes={uniqueFuelTypes}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />

            <div className="mt-6 md:mt-8">
              {filteredVehicles.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredVehicles.map((vehicle) => (
                    <div key={vehicle._id} className="flex justify-center">
                      <Item {...vehicle} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-base md:text-lg">
                    No se encontraron vehículos
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
