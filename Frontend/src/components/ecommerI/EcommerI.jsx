// components/Indicador.js
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FRONTEND_URL } from "../../config";

const formatPrice = (value) => {
  if (value === null || value === undefined) return '-';
  return Number(value).toLocaleString('es-CO', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const PriceChange = ({ currentPrice, previousPrice, hideArrow = false }) => {
  if (!previousPrice || !currentPrice) return null;
  
  const priceDiff = currentPrice - previousPrice;
  const percentChange = (priceDiff / previousPrice) * 100;
  const isPositive = priceDiff >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  return (
    <div className={`inline-flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {!hideArrow && <Icon className="w-4 h-4" strokeWidth={2.5} />}
      <span className="text-sm font-medium">
        {percentChange.toFixed(2)}%
      </span>
    </div>
  );
};

const FinancialItem = ({ symbol, name, price, previousPrice }) => {
  const displaySymbol = symbol.includes('USD') || symbol.includes('EUR') ? '$' : 
                       symbol.includes('IPC') || symbol.includes('TASA') || symbol.includes('DTF') ? '%' : '';

  return (
    <div className="flex items-center space-x-4 px-6 py-2 whitespace-nowrap">
      <span className="text-gray-300 min-w-[100px]">{name || symbol}</span>
      <div className="inline-flex items-center gap-3">
        <span className="font-semibold text-white">
          {displaySymbol}{formatPrice(price)}
        </span>
        <PriceChange 
          currentPrice={price}
          previousPrice={previousPrice}
        />
      </div>
    </div>
  );
};

export const Indicador = () => {
  const [financialData, setFinancialData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldUpdate = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return (
      (hour === 8 && minute < 30) || 
      (hour === 12 && minute < 30)
    );
  };

  const fetchData = async () => {
    try {
      setError(null);
      
      if (shouldUpdate()) {
        setIsUpdating(true);
        const response = await fetch(`${FRONTEND_URL}/api/update-data`, {
          method: 'POST'
        });
        
        if (!response.ok) throw new Error('Error en la actualizaciÃ³n');
        
        const result = await response.json();
        setFinancialData(result.data);
        setLastUpdate(new Date());
      } else {
        const response = await fetch(`${FRONTEND_URL}/api/financial-data`);
        if (!response.ok) throw new Error('Error al obtener datos');
        
        const data = await response.json();
        setFinancialData(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const checkInterval = setInterval(() => {
      fetchData();
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkInterval);
  }, []);

  const sortedData = [...financialData].sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white h-12 overflow-hidden z-[1002]">
        <div className="h-full flex items-center justify-between">
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track inline-flex">
              {[...sortedData, ...sortedData, ...sortedData].map((item, index) => (
                <FinancialItem
                  key={`${item.symbol}-${index}`}
                  symbol={item.symbol}
                  name={item.name}
                  price={item.price}
                  previousPrice={item.previousPrice}
                />
              ))}
            </div>
          </div>
          {!isMobile && lastUpdate && (
            <div className="px-4 text-xs text-gray-400">
              Actualizado: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker 30s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @media (max-width: 640px) {
          .ticker-track {
            animation-duration: 20s;
          }
        }
      `}</style>
    </>
  );
};