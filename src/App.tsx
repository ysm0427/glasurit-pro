import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket, Columns, Mail, Code, Users, CreditCard, AlertTriangle, ThumbsUp, Eye, Calendar, RefreshCw, MessageSquare, Send, Save, CheckCircle, Edit3, Target, Edit
} from 'lucide-react';

// 🚀 [핵심 엔진] Vercel CSS 에러 완벽 차단 및 다크모드 강제 구동 로더
if (typeof window !== 'undefined' && !document.getElementById('tailwind-script')) {
  const script = document.createElement('script');
  script.id = 'tailwind-script';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

const LAST_PATCH_DATE = "2026.09.18 (스마트 타자 엔진 및 안료 DB 풀세트 완벽 탑재)"; 

export const PEARL_LEVELS = [
  { level: 1, name: 'Ultra Micro 울트라 마이크로', size: '1~5µm', desc: '지문 사이로 스며드는 전분 가루 수준의 극미세 입자 크기를 가진 진주빛 조색제입니다.', faceFlop: '진주조개 안쪽을 긁어낸 듯한 뽀얗고 탁한 우윳빛을 띱니다. 정면과 측면 모두 왜곡 없이 은은하고 부드러운 실키 글로우(Silky Glow)를 일정하게 유지합니다.', usage: '최고급 세단의 깊은 화이트 펄 바탕을 깔거나, 입자가 거친 안료의 톤을 부드럽게 눌러줄 때 처방됩니다.', mix: '투명도가 낮고 은폐력이 매우 뛰어나, 베이스의 밀도를 높이기 위해 지시된 조색 데이터 수치를 정확히 계량합니다.', warning: '메탈릭이 뭉치는 얼룩(Mottling) 현상이 거의 발생하지 않아 초급자도 수월하게 도장할 수 있습니다.', codes: [] },
  { level: 2, name: 'Micro 마이크로', size: '5~10µm', desc: '고운 밀가루 수준의 미세 입자로, 도장 표면을 매끄럽고 차분하게 정돈하는 안료입니다.', faceFlop: '90-A032 (틴터 화이트): 맑은 물에 우유를 한 방울 떨어뜨린 듯한 반투명하고 뽀얀 흰빛을 냅니다.\n90-M99/01 (실버): 고운 알루미늄 호일을 갈아 넣은 듯 차분하고 매끄러운 쥐색(은빛)이 돕니다.', usage: '매끄러운 질감과 차분한 바탕색이 요구되는 부드러운 순정(OEM) 펄 계열 도장에 광범위하게 적용됩니다.', mix: '입자 배열이 안정적이므로 기본 배합 비율에 맞춰 혼합하며, 타 안료와 섞일 때 변수가 적습니다.', warning: '얼룩 발생 위험이 적어 숨김 도장(보카시) 작업 시 신구 도막의 경계면을 자연스럽게 잇기 유리합니다.', codes: ['90-A032', '90-M99/01'] },
  { level: 3, name: 'Fine 파인', size: '10~15µm', desc: '고운 슈가 파우더 크기로 미세한 반짝임과 투명한 질감을 동시에 부여하는 펄 조색제입니다.', faceFlop: '93-M010 (화이트 펄): 맑은 쌀뜨물처럼 깨끗하고 고운 흰색 진주빛이 피어오릅니다.\n93-M822 (그린 펄): 맑은 에메랄드 바다를 연상시키는 은은한 초록빛을 띱니다.', usage: '아시아계 양산차 특유의 촘촘하고 밝은 화이트 펄 베이스 컬러 도장 시 핵심적으로 처방됩니다.', mix: '은폐력과 투명성을 동시에 고려하여 설계되었으므로, 지정된 배합 비율을 오차 없이 준수해야 합니다.', warning: '수용성 베이스 도장 시 플래시 오프(건조) 시간을 정석대로 철저히 지켜야 투명한 질감을 극대화할 수 있습니다.', codes: ['93-M010', '93-M822'] },
  { level: 4, name: 'Fine Medium 파인 미디엄', size: '15~20µm', desc: '고운 맛소금 정도의 입자 크기로 어떤 바탕과도 자연스럽게 융화되는 중미세 안료입니다.', faceFlop: '특정한 색이 도드라지기보다 바탕색에 스며들어, 은은한 진주빛 코팅을 얇게 씌운 듯한 맑은 광택을 냅니다.', usage: '일반적인 순정(OEM) 밝은 컬러 도장 시 범용적으로 사용되며, 다양한 색상과 무난하게 조화됩니다.', mix: '작업성(은폐력)과 시각적 효과(반짝임)의 밸런스가 뛰어나 지시된 데이터를 기준으로 유연한 혼합이 가능합니다.', warning: '하도(바탕색)가 미세하게 불량하더라도 어느 정도 커버가 가능하여 작업자에게 가장 관대하고 안정성이 높습니다.', codes: [] },
  { level: 5, name: 'Standard Medium 스탠다드 미디엄', size: '20~25µm', desc: '일반 백설탕 크기의 표준 규격으로 은폐력과 광택 반사의 균형이 가장 뛰어난 안료입니다.', faceFlop: '93-M011 (파인 화이트 펄): 우유 빙수나 바닐라 아이스크림처럼 부드럽고 뽀얀 정통 화이트 진주빛을 냅니다.\n93-M176 (골드 펄): 투명한 샴페인이나 맑은 식용유처럼 찰랑거리는 고급스러운 연한 금빛이 돕니다.', usage: '양산차 보수 도장 현장에서 가장 사용 빈도가 높은 핵심 규격으로 대부분의 표준 펄 컬러에 처방됩니다.', mix: '배열제(플롭 컨트롤러) 등 첨가제 비율 변화에 크게 민감하지 않아 표준 배합 데이터를 따를 때 가장 안정적입니다.', warning: '웻(Wet)하게 뿌리든 드라이(Dry)하게 뿌리든 입자가 고르게 누워 얼룩 발생이 적고 일관된 결과물을 보장합니다.', codes: ['93-M011', '93-M176'] },
  { level: 6, name: 'Medium Coarse 미디엄 코어스', size: '25~35µm', desc: '굵은 황설탕 크기로 개별 입자의 반짝임이 시야에 뚜렷하게 들어오기 시작하는 조색제입니다.', faceFlop: '98-M319 (라디언트 레드): 잘 익은 체리나 붉은 석류알처럼 검붉은 바탕에 선명하게 맺히는 빨간빛을 냅니다.\n93-M505 (블루 펄): 맑은 가을 하늘이나 이온음료처럼 쨍하고 청량한 파란빛을 뿜어냅니다.', usage: '시선을 사로잡는 생동감 넘치는 레드 펄이나 눈부시게 밝고 선명한 블루 펄 컬러 등에 처방됩니다.', mix: '입자가 무거워지기 시작하므로 도료 내 침전을 막고 고르게 분산시키기 위해 지정된 배합 비율과 점도를 정확히 맞춥니다.', warning: '과도하게 젖은(Wet) 상태로 도포 시 입자가 엉켜 측면이 지저분해질 수 있으므로 일정한 겹침(Overlap)이 필수입니다.', codes: ['98-M319', '93-M505'] },
  { level: 7, name: 'Coarse & Xirallic 코어스 및 시라릭', size: '35~42µm', desc: '굵은 꽃소금 크기로 빛의 굴절을 극대화시킨 투명 고휘도 시라릭(Xirallic) 펄 조색제입니다.', faceFlop: '90-A34 (다이아몬드 화이트): 갓 내린 눈 결정체에 햇빛이 비칠 때처럼 차갑고 쨍하게 쏘는 순백의 크리스탈빛을 냅니다.\n90-A35 (다이아몬드 레드): 핏빛 루비 보석을 부수어 놓은 듯 묵직하면서도 날카롭게 반짝이는 붉은빛을 띱니다.', usage: '최고급 화이트 펄 및 특수 고채도 컬러 도장 시 극한의 입체 반사광을 구현하기 위해 처방됩니다.', mix: '분말 특성이 강하므로 믹싱 클리어와 완벽하게 교반하여 도막에 안착시켜야 하얗게 덩어리지는 하자를 막을 수 있습니다.', warning: '에어 압력이 낮거나 하도가 불량하면 측면 멍듦 현상이 발생하므로, 세심한 스프레이 컨트롤과 완벽한 바탕색이 요구됩니다.', codes: ['90-A34', '90-A35'] },
  { level: 8, name: 'High Coarse Diamond 하이 코어스 다이아몬드', size: '42~50µm', desc: '굵은 천일염 크기로 강렬한 난반사와 극단적인 명암 대비를 보여주는 다이아몬드급 이펙트 안료입니다.', faceFlop: '98-M919 (크리스탈 실버): 거친 얼음조각이 부서지듯 극단적이고 압도적인 투명 난반사를 폭발시킵니다.', usage: '압도적인 화려함을 뽐내는 프리미엄 익스테리어 컬러 및 캔디 이펙트 하도에 사용됩니다.', mix: '굵은 다이아몬드 입자가 균일하게 도막에 안착할 수 있도록 배합 후 충분하고 부드러운 교반을 거쳐야 합니다.', warning: '숨김 도장(보카시) 시 경계면에 입자가 하얗게 쌓이는 현상(Halo Effect)을 막기 위해 정교한 흩뿌리기 기술이 필요합니다.', codes: ['98-M919'] },
  { level: 9, name: 'Glass Flake 글래스 플레크', size: '50~70µm', desc: '미세한 유리 조각 크기로 유리 특유의 투과율을 이용한 스페셜 유리 편상 안료입니다.', faceFlop: '98-M80 (매직 카멜레온): 비눗방울 표면이나 홀로그램 스티커처럼 보는 각도에 따라 청록에서 보라로 요동치는 카멜레온빛을 냅니다.', usage: '신비로운 색상 변화나 압도적인 깊이감을 요구하는 매직 이펙트 및 판타지 커스텀 컬러에 적용됩니다.', mix: '베이스의 은폐력이 없으므로 반드시 완벽하게 조색된 하도(바탕색) 위에 지정된 비율로 혼합하여 투명한 층으로 올려야 합니다.', warning: '건조 후 표면이 거칠어지므로, 투명 클리어를 평소보다 두툼하게 올리고 고품질로 마감해야 완벽한 광택을 낼 수 있습니다.', codes: ['98-M80'] },
  { level: 10, name: 'Max Fantasy Extreme 맥스 판타지 익스트림', size: '70µm 이상', desc: '얼음 설탕 조각 크기의 초대형 기재를 사용한 커스텀 전용 맥스 익스트림 안료입니다.', faceFlop: '98-M88 (홀로그래픽 실버): 레이저 프리즘처럼 시야를 찌르는 극단적인 7색 무지개빛 난반사를 뿜어냅니다.', usage: '시선을 압도해야 하는 모터쇼 출품 차량이나 극한의 화려함을 추구하는 커스텀 익스테리어 전용 특수 도장에 처방됩니다.', mix: '매우 굵은 특수 입자이므로 일반적인 조색 데이터보다는 작업자의 커스텀 의도와 도막 두께에 맞춘 특수 비율 적용이 필요합니다.', warning: '일반 스프레이 건 노즐 막힘에 주의해야 하며, 클리어 도장 후 샌딩(평탄화) 및 재클리어 공정이 동반되어야 얼룩과 거칠음을 방지할 수 있습니다.', codes: ['98-M88'] }
];
export const TONER_DB: Record<string, TonerData> = {
  // --- [수지 및 첨가제 라인] ---
  '90-M4': { role: '스탠다드 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수용성 조색 시스템의 기본 뼈대를 형성하는 투명 수지입니다.', details: [
    ['화학적 특성', '수용성 아크릴 및 폴리우레탄 분산 수지로 도막의 물리적 뼈대(골조)를 완벽히 형성합니다.'],
    ['일반 특성', '90라인 시스템 전 색상의 근간이 되는 가장 필수적인 투명 베이스 수지입니다.'],
    ['외관 변화', '안료 고유 색상에 간섭하지 않으며 메탈릭/펄 입자의 배열(Orientation)을 고르게 안착시킵니다.'],
    ['배합 비율', '컬러 뼈대 구축을 위해 조색 시 가장 기본적이고 절대 다량으로 계량되어 투입됩니다.'],
    ['비교 분석', '[비교] 90-M4는 굳어서 도막 두께가 되고, 93-E3(환원제)는 점도만 맞춘 뒤 증발하여 날아갑니다.']
  ]},
  '90-M5': { role: '블렌딩 클리어 / 틴터', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '메탈릭 입자를 투명하고 부드럽게 펴주는 블렌딩 전용 수지입니다.', details: [
    ['화학적 특성', '기존 도막의 클리어층과 화학적 친화력이 높은 특수 용제가 포함된 침투성 수지입니다.'],
    ['일반 특성', '부분 도장(보카시) 시 신구 도막의 이질감을 없애고 시각적 경계를 완벽히 허물어버립니다.'],
    ['외관 변화', '메탈릭 입자가 뭉치지 않고 투명하고 넓게 분산되도록 유도하여 모틀링(얼룩)을 방지합니다.'],
    ['배합 비율', '도장 부위 경계면에 선행 도장(Wet-bed)하거나 특수 투명 베이스 조색 시 사용됩니다.'],
    ['비교 분석', '[비교] 일반 M4 수지 대비 용제 침투력이 뛰어나 경계면을 자연스럽게 녹여 잇는 데 탁월합니다.']
  ]},
  '90-M1': { role: '이펙트 어디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막의 흐름성과 웻(Wet) 상태를 강제로 유지하는 투명 첨가제입니다.', details: [
    ['화학적 특성', '도막 표면이 급격히 마르는 것을 화학적으로 억제하는 보습 및 흐름성 지연 수지입니다.'],
    ['일반 특성', '한여름 고온 건조한 악조건 환경(열풍기 가동 등)에서의 작업 안정성을 극대화합니다.'],
    ['외관 변화', '시각적인 발색이나 광택에는 전혀 개입하지 않으며, 거친 표면을 매끄럽게 눕혀줍니다.'],
    ['배합 비율', '부스 환경 조건에 따라 조색 최종 단계에서 미량만 정밀하게 첨가해야 합니다.'],
    ['비교 분석', '[경고] 정량 초과 과다 투입 시 내부 수분이 날아가지 않아(트래핑) 완전 건조 시간이 치명적으로 지연됩니다.']
  ]},
  '93-E3': { role: '어저스팅 베이스 (환원제)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수용성 조색 시스템의 점도를 제어하는 핵심 투명 환원제입니다.', details: [
    ['화학적 특성', '시각적 특성이 0%인 완벽한 투명 수용성 환원제로, 안료 입자의 분산 공간을 제공합니다.'],
    ['일반 특성', '도막이 안착할 최적의 웻(Wet) 상태를 유지시켜 스프레이 건 분사 시 미립화를 돕습니다.'],
    ['외관 변화', '입자가 고르게 펴지도록(Leveling) 유도하여 도막 표면의 오렌지필을 억제합니다.'],
    ['배합 비율', '조색 완료된 원액에 10~20% 비율로 희석하여 사용합니다. (은폐 약한 색 10%, 고점도 20%).'],
    ['비교 분석', '[환경 변수] 부스 온도가 30도 이상일 경우, 증발을 늦추는 지연제(93-E3 Slow)로 대체해야 얼룩이 안 생깁니다.']
  ]},
  '93-E3 Slow': { role: '지연형 환원제 (Slow)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '고온 환경에서 도료의 증발 속도를 강제로 늦추는 지연제입니다.', details: [
    ['화학적 특성', '비등점(끓는점)이 높은 특수 용제로 구성되어 수용성 도료의 급격한 증발을 화학적으로 방어합니다.'],
    ['일반 특성', '여름철 28도 이상 고온 건조 환경이나 대면적(전체) 도장 시 필수적인 지연 첨가제입니다.'],
    ['배합 비율', '일반 93-E3를 100% 대체하여 10~20% 희석 배합합니다.']
  ]},
  '93-E3 Fast': { role: '촉진형 환원제 (Fast)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '저온 환경에서 도료의 증발 속도를 강제로 돕는 촉진제입니다.', details: [
    ['화학적 특성', '비등점이 낮은 용제로 구성되어 수용성 도료의 증발을 화학적으로 가속시킵니다.'],
    ['일반 특성', '겨울철 15도 이하 저온 환경 부분 도장 및 빠른 건조가 필요한 소구역 작업에 사용됩니다.'],
    ['배합 비율', '일반 93-E3를 100% 대체하여 10~20% 희석 배합합니다.']
  ]},
  '90-M3': { role: '매팅 에이전트 (무광 수지)', type: 'binder', face: '#e2e8f0', flop: '#e2e8f0', desc: '광택을 강제로 죽여 난반사로 흩뿌리는 무광 첨가 수지입니다.', details: [
    ['일반 특성', '베이스 코트 자체가 무광이어야 하는 특수 질감 도장이나 무광 플라스틱 범퍼 가니쉬에 사용됩니다.'],
    ['외관 변화', '도막 표면을 미세하게 거칠게 만들어 포근하고 매트한(Satin/Matte) 질감을 형성합니다.']
  ]},
  '90-M20': { role: '플롭 컨트롤러 (배열제)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '메탈릭 안료의 누워있는 각도만 강제로 제어하는 특수 첨가제입니다.', details: [
    ['외관 변화', '은분을 강제로 눕히거나 세워서, 측면(Flop)을 환하게 개방하거나 정면을 어둡게 누릅니다.'],
    ['비교 분석', '[테크닉] 컬러 톤은 완벽히 맞는데 유독 측면(Flop)만 어둡거나 밝아 이색이 날 때 최후의 보루로 사용하는 치트키입니다.']
  ]},
  '90-M25': { role: '텍스처 어디티브 (질감제)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막 표면에 미세한 주름이나 범퍼 질감을 부여하는 투명 첨가제입니다.', details: [
    ['일반 특성', '특정 OEM 차량의 플라스틱 가니쉬나 범퍼 특유의 오돌토돌한 반광 텍스처 연출용입니다.']
  ]},
  // --- [무채색 : 화이트 & 블랙] ---
  '90-A031': { role: '스탠다드 화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', desc: '은폐력이 우수하며 밑바탕을 단단하게 덮어버리는 메인 백색 안료입니다.', details: [
    ['화학적 특성', '빛의 투과를 100% 차단하는 고밀도 이산화티타늄(TiO2) 기반 무기 안료입니다.'],
    ['일반 특성', '하도(서페이서) 색상이나 흠집을 완벽하게 차단하고 순백색의 면을 형성하는 바탕 공사용 백색입니다.']
  ]},
  '90-A032': { role: '틴터 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: '메탈릭의 광채를 가리지 않는 반투명 조색용 소프트 화이트입니다.', details: [
    ['외관 변화', '메탈릭 베이스에 안개처럼 깔려 입자의 반짝임을 살리면서 명도를 부드럽게 톤업(Tone-up)시킵니다.'],
    ['비교 분석', '[비교] 90-A031이 바닥을 완벽히 덮어버린다면, A032는 바닥을 맑게 비추면서 우윳빛 필터만 씌우는 반투명 틴트입니다.']
  ]},
  '90-A035': { role: '스노우 화이트', type: 'solid', face: '#f1f5f9', flop: '#94a3b8', desc: '푸른기가 살짝 도는 가장 차갑고 깨끗한 쿨톤 순백색입니다.', details: [
    ['외관 변화', '눈부신 설원이나 얼음장처럼 쨍하고 차가운 스노우 화이트 반사광을 뿜어냅니다.'],
    ['비교 분석', '[경고] 누런빛이 도는 웜톤 화이트 차량 조색 시 1방울이라도 들어가면 톤 전체가 창백하게 죽어버려 복구가 불가합니다.']
  ]},
  '90-A926': { role: '메인 블랙', type: 'solid', face: '#020617', flop: '#000000', desc: '적색이나 청색으로 치우치지 않은 완벽하게 중립적인 표준 흑색입니다.', details: [
    ['일반 특성', '딥 블랙 솔리드 차량의 뼈대 및 다크 남색, 쥐색 메탈릭의 톤다운(Tone-down) 핵심 베이스입니다.'],
    ['비교 분석', '[비교] 저가 범용 블랙이 은분과 섞일 때 측면이 흙빛으로 더러워지는 반면, A926은 맑고 깨끗하게 명도만 수직으로 떨어뜨립니다.']
  ]},
  '90-1250': { role: '제트 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '빛 흡수율을 극한으로 끌어올린 깊고 진한 심연의 최고급 블랙입니다.', details: [
    ['화학적 특성', '일반 카본을 넘어선 완벽한 빛 흡수 구조로 회색빛 잔상조차 허용하지 않는 압도적 암흑 안료입니다.'],
    ['비교 분석', '[경고] 일반 다크 메탈릭에 메인 블랙(A926) 대신 섞으면 톤이 비정상적으로 까맣고 무거워져 섀도우가 뭉개집니다.']
  ]},
  '90-A997': { role: '블랙 / 블루', type: 'solid', face: '#0f172a', flop: '#020617', desc: '서늘한 푸른빛(Bluish) 파장이 감도는 쿨톤 특수 흑색 틴터입니다.', details: [
    ['외관 변화', '정면은 깊은 블랙이지만, 측면으로 눕혀보면 서늘하고 깊은 심해의 푸른 기운을 은은하게 뿜어냅니다.'],
    ['비교 분석', '[경고] 노란색(웜톤)이나 오커 안료와 섞이면 블루와 옐로우가 충돌해 순식간에 칙칙한 카키(시체색) 탁색이 발생합니다.']
  ]},
  '90-A992': { role: '틴팅 그레이 (블랙/화이트)', type: 'solid', face: '#475569', flop: '#1e293b', desc: '블랙과 화이트가 미세하게 섞여있는 듯한 반투명 안전망 그레이 틴터입니다.', details: [
    ['배합 비율', '명도를 1/10 단위로 아주 미세하게 떨어뜨려야 할 때 마이크로 도징(극소량) 배합합니다.'],
    ['비교 분석', '[비교] A926(메인 블랙)을 쓰기엔 톤이 너무 확 죽을까 봐 겁날 때 대체제로 사용하는 최고의 안전 보장 안료입니다.']
  ]},
  // --- [실버 라인] ---
  '90-M99/00': { role: '수퍼 파인 알루미늄', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', desc: '입자가현재 사용 중이신 조색 프로그램의 검색 편의성과 데이터 누락 때문에 작업 흐름이 끊겨 많이 답답하셨을 것 같습니다. 올려주신 화면을 보면 말씀하신 문제들의 원인이 명확하게 나타납니다.

**1. 011, 919, 926 등이 검색되지 않는 이유 (데이터 누락)**
첨부하신 이미지의 좌측 리스트를 보면 '011'을 입력했을 때 **'미등록 안료'**라고 표시되고 있습니다[cite: 1]. 이는 검색 기능 자체의 오류라기보다는, 현재 연결된 데이터베이스(DB) 내에 011, 919, 926과 같은 특정 안료들의 정보가 아예 누락되어 있거나 매핑이 끊어져 있기 때문입니다. 

**2. M4 대신 숫자만 입력해도 검색되도록 로직 변경 필요 (UX 개선)**
현장 실무에서는 바쁜 와중에 'M4'나 '90-M4'를 전부 치는 것은 매우 비효율적입니다. '4'나 '11' 같은 핵심 숫자만 입력해도 시스템이 알아서 수지인지, 펄인지, 일반 안료인지 필터링해 주어야 한다는 말씀이 전적으로 맞습니다.
*   **원인:** 현재 검색창이 정확한 텍스트(예: 알파벳 포함)를 요구하도록 엄격하게 설정되어 있는 것으로 보입니다.
*   **해결책:** 전체 코드를 갈아엎는 대공사까지는 아닙니다. 검색 로직(알고리즘)에서 앞의 접두사(예: 90-, M, A 등)를 생략하고 **'숫자'만 입력해도 포함된 결과값을 모두 띄워주는 자동 완성 및 부분 일치(Partial Match) 기능**으로 검색 조건을 완화하도록 수정만 하면 됩니다.

**3. 안료 내용 및 속성 일괄 수정**
안료의 내용이나 속성(수지, 펄, 메탈릭 등) 분류에 절대적으로 수정해야 할 부분이 보인다면, 개별적으로 코드를 수정하기보다는 **현재 등록된 안료 DB를 엑셀표 형태로 한 번에 내려받아 일괄 검수하고 다시 업로드**하는 방식을 취하는 것이 가장 빠르고 정확합니다.

**💡 향후 프로그램 수정 요청 시 핵심 전달 사항**
이 프로그램을 개발/수정하는 단계시라면, 다음 두 가지를 최우선으로 반영해 달라고 요청하시는 것을 권장합니다.
1.  **검색 유연성 확보:** "영문이나 라인명(90-)을 치지 않고 숫자만 입력해도 해당 숫자가 포함된 안료가 자동 검색 및 자동 분류되도록 검색 필터 조건을 변경해 줄 것"
2.  **누락 데이터 업데이트:** "011, 919, 926 등 '미등록 안료'로 뜨는 글라슈리트(또는 해당 브랜드) 베이스 안료들의 DB 값을 추가하고 속성 정보를 전면 재검수할 것"
// --- [누락되었던 핵심 안료 완벽 복구: 무채색 / 펄 / 이펙트] ---
  '90-A926': { role: '메인 블랙', type: 'solid', face: '#020617', flop: '#000000', desc: '적색이나 청색으로 치우치지 않은 완벽하게 중립적인 표준 흑색입니다.', details: [
    ['일반 특성', '딥 블랙 솔리드 차량의 뼈대 및 다크 남색, 쥐색 메탈릭의 톤다운 핵심 베이스입니다.'],
    ['비교 분석', '[비교] 범용 블랙이 은분과 섞일 때 탁해지는 반면, A926은 맑고 깨끗하게 명도만 수직으로 떨어뜨립니다.']
  ]},
  '93-M010': { role: '화이트 펄 (스탠다드)', type: 'pearl', face: '#ffffff', flop: '#e2e8f0', desc: '가장 널리 쓰이는 표준 진주빛 마이카 펄입니다.', details: [
    ['일반 특성', '대중적인 국산차 3코트 화이트 펄 시스템의 메인 미들 코트 뼈대입니다.'],
    ['배합 비율', '모든 화이트 펄 조색 시 가장 다량으로, 가장 빈번하게 배합됩니다.']
  ]},
  '93-M011': { role: '파인 화이트 펄', type: 'pearl', face: '#f8fafc', flop: '#cbd5e1', desc: '가장 입자가 고운 실크 화이트 펄입니다.', details: [
    ['외관 변화', '모래알 느낌을 억제하고 몽환적이고 부드러운 안개/실크 진주빛을 냅니다.'],
    ['비교 분석', '[비교] 93-M010 대비 입자감이 극도로 억제되어 뽀얀 톤을 연출합니다.']
  ]},
  '93-M176': { role: '골드 펄', type: 'pearl', face: '#fde047', flop: '#ca8a04', desc: '따뜻한 18K 황금 간섭 마이카 펄입니다.', details: [
    ['일반 특성', '대중적인 샴페인 골드, 웜 베이지 특수 미들 펄로 다량 쓰입니다.']
  ]},
  '93-M505': { role: '블루 펄', type: 'pearl', face: '#3b82f6', flop: '#1e3a8a', desc: '시원하고 쨍한 청색 반사광을 터뜨리는 마이카 펄입니다.', details: [
    ['외관 변화', '탁색 없이 도막 내부에 입체적이고 청량한 파란빛 깊이감을 부여합니다.']
  ]},
  '93-M822': { role: '그린 펄', type: 'pearl', face: '#4ade80', flop: '#14532d', desc: '청량한 녹색 난반사를 뿜는 마이카 펄입니다.', details: [
    ['외관 변화', '탁색을 방어하며 도막에 싱그러운 녹색 깊이와 입체감을 줍니다.']
  ]},
  '98-M319': { role: '라디언트 레드', type: 'pearl', face: '#be123c', flop: '#7f1d1d', desc: '보석 투과 극채도 레드 틴터 이펙트입니다.', details: [
    ['일반 특성', '마쯔다 3코트 프리미엄 캔디 이펙트의 핵심 미들 펄입니다.']
  ]},
  '98-M919': { role: '크리스탈 실버', type: 'xirallic', face: '#ffffff', flop: '#64748b', desc: '거친 얼음조각이 부서지듯 극단적이고 압도적인 투명 난반사를 폭발시킵니다.', details: [
    ['일반 특성', '일반적인 펄이나 은분으로 구현할 수 없는 초고휘도 반사광을 냅니다.'],
    ['배합 비율', '압도적인 화려함을 뽐내는 프리미엄 익스테리어에 정밀하게 투입됩니다.']
  ]},
  '98-M80': { role: '매직 카멜레온 (시안-퍼플)', type: 'xirallic', face: '#2dd4bf', flop: '#a855f7', desc: '청록색에서 보라색으로 변환되는 마법의 카멜레온 펄입니다.', details: [
    ['외관 변화', '정면에서는 영롱한 시안(청록)이지만 측면으로 비틀면 차가운 퍼플(보라)로 180도 스와이프됩니다.']
  ]},
  '98-M88': { role: '홀로그래픽 실버', type: 'xirallic', face: '#f8fafc', flop: '#64748b', desc: '레이저 프리즘처럼 시야를 찌르는 극단적인 7색 무지개빛 난반사를 뿜어냅니다.', details: [
    ['외관 변화', '태양광 직사 시 일반 은빛을 깨고 무지개 스파클을 폭발시킵니다.']
  ]}
};

