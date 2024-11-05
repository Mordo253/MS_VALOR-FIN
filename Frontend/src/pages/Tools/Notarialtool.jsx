import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

export const NotarialCalculator = () => {
  // UVT 2024
  const UVT_2024 = 47065;

  const [propertyValue, setPropertyValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [expenses, setExpenses] = useState({
    retencion: 0,
    gastosNotariales: 0,
    iva: 0,
    copias: 70000,
    impuestoBeneficencia: 0,
    impuestoRegistro: 0,
    certificado: 18000,
  });

  const formatInputCurrency = (value) => {
    const numberValue = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('es-CO').format(numberValue);
    return formatted;
  };

  const calcularDerechosNotariales = (valor) => {
    // Según la Resolución 0069 de 2024 - Superintendencia de Notariado y Registro
    if (valor <= 0) return 0;
    
    let tarifa = 0;
    // Rangos en UVT 2024
    if (valor <= 100 * UVT_2024) { // Hasta 100 UVT
      tarifa = valor * 0.003;
    } else if (valor <= 300 * UVT_2024) { // > 100 hasta 300 UVT
      tarifa = valor * 0.0034;
    } else if (valor <= 500 * UVT_2024) { // > 300 hasta 500 UVT
      tarifa = valor * 0.004;
    } else if (valor <= 1000 * UVT_2024) { // > 500 hasta 1000 UVT
      tarifa = valor * 0.0046;
    } else if (valor <= 1500 * UVT_2024) { // > 1000 hasta 1500 UVT
      tarifa = valor * 0.005;
    } else { // > 1500 UVT
      tarifa = valor * 0.0054;
    }

    return Math.round(tarifa);
  };

  const calculateFees = (value) => {
    const numValue = parseFloat(value.replace(/\D/g, '')) || 0;
    
    // Derechos notariales según tabla 2024
    const notariales = calcularDerechosNotariales(numValue);

    // IVA 19% sobre derechos notariales
    const iva = notariales * 0.19;

    // Retención en la fuente 1% del valor del inmueble si supera tope
    const retencion = numValue >= (UVT_2024 * 20) ? numValue * 0.01 : 0;

    // Impuesto de registro 0.5% del valor del inmueble
    const impuestoRegistro = numValue * 0.005;

    // Impuesto de beneficencia 1% del valor del inmueble
    const impuestoBeneficencia = numValue * 0.01;

    setExpenses({
      retencion,
      gastosNotariales: notariales,
      iva,
      copias: 76000, // Valor fijo aproximado
      impuestoBeneficencia,
      impuestoRegistro,
      certificado: 18000, // Valor fijo aproximado
    });
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setPropertyValue(rawValue);
    setFormattedValue(formatInputCurrency(rawValue));
    calculateFees(rawValue);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('COP', '$');
  };

  const totalValue = Object.values(expenses).reduce((a, b) => a + b, 0);

  const chartData = [
    { name: 'Retención', value: expenses.retencion, color: '#3B82F6' },
    { name: 'Gastos notariales', value: expenses.gastosNotariales, color: '#EF4444' },
    { name: 'IVA', value: expenses.iva, color: '#F59E0B' },
    { name: 'Copias', value: expenses.copias, color: '#10B981' },
    { name: 'Impuesto de beneficencia', value: expenses.impuestoBeneficencia, color: '#6366F1' },
    { name: 'Impuesto de registro', value: expenses.impuestoRegistro, color: '#8B5CF6' },
    { name: 'Certificado de libertad', value: expenses.certificado, color: '#EC4899' },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
          Simulador de Gastos Notariales
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Chart */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-sm text-gray-500">Valor total</span>
                <span className="text-lg font-bold text-gray-800">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>

            {/* Total derechos notariales */}
            <div className="mt-6 w-full">
              <div className="flex justify-between items-center p-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Total derechos notariales:</span>
                <span className="font-medium">
                  {formatCurrency(expenses.gastosNotariales + expenses.iva)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Total gastos de registro:</span>
                <span className="font-medium">
                  {formatCurrency(expenses.impuestoRegistro + expenses.impuestoBeneficencia)}
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Input and values */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Valor del Inmueble
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formattedValue}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ingrese el valor del inmueble"
                />
                <Info className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Los valores pueden variar de acuerdo al departamento por tarifas notariales
              </p>
            </div>

            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
