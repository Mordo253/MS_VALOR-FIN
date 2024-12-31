import React, { useState, useEffect } from 'react';
import { Car, Fuel, GitFork, Calendar, Search, DollarSign } from 'lucide-react';

export const SearchbarC = ({ setSearchTerm, setFilters, brands, fuelTypes, minPrice, maxPrice }) => {
  const [localFilters, setLocalFilters] = useState({
    brand: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    fuel: '',
    disponible: true,
  });

  const predefinedPriceRanges = [
    { min: minPrice || 0, max: 100000000, label: 'Hasta $100.000.000' },
    { min: 100000001, max: 300000000, label: '$100.000.000 - $300.000.000' },
    { min: 300000001, max: 500000000, label: '$300.000.000 - $500.000.000' },
    { min: 500000001, max: maxPrice, label: 'Más de $500.000.000' }
  ];

  useEffect(() => {
    const filtersToApply = {
      brand: localFilters.brand || '',
      model: localFilters.model || '',
      priceMin: localFilters.priceMin ? parseInt(localFilters.priceMin) : '',
      priceMax: localFilters.priceMax ? parseInt(localFilters.priceMax) : '',
      yearMin: localFilters.yearMin ? parseInt(localFilters.yearMin) : '',
      yearMax: localFilters.yearMax ? parseInt(localFilters.yearMax) : '',
      fuel: localFilters.fuel || '',
      disponible: true
    };

    setFilters(filtersToApply);
    // Solo actualizamos el término de búsqueda si hay modelo, ya que la marca se maneja por filtro
    if (localFilters.model) {
      setSearchTerm(localFilters.model);
    } else {
      setSearchTerm('');
    }
  }, [localFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrandSelect = (e) => {
    const selectedBrand = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      brand: selectedBrand
    }));
  };

  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split('-');
    setLocalFilters(prev => ({
      ...prev,
      priceMin: min || '',
      priceMax: max || ''
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      brand: '',
      model: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      fuel: '',
      disponible: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col gap-4">
        {/* Primera fila - Búsqueda principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <select
              name="brand"
              value={localFilters.brand}
              onChange={handleBrandSelect}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Todas las marcas</option>
              {brands?.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <Car className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="text"
              name="model"
              value={localFilters.model}
              onChange={handleFilterChange}
              placeholder="Modelo"
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <select
              name="priceRange"
              onChange={handlePriceRangeChange}
              value={`${localFilters.priceMin}-${localFilters.priceMax}`}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Rango de precios</option>
              {predefinedPriceRanges.map((range, index) => (
                <option key={index} value={`${range.min}-${range.max}`}>
                  {range.label}
                </option>
              ))}
            </select>
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <select
              name="fuel"
              value={localFilters.fuel}
              onChange={handleFilterChange}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Tipo de combustible</option>
              {fuelTypes?.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
            <Fuel className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="number"
              name="yearMin"
              value={localFilters.yearMin}
              onChange={handleFilterChange}
              placeholder="Año mínimo"
              min="1886"
              max={new Date().getFullYear()}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="number"
              name="yearMax"
              value={localFilters.yearMax}
              onChange={handleFilterChange}
              placeholder="Año máximo"
              min="1886"
              max={new Date().getFullYear()}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Botón limpiar */}
        {Object.values(localFilters).some(value => value !== '' && value !== true) && (
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-6 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};