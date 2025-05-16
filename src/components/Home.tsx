'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { generateSimulationData } from '@/app/functions/simulattionData';
import { getBestTimeRecommendations } from '@/app/functions/recommendateTime';
import { analyzePatterns } from '@/app/functions/analyzePatternts';
import SimulationChart from './SimulationChart';
import RecommendationPanel from './RecommedationPanel';
import StatisticsPanel from './StaticsPanel';


export default function HomeView() {
  type SimulationDay = {
    date: string;
    hourlyResults: { [hour: number]: any };
  };
  const [simulationData, setSimulationData] = useState<SimulationDay[]>([]);
  type Recommendation = {
    day: number;
    dayName: string;
    time: string;
    score: number;
    expectedWinRate: number;
    volatility: number;
    description: any;
  };
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [statistics, setStatistics] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    daysToSimulate: 7,
    gamesPerHour: 30,
    volatilityFactor: 5,
    patternSensitivity: 3,
  });
  
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simular dados de forma assíncrona para não travar a UI
    setTimeout(() => {
      const data = generateSimulationData(
        simulationParams.daysToSimulate,
        simulationParams.gamesPerHour,
        simulationParams.volatilityFactor
      );
      
      const patterns = analyzePatterns(data, simulationParams.patternSensitivity);
      const recommendedTimes = getBestTimeRecommendations(data, patterns);
      
      // Calcular estatísticas
      const winRates = data.reduce((acc: { [hour: string]: number[] }, day: any) => {
        Object.keys(day.hourlyResults).forEach((hour: string) => {
          const games = day.hourlyResults[hour];
          const wins = games.filter((game: { result: number; }) => game.result > 1).length;
          acc[hour] = acc[hour] || [];
          acc[hour].push(wins / games.length);
        });
        return acc;
      }, {} as { [hour: string]: number[] });
      
      const stats = {
        hourlyWinRates: Object.keys(winRates).reduce((acc: { [hour: string]: string }, hour) => {
          acc[hour] = (winRates[hour].reduce((sum, rate) => sum + rate, 0) / winRates[hour].length).toFixed(2);
          return acc;
        }, {} as { [hour: string]: string }),
        bestDay: [...Array(7).keys()].reduce((best, dayIndex) => {
          const dayData = data.filter(d => new Date(d.date).getDay() === dayIndex);
          const winRate = dayData.flatMap(d => 
            Object.values(d.hourlyResults).flat()
          ).filter(game => game.result > 1).length / dayData.flatMap(d => 
            Object.values(d.hourlyResults).flat()
          ).length;
          
          return winRate > best.rate ? { day: dayIndex, rate: winRate } : best;
        }, { day: 0, rate: 0 }),
        patternStrength: patterns.map(p => p.strength).reduce((sum, strength) => sum + strength, 0) / patterns.length
      };
      
      setSimulationData(data);
      setRecommendations(recommendedTimes);
      setStatistics(stats);
      setIsSimulating(false);
    }, 500);
  };
  
  useEffect(() => {
    runSimulation();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Simulador de Apostas Tigrinho</title>
        <meta name="description" content="Simulador de padrões e recomendações para o jogo Tigrinho" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-500 mb-8 text-center">
          Simulador de Apostas Tigrinho
        </h1>
        
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Configurações da Simulação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Dias para simular</label>
              <input
                type="number"
                className="w-full bg-gray-700 rounded p-2 text-white"
                value={simulationParams.daysToSimulate}
                onChange={(e) => setSimulationParams({...simulationParams, daysToSimulate: parseInt(e.target.value) || 7})}
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Jogos por hora</label>
              <input
                type="number"
                className="w-full bg-gray-700 rounded p-2 text-white"
                value={simulationParams.gamesPerHour}
                onChange={(e) => setSimulationParams({...simulationParams, gamesPerHour: parseInt(e.target.value) || 30})}
                min="10"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fator de volatilidade</label>
              <input
                type="range"
                className="w-full"
                value={simulationParams.volatilityFactor}
                onChange={(e) => setSimulationParams({...simulationParams, volatilityFactor: parseInt(e.target.value)})}
                min="1"
                max="10"
              />
              <div className="flex justify-between text-xs">
                <span>Baixo</span>
                <span>Alto</span>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Sensibilidade de padrões</label>
              <input
                type="range"
                className="w-full"
                value={simulationParams.patternSensitivity}
                onChange={(e) => setSimulationParams({...simulationParams, patternSensitivity: parseInt(e.target.value)})}
                min="1"
                max="10"
              />
              <div className="flex justify-between text-xs">
                <span>Baixo</span>
                <span>Alto</span>
              </div>
            </div>
          </div>
          <button
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded"
            onClick={runSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulando...' : 'Executar Simulação'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
              <h2 className="text-xl font-semibold mb-4">Visualização da Simulação</h2>
              {simulationData.length > 0 ? (
                <SimulationChart data={simulationData} />
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados da simulação...</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <RecommendationPanel recommendations={recommendations} />
          </div>
        </div>
        
        <StatisticsPanel statistics={statistics} />
        
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Aviso Importante</h2>
          <p className="text-yellow-400">
            Este simulador é apenas para fins educacionais e de entretenimento. Os resultados são baseados em algoritmos
            de simulação e não representam o comportamento real do jogo Tigrinho. Jogos de cassino são baseados em RNG
            (geradores de números aleatórios) e não possuem padrões previsíveis. Jogue com responsabilidade.
          </p>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>© 2025 Simulador de Apostas Tigrinho - Criado apenas para fins educacionais</p>
      </footer>
    </div>
  );
}


