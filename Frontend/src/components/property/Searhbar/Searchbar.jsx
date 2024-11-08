  import React, { useState } from 'react';
  import { MapPin, Search, Bed, Bath, DollarSign } from 'lucide-react';

  export const Searchbar = ({ setSearchTerm, setFilters, tiposInmueble, minPrice, maxPrice }) => {
    const [localFilters, setLocalFilters] = useState({
      tipoInmueble: '',
      precioMin: '',
      precioMax: '',
      alcobas: '',
      banos: '',
      ciudad: '',
    });

    const predefinedPriceRanges = [
      { min: 0, max: 100000000, label: 'Hasta $100.000.000' },
      { min: 100000001, max: 300000000, label: '$100.000.000 - $300.000.000' },
      { min: 300000001, max: 500000000, label: '$300.000.000 - $500.000.000' },
      { min: 500000001, max: maxPrice, label: `Más de $500.000.000` },
    ];

    const [showCustomPrice, setShowCustomPrice] = useState(false);

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

      // Aplicar filtros automáticamente
      const updatedFilters = {
        ...localFilters,
        [name]: value,
      };

      applyFilters(updatedFilters);
    };

    const handleCustomPriceChange = (e) => {
      const { name, value } = e.target;
      const rawValue = value.replace(/\D/g, '');

      setLocalFilters(prev => ({
        ...prev,
        [name]: rawValue,
      }));

      const updatedFilters = {
        ...localFilters,
        [name]: rawValue,
      };

      applyFilters(updatedFilters);
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

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center gap-6">
          {/* Fila principal de búsqueda */}
          <div className="w-full max-w-5xl flex flex-wrap gap-4">
            {/* Barra de búsqueda principal - más ancha */}
            <div className='flex-grow min-w-[300px] flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
              <input
                type="text"
                name="ciudad"
                value={localFilters.ciudad}
                onChange={handleFilterChange}
                placeholder="Ingrese nombre, ciudad o precio"
                className="bg-transparent border-none outline-none w-full"
              />
              <MapPin className="relative right-6 text-xl text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
  
            {/* Tipo de inmueble - ancho fijo */}
            <div className='w-[200px] flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
              <select
                name="tipoInmueble"
                value={localFilters.tipoInmueble}
                onChange={handleFilterChange}
                className="bg-transparent border-none outline-none w-full pr-12"
              >
                <option value="">Tipo de inmueble</option>
                {tiposInmueble.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <Search className="relative right-6 text-xl text-gray-400" />
            </div>
  
            {/* Botón de búsqueda - ancho fijo */}
            {/* <button
              onClick={() => applyFilters(localFilters)}
              className="w-[120px] h-[3.3rem] bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button> */}
          </div>
  
          {/* Segunda fila de filtros */}
          <div className="w-full max-w-5xl flex flex-wrap gap-4">
            {/* Rango de precios */}
            <div className='w-[250px] flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
              <select
                onChange={handlePriceRangeChange}
                className="bg-transparent border-none outline-none w-full pr-12"
              >
                <option value="">Rango de precios</option>
                {predefinedPriceRanges.map((range, index) => (
                  <option key={index} value={`${range.min}-${range.max}`}>{range.label}</option>
                ))}
                <option value="custom">Personalizado</option>
              </select>
              <DollarSign className="relative right-6 text-xl text-gray-400" />
            </div>
  
            {/* Características en línea */}
            <div className='flex-grow min-w-[300px] flex gap-4'>
              <div className='flex-1 flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
                <input
                  type="number"
                  name="alcobas"
                  value={localFilters.alcobas}
                  onChange={handleFilterChange}
                  placeholder="Alcobas"
                  min="0"
                  className="bg-transparent border-none outline-none w-full pr-12"
                />
                <Bed className="relative right-6 text-xl text-gray-400" />
              </div>
              <div className='flex-1 flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
                <input
                  type="number"
                  name="banos"
                  value={localFilters.banos}
                  onChange={handleFilterChange}
                  placeholder="Baños"
                  min="0"
                  className="bg-transparent border-none outline-none w-full pr-12"
                />
                <Bath className="relative right-6 text-xl text-gray-400" />
              </div>
            </div>
  
            {/* Botón limpiar - solo visible cuando hay filtros */}
            {Object.values(localFilters).some(value => value !== '') && (
              <button
                onClick={handleClearFilters}
                className="w-[120px] h-[3.3rem] bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
              >
                Limpiar
              </button>
            )}
          </div>
  
          {/* Precios personalizados - aparece cuando se selecciona "Personalizado" */}
          {showCustomPrice && (
            <div className="w-full max-w-5xl flex gap-4">
              <div className='flex-1 flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
                <input
                  type="text"
                  name="precioMin"
                  value={formatPrice(localFilters.precioMin)}
                  onChange={handleCustomPriceChange}
                  placeholder="Precio mínimo"
                  className="bg-transparent border-none outline-none w-full pr-12"
                />
                <DollarSign className="relative right-6 text-xl text-gray-400" />
              </div>
              <div className='flex-1 flexBetween pl-6 h-[3.3rem] bg-white rounded-full ring-1 ring-slate-500/5 hover:ring-2 hover:ring-blue-200 transition-all duration-200'>
                <input
                  type="text"
                  name="precioMax"
                  value={formatPrice(localFilters.precioMax)}
                  onChange={handleCustomPriceChange}
                  placeholder="Precio máximo"
                  className="bg-transparent border-none outline-none w-full pr-12"
                />
                <DollarSign className="relative right-6 text-xl text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };