export type Category =
  | '환경·정화'
  | '복지·생활'
  | '지역발전'
  | '안전·치안'
  | '교육·문화'
  | '재난대응';

export type Priority = '긴급' | '높음' | '보통';

export interface SidebarMenu {
  id: string;
  label: string;
}

export interface CollaborationRequest {
  id: string;
  title: string;
  requester: string;
  date: string;
  status: string;
  category: Category;
  location: string;
  priority: Priority;
  aiSummary: string;
  neededResources: string[];
  partners: string[];
  mapX: number;
  mapY: number;
}

export interface RecommendationResource {
  id: string;
  name: string;
  owner: string;
  availableDate: string;
  detail: string;
}

export interface ProcessStep {
  id: string;
  label: string;
  description: string;
}

export interface DocumentDraft {
  letter: string;
  plan: string;
  report: string;
}

export const sidebarMenus: SidebarMenu[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'requests', label: '협업 요청 관리' },
  { id: 'analysis', label: 'AI 분석 & 추천' },
  { id: 'resources', label: '자원·지원 관리' },
  { id: 'cases', label: '유사사례 검색' },
  { id: 'documents', label: '공문·계획서 작성' },
  { id: 'performance', label: '성과 관리' },
  { id: 'alerts', label: '알림 센터' },
  { id: 'settings', label: '시스템 설정' },
];

export const partnerInstitutions = [
  '세종특별자치시',
  '세종시의회',
  '세종경찰청',
  '세종소방본부',
  '육군 제32보병사단',
  '세종시 자원봉사센터',
];

export const categoryLegend: Record<Category, { color: string; bg: string }> = {
  '환경·정화': { color: '#1F7A5C', bg: '#EAF4EF' },
  '복지·생활': { color: '#2F6FDB', bg: '#EAF2FF' },
  지역발전: { color: '#8B5CF6', bg: '#F1ECFF' },
  '안전·치안': { color: '#D94841', bg: '#FFF0EF' },
  '교육·문화': { color: '#B98535', bg: '#FFF8EA' },
  재난대응: { color: '#0B7285', bg: '#E7F8FB' },
};

