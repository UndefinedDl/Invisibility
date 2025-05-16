import { getRecommendationDescription } from "./recommendateDescription";

export function getBestTimeRecommendations(data: any[], patterns: any[]) {
  const recommendations: { day: number; dayName: string; time: string; score: number; expectedWinRate: number; volatility: number; description: any; }[] = [];
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const now = new Date();
  
  // Extrair horas favoráveis dos padrões
  const favorableHours = patterns
    .filter(p => p.type === 'favorable-hour')
    .sort((a, b) => b.strength - a.strength);
  
  // Criar recomendações baseadas em horas favoráveis
  favorableHours.forEach(pattern => {
    const hour = pattern.hour;
    const volatility = Math.floor(Math.random() * 5) + 3; // Volatilidade aleatória entre 3-7
    
    // Criar recomendação para cada dia da semana nos próximos 7 dias
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      
      // Ajustar score baseado no dia da semana
      let dayFactor = 1.0;
      if (dayOfWeek === 5 || dayOfWeek === 6) dayFactor = 1.2; // Fim de semana
      if (dayOfWeek === 1) dayFactor = 0.9; // Segunda-feira
      
      const score = Math.min(10, Math.round((pattern.strength * dayFactor) * 10) / 10);
      
      recommendations.push({
        day: dayOfWeek,
        dayName: days[dayOfWeek],
        time: `${hour.toString().padStart(2, '0')}:00`,
        score,
        expectedWinRate: Math.round(pattern.winRate * 100),
        volatility,
        description: getRecommendationDescription(score, pattern.winRate, volatility)
      });
    }
  });
  
  // Adicionar algumas recomendações baseadas em outras análises
  data.forEach(day => {
    const dayDate = new Date(day.date);
    const dayOfWeek = dayDate.getDay();
    
    // Encontrar horas com melhores resultados neste dia
    const hourlyWinRates = Object.entries(day.hourlyResults).map(([hour, games]) => {
      const gamesArray = games as Array<{ result: number }>;
      const wins = gamesArray.filter(game => game.result > 1).length;
      return { 
        hour: parseInt(hour), 
        winRate: wins / gamesArray.length,
        avgMultiplier: gamesArray.reduce((sum, game) => sum + game.result, 0) / gamesArray.length
      };
    });
    
    // Selecionar as 2 melhores horas do dia que ainda não estão nas recomendações
    hourlyWinRates
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 2)
      .forEach(hourData => {
        const hour = hourData.hour;
        
        // Verificar se já existe recomendação para esta hora
        const existing = recommendations.find(r => 
          r.day === dayOfWeek && parseInt(r.time) === hour
        );
        
        if (!existing && hourData.winRate > 0.4) {
          const volatility = Math.floor(Math.random() * 4) + 2; // Volatilidade menor (2-5)
          const score = Math.min(10, Math.round(hourData.winRate * 8 * 10) / 10);
          
          for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            if (date.getDay() === dayOfWeek) {
              recommendations.push({
                day: dayOfWeek,
                dayName: days[dayOfWeek],
                time: `${hour.toString().padStart(2, '0')}:00`,
                score,
                expectedWinRate: Math.round(hourData.winRate * 100),
                volatility,
                description: getRecommendationDescription(score, hourData.winRate, volatility)
              });
              break;
            }
          }
        }
      });
  });
  
  return recommendations.sort((a, b) => b.score - a.score);
}
