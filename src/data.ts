export type Category =
  | '재난복구'
  | '환경정화'
  | '시설·물자'
  | '농촌지원'
  | '교육·체험'
  | '행사지원';

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
  lat?: number;
  lng?: number;
}

export interface RequestDraftInput {
  title: string;
  requester: string;
  location: string;
  category: Category;
  priority: Priority;
  detail: string;
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

export interface SimilarCase {
  id: string;
  title: string;
  category: Category;
  agency: string;
  year: string;
  result: string;
  resources: string[];
  matchScore: number;
}

export const sidebarMenus: SidebarMenu[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'requests', label: '요청 접수' },
  { id: 'analysis', label: '현장 지도' },
  { id: 'resources', label: '실행 관리' },
  { id: 'cases', label: '사례 검색' },
  { id: 'documents', label: '문서 작성' },
  { id: 'performance', label: '성과 분석' },
];

export const partnerInstitutions = ['세종특별자치시', '협력 군부대'];

export const categoryLegend: Record<Category, { color: string; bg: string }> = {
  재난복구: { color: '#0B7285', bg: '#E7F8FB' },
  환경정화: { color: '#1F7A5C', bg: '#EAF4EF' },
  '시설·물자': { color: '#2F6FDB', bg: '#EAF2FF' },
  농촌지원: { color: '#7A6A1F', bg: '#F7F1D8' },
  '교육·체험': { color: '#805AD5', bg: '#F1ECFF' },
  행사지원: { color: '#B98535', bg: '#FFF8EA' },
};