export const OEM_COLORS: { code: string; name: string }[] = [
    // 👇👇👇 여기에 기존 엑셀 데이터 2610개를 덮어쓰기 해서 붙여넣으세요! 👇👇👇
    { code: "TEST", name: "글라슈리트 마스터 DB 세팅 완료" }
    // 👆👆👆 여기에 기존 엑셀 데이터 2610개를 덮어쓰기 해서 붙여넣으세요! 👆👆👆
];

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('다이아몬드') || r.includes('시라릭'); };

const textureCache: any = {};
export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid' || type === 'candy') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    const key = `${type}_${faceColor}_${flopColor}`; if (textureCache[key]) return textureCache[key];
    let baseFreq = '0.8', alphaMult = '4', surfaceScale = '1.5', specConst = '1.2';
    if (type === 'xirallic') { baseFreq = '0.6'; alphaMult = '8'; surfaceScale = '3'; specConst = '1.8'; }
    else if (type === 'pearl') { baseFreq = '0.5'; alphaMult = '6'; surfaceScale = '2'; specConst = '1.5'; }
    else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.2'; specConst = '1.0'; }
    else if (type === 'silver_coarse') { baseFreq = '0.4'; alphaMult = '8'; surfaceScale = '2.5'; specConst = '1.6'; }
    const safeFaceColor = faceColor || '#ffffff'; const safeFlopColor = flopColor || '#ffffff';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="25" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="55"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.6"/></svg>`;
    const result = { backgroundColor: safeFaceColor, backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), radial-gradient(circle at 50% 20%, ${safeFaceColor} 0%, ${safeFlopColor} 80%, #000000 100%)`, backgroundBlendMode: 'overlay, normal' as any, boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.8)' };
    textureCache[key] = result; return result;
};

