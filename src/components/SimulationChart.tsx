'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Game {
  result: number;
  // add other properties if needed
}

interface DayData {
  date: string | number | Date;
  hourlyResults: {
    [hour: number]: Game[];
  };
}

interface SimulationChartProps {
  data: DayData[];
}

export default function SimulationChart({ data }: SimulationChartProps) {
  const [viewMode, setViewMode] = useState('daily');
  
  // Processar dados para visualização
  const processedData = viewMode === 'daily' 
    ? data.map(day => {
        // Média de resultados por dia
        const allResults = Object.values(day.hourlyResults).flat();
        const avgResult = allResults.reduce((sum, game) => sum + game.result, 0) / allResults.length;
        return {
          date: new Date(day.date).toLocaleDateString(),
          avgResult: parseFloat(avgResult.toFixed(2)),
          totalGames: allResults.length,
          winRate: parseFloat(((allResults.filter(game => game.result > 1).length / allResults.length) * 100).toFixed(2))
        };
      })
    : // Processar por hora
      Array.from(Array(24).keys()).map(hour => {
        const gamesAtHour = data.flatMap(day => 
          day.hourlyResults[hour] ? day.hourlyResults[hour] : []
        );
        
        if (gamesAtHour.length === 0) return { hour, avgResult: 0, winRate: 0 };
        
        const avgResult = gamesAtHour.reduce((sum, game) => sum + game.result, 0) / gamesAtHour.length;
        return {
          hour: `${hour}:00`,
          avgResult: parseFloat(avgResult.toFixed(2)),
          winRate: parseFloat(((gamesAtHour.filter(game => game.result > 1).length / gamesAtHour.length) * 100).toFixed(2))
        };
      });
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'daily' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setViewMode('daily')}
          >
            Visualização Diária
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'hourly' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setViewMode('hourly')}
          >
            Visualização por Hora
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey={viewMode === 'daily' ? 'date' : 'hour'} 
            stroke="#999"
          />
          <YAxis stroke="#999" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="avgResult" 
            name="Resultado Médio" 
            stroke="#f59e0b" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="winRate" 
            name="Taxa de Vitória (%)" 
            stroke="#10b981" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