export const collaborationRequests: CollaborationRequest[] = [
  {
    id: 'flood-field-recovery',
    title: '집중호우 피해 농경지 배수 및 토사 제거 지원 요청',
    requester: '금남면 이장협의회',
    date: '2024.05.20',
    status: 'AI 분석 완료',
    category: '재난복구',
    location: '금남면 저지대 농경지',
    priority: '긴급',
    aiSummary:
      '집중호우 이후 농경지 배수 지연과 토사 유입이 동시에 발생한 대민지원 요청입니다. 세종시 현장 확인 후 협력 군부대의 인력·장비 지원 가능성을 검토하면 초기 복구 시간을 줄일 수 있습니다.',
    neededResources: ['굴삭기 1대', '덤프트럭 1대', '현장 정비 인력', '안전 통제선'],
    partners: ['세종특별자치시 재난관리부서', '협력 군부대'],
    mapX: 62,
    mapY: 72,
    lat: 36.468,
    lng: 127.281,
  },
  {
    id: 'river-cleanup-support',
    title: '하천변 부유물 수거 및 환경정화 대민지원 요청',
    requester: '연동면 주민자치회',
    date: '2024.05.19',
    status: '협업 매칭 중',
    category: '환경정화',
    location: '연동면 하천 산책로',
    priority: '높음',
    aiSummary:
      '호우 뒤 하천변에 부유물과 생활폐기물이 쌓인 환경정화 요청입니다. 일반 미화 활동보다 현장 범위가 넓어 세종시 수거 차량과 협력 군부대의 정비 인력을 함께 배치하는 방식이 적합합니다.',
    neededResources: ['환경정비 인력', '폐기물 수거 차량', '방수 장갑·마대', '보행자 안내물'],
    partners: ['세종특별자치시 환경관리부서', '협력 군부대'],
    mapX: 55,
    mapY: 46,
    lat: 36.562,
    lng: 127.331,
  },
  {
    id: 'snow-route-support',
    title: '폭설 취약마을 진입로 제설 및 물자 운반 지원 요청',
    requester: '전의면 행정복지센터',
    date: '2024.05.18',
    status: '지원 계획 작성 중',
    category: '시설·물자',
    location: '전의면 산간마을 진입로',
    priority: '높음',
    aiSummary:
      '폭설 시 고령 주민 이동과 생필품 운반이 어려운 마을 진입로 지원 건입니다. 제설 장비 접근 가능 구간을 세종시가 확인하고 협력 군부대는 물자 운반과 취약 구간 보조를 담당하는 조합이 적합합니다.',
    neededResources: ['제설 장비', '물자 운반 차량', '현장 보조 인력', '미끄럼 방지 자재'],
    partners: ['세종특별자치시 도로관리부서', '협력 군부대'],
    mapX: 42,
    mapY: 18,
    lat: 36.681,
    lng: 127.196,
  },
  {
    id: 'farm-harvest-help',
    title: '농번기 고령농가 일손돕기 대민지원 요청',
    requester: '장군면 이장단협의회',
    date: '2024.05.17',
    status: '지원 가능 검토',
    category: '농촌지원',
    location: '장군면 농가 밀집지역',
    priority: '보통',
    aiSummary:
      '농번기 단기간 인력 공백이 발생한 고령농가 지원 요청입니다. 세종시가 대상 농가와 작업 범위를 확정하고 협력 군부대는 제한된 시간의 일손돕기 인력을 검토하는 방식이 적절합니다.',
    neededResources: ['일손돕기 인력', '소형 운반 차량', '작업 장갑·안전용품', '현장 안내 인력'],
    partners: ['세종특별자치시 농업지원부서', '협력 군부대'],
    mapX: 33,
    mapY: 63,
    lat: 36.498,
    lng: 127.205,
  },
  {
    id: 'memorial-event-support',
    title: '현충일 추념행사 현장 정리 및 물자 설치 지원 요청',
    requester: '조치원읍 행정복지센터',
    date: '2024.05.16',
    status: '공문 초안 작성',
    category: '행사지원',
    location: '조치원읍 추념행사장',
    priority: '보통',
    aiSummary:
      '보훈행사 전후 현장 정리, 의자·천막 등 물자 설치, 참여자 동선 안내가 필요한 행사지원 요청입니다. 세종시 행사 주관 아래 협력 군부대의 제한적 현장 지원을 검토할 수 있습니다.',
    neededResources: ['행사용 물자', '설치 보조 인력', '동선 안내 표지', '현장 안전 확인'],
    partners: ['세종특별자치시 보훈업무부서', '협력 군부대'],
    mapX: 47,
    mapY: 26,
    lat: 36.603,
    lng: 127.298,
  },
  {
    id: 'safety-experience',
    title: '시민 재난안전 체험교육 운영 지원 요청',
    requester: '세종시 안전교육 담당부서',
    date: '2024.05.15',
    status: '협업기관 회신 대기',
    category: '교육·체험',
    location: '보람동 공공교육장',
    priority: '보통',
    aiSummary:
      '시민 대상 재난안전 체험교육 운영 지원 건입니다. 세종시가 교육 일정과 대상자를 관리하고 협력 군부대는 재난 대비 물자 전시, 현장 안전 안내, 체험 보조 범위에서 참여하는 구조가 적합합니다.',
    neededResources: ['교육 보조 인력', '재난 대비 물자 전시', '안전 안내 요원', '참여자 동선 관리'],
    partners: ['세종특별자치시 안전교육부서', '협력 군부대'],
    mapX: 53,
    mapY: 66,
    lat: 36.479,
    lng: 127.289,
  },
  {
    id: 'sandbag-logistics',
    title: '침수 우려지역 모래주머니 적재 및 운반 지원 요청',
    requester: '부강면 주민대표회의',
    date: '2024.05.14',
    status: '긴급 대응 준비',
    category: '시설·물자',
    location: '부강면 배수 취약구간',
    priority: '긴급',
    aiSummary:
      '침수 우려지역의 사전 대비를 위한 모래주머니 적재·운반 요청입니다. 세종시가 배치 지점을 지정하고 협력 군부대의 운반 인력과 차량 지원 가능성을 함께 검토하는 것이 좋습니다.',
    neededResources: ['모래주머니 300개', '운반 차량', '적재 인력', '현장 통제선'],
    partners: ['세종특별자치시 재난관리부서', '협력 군부대'],
    mapX: 66,
    mapY: 57,
    lat: 36.529,
    lng: 127.373,
  },
];