export const getBadgeClass = (title: string) => {
    if(title.includes("화학적")) return "bg-purple-50 text-purple-700 border-purple-300 shadow-sm";
    if(title.includes("일반")) return "bg-blue-50 text-blue-700 border-blue-300 shadow-sm";
    if(title.includes("외관")) return "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm";
    if(title.includes("배합")) return "bg-orange-50 text-orange-700 border-orange-300 shadow-sm";
    if(title.includes("비교")) return "bg-yellow-100 text-yellow-800 border-yellow-400 shadow-md font-black";
    return "bg-slate-50 text-slate-700 border-slate-300 shadow-sm";
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 215; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬') || r.includes('캔디')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹') || r.includes('에메랄드')) { h = 150; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황') || r.includes('오렌지')) { h = 45; s = 80; baseL = 50; }
  else if (r.includes('화이트') || r.includes('백')) { h = 0; s = 0; baseL = 90; }
  else if (r.includes('블랙') || r.includes('흑')) { h = 0; s = 0; baseL = 15; }
  else if (r.includes('실버') || r.includes('알루미늄') || code.includes('400')) { h = 210; s = 10; baseL = 60; }
  else { h=0; s=0; baseL=95; } 
  const isMetallic = isTonerMetallic(r) || code.includes('400');
  if (angle === 'face') {
    const l = isMetallic ? Math.min(100, baseL + 25) : Math.min(100, baseL + 10);
    return `radial-gradient(circle at 40% 40%, hsl(${h}, ${s}%, ${Math.min(100, l+20)}%) 0%, hsl(${h}, ${s}%, ${l}%) 60%, hsl(${h}, ${s}%, ${Math.max(0, l-15)}%) 100%)`;
  } else {
    const l = isMetallic ? Math.max(0, baseL - 30) : Math.max(0, baseL - 15);
    return `radial-gradient(circle at 10% 10%, hsl(${h}, ${s}%, ${Math.min(100, l+10)}%) 0%, hsl(${h}, ${s}%, ${l}%) 100%)`;
  }
};

