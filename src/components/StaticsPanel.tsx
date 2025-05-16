'use client';
import { useState } from 'react';

export default function StatisticsPanel({ statistics }: { statistics: any }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  if (!statistics.hourlyWinRates) return null;
  
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const bestDay = statistics.bestDay ? days[statistics.bestDay.day] : 'N/A';
  const bestHour = statistics.hourlyWinRates ? 
    Object.entries(statistics.hourlyWinRates).reduce(
      (best: [string, string], [hour, rate]) => 
        parseFloat(String(rate)) > parseFloat(String(best[1])) ? [hour, String(rate)] : best, 
      ['0', '0']
    )[0] : 'N/A';
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Estatísticas da Simulação</h2>
        <button
          className="text-sm text-amber-400 hover:text-amber-300"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Mostrar menos' : 'Mostrar avançado'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Melhor Dia</h3>
          <p className="text-xl font-bold">{bestDay}</p>
          <p className="text-sm text-gray-400">
            Taxa de vitória: {statistics.bestDay ? (statistics.bestDay.rate * 100).toFixed(1) : 0}%
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Melhor Horário</h3>
          <p className="text-xl font-bold">{bestHour}:00</p>
          <p className="text-sm text-gray-400">
            Taxa de vitória: {statistics.hourlyWinRates[bestHour] * 100}%
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Força de Padrões</h3>
          <p className="text-xl font-bold">{statistics.patternStrength ? statistics.patternStrength.toFixed(1) : 'N/A'}/10</p>
          <p className="text-sm text-gray-400">
            Confiabilidade de previsões
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Horas Favoráveis</h3>
          <p className="text-xl font-bold">
            {Object.entries(statistics.hourlyWinRates || {}).filter(
              ([_, rate]) => parseFloat(String(rate)) > 0.4
            ).length}
          </p>
          <p className="text-sm text-gray-400">
            Horas com taxa {'>'} 40%
          </p>
        </div>
      </div>
      
      {showAdvanced && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Taxa de Vitória por Hora</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(statistics.hourlyWinRates || {}).map(([hour, rate]) => (
              <div 
                key={hour} 
                className={`p-3 rounded-lg text-center ${
                  parseFloat(String(rate)) > 0.5 ? 'bg-green-800' : 
                  parseFloat(String(rate)) > 0.4 ? 'bg-yellow-800' : 'bg-red-800'
                }`}
              >
                <p className="font-bold">{hour}:00</p>
                <p className="text-sm">{(parseFloat(String(rate)) * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}