export const similarCases: SimilarCase[] = [
  {
    id: 'case-flood-field',
    title: '집중호우 후 농경지 배수로 응급 복구',
    category: '재난복구',
    agency: '세종특별자치시 재난관리부서',
    year: '2023',
    result: '배수 취약구간 900m 정비, 토사 반출과 주민 통행로 확보',
    resources: ['굴삭기', '덤프트럭', '현장 정비 인력'],
    matchScore: 95,
  },
  {
    id: 'case-river-cleanup',
    title: '하천 산책로 부유물 수거 합동 정비',
    category: '환경정화',
    agency: '세종특별자치시 환경관리부서',
    year: '2024',
    result: '하천변 1.4km 정비, 수거 폐기물 반출과 보행 안전 확보',
    resources: ['환경정비 인력', '수거 차량', '안전 안내물'],
    matchScore: 92,
  },
  {
    id: 'case-sandbag',
    title: '침수 대비 모래주머니 사전 배치',
    category: '시설·물자',
    agency: '세종특별자치시 재난관리부서',
    year: '2023',
    result: '취약구간 6곳에 예방 물자 배치, 현장 대응 시간 단축',
    resources: ['모래주머니', '운반 차량', '적재 인력'],
    matchScore: 90,
  },
  {
    id: 'case-farm-help',
    title: '고령농가 농번기 일손돕기 대민지원',
    category: '농촌지원',
    agency: '세종특별자치시 농업지원부서',
    year: '2024',
    result: '고령농가 12곳 작업 지원, 수확 지연 민원 감소',
    resources: ['일손돕기 인력', '소형 운반 차량', '안전용품'],
    matchScore: 88,
  },
  {
    id: 'case-safety-education',
    title: '시민 재난안전 체험교육 운영 보조',
    category: '교육·체험',
    agency: '세종특별자치시 안전교육부서',
    year: '2023',
    result: '체험 동선 분리와 안전 안내로 참여 만족도 향상',
    resources: ['교육 보조 인력', '전시 물자', '안전 안내 요원'],
    matchScore: 84,
  },
  {
    id: 'case-memorial-event',
    title: '보훈행사 현장 물자 설치 및 정리 지원',
    category: '행사지원',
    agency: '세종특별자치시 보훈업무부서',
    year: '2024',
    result: '행사장 설치·철수 시간 단축, 참여자 이동 동선 안정화',
    resources: ['행사용 물자', '설치 보조 인력', '안내 표지'],
    matchScore: 82,
  },
];

