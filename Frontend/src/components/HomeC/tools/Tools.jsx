import React, { useState, useEffect } from 'react';

// Función helper para formatear números a moneda colombiana
const formatCurrency = (value) => {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Función para formatear números con puntos de separación
const formatNumber = (value) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Función para desformatear números (quitar puntos)
const unformatNumber = (value) => {
  return value.replace(/\./g, "");
};

const PrimaCalculator = () => {
  const [salary, setSalary] = useState('');
  const [daysWorked, setDaysWorked] = useState('');
  const [includeTransportAllowance, setIncludeTransportAllowance] = useState(false);
  const [result, setResult] = useState(null);

  const handleSalaryChange = (e) => {
    setSalary(formatNumber(e.target.value));
  };

  const calculatePrima = () => {
    const smlv2023 = 1160000;
    const transportAllowance2023 = 140606;

    let monthlySalary = parseFloat(unformatNumber(salary));
    const days = parseInt(daysWorked);

    if (isNaN(monthlySalary) || isNaN(days) || days <= 0 || days > 180) {
      setResult('Por favor, ingrese valores válidos. Los días trabajados deben estar entre 1 y 180.');
      return;
    }

    if (monthlySalary < smlv2023) {
      monthlySalary = smlv2023;
    }

    if (includeTransportAllowance && monthlySalary <= (2 * smlv2023)) {
      monthlySalary += transportAllowance2023;
    }

    const prima = (monthlySalary * days) / 360;
    setResult(prima);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Calculadora de Prima</h2>
      <input
        type="text"
        placeholder="Salario mensual"
        value={salary}
        onChange={handleSalaryChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        placeholder="Días trabajados (1-180)"
        value={daysWorked}
        onChange={(e) => setDaysWorked(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeTransportAllowance}
            onChange={(e) => setIncludeTransportAllowance(e.target.checked)}
            className="mr-2"
          />
          Incluir auxilio de transporte
        </label>
      </div>
      <button onClick={calculatePrima} className="w-full bg-blue-500 text-white p-2 rounded">Calcular Prima</button>
      {result && (
        <p className="mt-4">
          {typeof result === 'number' 
            ? `Tu prima es: ${formatCurrency(result)}` 
            : result}
        </p>
      )}
    </div>
  );
};

const CDTSimulator = () => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState(null);

  const handleAmountChange = (e) => {
    setAmount(formatNumber(e.target.value));
  };

  const simulateCDT = () => {
    const principal = parseFloat(unformatNumber(amount));
    const rateDecimal = parseFloat(rate) / 100;
    const termYears = parseInt(term) / 12;
    const finalAmount = principal * Math.pow(1 + rateDecimal, termYears);
    setResult(finalAmount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Simulador CDT</h2>
      <input
        type="text"
        placeholder="Monto a invertir"
        value={amount}
        onChange={handleAmountChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        placeholder="Plazo en meses"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        placeholder="Tasa de interés anual (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button onClick={simulateCDT} className="w-full bg-blue-500 text-white p-2 rounded">Simular</button>
      {result && <p className="mt-4">Monto final estimado: {formatCurrency(result)}</p>}
    </div>
  );
};

const Calculadora4x1000 = () => {
  const [amount, setAmount] = useState('');
  const [isExempt, setIsExempt] = useState(false);
  const [result, setResult] = useState(null);

  const handleAmountChange = (e) => {
    setAmount(formatNumber(e.target.value));
  };

  const calculate4x1000 = () => {
    const transactionAmount = parseFloat(unformatNumber(amount));
    if (isNaN(transactionAmount)) {
      setResult('Por favor, ingrese un monto válido.');
      return;
    }

    const uvt2023 = 42412;
    const monthlyExemptionLimit = 350 * uvt2023;

    let taxableAmount = transactionAmount;
    if (isExempt && transactionAmount <= monthlyExemptionLimit) {
      taxableAmount = 0;
    }

    const tax = taxableAmount * 0.004;
    setResult(tax);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Calculadora 4x1000</h2>
      <input
        type="text"
        placeholder="Monto de la transacción"
        value={amount}
        onChange={handleAmountChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isExempt}
            onChange={(e) => setIsExempt(e.target.checked)}
            className="mr-2"
          />
          Cuenta de ahorros exenta (hasta 350 UVT mensuales)
        </label>
      </div>
      <button onClick={calculate4x1000} className="w-full bg-blue-500 text-white p-2 rounded">Calcular</button>
      {result !== null && (
        <p className="mt-4">
          {typeof result === 'number' 
            ? `Impuesto 4x1000: ${formatCurrency(result)}` 
            : result}
        </p>
      )}
    </div>
  );
};

const tools = [
  { 
    id: 'prima', 
    name: 'Calculadora de Prima', 
    component: PrimaCalculator, 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
        <path d="M1.5 18a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v.375A2.625 2.625 0 0119.875 21H4.125A2.625 2.625 0 011.5 18.375V18z" />
      </svg>
    )
  },
  { 
    id: 'cdt', 
    name: 'Simulador CDT', 
    component: CDTSimulator, 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.25 3A.75.75 0 014.5 3.75v16.5c0 .414.336.75.75.75h14.25a.75.75 0 00.75-.75V8.773a.75.75 0 00-.22-.53L14.98 3.22a.75.75 0 00-.53-.22H5.25zm0-1.5h9a.75.75 0 01.53.22l5.25 5.25a.75.75 0 01.22.53V20.25A2.25 2.25 0 0119.5 22.5H5.25A2.25 2.25 0 013 20.25V3.75A2.25 2.25 0 015.25 1.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10.5 6.75A.75.75 0 0111.25 6h5.25a.75.75 0 110 1.5h-5.25a.75.75 0 01-.75-.75zM6.75 12a.75.75 0 100 1.5h10.5a.75.75 0 100-1.5H6.75zm0 4.5a.75.75 0 100 1.5h10.5a.75.75 0 100-1.5H6.75z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: '4x1000', 
    name: 'Calculadora 4x1000', 
    component: Calculadora4x1000, 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm9.75-6.25a.75.75 0 01.75.75v4.753l3.63 1.815a.75.75 0 01-.664 1.342l-4-2a.75.75 0 01-.416-.671V6.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>
    )
  }
];

// Componente de las tarjetas de herramientas
const ToolCard = ({ tool, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div className="bg-indigo-50 rounded-full p-3 mb-2">
      {tool.icon}
    </div>
    <h3 className="text-sm font-semibold text-center text-gray-800">{tool.name}</h3>
  </div>
);

// Componente principal de las herramientas
export const Tools = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    document.body.style.overflow = 'hidden'; // Evita el scroll del body
  };

  const closeModal = () => {
    setSelectedTool(null);
    document.body.style.overflow = 'auto'; // Restaura el scroll del body
  };

  // Limpia el estilo del body cuando el componente se desmonta
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="flex-1">
              <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
            </div>
          ))}
        </div>

        {selectedTool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <selectedTool.component />
              <button 
                onClick={closeModal}
                className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
