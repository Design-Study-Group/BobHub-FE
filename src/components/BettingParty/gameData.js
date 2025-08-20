export const gameTypes = [
  { id: 'rps', label: '가위바위보', icon: '✂️', description: '클래식한 가위바위보 게임' },
  { id: 'number', label: '숫자 맞추기', icon: '🎯', description: '1-100 사이 숫자 맞추기' },
  { id: 'quiz', label: '퀴즈', icon: '🧠', description: '개발 관련 퀴즈 배틀' },
  { id: 'dice', label: '주사위', icon: '🎲', description: '주사위 굴려서 높은 수가 승리' }
];

export const initialGames = [
  {
    id: 1,
    title: '가위바위보 커피내기 ✂️',
    type: 'rps',
    creator: '김철수',
    participants: ['김철수', '이영희', '박민수'],
    maxParticipants: 4,
    prize: '스타벅스 아메리카노',
    status: 'waiting',
    description: '간단한 가위바위보로 커피값 정하기!',
    createdAt: '2024-08-20 14:30'
  },
  {
    id: 2,
    title: '숫자 맞추기 게임 🎯',
    type: 'number',
    creator: '이영희',
    participants: ['이영희', '최지은'],
    maxParticipants: 5,
    prize: '투썸 케이크',
    status: 'active',
    description: '1-100 사이 숫자를 맞춰보세요!',
    createdAt: '2024-08-20 15:00'
  },
  {
    id: 3,
    title: '퀴즈 배틀 🧠',
    type: 'quiz',
    creator: '박민수',
    participants: ['박민수', '김민지', '정태윤', '이수현'],
    maxParticipants: 4,
    prize: '던킨도너츠 세트',
    status: 'completed',
    winner: '김민지',
    description: '개발 관련 퀴즈로 승부!',
    createdAt: '2024-08-20 13:00'
  }
];