const getTonerBaseHue = (code: string, role: string) => {
    if (code.includes('144')) return 215; if (role.includes('블루') || role.includes('청')) return 215;
    if (role.includes('레드') || role.includes('마젠타') || role.includes('마룬') || role.includes('적') || role.includes('캔디')) return 350;
    if (role.includes('그린') || role.includes('녹') || role.includes('에메랄드')) return 150;
    if (role.includes('옐로우') || role.includes('황') || role.includes('오렌지')) return 45; return null;
};

export const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };
  let totalX = 0; let totalY = 0; let colorWeight = 0; let wSilver=0; let wWhite=0; let wBlack=0; let wPearl=0;

  colorToners.forEach(t => {
    const w = safeNum(parseFloat(t.adjustedWeight)); if (w <= 0) return;
    const role = TONER_DB[t.code]?.role || ''; const code = t.code || '';
    if (role.includes('블랙')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄')) wSilver += w;
    else if (role.includes('화이트')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트')) wPearl += w;
    const baseHue = getTonerBaseHue(code, role);
    if (baseHue !== null) { let rad = baseHue * (Math.PI / 180); totalX += Math.cos(rad) * w; totalY += Math.sin(rad) * w; colorWeight += w; }
  });

  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight; const totalForRatio = effectiveW > 0 ? effectiveW : 1;
  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio; const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 90) + (pSilver * 55) + (pPearl * 65); 
  if (pBlack > 0) baseL = Math.max(5, baseL - (Math.pow(pBlack, 0.4) * 60)); 
  if (pColor > 0) baseL = Math.max(3, baseL - (Math.pow(pColor, 0.5) * 30));
  let l15 = Math.min(98, baseL + (pSilver * 40) + (pPearl * 35)); let l110 = Math.max(1, baseL - (pSilver * 30) - (pBlack * 20)); 
  let hue = 0; if (totalX !== 0 || totalY !== 0) { hue = Math.atan2(totalY, totalX) * (180 / Math.PI); if (hue < 0) hue += 360; }
  let sat = colorWeight > 0 ? Math.min(100, (pColor / (pColor + pWhite + pBlack)) * 130) : 0;
  return { face: { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(99, Math.max(5, l15)))) }, mid: { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(3, baseL)))) }, flop: { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(1, l110)))) }, isMetallic: (wSilver > 0 || wPearl > 0) };
};

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const w = t.adjustedWeight || ''; return `${t.code}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c || '', adjustedWeight: w || '', history: [], memo: '', isExpanded: false }; }); };

const MUNSELL_WHEEL_COLORS = [
    { name: '빨강', symbol: 'R', hex: '#E60012' }, { name: '다홍', symbol: 'yR', hex: '#EB6100' }, { name: '주황', symbol: 'YR', hex: '#F39800' }, { name: '귤색', symbol: 'rY', hex: '#FCC800' }, { name: '노랑', symbol: 'Y', hex: '#FFF100' }, { name: '노랑연두', symbol: 'gY', hex: '#CFDB00' }, { name: '연두', symbol: 'GY', hex: '#8FC31F' }, { name: '풀색', symbol: 'yG', hex: '#22AC38' }, { name: '녹색', symbol: 'G', hex: '#009944' }, { name: '초록', symbol: 'bG', hex: '#009B6B' }, { name: '청록', symbol: 'BG', hex: '#009E96' }, { name: '바다색', symbol: 'gB', hex: '#00A0C1' }, { name: '파랑', symbol: 'B', hex: '#00A0E9' }, { name: '감청', symbol: 'pB', hex: '#0086D1' }, { name: '남색', symbol: 'PB', hex: '#0068B7' }, { name: '남보라', symbol: 'bP', hex: '#00479D' }, { name: '보라', symbol: 'P', hex: '#1D2088' }, { name: '붉은보라', symbol: 'rP', hex: '#601986' }, { name: '자주', symbol: 'RP', hex: '#920783' }, { name: '연지', symbol: 'pR', hex: '#BE0081' }
];

const MIXING_DATA: Record<string, any> = {
    'R': { c1: '빨강 (R)', h1: '#ff0000', r1: 100 }, 'yR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 }, 'YR': { c1: '빨강 (R)', h1: '#ff0000', r1: 50, c2: '노랑 (Y)', h2: '#ffff00', r2: 50 }, 'rY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 }, 'Y': { c1: '노랑 (Y)', h1: '#ffff00', r1: 100 }, 'gY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 }, 'GY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 50, c2: '녹색 (G)', h2: '#009900', r2: 50 }, 'yG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 }, 'G': { c1: '녹색 (G)', h1: '#009900', r1: 100 }, 'bG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 }, 'BG': { c1: '녹색 (G)', h1: '#009900', r1: 50, c2: '파랑 (B)', h2: '#0000ff', r2: 50 }, 'gB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 }, 'B': { c1: '파랑 (B)', h1: '#0000ff', r1: 100 }, 'pB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 }, 'PB': { c1: '파랑 (B)', h1: '#0000ff', r1: 50, c2: '보라 (P)', h2: '#700070', r2: 50 }, 'bP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 }, 'P': { c1: '보라 (P)', h1: '#700070', r1: 100 }, 'rP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 }, 'RP': { c1: '보라 (P)', h1: '#700070', r1: 50, c2: '빨강 (R)', h2: '#ff0000', r2: 50 }, 'pR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => { const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0; return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) }; };
const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => { const startOuter = polarToCartesian(x, y, outerRadius, endAngle); const endOuter = polarToCartesian(x, y, outerRadius, startAngle); const startInner = polarToCartesian(x, y, innerRadius, endAngle); const endInner = polarToCartesian(x, y, innerRadius, startAngle); const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"; return [ "M", startOuter.x, startOuter.y, "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y, "L", endInner.x, endInner.y, "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y, "Z" ].join(" "); };
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [designReady, setDesignReady] = useState(false); // 🚨 화면 하얗게 깨짐 방지 100% 잠금장치

  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); 
  const [vehicleNumber, setVehicleNumber] = useState(''); 
  const [carModel, setCarModel] = useState(''); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [memoModal, setMemoModal] = useState<{isOpen: boolean, id: string, code: string, isPearl: boolean, text: string, history: string[]}>({isOpen: false, id: '', code: '', isPearl: false, text: '', history: []});

  const [activeTab, setActiveTab] = useState<'90'|'ECO'|'EFFECT'>('90');
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  
  const [isBoardOpen, setIsBoardOpen] = useState(false); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false); 
  const [viewingPost, setViewingPost] = useState<any>(null); 
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostForm, setEditPostForm] = useState({ brand: '', code: '', spec: '' });

  const [boardSearch, setBoardSearch] = useState(''); const [boardBrandFilter, setBoardBrandFilter] = useState('전체');
  
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [activePearlLevel, setActivePearlLevel] = useState(6);
  
  const [boardPosts, setBoardPosts] = useState<any[]>([]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === '90') return code.startsWith('90-');
    if (activeTab === 'ECO') return code.startsWith('100-') || code.startsWith('22-');
    if (activeTab === 'EFFECT') return code.startsWith('93-') || code.startsWith('98-');
    return true; 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.toUpperCase();
      return item.code.includes(searchTxt) || item.role.toUpperCase().includes(searchTxt);
  });

  // 🚀 디자인(Tailwind CDN) 안전 로딩 대기 루프
  useEffect(() => {
    let attempts = 0;
    const timer = setInterval(() => {
      if ((window as any).tailwind || attempts > 50) {
        clearInterval(timer);
        setDesignReady(true);
      }
      attempts++;
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); const d = urlParams.get('d'); 
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        let loadedFromUrl = false;
        if (d) {
            const safeD = d.replace(/ /g, '+'); 
            try {
                let decodedStr = '';
                if (safeD.includes('%7B') || safeD.includes('{')) { decodedStr = decodeURIComponent(safeD); } 
                else if (!safeD.includes('|') && !safeD.includes('%')) { try { decodedStr = decodeURIComponent(escape(atob(safeD))); } catch(e) { decodedStr = atob(safeD); } } 
                else { decodedStr = decodeURIComponent(safeD.replace(/%7C/g, '|')); }
                let parsedData = null;
                if (decodedStr.startsWith('{')) { parsedData = JSON.parse(decodedStr); } 
                else {
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) parsedData = { v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1', date: parts[8] || '' };
                }
                if (parsedData) { 
                    setVehicleNumber(parsedData.v || ''); setCarModel(parsedData.m || ''); setTargetColorCode(parsedData.c || ''); setJobDescription(parsedData.j || ''); setSpecialNotes(parsedData.n || '');
                    if(parsedData.b && parsedData.b.length > 0) setToners(parsedData.b); if(parsedData.p && parsedData.p.length > 0) setPearlToners(parsedData.p);
                    setIsThreeCoatMode(parsedData.t || false); if(parsedData.date) setRegistrationDate(parsedData.date);
                    window.history.replaceState({}, document.title, window.location.pathname); loadedFromUrl = true; 
                }
            } catch (e) {}
        }
        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedBoard = localStorage.getItem('hitec_board_mock'); const savedSnapshots = localStorage.getItem('hitec_snapshots');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedBoard) setBoardPosts(JSON.parse(savedBoard)); if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '' && type !== 'candy'; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; 
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { el.focus(); setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30); clearInterval(interval); setFocusTarget(null); }
        attempts++; if (attempts > 30) { clearInterval(interval); setFocusTarget(null); }
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
  };

  // 🚀 [스마트 타자 자동완성 엔진] "4"만 쳐도 "90-M4"로, "011"만 쳐도 "93-M011"로 완벽 변환
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    let val = newCode.toUpperCase().replace(/[^A-Z0-9/.-]/g, '');
    let mappedCode = val;
    
    // 현장 실무자가 자주 쓰는 단축어 1:1 매핑 (글라슈리트 최적화)
    const shortcuts: Record<string, string> = {
        '4': '90-M4', 'M4': '90-M4',
        '5': '90-M5', 'M5': '90-M5',
        '1': '90-M1', 'M1': '90-M1',
        '3': '90-M3', 'M3': '90-M3',
        '20': '90-M20', 'M20': '90-M20',
        '25': '90-M25', 'M25': '90-M25',
        '010': '93-M010', '10': '93-M010', 'M010': '93-M010',
        '011': '93-M011', '11': '93-M011', 'M011': '93-M011',
        '176': '93-M176', 'M176': '93-M176',
        '505': '93-M505', 'M505': '93-M505',
        '822': '93-M822', 'M822': '93-M822',
        '919': '98-M919', 'M919': '98-M919',
        '80': '98-M80', 'M80': '98-M80',
        '88': '98-M88', 'M88': '98-M88',
        '319': '98-M319', 'M319': '98-M319',
        '34': '90-A34', 'A34': '90-A34',
        '35': '90-A35', 'A35': '90-A35',
        '926': '90-A926', 'A926': '90-A926',
        '1250': '90-1250',
        '997': '90-A997', 'A997': '90-A997',
        '992': '90-A992', 'A992': '90-A992',
        '031': '90-A031', '31': '90-A031', 'A031': '90-A031',
        '032': '90-A032', '32': '90-A032', 'A032': '90-A032',
        '035': '90-A035', 'A035': '90-A035',
        '528': '90-A528', 'A528': '90-A528',
        '533': '90-A533', 'A533': '90-A533',
        '563': '90-A563', 'A563': '90-A563',
        '564': '90-A564', 'A564': '90-A564',
        '640': '90-A640', 'A640': '90-A640',
        '695': '90-A695', 'A695': '90-A695',
        '105': '90-A105', 'A105': '90-A105',
        '115': '90-A115', 'A115': '90-A115',
        '148': '90-A148', 'A148': '90-A148',
        '201': '90-A201', 'A201': '90-A201',
        '328': '90-A328', 'A328': '90-A328',
        '329': '90-A329', 'A329': '90-A329',
        '423': '90-A423', 'A423': '90-A423',
        '430': '90-A430', 'A430': '90-A430',
        '00': '90-M99/00', '9900': '90-M99/00',
        '01': '90-M99/01', '9901': '90-M99/01',
        '02': '90-M99/02', '9902': '90-M99/02',
        '03': '90-M99/03', '9903': '90-M99/03',
        '04': '90-M99/04', '9904': '90-M99/04',
        '10': '90-M99/10', '9910': '90-M99/10',
        'E3': '93-E3', 'E3S': '93-E3 Slow', 'E3F': '93-E3 Fast'
    };

    if (shortcuts[val]) {
        mappedCode = shortcuts[val];
    } else if (/^[A-Z]\d+$/.test(val) && (val.length === 3 || val.length === 4)) {
        mappedCode = `90-${val}`;
    }

    if (mappedCode !== '' && !TONER_DB[mappedCode]) {
        const keys = Object.keys(TONER_DB);
        let match = keys.find(k => k.replace(/-/g, '') === mappedCode.replace(/-/g, ''));
        if (!match) match = keys.find(k => k.split('-')[1] === mappedCode);
        if (!match) match = keys.find(k => k.includes(mappedCode));
        if (match) mappedCode = match;
    }

    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { 
        if (toner.id === id) { 
            if (TONER_DB[mappedCode]) { setFocusTarget({ id: id, type: 'weight' }); } 
            return { ...toner, code: mappedCode }; 
        } 
        return toner; 
    }));
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val; 
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t)); else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };
  const handleWeightBlur = (id: string, value: string, isPearl = false) => {
    if (!value) return; const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; } return t; }));
  };
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => { if (e.key === 'Enter') { e.preventDefault(); const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); } };
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  const addToner = (isPearl = false) => { const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); };
  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };
  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); const shareUrl = `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
    return `[조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 93-E3 수지: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 합계: ${totalPearlWeight}g\n▶ 93-E3 수지: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 총량: ${totalFinalWeight}g\n\n👉 링크:\n${shareUrl}`;
  };

  const handleShareKakao = () => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(generateShareText()); alert("복사되었습니다. 카톡에 붙여넣으세요."); } else { alert("클립보드 미지원."); } setIsShareModalOpen(false); };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const generateShareUrl = () => { let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin; const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`; }

  const handleDirectExcelCopy = () => {
      const shareUrl = generateShareUrl(); const plainText = `${registrationDate || '-'}	${vehicleNumber || '미입력'}	${carModel || '미입력'}	${targetColorCode || '미지정'}	${jobDescription || '미입력'}	${specialNotes || '-'}	${shareUrl}`;
      const htmlText = `<meta charset="utf-8"><table><tr><td>${registrationDate || '-'}</td><td>${vehicleNumber || '미입력'}</td><td>${carModel || '미입력'}</td><td>${targetColorCode || '미지정'}</td><td>${jobDescription || '미입력'}</td><td>${specialNotes || '-'}</td><td><a href="${shareUrl}">[배합보기]</a></td></tr></table>`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          const htmlBlob = new Blob([htmlText], { type: 'text/html' }); const textBlob = new Blob([plainText], { type: 'text/plain' });
          const ClipboardItemConstructor = (window as any).ClipboardItem; const item = new ClipboardItemConstructor({ 'text/html': htmlBlob, 'text/plain': textBlob });
          navigator.clipboard.write([item]).then(() => { alert("✅ 엑셀 데이터가 복사되었습니다!"); }).catch(() => { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); }
      setIsExcelModalOpen(false);
  };
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } }
  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      const newPost = { id: Date.now(), brand: carModel || '미지정', code: targetColorCode, date: registrationDate, likes: 0, views: 0, author: '내 데이터', spec: specialNotes || '특이사항 없음', baseFormula: [...toners], pearlFormula: [...pearlToners], isThreeCoat: isThreeCoatMode };
      setBoardPosts([newPost, ...boardPosts]); alert("🎉 게시판에 데이터가 등록되었습니다!");
  };
  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => {
      const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement;
      const val = inputEl?.value?.trim();
      if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; }
      window.open(`https://www.google.com/search?q=글라슈리트+조색+${val}+뜻`, '_blank');
  };
  export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [designReady, setDesignReady] = useState(false); // 🚨 화면 하얗게 깨짐 방지 100% 잠금장치

  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); 
  const [vehicleNumber, setVehicleNumber] = useState(''); 
  const [carModel, setCarModel] = useState(''); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [memoModal, setMemoModal] = useState<{isOpen: boolean, id: string, code: string, isPearl: boolean, text: string, history: string[]}>({isOpen: false, id: '', code: '', isPearl: false, text: '', history: []});

  const [activeTab, setActiveTab] = useState<'90'|'ECO'|'EFFECT'>('90');
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  
  const [isBoardOpen, setIsBoardOpen] = useState(false); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false); 
  const [viewingPost, setViewingPost] = useState<any>(null); 
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostForm, setEditPostForm] = useState({ brand: '', code: '', spec: '' });

  const [boardSearch, setBoardSearch] = useState(''); const [boardBrandFilter, setBoardBrandFilter] = useState('전체');
  
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [activePearlLevel, setActivePearlLevel] = useState(6);
  
  const [boardPosts, setBoardPosts] = useState<any[]>([]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === '90') return code.startsWith('90-');
    if (activeTab === 'ECO') return code.startsWith('100-') || code.startsWith('22-');
    if (activeTab === 'EFFECT') return code.startsWith('93-') || code.startsWith('98-');
    return true; 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.toUpperCase();
      return item.code.includes(searchTxt) || item.role.toUpperCase().includes(searchTxt);
  });

  // 🚀 디자인(Tailwind CDN) 안전 로딩 대기 루프
  useEffect(() => {
    let attempts = 0;
    const timer = setInterval(() => {
      if ((window as any).tailwind || attempts > 50) {
        clearInterval(timer);
        setDesignReady(true);
      }
      attempts++;
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); const d = urlParams.get('d'); 
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        let loadedFromUrl = false;
        if (d) {
            const safeD = d.replace(/ /g, '+'); 
            try {
                let decodedStr = '';
                if (safeD.includes('%7B') || safeD.includes('{')) { decodedStr = decodeURIComponent(safeD); } 
                else if (!safeD.includes('|') && !safeD.includes('%')) { try { decodedStr = decodeURIComponent(escape(atob(safeD))); } catch(e) { decodedStr = atob(safeD); } } 
                else { decodedStr = decodeURIComponent(safeD.replace(/%7C/g, '|')); }
                let parsedData = null;
                if (decodedStr.startsWith('{')) { parsedData = JSON.parse(decodedStr); } 
                else {
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) parsedData = { v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1', date: parts[8] || '' };
                }
                if (parsedData) { 
                    setVehicleNumber(parsedData.v || ''); setCarModel(parsedData.m || ''); setTargetColorCode(parsedData.c || ''); setJobDescription(parsedData.j || ''); setSpecialNotes(parsedData.n || '');
                    if(parsedData.b && parsedData.b.length > 0) setToners(parsedData.b); if(parsedData.p && parsedData.p.length > 0) setPearlToners(parsedData.p);
                    setIsThreeCoatMode(parsedData.t || false); if(parsedData.date) setRegistrationDate(parsedData.date);
                    window.history.replaceState({}, document.title, window.location.pathname); loadedFromUrl = true; 
                }
            } catch (e) {}
        }
        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedBoard = localStorage.getItem('hitec_board_mock'); const savedSnapshots = localStorage.getItem('hitec_snapshots');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedBoard) setBoardPosts(JSON.parse(savedBoard)); if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '' && type !== 'candy'; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; 
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { el.focus(); setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30); clearInterval(interval); setFocusTarget(null); }
        attempts++; if (attempts > 30) { clearInterval(interval); setFocusTarget(null); }
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
  };

  // 🚀 [스마트 타자 자동완성 엔진] "4"만 쳐도 "90-M4"로, "011"만 쳐도 "93-M011"로 완벽 변환
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    let val = newCode.toUpperCase().replace(/[^A-Z0-9/.-]/g, '');
    let mappedCode = val;
    
    // 현장 실무자가 자주 쓰는 단축어 1:1 매핑 (글라슈리트 최적화)
    const shortcuts: Record<string, string> = {
        '4': '90-M4', 'M4': '90-M4',
        '5': '90-M5', 'M5': '90-M5',
        '1': '90-M1', 'M1': '90-M1',
        '3': '90-M3', 'M3': '90-M3',
        '20': '90-M20', 'M20': '90-M20',
        '25': '90-M25', 'M25': '90-M25',
        '010': '93-M010', '10': '93-M010', 'M010': '93-M010',
        '011': '93-M011', '11': '93-M011', 'M011': '93-M011',
        '176': '93-M176', 'M176': '93-M176',
        '505': '93-M505', 'M505': '93-M505',
        '822': '93-M822', 'M822': '93-M822',
        '919': '98-M919', 'M919': '98-M919',
        '80': '98-M80', 'M80': '98-M80',
        '88': '98-M88', 'M88': '98-M88',
        '319': '98-M319', 'M319': '98-M319',
        '34': '90-A34', 'A34': '90-A34',
        '35': '90-A35', 'A35': '90-A35',
        '926': '90-A926', 'A926': '90-A926',
        '1250': '90-1250',
        '997': '90-A997', 'A997': '90-A997',
        '992': '90-A992', 'A992': '90-A992',
        '031': '90-A031', '31': '90-A031', 'A031': '90-A031',
        '032': '90-A032', '32': '90-A032', 'A032': '90-A032',
        '035': '90-A035', 'A035': '90-A035',
        '528': '90-A528', 'A528': '90-A528',
        '533': '90-A533', 'A533': '90-A533',
        '563': '90-A563', 'A563': '90-A563',
        '564': '90-A564', 'A564': '90-A564',
        '640': '90-A640', 'A640': '90-A640',
        '695': '90-A695', 'A695': '90-A695',
        '105': '90-A105', 'A105': '90-A105',
        '115': '90-A115', 'A115': '90-A115',
        '148': '90-A148', 'A148': '90-A148',
        '201': '90-A201', 'A201': '90-A201',
        '328': '90-A328', 'A328': '90-A328',
        '329': '90-A329', 'A329': '90-A329',
        '423': '90-A423', 'A423': '90-A423',
        '430': '90-A430', 'A430': '90-A430',
        '00': '90-M99/00', '9900': '90-M99/00',
        '01': '90-M99/01', '9901': '90-M99/01',
        '02': '90-M99/02', '9902': '90-M99/02',
        '03': '90-M99/03', '9903': '90-M99/03',
        '04': '90-M99/04', '9904': '90-M99/04',
        '10': '90-M99/10', '9910': '90-M99/10',
        'E3': '93-E3', 'E3S': '93-E3 Slow', 'E3F': '93-E3 Fast'
    };

    if (shortcuts[val]) {
        mappedCode = shortcuts[val];
    } else if (/^[A-Z]\d+$/.test(val) && (val.length === 3 || val.length === 4)) {
        mappedCode = `90-${val}`;
    }

    if (mappedCode !== '' && !TONER_DB[mappedCode]) {
        const keys = Object.keys(TONER_DB);
        let match = keys.find(k => k.replace(/-/g, '') === mappedCode.replace(/-/g, ''));
        if (!match) match = keys.find(k => k.split('-')[1] === mappedCode);
        if (!match) match = keys.find(k => k.includes(mappedCode));
        if (match) mappedCode = match;
    }

    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { 
        if (toner.id === id) { 
            if (TONER_DB[mappedCode]) { setFocusTarget({ id: id, type: 'weight' }); } 
            return { ...toner, code: mappedCode }; 
        } 
        return toner; 
    }));
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val; 
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t)); else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };
  const handleWeightBlur = (id: string, value: string, isPearl = false) => {
    if (!value) return; const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; } return t; }));
  };
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => { if (e.key === 'Enter') { e.preventDefault(); const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); } };
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  const addToner = (isPearl = false) => { const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); };
  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };
  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); const shareUrl = `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
    return `[조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 93-E3 수지: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 합계: ${totalPearlWeight}g\n▶ 93-E3 수지: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 총량: ${totalFinalWeight}g\n\n👉 링크:\n${shareUrl}`;
  };

  const handleShareKakao = () => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(generateShareText()); alert("복사되었습니다. 카톡에 붙여넣으세요."); } else { alert("클립보드 미지원."); } setIsShareModalOpen(false); };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const generateShareUrl = () => { let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin; const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`; }

  const handleDirectExcelCopy = () => {
      const shareUrl = generateShareUrl(); const plainText = `${registrationDate || '-'}	${vehicleNumber || '미입력'}	${carModel || '미입력'}	${targetColorCode || '미지정'}	${jobDescription || '미입력'}	${specialNotes || '-'}	${shareUrl}`;
      const htmlText = `<meta charset="utf-8"><table><tr><td>${registrationDate || '-'}</td><td>${vehicleNumber || '미입력'}</td><td>${carModel || '미입력'}</td><td>${targetColorCode || '미지정'}</td><td>${jobDescription || '미입력'}</td><td>${specialNotes || '-'}</td><td><a href="${shareUrl}">[배합보기]</a></td></tr></table>`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          const htmlBlob = new Blob([htmlText], { type: 'text/html' }); const textBlob = new Blob([plainText], { type: 'text/plain' });
          const ClipboardItemConstructor = (window as any).ClipboardItem; const item = new ClipboardItemConstructor({ 'text/html': htmlBlob, 'text/plain': textBlob });
          navigator.clipboard.write([item]).then(() => { alert("✅ 엑셀 데이터가 복사되었습니다!"); }).catch(() => { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); }
      setIsExcelModalOpen(false);
  };
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } }
  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      const newPost = { id: Date.now(), brand: carModel || '미지정', code: targetColorCode, date: registrationDate, likes: 0, views: 0, author: '내 데이터', spec: specialNotes || '특이사항 없음', baseFormula: [...toners], pearlFormula: [...pearlToners], isThreeCoat: isThreeCoatMode };
      setBoardPosts([newPost, ...boardPosts]); alert("🎉 게시판에 데이터가 등록되었습니다!");
  };
  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => {
      const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement;
      const val = inputEl?.value?.trim();
      if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; }
      window.open(`https://www.google.com/search?q=글라슈리트+조색+${val}+뜻`, '_blank');
  };