export const resourceRecommendations: Record<string, RecommendationResource[]> = {
  'flood-field-recovery': [
    {
      id: 'excavator-recovery',
      name: '굴삭기 1대',
      owner: '협력 군부대',
      availableDate: '2024.05.25',
      detail: '농경지 유입 토사 제거와 배수 흐름 복구 지원',
    },
    {
      id: 'dump-truck-recovery',
      name: '덤프트럭 15톤',
      owner: '세종특별자치시 도로관리부서',
      availableDate: '2024.05.24',
      detail: '준설토와 훼손 자재 운반 지원',
    },
    {
      id: 'field-team-recovery',
      name: '현장 정비 인력 20명',
      owner: '협력 군부대',
      availableDate: '2024.05.25',
      detail: '토사 정리, 마대 적재, 접근 통제 보조',
    },
  ],
  'river-cleanup-support': [
    {
      id: 'cleanup-team-river',
      name: '환경정비 인력 24명',
      owner: '협력 군부대',
      availableDate: '2024.05.23',
      detail: '하천변 부유물 수거와 정리 작업 지원',
    },
    {
      id: 'collection-truck-river',
      name: '폐기물 수거 차량 2대',
      owner: '세종특별자치시 환경관리부서',
      availableDate: '2024.05.23',
      detail: '수거물 반출과 임시 적치장 이동',
    },
    {
      id: 'safety-kit-river',
      name: '현장 안전물품 1식',
      owner: '세종특별자치시 환경관리부서',
      availableDate: '2024.05.22',
      detail: '마대, 장갑, 작업구간 안내물 지원',
    },
  ],
  'snow-route-support': [
    {
      id: 'snow-vehicle',
      name: '물자 운반 차량 2대',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '제설 취약구간 생필품과 제설 자재 운반',
    },
    {
      id: 'road-snow-equipment',
      name: '제설 장비 1식',
      owner: '세종특별자치시 도로관리부서',
      availableDate: '협의 후 확정',
      detail: '마을 진입로 주요 구간 제설',
    },
    {
      id: 'anti-slip-material',
      name: '미끄럼 방지 자재',
      owner: '세종특별자치시 도로관리부서',
      availableDate: '협의 후 확정',
      detail: '급경사·결빙 우려 구간 사전 배치',
    },
  ],
  'farm-harvest-help': [
    {
      id: 'farm-support-team',
      name: '일손돕기 인력 18명',
      owner: '협력 군부대',
      availableDate: '2024.05.27',
      detail: '고령농가 단기 작업 보조',
    },
    {
      id: 'farm-transport',
      name: '소형 운반 차량 1대',
      owner: '세종특별자치시 농업지원부서',
      availableDate: '2024.05.27',
      detail: '작업 도구와 수확물 이동 보조',
    },
    {
      id: 'farm-safety-kit',
      name: '작업 안전용품 30세트',
      owner: '세종특별자치시 농업지원부서',
      availableDate: '2024.05.26',
      detail: '장갑, 팔토시, 현장 안내물 지원',
    },
  ],
  'memorial-event-support': [
    {
      id: 'event-setup-team',
      name: '행사 설치 보조 인력 12명',
      owner: '협력 군부대',
      availableDate: '2024.06.05',
      detail: '행사장 물자 설치와 종료 후 정리 지원',
    },
    {
      id: 'event-materials',
      name: '행사용 물자 1식',
      owner: '세종특별자치시 보훈업무부서',
      availableDate: '2024.06.04',
      detail: '의자, 천막, 안내 표식 설치',
    },
    {
      id: 'event-route-guides',
      name: '동선 안내 표지 20개',
      owner: '세종특별자치시 보훈업무부서',
      availableDate: '2024.06.04',
      detail: '참여자 이동 동선과 안전 구역 안내',
    },
  ],
  'safety-experience': [
    {
      id: 'education-assist-team',
      name: '교육 보조 인력 8명',
      owner: '협력 군부대',
      availableDate: '2024.05.28',
      detail: '체험 부스 안내와 참여자 안전 보조',
    },
    {
      id: 'disaster-display-kit',
      name: '재난 대비 물자 전시 세트',
      owner: '협력 군부대',
      availableDate: '2024.05.28',
      detail: '시민 체험용 전시 물자와 설명 보조',
    },
    {
      id: 'education-space',
      name: '교육장 운영 지원',
      owner: '세종특별자치시 안전교육부서',
      availableDate: '2024.05.28',
      detail: '참여자 접수, 동선 관리, 사전 안내',
    },
  ],
  'sandbag-logistics': [
    {
      id: 'sandbag-team',
      name: '모래주머니 적재 인력 16명',
      owner: '협력 군부대',
      availableDate: '2024.05.21',
      detail: '취약구간 모래주머니 적재와 배치 보조',
    },
    {
      id: 'sandbag-truck',
      name: '운반 차량 2대',
      owner: '협력 군부대',
      availableDate: '2024.05.21',
      detail: '현장별 예방 물자 운반',
    },
    {
      id: 'sandbag-stock',
      name: '모래주머니 300개',
      owner: '세종특별자치시 재난관리부서',
      availableDate: '2024.05.20',
      detail: '침수 우려지역 사전 배치 물자',
    },
  ],
};

