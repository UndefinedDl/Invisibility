'use client';
type Recommendation = {
  time: string;
  score: number;
  description: string;
  expectedWinRate: number;
  volatility: number;
  dayName: string;
};

interface RecommendationPanelProps {
  recommendations: Recommendation[];
}

export default function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  const getCurrentTimeRecommendation = () => {
    if (!recommendations.length) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Encontrar a recomendação mais próxima da hora atual
    return recommendations.reduce((closest, rec) => {
      const recHour = parseInt(rec.time.split(':')[0]);
      const currentDiff = Math.abs(currentHour - parseInt(closest.time.split(':')[0]));
      const newDiff = Math.abs(currentHour - recHour);
      
      return newDiff < currentDiff ? rec : closest;
    });
  };
  
  const currentRec = getCurrentTimeRecommendation();
  
  // Ordenar recomendações por pontuação
  const sortedRecs = [...recommendations].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4">Recomendações</h2>
      
      {currentRec ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-2">Recomendação Atual</h3>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold">{currentRec.time}</span>
              <span className={`px-2 py-1 rounded ${
                currentRec.score > 7 ? 'bg-green-600' : 
                currentRec.score > 5 ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                Score: {currentRec.score}/10
              </span>
            </div>
            <p className="text-gray-300 mb-3">{currentRec.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="block text-gray-400">Taxa de Vitória Est.</span>
                <span className="font-semibold">{currentRec.expectedWinRate}%</span>
              </div>
              <div>
                <span className="block text-gray-400">Volatilidade</span>
                <span className="font-semibold">{currentRec.volatility}/10</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-gray-300">Nenhuma recomendação disponível para o horário atual.</p>
      )}
      
      <h3 className="text-lg font-semibold mb-2">Melhores Horários</h3>
      <div className="space-y-2">
        {sortedRecs.slice(0, 5).map((rec, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
            <div>
              <span className="font-bold">{rec.time}</span>
              <span className="text-sm text-gray-400 ml-2">{rec.dayName}</span>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              rec.score > 7 ? 'bg-green-600' : 
              rec.score > 5 ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {rec.score}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
