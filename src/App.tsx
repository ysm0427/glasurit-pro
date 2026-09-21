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
    ['일반 특성', '딥 블랙 솔리드 차량의 뼈대 및 다크 남색, 쥐색 메탈릭의 톤다운 핵심 베이스입니다.'],
    ['비교 분석', '[비교] 범용 블랙이 은분과 섞일 때 탁해지는 반면, A926은 맑고 깨끗하게 명도만 수직으로 떨어뜨립니다.']
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
  '90-M99/00': { role: '수퍼 파인 알루미늄', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', desc: '입자가 보이지 않을 정도로 정제된 극미세 알루미늄 안료입니다.', details: [
    ['화학적 특성', '금속 입자를 극한으로 정제하여 난반사를 억제한 초미립 렌티큘러 실버 페이스트입니다.'],
    ['일반 특성', '입자감이 완전히 사라져야 하는 최고급 수입차의 하이퍼 실버 도장에 사용됩니다.'],
    ['외관 변화', '정면은 액체 거울(Liquid Metal)처럼 매끄럽고 눈부시지만, 측면은 묵직한 솔리드 그레이로 차분하게 떨어집니다.'],
    ['배합 비율', '하이엔드 미립자 실버 조색 시 메인 베이스로 다량 배합됩니다.'],
    ['비교 분석', '[경고] 입자가 극도로 고와서 두껍게 웻 코트를 치면 100% 뭉치므로(Clumping), 거리를 띄운 드롭 코트가 생명입니다.']
  ]},
  '90-M99/01': { role: '엑스트라 파인 알루미늄', type: 'silver_fine', face: '#f1f5f9', flop: '#475569', desc: '매우 고운 실버로, 은은한 금속광을 내며 측면이 부드러운 안료입니다.', details: [
    ['화학적 특성', '튀는 난반사를 억제하도록 표면이 균일하게 컷팅된 고품질 미립자 구조입니다.'],
    ['일반 특성', '최신 국산 및 수입 차량의 입자감이 튀지 않는 고휘도 차분한 미립 실버톤에 쓰입니다.'],
    ['외관 변화', '거친 느낌 없이 도막 전체에 은은하고 고급스러운 금속 윤기를 형성합니다.'],
    ['배합 비율', '일반적인 미세 메탈릭 베이스 조색 시 메인 뼈대로 다량 투입됩니다.'],
    ['비교 분석', '[비교] 00번(수퍼파인)과 02번(일반은분) 사이의 절묘한 간극을 메우는 텍스처로 모틀링 제어가 수월합니다.']
  ]},
  '90-M99/02': { role: '파인 알루미늄', type: 'silver_fine', face: '#e2e8f0', flop: '#334155', desc: '가장 스탠다드하게 광범위하게 쓰이는 중간 고운 입자 은분입니다.', details: [
    ['화학적 특성', '빛을 가장 안정적이고 둥글게 산란시키는 중간 이하의 코발트 컷팅 입자 구조입니다.'],
    ['일반 특성', '대중적인 양산차 실버 메탈릭 및 밝은 쥐색 메탈릭의 근간이 되는 현장 범용 은분입니다.'],
    ['외관 변화', '과하게 빛나지도 칙칙하지도 않은 익숙하고 편안한 스탠다드 실버감을 선사합니다.'],
    ['배합 비율', '범용 실버 조색 데이터의 핵심 안료로 레시피에서 가장 큰 중량 비중을 차지합니다.'],
    ['비교 분석', '[주의사항] 특수 마이카 펄(진주)과 혼용 시 이 은분의 금속 스파클이 진주광을 억제하여 펄감이 묻힐 수 있습니다.']
  ]},
  '90-M99/03': { role: '미디엄 알루미늄', type: 'silver_coarse', face: '#cbd5e1', flop: '#1e293b', desc: '정면광과 측면광의 명암 대비(Contrast)가 가장 뚜렷한 중간 입자 은분입니다.', details: [
    ['화학적 특성', '빛을 강하게 반사시키는 렌티큘러 입자 특성이 본격적으로 나타나는 중간 굵기 알루미늄입니다.'],
    ['일반 특성', '명암 대비가 뚜렷하고 입체감이 살아야 하는 스포티한 다크 그레이, 건메탈 계열에 최적화되었습니다.'],
    ['외관 변화', '정면은 잘게 부순 은박지처럼 화사하게 터지고, 측면은 그림자가 묵직하게 지며 차량 굴곡을 극대화합니다.'],
    ['배합 비율', '남성적이고 단단한 느낌을 주는 어두운 메탈릭 컬러 조색 시 메인 베이스로 활약합니다.'],
    ['비교 분석', '[주의사항] 금속 특유의 찌르는 스파클이 강해 부드러운 파스텔톤에 들어가면 입자가 지저분하게 둥둥 떠 보입니다.']
  ]},
  '90-M99/04': { role: '라지 알루미늄', type: 'silver_coarse', face: '#94a3b8', flop: '#0f172a', desc: '매우 굵은 반사광을 발현하는 조대(Coarse) 알루미늄 입자입니다.', details: [
    ['화학적 특성', '면적이 넓고 불규칙하게 컷팅된 초대형 금속 입자로 가장 거친 난반사를 유도합니다.'],
    ['일반 특성', '입자감이 도드라지는 대형 SUV의 특수 다크 실버 및 커스텀 튜닝카 베이스에 사용됩니다.'],
    ['외관 변화', '직사광선에서 거친 모래알이나 쇳조각이 부서지듯 야성적이고 화려한 스파클을 폭발시킵니다.'],
    ['배합 비율', '입자가 무거워 도료 침전이 빠르므로 스프레이 직전 교반을 확실히 한 뒤 포인트 안료로 첨가합니다.'],
    ['비교 분석', '[경고] 입자 사이 빈 공간이 많아 자체 은폐력이 현저히 떨어지므로 바닥 서페이서 색상을 완벽히 맞춰야 얼룩이 안 비칩니다.']
  ]},
  '90-M99/10': { role: '실버 수퍼 파인', type: 'silver_fine', face: '#ffffff', flop: '#94a3b8', desc: '고휘도의 맑고 밝은 명도를 극한으로 유지하는 극미립자 특수 은분입니다.', details: [
    ['화학적 특성', '탁색 불순물을 완전히 제거한 고휘도 극미립 렌티큘러 컷팅 공법으로 제작되었습니다.'],
    ['일반 특성', '벤츠, 렉서스 등의 최고급 맑은 크롬톤 실버 메탈릭 및 맑은 고채도 캔디 하도에 쓰입니다.'],
    ['외관 변화', '측면으로 누워도 칙칙하게 탁해지지 않고 정/측면 모두 맑은 백색 크롬 수준의 밝기를 유지합니다.'],
    ['배합 비율', '모틀링 제어를 위해 90-M5 블렌딩 클리어와 충분히 믹싱하여 아주 얇게 분산 도포해야 합니다.'],
    ['비교 분석', '[경고] 반사율이 너무 예리해서 하도 샌딩 기스나 서페이서 단차를 현미경처럼 100% 드러냅니다. 완벽한 평탄화가 필수입니다.']
  ]},
  '90-A528': { role: '메인 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', desc: '가장 중립적인 스탠다드 청색 원색입니다.', details: [
    ['화학적 특성', '파란색 파장의 정중앙에 위치하여 웜/쿨 어느 쪽으로도 치우치지 않는 퓨어 블루 안료입니다.'],
    ['일반 특성', '대다수 솔리드 블루 및 범용 블루 메탈릭 조색 시 기준점이 되는 핵심 뼈대입니다.'],
    ['외관 변화', '정면의 맑은 파란색이 측면으로 갈수록 붉은 멍울 없이 차분하고 정직하게 톤다운됩니다.'],
    ['배합 비율', '청색 계열 조색 시 가장 다량으로 배합되어 전체적인 파란색 톤의 도화지 역할을 합니다.'],
    ['비교 분석', '[경고] 화이트 펄 안료와 잘못 혼합되면 블루의 맑은 채도가 급감하고 탁한 파스텔톤으로 뭉개집니다.']
  ]},
  '90-A533': { role: '사파이어 블루', type: 'solid', face: '#1d4ed8', flop: '#1e40af', desc: '채도가 극도로 높고 영롱한 보석빛을 내는 하이엔드 블루 안료입니다.', details: [
    ['화학적 특성', '빛 투과율을 극대화하여 메탈릭 입자와 결합 시 이중 반사를 일으키는 특수 고채도 구조입니다.'],
    ['일반 특성', '포르쉐 등 시선을 한눈에 사로잡아야 하는 고성능 스포츠카의 고채도 특수 블루 도장용입니다.'],
    ['외관 변화', '빛을 뿜어내는 네온사인처럼 일반 블루가 범접할 수 없는 깊고 선명한 압도적 반사율을 자랑합니다.'],
    ['배합 비율', '맑은 은분과 결합하여 정면광의 시린 파란색을 한계치까지 끌어올릴 때 다량 씁니다.'],
    ['비교 분석', '[경고] 색이 너무 화려하게 튀어, 일반적이고 차분한 세단 색상 조색에 잘못 섞으면 톤이 가벼워지고 겉돌게 됩니다.']
  ]},
  '90-A563': { role: '미드 블루', type: 'solid', face: '#3b82f6', flop: '#1e3a8a', desc: '명도가 살짝 억제된 차분한 중간 톤의 솔리드 청색입니다.', details: [
    ['화학적 특성', '블루 파장에 미세한 무채색 입자가 화학적으로 결합되어 채도 폭발을 막아줍니다.'],
    ['일반 특성', '무게감 있는 다크 블루 차량 및 어두운 네이비 메탈릭의 기본 하도에 주로 사용됩니다.'],
    ['외관 변화', '블랙을 타지 않고도 자연스럽게 블루 본연의 깊이감 있고 진중한 섀도우를 형성합니다.'],
    ['배합 비율', '고채도 블루의 색감이 너무 날뛸 때, 탁해지는 블랙 대신 투입하여 색감을 차분하게 톤다운시킬 때 씁니다.'],
    ['비교 분석', '[주의사항] 명도가 기본적으로 낮으므로 다량 배합 시 전체 색상이 다소 칙칙하고 무거워지는 탁색 위험이 존재합니다.']
  ]},
  '90-A564': { role: '라이트 블루', type: 'solid', face: '#7dd3fc', flop: '#0284c7', desc: '자체적으로 밝고 시원한 아이스 하늘색 원색입니다.', details: [
    ['화학적 특성', '화이트 안료 개입 없이 분자 구조 자체로 밝은 청색광을 튕겨내는 특수 블루 틴터입니다.'],
    ['일반 특성', '투명한 파스텔톤 솔리드 블루, 아이스 블루 계열 도장에 뼈대로 사용됩니다.'],
    ['외관 변화', '탁하지 않고 청명한 가을 하늘처럼 시원하고 맑은 톤을 도막에 부여합니다.'],
    ['배합 비율', '스카이 블루 계열 조색 시 메인 베이스로 투입되며, 백색 안료와 섞어 파스텔톤을 조절합니다.'],
    ['비교 분석', '[테크닉] 은폐력이 약해 화이트 하도가 필수이며, 블랙 서페이서를 쓰면 색이 우중충하게 죽어버립니다.']
  ]},
  '90-A640': { role: '스프링 그린', type: 'solid', face: '#84cc16', flop: '#4d7c0f', desc: '명도와 채도가 매우 높은 맑고 싱그러운 라임색 안료입니다.', details: [
    ['화학적 특성', '노란 파장과 녹색 파장이 최적의 비율로 결합되어 눈이 시릴 정도의 맑은 발색을 냅니다.'],
    ['일반 특성', '람보르기니 등 고채도 라임색 스포츠카 솔리드 및 특수 에메랄드 메탈릭 도장용입니다.'],
    ['외관 변화', '칙칙함 없이 투명하고 맑은 봄날 새싹처럼 화사하고 쨍한 질감을 도막에 부여합니다.'],
    ['배합 비율', '옐로우 틴터와 혼용하여 형광빛에 가까운 고채도 녹색을 연출할 때 메인으로 다량 배합합니다.'],
    ['비교 분석', '[경고] 이 안료에 블루 틴터를 잘못 혼용하면 예상치 못한 탁한 청록색(시체색)으로 스와이프되며 톤이 완전히 망가집니다.']
  ]},
  '90-A695': { role: '메인 그린', type: 'solid', face: '#15803d', flop: '#14532d', desc: '짙고 안정적인 가장 스탠다드한 기준점 녹색 안료입니다.', details: [
    ['화학적 특성', '노란기나 푸른기로 쏠리지 않은 정직하고 깊은 녹색 파장을 흡수/반사합니다.'],
    ['일반 특성', '브리티시 레이싱 그린 등 고전적이고 클래식한 솔리드 딥 그린 및 다크 펄의 하도입니다.'],
    ['외관 변화', '가볍게 뜨지 않고 색의 중심을 무겁고 단단하게 잡아주는 깊은 숲속 질감을 냅니다.'],
    ['배합 비율', '녹색 계열 베이스 바탕색 구축 시 가장 광범위하게 쓰이는 메인 안료입니다.'],
    ['비교 분석', '[주의사항] 단독으로 과량 사용 시 발색이 다소 어둡고 진중하게 발현되므로, 맑은 색상 조색 시엔 투입량에 주의해야 합니다.']
  ]},
  '90-A105': { role: '오커 (황토)', type: 'solid', face: '#b45309', flop: '#451a03', desc: '은폐력이 매우 강하고 무거운 전형적인 황토색/흙빛 안료입니다.', details: [
    ['화학적 특성', '산화철 기반의 무기질 안료로 빛 투과를 강하게 차단하는 불투명 구조입니다.'],
    ['일반 특성', '구형 베이지, 브론즈 컬러의 솔리드 하도 및 빈티지한 탁색 베이스 조색용입니다.'],
    ['외관 변화', '맑은 색상을 묵직하고 차분하게 짓누르며 도막 전체를 에이징 된 흙빛으로 다운시킵니다.'],
    ['배합 비율', '차분하고 진중한 웜톤 계열 조색 시 명도를 낮추는 용도로 소량씩 조심스럽게 씁니다.'],
    ['비교 분석', '[경고] 채도를 급격히 떨어뜨리므로 투명감이 생명인 맑은 골드 펄이나 화사한 메탈릭 조색 시엔 절대 투입 금지입니다.']
  ]},
  '90-A115': { role: '메인 옐로우', type: 'solid', face: '#eab308', flop: '#a16207', desc: '불순물이 섞이지 않은 가장 맑고 선명한 표준 노란색입니다.', details: [
    ['화학적 특성', '적색이나 청색 간섭을 차단한 고순도 퓨어 옐로우 유기 안료입니다.'],
    ['일반 특성', '스쿨버스, 스포츠카 등 눈길을 확 사로잡는 밝은 명시성의 솔리드 노랑 원톤 뼈대입니다.'],
    ['외관 변화', '눈부시고 쨍한 순수 옐로우 반사를 통해 왜곡 없이 화사한 웜톤 광채를 발산합니다.'],
    ['배합 비율', '모든 옐로우/오렌지 조색 시 가장 기본이 되는 메인 베이스로 대량 배합됩니다.'],
    ['비교 분석', '[경고] 순수 노란색 특성상 자체 은폐력이 매우 약하므로 반드시 화이트 서페이서(하도) 처리가 선행되어야 칙칙해지지 않습니다.']
  ]},
  '90-A148': { role: '레몬 골드', type: 'solid', face: '#fde047', flop: '#ca8a04', desc: '푸른빛이 살짝 감도는 매우 밝고 투명한 레몬 옐로우입니다.', details: [
    ['화학적 특성', '적색 파장을 완벽히 배제하고 미세한 녹/청 파장을 결합시킨 서늘한 황색 유기 안료입니다.'],
    ['일반 특성', '형광 옐로우 계열의 고채도 스포츠 색상 및 맑은 하이퍼 실버의 레몬 틴팅 전용입니다.'],
    ['외관 변화', '눈이 시리도록 밝고 투명한 형광 레몬빛 필터를 통해 도막을 차갑고 예리하게 튜닝합니다.'],
    ['배합 비율', '시원하고 맑은 느낌의 노란색을 낼 때 칙칙해지는 것을 막기 위해 메인 베이스로 투입합니다.'],
    ['비교 분석', '[경고] 붉은기(웜톤)와는 완벽한 상극입니다. 레드 안료와 단 1방울만 섞여도 형광빛이 즉각 소실되고 톤이 망가집니다.']
  ]},
  '90-A201': { role: '라이트 오렌지', type: 'solid', face: '#f97316', flop: '#c2410c', desc: '레드와 옐로우의 경계에 있는 눈부시게 밝은 귤색 안료입니다.', details: [
    ['화학적 특성', '옐로우 베이스에 적색 파장을 폭발적으로 결합시킨 웜톤 극채도 유기 안료입니다.'],
    ['일반 특성', '포르쉐 파파야 오렌지 등 시선을 끄는 고채도 귤색 솔리드 및 포인트 스포츠카 전용입니다.'],
    ['외관 변화', '어둡거나 탁하지 않고 극도로 화사하며 불타오르는 듯한 역동적인 생동감을 부여합니다.'],
    ['배합 비율', '강렬한 레드나 옐로우 조색 시 웜톤 채도를 끝까지 끌어올리기 위한 조미료로 다량 배합됩니다.'],
    ['비교 분석', '[경고] 채도가 억세고 강해, 차분한 세단 컬러에 미량만 튀어 들어가도 톤이 형광펜처럼 떠버리므로 교반 시 붓끝 관리가 필수입니다.']
  ]},
  '90-A328': { role: '스탠다드 레드', type: 'solid', face: '#dc2626', flop: '#991b1b', desc: '가장 표준적이고 정직한 스탠다드 적색 솔리드입니다.', details: [
    ['화학적 특성', '오렌지 파장이나 마젠타 파장으로 치우침이 없는 완벽한 정중앙의 퓨어 레드 파장입니다.'],
    ['일반 특성', '소방차, 우체국 차량 등 대중적이고 스탠다드한 솔리드 레드 원톤에 필수적인 뼈대입니다.'],
    ['외관 변화', '탁색이나 이질감 없이 화사하면서도 정직하고 따뜻한 붉은빛으로 도막의 온도를 올립니다.'],
    ['배합 비율', '모든 적색 베이스 조색 시 가장 기본 체력이 되는 스탠다드 비율을 차지하여 대량 투입됩니다.'],
    ['비교 분석', '[테크닉] 은폐력이 100% 완벽하지 않아 하도 색상에 영향을 받으므로, 얼룩 없이 덮으려면 정석적인 웻 코트(Wet coat) 겹침이 필수입니다.']
  ]},
  '90-A329': { role: '투명 레드 (캔디)', type: 'solid', face: '#ef4444', flop: '#b91c1c', desc: '빛 투과율이 매우 높은 맑은 고채도 투명 적색 틴터입니다.', details: [
    ['화학적 특성', '안료의 은폐력을 화학적으로 제거하여 거울 위의 맑은 셀로판지 효과를 내는 염료성 틴터입니다.'],
    ['일반 특성', '마쯔다 소울레드 크리스탈 등 프리미엄 캔디톤 3코트 레드의 핵심 미들 코트에 쓰입니다.'],
    ['외관 변화', '빛이 도막을 투명하게 뚫고 들어가 바닥 메탈릭을 치고 나오는 극강의 이중 반사 캔디 이펙트를 터뜨립니다.'],
    ['배합 비율', '밝은 메탈릭 안료 위에 올라가 맑고 쨍한 붉은빛 필터 역할을 수행하도록 정량 배합 분사합니다.'],
    ['비교 분석', '[경고] 은폐력이 전무하므로 바탕 서페이서 자국이나 샌딩 얼룩을 돋보기처럼 그대로 비춰버립니다. 하도 평탄화가 생명입니다.']
  ]},
  '90-A423': { role: '퍼플 / 바이올렛', type: 'solid', face: '#7e22ce', flop: '#4c1d95', desc: '푸른빛이 강하게 도는 스탠다드 솔리드 보라색입니다.', details: [
    ['화학적 특성', '적색과 청색 파장의 완벽한 균형점에서 살짝 쿨톤(푸른빛)으로 기운 깊은 퍼플광입니다.'],
    ['일반 특성', '퍼플 펄 메탈릭 베이스 하도 및 블루 메탈릭의 오묘한 톤다운 보정에 사용됩니다.'],
    ['외관 변화', '정면의 쨍한 보라색이 측면에서는 붉은기를 버리고 차가운 다크 네이비 톤으로 단단히 가라앉습니다.'],
    ['배합 비율', '신비로운 쿨톤 퍼플을 조색할 때 뼈대로 다량 투입되며 명도 조절에 주의합니다.'],
    ['비교 분석', '[경고] 화이트 원색과 섞이면 고급스러움이 사라지고 순식간에 촌스러운 연보라색(파스텔 탁색)으로 변합니다.']
  ]},
  '90-A430': { role: '마젠타', type: 'solid', face: '#db2777', flop: '#9d174d', desc: '자주/핑크빛이 강렬하게 도는 밝은 레드(마젠타) 원색입니다.', details: [
    ['화학적 특성', '레드 파장에 백색광이 미세하게 결합되어 화사한 마젠타(Pinkish Red) 발색을 터뜨립니다.'],
    ['일반 특성', '고채도 핫핑크 원톤 및 밝은 와인색 계열 조색에 뼈대로 사용됩니다.'],
    ['외관 변화', '칙칙하거나 무겁지 않고 직사광선에서 생기발랄하게 튀어 오르는 핑크빛 웜톤을 발산합니다.'],
    ['배합 비율', '화이트 펄 바닥에 극소량 넣어 화사한 쿨톤 레드를 연출할 때 조미료로 쓰입니다.'],
    ['비교 분석', '[경고] 일반 스탠다드 레드(A328) 조색에 섞어 넣으면 색 전체가 가벼운 핑크빛으로 들떠버리니 타겟 온도를 파악해야 합니다.']
  ]},
  '22-MC35': { role: '2K 우레탄 믹싱 클리어', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '22라인 우레탄 시스템의 뼈대 역할을 하는 투명 수지입니다.', details: [
    ['화학적 특성', '단순 조색용이 아니라 자외선과 오염을 방어하는 2K 하이솔리드 코팅제 뼈대 수지입니다.'],
    ['일반 특성', '상도 클리어가 필요 없는 22라인 솔리드 원톤 컬러 전반의 핵심 뼈대입니다.'],
    ['외관 변화', '건조 후 젤리처럼 맑고 깊은 묵직한 고광택(High Gloss)을 도막 자체적으로 발현합니다.'],
    ['배합 비율', '22라인 조색 시 가장 다량으로 투입됩니다.'],
    ['비교 분석', '[경고] 경화제와의 혼합 비율이 조금이라도 틀어지면 크랙 하자가 직빵으로 발생합니다.']
  ]},
  '22-M1': { role: '2K 우레탄 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '거울 같은 심연 흑경 우레탄 블랙.', details: [
    ['화학적 특성', '우레탄 살오름성/빛 흡수 극강 세팅 블랙 마스터'],
    ['일반 특성', '구형 대형차/에쿠스 1코트 딥 블랙 전용'],
    ['외관 변화', '클리어 없이 자체 거울 깊은 심연 광택 뿜음'],
    ['배합 비율', '블랙 원톤 대량 단독 배합'],
    ['비교 분석', '[경고] 우레탄 특유 강착색 타 조색 1방울 오염 주의']
  ]},
  '100-MB50': { role: '100라인 고농축 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '차세대 100라인 고농축 안료를 완벽히 펴주는 혁신 수지입니다.', details: [
    ['화학적 특성', '과거 90라인의 두께감을 극복하고 압도적인 퍼짐성을 부여하는 하이-에코 분산 수지입니다.'],
    ['일반 특성', '100라인 에코 수용성 시스템 전 색상의 근간이 되는 투명 뼈대입니다.'],
    ['외관 변화', '도막을 매우 얇고 단단하게 잡으면서 최고 수준의 투명도를 안착시킵니다.'],
    ['배합 비율', '100라인 시스템 컬러 구축 시 무조건 기초 단위로 대량 계량됩니다.'],
    ['비교 분석', '[경고] 90라인 수지(M4 등)와 혼용 시 즉각 젤리처럼 응고되며 대참사가 발생합니다.']
  ]},
  '100-M1': { role: '100라인 에코 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '기존 수용성의 한계를 뛰어넘어 빛 흡수율이 극대화된 심연의 흑색입니다.', details: [
    ['화학적 특성', '안료의 농축도를 극한으로 끌어올려 완벽한 빛 흡수율을 자랑하는 차세대 블랙입니다.'],
    ['일반 특성', '최신 수입차 프리미엄 솔리드 블랙 도장 및 톤다운용으로 쓰입니다.'],
    ['외관 변화', '도막 건조 후 뿜어져 나오는 맑고 깊은 심연의 블랙이 90라인보다 한 차원 더 예리합니다.'],
    ['배합 비율', '농축도가 매우 높아 톤다운 시 극소량만 정밀 투입해야 합니다.'],
    ['비교 분석', '[비교] 100-M1 vs 90-M1 : 100라인 블랙이 착색력(Tinting Strength)이 월등히 강력합니다.']
  ]},
  '90-A34': { role: '다이아몬드 화이트 (시라릭)', type: 'xirallic', face: '#ffffff', flop: '#f1f5f9', desc: '가장 쨍하고 굵은 반사를 내는 화이트 크리스탈입니다.', details: [
    ['화학적 특성', '투과율이 가장 높은 인공 합성 크리스탈(Alumina Flake) 베이스의 대형 입자입니다.'],
    ['일반 특성', '최고급 플래그십 세단의 다이아몬드 화이트 펄 도장 시 궁극의 화려함을 위해 처방됩니다.'],
    ['외관 변화', '태양광 아래에서 유리 파편이나 얼음조각이 부서지듯 압도적인 스파클링을 폭발시킵니다.'],
    ['배합 비율', '소량 투입으로도 극강의 화려함을 내며 정량 초과 시 눈이 아플 정도로 난반사됩니다.'],
    ['비교 분석', '[테크닉] 분말 성향이 강해 믹싱 클리어 수지에 완벽히 개어서 분사해야 하얗게 뭉치지 않습니다.']
  ]},
  '90-A35': { role: '다이아몬드 레드', type: 'xirallic', face: '#dc2626', flop: '#7f1d1d', desc: '핏빛 루비 보석을 부수어 놓은 듯 묵직하고 날카롭게 반짝이는 레드 시라릭입니다.', details: [
    ['일반 특성', '최고급 프리미엄 다크 레드 펄 및 캔디 이펙트에 주로 처방됩니다.']
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