export const collaborationRequests: CollaborationRequest[] = [
  {
    id: 'drainage-improvement',
    title: '○○마을 배수로 정비 및 하천 환경 개선 요청',
    requester: '연동면 주민자치회',
    date: '2024.05.20',
    status: 'AI 분석 완료',
    category: '환경·정화',
    location: '연동면 ○○마을',
    priority: '높음',
    aiSummary:
      '해당 요청은 배수로 정비와 하천 환경 개선이 필요한 것으로 분석됩니다. 유사 사례를 기반으로 민·관·군 협업을 통해 신속한 해결이 가능합니다.',
    neededResources: ['장비(굴삭기)', '인력(토목)', '차량(덤프)'],
    partners: ['세종시 건설과', '육군 제32보병사단', '세종시 자원봉사센터'],
    mapX: 46,
    mapY: 58,
  },
  {
    id: 'housing-support',
    title: '취약계층 주거환경 개선 지원 요청',
    requester: '한솔동 지역사회보장협의체',
    date: '2024.05.19',
    status: '협업 매칭 중',
    category: '복지·생활',
    location: '한솔동 생활권',
    priority: '보통',
    aiSummary:
      '독거 어르신 가구의 주거환경 개선 요청으로 분류됩니다. 실내 정리, 폐기물 반출, 소규모 보수 인력이 함께 투입될 경우 생활 안정 효과가 높습니다.',
    neededResources: ['인력(정리·보수)', '차량(소형 화물)', '생활지원 물품'],
    partners: ['세종시 복지정책과', '세종시 자원봉사센터', '지역 사회복지기관'],
    mapX: 35,
    mapY: 46,
  },
  {
    id: 'trail-cleanup',
    title: '산책로 주변 쓰레기 수거 및 환경 정비 요청',
    requester: '아름동 통장협의회',
    date: '2024.05.18',
    status: '지원 실행 중',
    category: '환경·정화',
    location: '아름동 산책로',
    priority: '보통',
    aiSummary:
      '주민 이용 빈도가 높은 산책로의 환경 정비 건입니다. 단시간 집중 정비와 안전 안내 인력을 배치하면 시민 불편을 줄일 수 있습니다.',
    neededResources: ['환경정비 인력', '수거 차량', '안전 안내 표지'],
    partners: ['세종시 환경정책과', '세종시 자원봉사센터'],
    mapX: 58,
    mapY: 38,
  },
  {
    id: 'roadscape-improvement',
    title: '마을 진입도로 경관 정비 및 안내시설 개선 요청',
    requester: '장군면 주민협의회',
    date: '2024.05.17',
    status: '계획 검토 중',
    category: '지역발전',
    location: '장군면 진입도로',
    priority: '보통',
    aiSummary:
      '마을 진입부의 경관 개선과 안내시설 정비가 결합된 지역발전형 요청입니다. 현장 조사 후 시설 보수와 정비 인력을 단계적으로 배치하는 방식이 적합합니다.',
    neededResources: ['현장조사 인력', '정비 장비', '안내시설 자재'],
    partners: ['세종시 지역균형발전과', '마을공동체 지원기관'],
    mapX: 30,
    mapY: 68,
  },
  {
    id: 'night-safety',
    title: '학교 주변 야간 보행 안전 점검 요청',
    requester: '새롬동 학부모회',
    date: '2024.05.16',
    status: '우선순위 검토',
    category: '안전·치안',
    location: '새롬동 학교 주변',
    priority: '높음',
    aiSummary:
      '어린이와 청소년의 야간 보행 안전과 관련된 요청입니다. 조도 점검, 순찰 동선 협의, 위험 구간 표식을 함께 검토할 필요가 있습니다.',
    neededResources: ['안전 점검 인력', '순찰 협조', '임시 안내물'],
    partners: ['세종시 안전정책과', '세종경찰청', '학교 관계자'],
    mapX: 66,
    mapY: 51,
  },
  {
    id: 'youth-public-safety',
    title: '청소년 공공안전 체험 프로그램 운영 요청',
    requester: '보람동 청소년운영위원회',
    date: '2024.05.15',
    status: '협업기관 검토',
    category: '교육·문화',
    location: '보람동 복합커뮤니티센터',
    priority: '보통',
    aiSummary:
      '청소년 대상 공공안전 체험 프로그램으로 분류됩니다. 안전교육, 현장 체험, 참여자 이동 동선을 사전에 조율하면 교육 효과를 높일 수 있습니다.',
    neededResources: ['교육 운영 인력', '체험 교구', '안전관리 요원'],
    partners: ['세종시 교육지원 부서', '세종소방본부', '지역 교육기관'],
    mapX: 53,
    mapY: 72,
  },
  {
    id: 'rainfall-prep',
    title: '집중호우 대비 저지대 배수지원 사전 점검 요청',
    requester: '금남면 이장협의회',
    date: '2024.05.14',
    status: '긴급 대응 준비',
    category: '재난대응',
    location: '금남면 저지대',
    priority: '긴급',
    aiSummary:
      '집중호우 전 배수 취약 지역을 사전 점검하는 재난대응 요청입니다. 양수 장비, 현장 통제, 주민 안내 체계를 우선 확보하는 것이 중요합니다.',
    neededResources: ['양수 장비', '현장 통제 인력', '주민 안내 채널'],
    partners: ['세종시 재난안전대책본부', '세종소방본부', '육군 제32보병사단'],
    mapX: 69,
    mapY: 78,
  },
];

