export const quickButtons = [
  '🍚 한식', '🍕 양식', '🍜 중식', '🍱 일식',
  '🌮 분식', '🍗 치킨', '🍔 패스트푸드', '☕ 카페'
];

export const menuRecommendations = {
  '한식': ['김치찌개', '된장찌개', '비빔밥', '불고기', '갈비탕'],
  '양식': ['파스타', '피자', '스테이크', '리조또', '샐러드'],
  '중식': ['짜장면', '짬뽕', '탕수육', '마파두부', '볶음밥'],
  '일식': ['초밥', '라멘', '우동', '돈까스', '규동'],
  '분식': ['떡볶이', '김밥', '순대', '어묵', '라면'],
  '치킨': ['후라이드', '양념치킨', '간장치킨', '허니머스타드', '치킨버거'],
  '패스트푸드': ['햄버거', '감자튀김', '핫도그', '너겟', '콜라'],
  '카페': ['아메리카노', '라떼', '샌드위치', '케이크', '쿠키']
};

export const generateBotResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // 카테고리별 추천
  for (const [category, items] of Object.entries(menuRecommendations)) {
    if (lowerMessage.includes(category.toLowerCase()) || 
        lowerMessage.includes(category.slice(2))) {
      const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 3);
      return `${category} 메뉴 추천드려요! 🍽️\n\n${randomItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n\n어떤 메뉴가 마음에 드시나요?`;
    }
  }

  // 특정 키워드 응답
  if (lowerMessage.includes('배고프') || lowerMessage.includes('배고파')) {
    return '배고프시군요! 든든한 메뉴를 추천해드릴게요. 어떤 종류의 음식을 원하시나요? 🤤';
  }
  
  if (lowerMessage.includes('다이어트') || lowerMessage.includes('살') || lowerMessage.includes('헬스')) {
    return '건강한 식단을 원하시는군요! 🥗\n\n1. 그릭요거트 + 견과류\n2. 닭가슴살 샐러드\n3. 현미밥 + 나물\n\n어떠신가요?';
  }

  if (lowerMessage.includes('비') || lowerMessage.includes('날씨')) {
    return '비오는 날에는 뜨끈한 음식이 최고죠! ☔\n\n1. 김치찌개 + 밥\n2. 라면 + 김밥\n3. 우동\n\n몸이 따뜻해지는 메뉴들이에요!';
  }

  // 기본 응답
  const defaultResponses = [
    '음... 🤔 더 구체적으로 알려주시면 더 정확한 추천을 드릴 수 있어요!',
    '어떤 종류의 음식을 원하시나요? 위의 카테고리 버튼을 눌러보세요!',
    '오늘의 기분이나 상황을 알려주시면 맞춤 추천해드릴게요! 😊'
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};