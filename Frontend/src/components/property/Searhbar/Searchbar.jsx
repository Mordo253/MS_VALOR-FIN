import React, { useState } from 'react';
import { MapPin, Search, Bed, Bath, DollarSign, X } from 'lucide-react';

export const Searchbar = ({ setSearchTerm, setFilters, tiposInmueble, minPrice, maxPrice }) => {
  const [localFilters, setLocalFilters] = useState({
    tipoInmueble: '',
    precioMin: '',
    precioMax: '',
    alcobas: '',
    banos: '',
    ciudad: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomPrice, setShowCustomPrice] = useState(false);

  const predefinedPriceRanges = [
    { min: 0, max: 100000000, label: 'Hasta $100M' },
    { min: 100000001, max: 300000000, label: '$100M - $300M' },
    { min: 300000001, max: 500000000, label: '$300M - $500M' },
    { min: 500000001, max: maxPrice, label: `>$500M` },
  ];

  const formatPrice = (value) => {
    if (!value) return '';
    const numberValue = String(value).replace(/\D/g, '');
    return new Intl.NumberFormat('de-DE').format(numberValue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'ciudad') {
      setSearchTerm?.(value);
    }

    applyFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleCustomPriceChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/\D/g, '');

    setLocalFilters(prev => ({
      ...prev,
      [name]: rawValue,
    }));

    applyFilters({
      ...localFilters,
      [name]: rawValue,
    });
  };

  const handlePriceRangeChange = (e) => {
    const selectedRange = e.target.value;

    if (selectedRange === 'custom') {
      setShowCustomPrice(true);
      setLocalFilters(prev => ({
        ...prev,
        precioMin: '',
        precioMax: '',
      }));
    } else {
      setShowCustomPrice(false);
      const [min, max] = selectedRange.split('-');
      
      const updatedFilters = {
        ...localFilters,
        precioMin: min,
        precioMax: max,
      };

      setLocalFilters(updatedFilters);
      applyFilters(updatedFilters);
    }
  };

  const applyFilters = (filters) => {
    const filtersToApply = {};
    
    if (filters.ciudad) filtersToApply.ciudad = filters.ciudad;
    if (filters.tipoInmueble) filtersToApply.tipoInmueble = filters.tipoInmueble;
    if (filters.precioMin) filtersToApply.precioMin = parseInt(filters.precioMin);
    if (filters.precioMax) filtersToApply.precioMax = parseInt(filters.precioMax);
    if (filters.alcobas) filtersToApply.alcobas = parseInt(filters.alcobas);
    if (filters.banos) filtersToApply.banos = parseInt(filters.banos);

    setFilters(filtersToApply);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      tipoInmueble: '',
      precioMin: '',
      precioMax: '',
      alcobas: '',
      banos: '',
      ciudad: '',
    });
    setShowCustomPrice(false);
    setSearchTerm?.('');
    setFilters({});
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6">
        {/* Contenedor principal con scroll horizontal en móvil */}
        <div className="flex flex-col gap-4">
          {/* Barra principal siempre visible */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de búsqueda */}
            <div className="flex-grow min-w-[200px] relative">
              <input
                type="text"
                name="ciudad"
                value={localFilters.ciudad}
                onChange={handleFilterChange}
                placeholder="Ciudad o ubicación"
                className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Botón expandir/colapsar en móvil */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Filtros adicionales - expandibles en móvil */}
          <div className={`${isExpanded ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 transition-all duration-300`}>
            {/* Tipo de inmueble */}
            <div className="w-full md:w-48 relative">
              <select
                name="tipoInmueble"
                value={localFilters.tipoInmueble}
                onChange={handleFilterChange}
                className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
              >
                <option value="">Tipo de inmueble</option>
                {tiposInmueble.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Rango de precios */}
            <div className="w-full md:w-48 relative">
              <select
                onChange={handlePriceRangeChange}
                className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
              >
                <option value="">Rango de precios</option>
                {predefinedPriceRanges.map((range, index) => (
                  <option key={index} value={`${range.min}-${range.max}`}>{range.label}</option>
                ))}
                <option value="custom">Personalizado</option>
              </select>
              <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Alcobas y baños */}
            <div className="flex gap-4 flex-1">
              <div className="w-full md:w-32 relative">
                <input
                  type="number"
                  name="alcobas"
                  value={localFilters.alcobas}
                  onChange={handleFilterChange}
                  placeholder="Alcobas"
                  min="0"
                  className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
                />
                <Bed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="w-full md:w-32 relative">
                <input
                  type="number"
                  name="banos"
                  value={localFilters.banos}
                  onChange={handleFilterChange}
                  placeholder="Baños"
                  min="0"
                  className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
                />
                <Bath className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Botón limpiar */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full md:w-auto h-12 px-6 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          {/* Precios personalizados */}
          {showCustomPrice && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 relative">
                <input
                  type="text"
                  name="precioMin"
                  value={formatPrice(localFilters.precioMin)}
                  onChange={handleCustomPriceChange}
                  placeholder="Precio mínimo"
                  className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
                />
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="w-full sm:w-1/2 relative">
                <input
                  type="text"
                  name="precioMax"
                  value={formatPrice(localFilters.precioMax)}
                  onChange={handleCustomPriceChange}
                  placeholder="Precio máximo"
                  className="w-full h-12 pl-4 pr-10 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
                />
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};