export const resourceRecommendations: Record<string, RecommendationResource[]> = {
  'drainage-improvement': [
    {
      id: 'excavator-06',
      name: '굴삭기 0.6㎥',
      owner: '육군 제32보병사단',
      availableDate: '2024.05.25',
      detail: '배수로 토사 제거 및 하천 주변 정비에 적합',
    },
    {
      id: 'dump-truck-15',
      name: '덤프트럭 15톤',
      owner: '세종시 건설과',
      availableDate: '2024.05.24',
      detail: '준설토와 폐기물 운반 지원',
    },
    {
      id: 'volunteers-20',
      name: '자원봉사 인력 20명',
      owner: '세종시 자원봉사센터',
      availableDate: '2024.05.25',
      detail: '주변 환경정화와 주민 안내 보조',
    },
  ],
  'housing-support': [
    {
      id: 'home-repair-team',
      name: '주거환경 개선 인력 12명',
      owner: '세종시 자원봉사센터',
      availableDate: '2024.05.23',
      detail: '실내 정리, 폐기물 분리, 소규모 보수 지원',
    },
    {
      id: 'small-cargo',
      name: '소형 화물차 2대',
      owner: '세종시 복지정책과',
      availableDate: '2024.05.23',
      detail: '생활폐기물 반출과 물품 운송',
    },
    {
      id: 'care-kit',
      name: '생활지원 꾸러미 30세트',
      owner: '지역 사회복지기관',
      availableDate: '2024.05.24',
      detail: '주거환경 개선 후 기본 생활물품 지원',
    },
  ],
  'trail-cleanup': [
    {
      id: 'cleanup-team',
      name: '환경정비 인력 24명',
      owner: '세종시 자원봉사센터',
      availableDate: '2024.05.22',
      detail: '산책로 쓰레기 수거와 분리 배출',
    },
    {
      id: 'collection-vehicle',
      name: '수거 차량 2대',
      owner: '세종시 환경정책과',
      availableDate: '2024.05.22',
      detail: '수거 폐기물 이동 및 임시 적치 지원',
    },
    {
      id: 'safety-signs',
      name: '안전 안내 표지 12개',
      owner: '아름동 행정복지센터',
      availableDate: '2024.05.21',
      detail: '작업 구간 안내와 보행자 우회 동선 표시',
    },
  ],
  'roadscape-improvement': [
    {
      id: 'site-survey',
      name: '현장조사반 6명',
      owner: '세종시 지역균형발전과',
      availableDate: '2024.05.23',
      detail: '진입도로 위험 요소와 시설 개선 지점 확인',
    },
    {
      id: 'landscape-tools',
      name: '경관 정비 장비 세트',
      owner: '마을공동체 지원기관',
      availableDate: '2024.05.24',
      detail: '제초, 정리, 소규모 보수 작업',
    },
    {
      id: 'guide-materials',
      name: '안내시설 자재 1식',
      owner: '세종시 지역균형발전과',
      availableDate: '2024.05.27',
      detail: '마을 안내판과 임시 방향 표식 설치',
    },
  ],
  'night-safety': [
    {
      id: 'lighting-check',
      name: '조도 점검 장비 3세트',
      owner: '세종시 안전정책과',
      availableDate: '2024.05.21',
      detail: '학교 주변 어두운 구간 계측',
    },
    {
      id: 'patrol-support',
      name: '야간 순찰 협조팀',
      owner: '세종경찰청',
      availableDate: '2024.05.21',
      detail: '학생 귀가 시간대 위험 구간 합동 점검',
    },
    {
      id: 'temporary-guides',
      name: '임시 안전 안내물 20개',
      owner: '새롬동 행정복지센터',
      availableDate: '2024.05.20',
      detail: '보행 주의 구간과 우회 동선 표시',
    },
  ],
  'youth-public-safety': [
    {
      id: 'safety-instructors',
      name: '공공안전 교육 운영 인력 8명',
      owner: '세종소방본부',
      availableDate: '2024.05.28',
      detail: '응급대응과 생활안전 체험 교육 운영',
    },
    {
      id: 'education-kit',
      name: '체험 교구 10세트',
      owner: '지역 교육기관',
      availableDate: '2024.05.28',
      detail: '참여형 안전교육 콘텐츠 운영',
    },
    {
      id: 'program-staff',
      name: '진행 보조 인력 10명',
      owner: '보람동 행정복지센터',
      availableDate: '2024.05.28',
      detail: '참여자 안내와 동선 관리',
    },
  ],
  'rainfall-prep': [
    {
      id: 'pump-kit',
      name: '양수 장비 4대',
      owner: '세종시 재난안전대책본부',
      availableDate: '2024.05.21',
      detail: '저지대 배수 취약 지점 사전 배치',
    },
    {
      id: 'field-control',
      name: '현장 통제 인력 16명',
      owner: '육군 제32보병사단',
      availableDate: '2024.05.21',
      detail: '침수 우려 구간 접근 통제와 물자 이동 보조',
    },
    {
      id: 'resident-alert',
      name: '주민 안내 채널 1식',
      owner: '금남면 행정복지센터',
      availableDate: '2024.05.20',
      detail: '마을방송, 문자 안내, 대피 안내문 연계',
    },
  ],
};

