import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';
const MAX_UPDATES = 5;
const RESET_HOURS = 24;
const STORAGE_KEY = 'financial_updates';

const FinancialItem = ({ symbol, price, percentChange }) => (
  <div className="flex items-center space-x-2 text-sm whitespace-nowrap px-3 py-2">
    <span className="font-semibold">{symbol}</span>
    <span className="font-bold">{typeof price === 'number' ? price.toFixed(2) : price}</span>
  </div>
);

export const Indicador = () => {
  const [financialData, setFinancialData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [nextResetTime, setNextResetTime] = useState(null);

  // Función para cargar el estado guardado
  const loadSavedState = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { count, timestamp } = JSON.parse(savedData);
        const now = new Date().getTime();
        const timeDiff = now - timestamp;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff >= RESET_HOURS) {
          // Han pasado 24 horas, reiniciar contador
          setUpdateCount(0);
          setNextResetTime(now + (RESET_HOURS * 60 * 60 * 1000));
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            count: 0,
            timestamp: now
          }));
        } else {
          // No han pasado 24 horas, mantener contador y calcular tiempo restante
          setUpdateCount(count);
          setNextResetTime(timestamp + (RESET_HOURS * 60 * 60 * 1000));
        }
      } else {
        // Primera vez, inicializar
        const now = new Date().getTime();
        setNextResetTime(now + (RESET_HOURS * 60 * 60 * 1000));
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          count: 0,
          timestamp: now
        }));
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  };

  // Función para formatear el tiempo restante
  const formatTimeRemaining = () => {
    if (!nextResetTime) return '';
    
    const now = new Date().getTime();
    const timeLeft = nextResetTime - now;
    
    if (timeLeft <= 0) return 'Reiniciando...';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/financial-data`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFinancialData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Error al cargar los datos. Por favor, intente de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async () => {
    if (updateCount >= MAX_UPDATES) {
      setError(`Has alcanzado el límite máximo de actualizaciones. Se restablecerá en ${formatTimeRemaining()}`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/update-data`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await fetchFinancialData();
      const newCount = updateCount + 1;
      setUpdateCount(newCount);
      
      // Guardar el nuevo estado
      const now = new Date().getTime();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        count: newCount,
        timestamp: now
      }));
    } catch (error) {
      console.error('Error updating financial data:', error);
      setError('Error al actualizar los datos. Por favor, intente de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedState();
    fetchFinancialData();

    // Actualización automática de datos cada 5 minutos
    const dataInterval = setInterval(fetchFinancialData, 5 * 60 * 1000);

    // Verificar el tiempo restante cada minuto
    const checkResetInterval = setInterval(() => {
      const now = new Date().getTime();
      if (nextResetTime && now >= nextResetTime) {
        loadSavedState(); // Esto reiniciará el contador si han pasado 24 horas
      }
    }, 60 * 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(checkResetInterval);
    };
  }, []);

  if (isLoading && financialData.length === 0) {
    return <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white py-2 px-4 text-center z-50">Cargando datos financieros...</div>;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white py-1 px-4 overflow-hidden z-[1101] h-12">
      <div className="flex justify-between items-center">
        <div className="flex-grow overflow-hidden">
          <div className="animate-scroll flex space-x-6 whitespace-nowrap">
            {[...financialData, ...financialData].map((item, index) => (
              <FinancialItem
                key={index}
                symbol={item.symbol}
                price={item.price}
                percentChange={item.percentChange}
              />
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
          {lastUpdated && (
            <span className="text-xs">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div className="flex flex-col items-end">
            <button 
              onClick={updateData} 
              className={`bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded flex items-center ${updateCount >= MAX_UPDATES ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || updateCount >= MAX_UPDATES}
            >
              <RefreshCw size={12} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar ({MAX_UPDATES - updateCount} restantes)
            </button>
            {updateCount >= MAX_UPDATES && (
              <span className="text-xs text-red-400 mt-1">
                Reinicio en: {formatTimeRemaining()}
              </span>
            )}
          </div>
        </div>
      </div>
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </div>
  );
};