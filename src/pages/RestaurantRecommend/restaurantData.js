export const categories = [
  { id: 'all', label: '전체', icon: '🍽️' },
  { id: 'korean', label: '한식', icon: '🍚' },
  { id: 'chinese', label: '중식', icon: '🍜' },
  { id: 'japanese', label: '일식', icon: '🍱' },
  { id: 'western', label: '양식', icon: '🍕' },
  { id: 'cafe', label: '카페', icon: '☕' },
  { id: 'snack', label: '분식', icon: '🌮' }
];

export const restaurants = [
  {
    id: 1,
    name: '홍대 돈까스',
    category: 'japanese',
    rating: 4.8,
    distance: '50m',
    price: '8,000-12,000원',
    tags: ['깔끔한', '가성비', '혼밥가능'],
    openTime: '11:00-21:00',
    phone: '02-1234-5678',
    description: '신선한 재료로 만드는 수제 돈까스 전문점입니다.',
    reviews: [
      { id: 1, user: '김철수', rating: 5, comment: '돈까스가 정말 바삭하고 맛있어요!', date: '2024-08-19' },
      { id: 2, user: '이영희', rating: 4, comment: '가격대비 양도 많고 괜찮네요', date: '2024-08-18' }
    ]
  },
  {
    id: 2,
    name: '마마김치찌개',
    category: 'korean',
    rating: 4.6,
    distance: '120m',
    price: '6,000-9,000원',
    tags: ['푸짐한', '집밥같은', '따뜻한'],
    openTime: '10:00-22:00',
    phone: '02-2345-6789',
    description: '집에서 끓인 것 같은 김치찌개와 한식 메뉴',
    reviews: [
      { id: 1, user: '박민수', rating: 5, comment: '진짜 집밥 느낌이에요!', date: '2024-08-20' },
      { id: 2, user: '최지은', rating: 4, comment: '김치찌개 맛있고 반찬도 푸짐해요', date: '2024-08-19' }
    ]
  },
  {
    id: 3,
    name: '드림카페',
    category: 'cafe',
    rating: 4.4,
    distance: '80m',
    price: '3,000-6,000원',
    tags: ['조용한', '와이파이', '콘센트'],
    openTime: '08:00-22:00',
    phone: '02-3456-7890',
    description: '공부하기 좋은 조용한 카페. 디저트도 맛있어요.',
    reviews: [
      { id: 1, user: '김민지', rating: 4, comment: '공부하기 좋은 환경이에요', date: '2024-08-20' },
      { id: 2, user: '정태윤', rating: 5, comment: '아메리카노가 진짜 맛있어요!', date: '2024-08-19' }
    ]
  },
  {
    id: 4,
    name: '짬뽕대왕',
    category: 'chinese',
    rating: 4.7,
    distance: '200m',
    price: '7,000-15,000원',
    tags: ['맵고진한', '푸짐한', '배달가능'],
    openTime: '11:00-21:30',
    phone: '02-4567-8901',
    description: '매콤하고 진한 국물의 짬뽕과 중식 요리 전문점',
    reviews: [
      { id: 1, user: '이수현', rating: 5, comment: '짬뽕 국물이 끝내줘요!', date: '2024-08-20' },
      { id: 2, user: '조성민', rating: 4, comment: '탕수육도 바삭하고 맛있어요', date: '2024-08-18' }
    ]
  },
  {
    id: 5,
    name: '홍대떡볶이',
    category: 'snack',
    rating: 4.3,
    distance: '90m',
    price: '3,000-8,000원',
    tags: ['매콤한', '저렴한', '야식'],
    openTime: '12:00-24:00',
    phone: '02-5678-9012',
    description: '옛날 떡볶이와 다양한 분식 메뉴',
    reviews: [
      { id: 1, user: '김영수', rating: 4, comment: '떡볶이 맛이 옛날 생각나요', date: '2024-08-19' },
      { id: 2, user: '박지혜', rating: 4, comment: '야식으로 최고예요!', date: '2024-08-18' }
    ]
  }
];