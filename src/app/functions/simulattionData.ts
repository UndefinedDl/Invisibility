export function generateSimulationData(days = 7, gamesPerHour = 30, volatilityFactor = 5) {
  const data = [];
  const now = new Date();
  
  // Ciclos de tempo onde o jogo tende a ser mais generoso
  const favorableCycles = [
    { day: 5, startHour: 20, endHour: 23, bonus: 0.2 }, // Sexta à noite
    { day: 6, startHour: 21, endHour: 2, bonus: 0.3 },  // Sábado à noite
    { day: 0, startHour: 15, endHour: 18, bonus: 0.1 }, // Domingo tarde
    { day: 1, startHour: 12, endHour: 14, bonus: 0.1 }, // Segunda meio-dia
    { day: 3, startHour: 19, endHour: 21, bonus: 0.15 } // Quarta à noite
  ];
  
  // Criar dados para cada dia
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayData: {
      date: string;
      hourlyResults: { [hour: number]: any };
    } = {
      date: date.toISOString(),
      hourlyResults: {}
    };
    
    // Gerar resultados para cada hora do dia
    for (let hour = 0; hour < 24; hour++) {
      const games = [];
      
      // Verificar se estamos em um ciclo favorável
      const dayOfWeek = date.getDay();
      const favorableCycle = favorableCycles.find(cycle => 
        cycle.day === dayOfWeek && 
        hour >= cycle.startHour && 
        (hour <= cycle.endHour || (cycle.endHour < cycle.startHour && hour <= cycle.endHour + 24))
      );
      
      const baseWinRate = 0.35; // Taxa base de vitória (35%)
      const cycleBonus = favorableCycle ? favorableCycle.bonus : 0;
      const randomVariation = (Math.random() * 0.2 - 0.1) * (volatilityFactor / 5); // Variação aleatória baseada na volatilidade
      
      const hourWinRate = Math.min(0.8, Math.max(0.1, baseWinRate + cycleBonus + randomVariation));
      
      // Gerar jogos para esta hora
      for (let j = 0; j < gamesPerHour; j++) {
        const isWin = Math.random() < hourWinRate;
        
        let multiplier = 0;
        if (isWin) {
          // Distribuição de multiplicadores quando ganha
          const rand = Math.random();
          if (rand < 0.6) multiplier = +(1 + Math.random() * 1).toFixed(2); // 1.0x - 2.0x (60% chance)
          else if (rand < 0.85) multiplier = +(2 + Math.random() * 1).toFixed(2); // 2.0x - 3.0x (25% chance)
          else if (rand < 0.95) multiplier = +(3 + Math.random() * 2).toFixed(2); // 3.0x - 5.0x (10% chance)
          else multiplier = +(5 + Math.random() * 15).toFixed(2); // 5.0x - 20.0x (5% chance)
        }
        
        games.push({
          id: `game-${i}-${hour}-${j}`,
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, Math.floor(Math.random() * 60)),
          bet: +(5 + Math.random() * 45).toFixed(2), // Aposta entre 5 e 50
          result: multiplier
        });
      }
      
      // Ordenar jogos por timestamp
      games.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      dayData.hourlyResults[hour] = games;
    }
    
    data.push(dayData);
  }
  
  // Ordenar dias por data
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
