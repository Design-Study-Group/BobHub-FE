export const categories = [
  { id: 'all', label: '전체', icon: '🍽️' },
  { id: 'dining', label: '외식', icon: '🍽️' },
  { id: 'delivery', label: '배달', icon: '🚚' },
  { id: 'lunchbox', label: '도시락', icon: '🍱' }
];

export const initialParties = [
  {
    id: 1,
    title: '점심 치킨 파티 🍗',
    category: 'delivery',
    description: '교촌치킨 레드콤보 주문할 사람 구해요!',
    creator: '김철수',
    members: ['김철수', '이영희'],
    maxMembers: 4,
    location: '2층 강의실',
    time: '12:30',
    status: 'recruiting',
    messages: [
      { id: 1, user: '김철수', message: '치킨 먹고 싶어서 파티 만들었어요!', time: '12:10' },
      { id: 2, user: '이영희', message: '저도 참여할게요! 콤보 맛있죠', time: '12:15' }
    ]
  },
  {
    id: 2,
    title: '카페 디저트 모임 ☕',
    category: 'dining',
    description: '스타벅스 가서 디저트랑 커피 마실 분들 모집',
    creator: '박민수',
    members: ['박민수', '최지은', '김민지'],
    maxMembers: 5,
    location: '스타벅스 홍대점',
    time: '15:00',
    status: 'recruiting',
    messages: [
      { id: 1, user: '박민수', message: '오늘 날씨 좋아서 카페 가려고 해요', time: '14:30' },
      { id: 2, user: '최지은', message: '좋아요! 저도 갈게요', time: '14:35' },
      { id: 3, user: '김민지', message: '저도 참여합니다~', time: '14:40' }
    ]
  },
  {
    id: 3,
    title: '도시락 나눠먹기 🍱',
    category: 'lunchbox',
    description: '엄마가 싸주신 도시락이 너무 많아요. 나눠먹어요!',
    creator: '이수현',
    members: ['이수현', '정태윤'],
    maxMembers: 3,
    location: '3층 휴게실',
    time: '12:00',
    status: 'recruiting',
    messages: [
      { id: 1, user: '이수현', message: '엄마표 도시락 나눠먹을 분 구해요!', time: '11:45' },
      { id: 2, user: '정태윤', message: '우와 엄마표라니! 저 참여할게요', time: '11:50' }
    ]
  }
];