import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, X } from 'lucide-react';
import { NotarialCalculator } from '../../../pages/Tools/Notarialtool';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const Modal = ({ isOpen, onClose, children, isNotarial }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-xl ${isNotarial ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto relative`}>
        <button 
          onClick={() => {
            document.body.style.overflow = 'unset';
            onClose();
          }} 
          className="float-right text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const CreditSimulator = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState(48);
  const [rateType, setRateType] = useState('fixed');
  const [customRate, setCustomRate] = useState('');
  const [result, setResult] = useState(null);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || parseInt(value, 10) >= 0) {
      setAmount(value ? parseInt(value, 10) : '');
    }
  };

  const handleTermChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 12) {
      setTerm(Math.min(value, 84));
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
    if (!amount || amount < 1000000 || amount > 500000000) {
      alert('Por favor ingrese un monto válido entre $1,000,000 y $500,000,000');
      return;
    }

    if (!term || term < 12 || term > 84) {
      alert('Por favor ingrese un plazo válido entre 12 y 84 meses');
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calculator className="mr-2" /> Simulador de Crédito
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto del crédito</label>
        <input
          type="text"
          value={amount ? formatCurrency(amount).replace(/COP\s?/, '') : ''}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="$0"
          min="1000000"
          max="500000000"
        />
        <p className="text-xs text-gray-500 mt-1">Monto Mínimo: $1,000,000 - Monto Máximo: $500,000,000</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Plazo (meses)</label>
        <input
          type="number"
          value={term}
          onChange={handleTermChange}
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === '.') {
              e.preventDefault();
            }
          }}
          min="12"
          max="84"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">Plazo entre 12 y 84 meses</p>
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
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
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
          <p>Cuota mensual: {formatCurrency(result.monthlyPayment)}</p>
          <p>Tasa mes vencido: {result.interestRate.toFixed(2)}%</p>
          <p>Total intereses: {formatCurrency(result.totalInterest)}</p>
          <p>Total a pagar: {formatCurrency(result.totalPayment)}</p>
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
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <RefreshCw className="mr-2" /> Convertidor a Tasa M.V.
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tasa de interés</label>
        <input
          type="number"
          value={inputRate}
          onChange={handleRateChange}
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e') {
              e.preventDefault();
            }
          }}
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

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-row justify-center items-center gap-6 mb-12">
        {toolCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer w-64"
            onClick={card.onClick}
          >
            <div className="flex flex-col items-center justify-center p-6 h-40">
              <div className="bg-indigo-100 rounded-full p-4 mb-4">
                {card.icon}
              </div>
              <span className="text-sm font-medium text-center">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)}>
        <CreditSimulator onClose={() => setIsSimulatorOpen(false)} />
      </Modal>

      <Modal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)}>
        <InterestRateConverter onClose={() => setIsConverterOpen(false)} />
      </Modal>

      <Modal isOpen={isNotarialOpen} onClose={() => setIsNotarialOpen(false)} isNotarial={true}>
        <NotarialCalculator onClose={() => setIsNotarialOpen(false)} />
      </Modal>
    </div>
  );
};