export const processSteps: ProcessStep[] = [
  {
    id: 'intake',
    label: '요청 접수',
    description:
      '읍면동, 시민단체, 협력기관의 요청을 표준 양식으로 접수하고 위치, 긴급성, 요청 목적을 정리합니다.',
  },
  {
    id: 'ai-analysis',
    label: 'AI 분석',
    description:
      '요청 내용을 자연어로 분류하고 유사사례, 위험도, 필요 자원, 우선 검토사항을 빠르게 요약합니다.',
  },
  {
    id: 'matching',
    label: '협업 매칭',
    description:
      '세종시 부서와 협력기관의 지원 가능 자원을 비교해 가장 적합한 협업 조합을 추천합니다.',
  },
  {
    id: 'execution',
    label: '자원 실행',
    description:
      '승인된 계획에 따라 인력, 장비, 차량, 안내 체계를 배치하고 현장 진행 상태를 추적합니다.',
  },
  {
    id: 'performance',
    label: '성과 관리',
    description:
      '지원 결과, 투입 자원, 시민 체감 효과를 기록해 다음 유사 요청의 추천 품질을 높입니다.',
  },
];

export function buildDocumentDraft(request: CollaborationRequest): DocumentDraft {
  if (request.id === 'drainage-improvement') {
    return {
      letter:
        '수신: 육군 제32보병사단\n제목: 세종시 ○○마을 배수로 정비 및 하천 환경 개선 관련 협조 요청\n\n내용:\n세종특별자치시는 ○○마을 일대 배수로 정비 및 하천 환경 개선을 위하여 민·관·군 협업 지원을 요청드립니다. AI 분석 결과 해당 지역은 집중호우 시 배수 취약성이 확인되었으며, 굴삭기 및 현장 정비 인력 지원 시 신속한 조치가 가능할 것으로 판단됩니다.',
      plan:
        '- 작업지역: ○○마을 배수로 및 하천 주변\n- 필요자원: 굴삭기 1대, 덤프트럭 1대, 현장인력 20명\n- 예상 소요시간: 4시간\n- 협업기관: 세종특별자치시, 육군 제32보병사단, 세종시 자원봉사센터\n- 안전조치: 현장 통제선 설치, 장비 접근로 확인, 작업 전 안전교육 실시',
      report:
        '- 지원일자: 2024.05.25\n- 지원내용: 배수로 정비, 토사 제거, 주변 환경정화\n- 투입자원: 장비 2대, 인력 20명\n- 기대효과: 집중호우 대비 배수 기능 향상 및 주민 생활환경 개선',
    };
  }

  const primaryPartner = request.partners[0] ?? '세종특별자치시';
  return {
    letter: `수신: ${primaryPartner}\n제목: ${request.title} 관련 협조 요청\n\n내용:\n세종특별자치시는 ${request.location} 일대의 공공문제 해결을 위해 협업 지원을 요청드립니다. AI 분석 결과 해당 요청은 ${request.category} 분야로 분류되었으며, 유사 사례와 현장 여건을 고려할 때 관련 기관의 자원 연계가 필요합니다.`,
    plan: `- 작업지역: ${request.location}\n- 필요자원: ${request.neededResources.join(', ')}\n- 예상 소요시간: 현장 확인 후 확정\n- 협업기관: ${request.partners.join(', ')}\n- 안전조치: 작업 구간 사전 점검, 현장 안내, 참여자 안전교육 실시`,
    report: `- 지원일자: 협업기관 일정 확정 후 기재\n- 지원내용: ${request.category} 분야 요청사항 지원\n- 투입자원: AI 추천 자원 및 현장 필요 자원\n- 기대효과: 시민 불편 완화, 공공서비스 대응 속도 향상, 협업 사례 축적`,
  };
}
