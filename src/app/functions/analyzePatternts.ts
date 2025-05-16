export function analyzePatterns(data: any[], sensitivity = 3): any[] {
  const patterns: any[] = [];
  
  // Detectar sequências ganha/perde
  data.forEach(day => {
    Object.values(day.hourlyResults).forEach(games => {
      let currentStreak: { type: string | null, count: number, startIndex: number } = { type: null, count: 0, startIndex: 0 };
      
      if (Array.isArray(games)) {
        games.forEach((game, index) => {
          const isWin = game.result > 1;
          const resultType = isWin ? 'win' : 'loss';
          
          if (currentStreak.type === null) {
            currentStreak = { type: resultType, count: 1, startIndex: index };
          } else if (currentStreak.type === resultType) {
            currentStreak.count++;
          } else {
            // Fim da sequência, verificar se é longa o suficiente para ser um padrão
            if (currentStreak.count >= sensitivity) {
              patterns.push({
                type: `${currentStreak.type}-streak`,
                count: currentStreak.count,
                games: games.slice(currentStreak.startIndex, index),
                strength: Math.min(10, currentStreak.count / sensitivity)
              });
            }
            
            // Iniciar nova sequência
            currentStreak = { type: resultType, count: 1, startIndex: index };
          }
        });
      }
      
      // Verificar última sequência
      if (currentStreak.count >= sensitivity && Array.isArray(games)) {
        patterns.push({
          type: `${currentStreak.type}-streak`,
          count: currentStreak.count,
          games: games.slice(currentStreak.startIndex),
          strength: Math.min(10, currentStreak.count / sensitivity)
        });
      }
    });
  });
  
  // Detectar padrões de horas favoráveis
  const hourlyStats: { [hour: string]: number[] } = {};
  
  data.forEach(day => {
    Object.entries(day.hourlyResults).forEach(([hour, games]) => {
      if (Array.isArray(games)) {
        const wins = games.filter((game: any) => game.result > 1).length;
        const winRate = wins / games.length;
        
        hourlyStats[hour] = hourlyStats[hour] || [];
        hourlyStats[hour].push(winRate);
      }
    });
  });
  
  // Encontrar horas com consistência alta
  Object.entries(hourlyStats).forEach(([hour, rates]) => {
    const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const consistency = 1 - (rates.reduce((sum, rate) => sum + Math.abs(rate - avgRate), 0) / rates.length);
    
    if (avgRate > 0.4 && consistency > 0.7 && rates.length > sensitivity) {
      patterns.push({
        type: 'favorable-hour',
        hour: parseInt(hour),
        winRate: avgRate,
        consistency,
        strength: Math.min(10, (avgRate * 10 + consistency * 8) / 2)
      });
    }
  });
  
  return patterns;
}