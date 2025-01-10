import React, { useState, useEffect, useRef } from 'react';
import { Calculator, RefreshCw, X } from 'lucide-react';
import { NotarialCalculator } from '../../../pages/Tools/Notarialtool';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(value);
};

const formatNumber = (value) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const unformatNumber = (value) => {
  return value.replace(/\./g, "");
};

const Modal = ({ isOpen, onClose, children, isNotarial }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !contentRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef} 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] px-4 py-6"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <div 
        ref={contentRef}
        className={`relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto z-[10000] transform transition-all duration-300 ease-in-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${
          isNotarial 
            ? 'max-w-4xl' 
            : 'max-w-md'  
        }`}
      >
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <button 
            onClick={() => {
              document.body.style.overflow = 'unset';
              onClose();
            }} 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <div className={`p-6 ${isNotarial ? 'px-8' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const CreditSimulator = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState(120);
  const [rateType, setRateType] = useState('fixed');
  const [customRate, setCustomRate] = useState('');
  const [result, setResult] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || parseInt(value, 10) >= 0) {
      setAmount(value ? parseInt(value, 10) : '');
    }
  };

  const handleTermChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || value === '0') {
      setTerm('');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue >= 1 && numValue <= 360) {
        setTerm(numValue);
      } else if (numValue > 360) {
        setTerm(360);
      }
    }
  };

  const handleCustomRateChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && !value.startsWith('-'))) {
      setCustomRate(value);
    }
  };

  const calculateMonthlyPayment = (principal, rate, months) => {
    const monthlyRate = rate / 100;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const handleSimulate = () => {
    if (!amount || amount < 1000000 || amount > 20000000000) {
      alert('Por favor ingrese un monto válido entre $1,000,000 y $500,000,000');
      return;
    }

    if (!term || term < 1 || term > 360) {
      alert('Por favor ingrese un plazo válido entre 1 y 360 meses');
      return;
    }

    if (rateType === 'custom' && (!customRate || parseFloat(customRate) < 0)) {
      alert('Por favor ingrese una tasa válida mayor o igual a 0');
      return;
    }

    let monthlyRate;
    
    if (rateType === 'custom') {
      monthlyRate = parseFloat(customRate);
    } else {
      const rates = {
        fixed: 1.78,
        variableFixed: 1.84,
        variableVariable: 1.84
      };
      monthlyRate = rates[rateType];
    }

    const monthlyPayment = calculateMonthlyPayment(amount, monthlyRate, term);
    setResult({ 
      monthlyPayment,
      interestRate: monthlyRate,
      totalInterest: (monthlyPayment * term) - amount,
      totalPayment: monthlyPayment * term
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto del crédito</label>
        <input
          type="text"
          value={amount ? formatCurrency(amount).replace(/COP\s?/, '') : ''}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="$0"
        />
        <p className="text-xs text-gray-500 mt-1">Monto Mínimo: $1,000,000 - Monto Máximo: $500,000,000</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Plazo (meses)</label>
        <input
          type="text"
          value={term}
          onChange={handleTermChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Ingrese el plazo en meses"
        />
        <p className="text-xs text-gray-500 mt-1">Plazo entre 1 y 360 meses</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de tasa mes vencido</label>
        <select
          value={rateType}
          onChange={(e) => setRateType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="fixed">Tasa fija - 1.78% m.v.</option>
          <option value="variableFixed">Tasa variable cuota fija - 1.84% m.v.</option>
          <option value="variableVariable">Tasa variable cuota variable - 1.84% m.v.</option>
          <option value="custom">Tasa personalizada</option>
        </select>
      </div>

      {rateType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Tasa mensual vencida (%)</label>
          <input
            type="number"
            value={customRate}
            onChange={handleCustomRateChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Ejemplo: 1.78"
          />
          <p className="text-xs text-gray-500 mt-1">Ingrese la tasa efectiva mensual (mes vencido)</p>
        </div>
      )}

      <button
        onClick={handleSimulate}
        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        SIMULAR
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md space-y-2">
          <h3 className="font-semibold text-lg mb-2">Resultado de la simulación:</h3>
          <p>Cuota mensual: {formatCurrency(Math.round(result.monthlyPayment))}</p>
          <p>Tasa mes vencido: {result.interestRate.toFixed(2)}%</p>
          <p>Total intereses: {formatCurrency(Math.round(result.totalInterest))}</p>
          <p>Total a pagar: {formatCurrency(Math.round(result.totalPayment))}</p>
        </div>
      )}
    </div>
  );
};

const InterestRateConverter = ({ onClose }) => {
  const [inputRate, setInputRate] = useState('');
  const [inputType, setInputType] = useState('annual');
  const [result, setResult] = useState(null);

  const handleRateChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && !value.startsWith('-'))) {
      setInputRate(value);
    }
  };

  const calculateMonthlyRate = () => {
    if (!inputRate || parseFloat(inputRate) < 0) {
      alert('Por favor ingrese una tasa válida mayor o igual a 0');
      return;
    }

    const rate = parseFloat(inputRate);
    if (isNaN(rate)) {
      setResult('Por favor, ingrese una tasa válida.');
      return;
    }

    let monthlyRate;
    let equivalentAnnual;

    switch (inputType) {
      case 'annual':
        monthlyRate = (Math.pow(1 + rate/100, 1/12) - 1) * 100;
        equivalentAnnual = rate;
        break;
      case 'nominal':
        const monthlyNominal = rate / 12;
        monthlyRate = monthlyNominal;
        equivalentAnnual = (Math.pow(1 + monthlyNominal/100, 12) - 1) * 100;
        break;
      case 'monthly':
        monthlyRate = rate;
        equivalentAnnual = (Math.pow(1 + rate/100, 12) - 1) * 100;
        break;
      default:
        monthlyRate = 0;
        equivalentAnnual = 0;
    }

    setResult({
      monthlyRate: parseFloat(monthlyRate.toFixed(4)),
      annualRate: parseFloat(equivalentAnnual.toFixed(4))
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tasa de interés</label>
        <input
          type="number"
          value={inputRate}
          onChange={handleRateChange}
          step="0.0001"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Ingrese la tasa"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de tasa</label>
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="annual">Efectiva Anual (E.A.)</option>
          <option value="nominal">Nominal Anual</option>
          <option value="monthly">Mensual Vencida (M.V.)</option>
        </select>
      </div>

      <button
        onClick={calculateMonthlyRate}
        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Convertir
      </button>

      {result && typeof result !== 'string' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md space-y-2">
          <h3 className="font-semibold text-lg mb-2">Resultado:</h3>
          <p>Tasa Mensual Vencida (M.V.): {result.monthlyRate}%</p>
          <p>Tasa Efectiva Anual (E.A.): {result.annualRate}%</p>
        </div>
      )}
    </div>
  );
};

export const ToolsI = () => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isNotarialOpen, setIsNotarialOpen] = useState(false);

  const toolCards = [
    {
      icon: <Calculator className="w-8 h-8 text-indigo-600" />,
      title: "Simulador de Crédito",
      onClick: () => setIsSimulatorOpen(true),
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-indigo-600" />,
      title: "Convertidor a Tasa M.V.",
      onClick: () => setIsConverterOpen(true),
    },
    {
      icon: <Calculator className="w-8 h-8 text-indigo-600" />,
      title: "Simulador Notarial",
      onClick: () => setIsNotarialOpen(true),
    }
  ];

  useEffect(() => {
    const handleModalOpen = (isOpen) => {
      if (isOpen) {
        const scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
      } else {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };

    handleModalOpen(isSimulatorOpen || isConverterOpen || isNotarialOpen);

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isSimulatorOpen, isConverterOpen, isNotarialOpen]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {toolCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform transition-transform duration-200 hover:scale-105"
            onClick={card.onClick}
          >
            <div className="flex flex-col items-center justify-center p-6 h-40">
              <div className="bg-indigo-50 rounded-full p-4 mb-4 transform transition-all duration-200 group-hover:scale-110">
                {card.icon}
              </div>
              <span className="text-sm font-medium text-center">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)}
      >
        <CreditSimulator onClose={() => setIsSimulatorOpen(false)} />
      </Modal>

      <Modal 
        isOpen={isConverterOpen} 
        onClose={() => setIsConverterOpen(false)}
      >
        <InterestRateConverter onClose={() => setIsConverterOpen(false)} />
      </Modal>

      <Modal 
        isOpen={isNotarialOpen} 
        onClose={() => setIsNotarialOpen(false)} 
        isNotarial={true}
      >
        <NotarialCalculator onClose={() => setIsNotarialOpen(false)} />
      </Modal>
    </div>
  );
};