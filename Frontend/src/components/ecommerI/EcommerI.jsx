import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FRONTEND_URL } from '../../config';

const UPDATE_TIMES = [8, 18]; // 8am y 6pm
const PRICE_HISTORY_KEY = 'market_price_history';

const formatPrice = (value) => {
  return Number(value).toLocaleString('es-CO', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const PriceChange = ({ currentPrice, previousPrice, hideArrow = false }) => {
  if (!previousPrice) return null;
  
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

const FinancialItem = ({ symbol, price, previousPrice }) => (
  <div className="flex items-center space-x-4 px-6 py-2 whitespace-nowrap">
    <span className="text-gray-300 min-w-[100px]">{symbol}</span>
    <div className="inline-flex items-center gap-3">
      <span className="font-semibold text-white">
        {formatPrice(price)}
      </span>
      <PriceChange 
        currentPrice={price}
        previousPrice={previousPrice}
      />
    </div>
  </div>
);

export const Indicador = () => {
  const [financialData, setFinancialData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${FRONTEND_URL}/api/financial-data`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const newData = await response.json();
      const prevData = localStorage.getItem(PRICE_HISTORY_KEY);
      const previousPrices = prevData ? JSON.parse(prevData) : null;
      
      const enrichedData = newData.map(item => ({
        ...item,
        previousPrice: previousPrices?.find(p => p.symbol === item.symbol)?.price || item.price
      }));

      localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(
        enrichedData.map(({ symbol, price }) => ({ symbol, price }))
      ));
      
      setFinancialData(enrichedData);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const checkUpdateTime = () => {
      const now = new Date();
      if (UPDATE_TIMES.includes(now.getHours()) && now.getMinutes() === 0) {
        fetchFinancialData();
      }
    };

    fetchFinancialData();
    const interval = setInterval(checkUpdateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white py-2 text-center">
        Cargando datos financieros...
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white h-12 overflow-hidden z-[1002]">
      <div className="h-full flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track inline-flex">
            {[...financialData, ...financialData, ...financialData].map((item, index) => (
              <FinancialItem
                key={`item-${index}`}
                symbol={item.symbol}
                price={item.price}
                previousPrice={item.previousPrice}
              />
            ))}
          </div>
        </div>
        {lastUpdated && !isMobile && (
          <div className="px-4 text-xs text-gray-400">
            Actualizado: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
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
    </div>
  );
};
