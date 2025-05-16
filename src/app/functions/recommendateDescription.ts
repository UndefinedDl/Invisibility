export function getRecommendationDescription(score: number, winRate: any, volatility: number) {
  const descriptions = [
    // Pontuação alta (8-10)
    [
      "Horário ideal para apostar! Os padrões históricos mostram resultados consistentemente positivos.",
      "Momento quente! A taxa de vitória neste horário está significativamente acima da média.",
      "Excelente oportunidade de jogo com alta probabilidade de multiplicadores favoráveis."
    ],
    // Pontuação média (5-7)
    [
      "Horário moderadamente favorável com boas chances de sucesso.",
      "Padrões mostram potencial positivo, mas mantenha apostas conservadoras.",
      "Momento razoável para jogar, com taxa de vitória levemente acima da média."
    ],
    // Pontuação baixa (0-4)
    [
      "Horário com baixa probabilidade de sucesso. Melhor esperar por momento mais favorável.",
      "Padrões indicam período desfavorável com tendência de perdas consecutivas.",
      "Momento de alta volatilidade com poucos resultados positivos esperados."
    ]
  ];
  
  const volatilityDescriptions = [
    "Comportamento do jogo bastante previsível neste horário.",
    "Variação moderada nos resultados, mas com tendência definida.",
    "Alta volatilidade. Prepare-se para variações significativas nos resultados."
  ];
  
  const category = score >= 8 ? 0 : score >= 5 ? 1 : 2;
  const descIndex = Math.floor(Math.random() * descriptions[category].length);
  const volatilityIndex = volatility <= 3 ? 0 : volatility <= 6 ? 1 : 2;
  
  return `${descriptions[category][descIndex]} ${volatilityDescriptions[volatilityIndex]}`;
}