export const processSteps: ProcessStep[] = [
  {
    id: 'intake',
    label: '요청 접수',
    description:
      '읍면동과 세종시 담당자가 시민 요청을 표준 양식으로 접수하고 위치, 긴급성, 군 협력 필요 여부를 정리합니다.',
  },
  {
    id: 'ai-analysis',
    label: 'AI 분석',
    description:
      '요청 내용을 분석해 대민지원 유형, 현장 위험도, 필요 인력·장비, 유사사례를 빠르게 요약합니다.',
  },
  {
    id: 'matching',
    label: '협업 매칭',
    description:
      '세종시 보유 자원과 협력 군부대 지원 가능 범위를 비교해 실행 가능한 조합을 추천합니다.',
  },
  {
    id: 'execution',
    label: '현장 지원',
    description:
      '승인된 계획에 따라 인력, 장비, 차량, 안내 체계를 배치하고 현장 진행 상태를 기록합니다.',
  },
  {
    id: 'performance',
    label: '결과 정리',
    description:
      '지원 결과, 투입 자원, 안전조치, 시민 체감 효과를 기록해 다음 유사 요청의 판단 근거로 축적합니다.',
  },
];

export function buildDocumentDraft(request: CollaborationRequest): DocumentDraft {
  if (request.id === 'flood-field-recovery') {
    return {
      letter:
        '수신: 협력 군부대\n제목: 세종시 금남면 집중호우 피해 농경지 배수 및 토사 제거 지원 협조 요청\n\n내용:\n세종특별자치시는 금남면 저지대 농경지의 집중호우 피해 복구를 위하여 민·관·군 협업 지원을 요청드립니다. AI 분석 결과 해당 지역은 배수 지연과 토사 유입으로 농가 피해 확대 가능성이 확인되었으며, 굴삭기와 현장 정비 인력 지원 시 신속한 응급 복구가 가능할 것으로 판단됩니다.',
      plan:
        '- 작업지역: 금남면 저지대 농경지 및 인접 배수로\n- 필요자원: 굴삭기 1대, 덤프트럭 1대, 현장 정비 인력 20명\n- 예상 소요시간: 4시간\n- 협업기관: 세종특별자치시, 협력 군부대\n- 안전조치: 현장 통제선 설치, 장비 접근로 확인, 작업 전 안전교육 실시',
      report:
        '- 지원일자: 2024.05.25\n- 지원내용: 농경지 배수로 정비, 토사 제거, 운반 지원\n- 투입자원: 장비 2대, 인력 20명\n- 기대효과: 집중호우 피해 확산 방지 및 농가 생활 안정 지원',
    };
  }

  const primaryPartner =
    request.partners.find((partner) => partner.includes('군부대')) ??
    request.partners[0] ??
    '협력기관';

  return {
    letter: `수신: ${primaryPartner}\n제목: ${request.title} 관련 협조 요청\n\n내용:\n세종특별자치시는 ${request.location} 일대의 공공지원 수요 해결을 위해 민·관·군 협업 지원을 요청드립니다. AI 분석 결과 해당 요청은 ${request.category} 분야로 분류되었으며, 유사 사례와 현장 여건을 고려할 때 관련 기관의 자원 연계가 필요합니다.`,
    plan: `- 작업지역: ${request.location}\n- 필요자원: ${request.neededResources.join(', ')}\n- 예상 소요시간: 현장 확인 후 확정\n- 협업기관: ${request.partners.join(', ')}\n- 안전조치: 작업 구간 사전 점검, 현장 안내, 참여자 안전교육 실시`,
    report: `- 지원일자: 협업기관 일정 확정 후 기재\n- 지원내용: ${request.category} 분야 요청사항 지원\n- 투입자원: AI 추천 자원 및 현장 필요 자원\n- 기대효과: 시민 불편 완화, 공공지원 대응 속도 향상, 협업 사례 축적`,
  };
}
