import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket, Columns, Mail, Code, Users, CreditCard, AlertTriangle, ThumbsUp, Eye, Calendar, RefreshCw, MessageSquare, Send, Save, CheckCircle, Edit3, Target } from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

export const TONER_DB: Record<string, TonerData> = {
  // =====================================================================
  // 🚀 [1구간] 90라인 시스템 수지 및 솔리드 화이트/블랙
  // =====================================================================
  '90-M4': { 
    role: '스탠다드 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '수용성 조색 시스템의 모든 기본 뼈대를 형성하는 투명 수지입니다.', 
    details: [['🎨 광학적 본질', '도막 내부에서 입자의 배열을 잡아주는 골조 역할'], ['🎯 주요 타겟 감성', '90라인 시스템 전 색상의 기본 뼈대']] 
  },
  '90-M5': { 
    role: '블렌딩 클리어 / 틴터', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '메탈릭 입자를 투명하고 부드럽게 펴주는 블렌딩 전용 수지입니다.', 
    details: [['🎨 광학적 본질', '경계를 허물어버리는 특수 용제'], ['⚗️ 배합 및 도장 팁', '숨김 도장(보카시)시 웻베드(Wet-bed)용']] 
  },
  '90-M1': { 
    role: '이펙트 어디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '색상 변화 없이 도막의 흐름성과 웻(Wet) 상태를 강제로 유지하는 투명 첨가제입니다.', 
    details: [['🎯 주요 타겟 감성', '한여름 고온 건조한 악조건 환경 작업용']] 
  },
  '93-E3': { 
    role: '어저스팅 베이스 (스탠다드)', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '수용성 조색 시스템의 점도를 제어하는 핵심 투명 환원제(Reducer)입니다.', 
    details: [['⚗️ 배합 및 도장 팁', '조색 완료된 원액에 10~20% 비율로 희석']] 
  },
  '90-A031': { 
    role: '스탠다드 화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', 
    desc: '은폐력이 가장 우수하며 밑바탕을 단단하게 덮어버리는 메인 백색 안료입니다.', 
    details: [['⚠️ 탁색 주의보', '펄 안료와 섞이면 펄 고유의 투명도를 시멘트처럼 덮어버림']] 
  },
  '90-A032': { 
    role: '틴터 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', 
    desc: '약간의 투명도를 가져 메탈릭/펄의 광채를 완전히 가리지 않는 조색용 소프트 화이트입니다.', 
    details: [['🎯 주요 타겟 감성', '메탈릭 톤을 탁해짐 없이 한 단계 밝게 톤업시킬 때']] 
  },
  '90-A035': { 
    role: '스노우 화이트', type: 'solid', face: '#f1f5f9', flop: '#94a3b8', 
    desc: '푸른기가 살짝 도는 가장 차갑고 깨끗한 쿨톤(Cool-tone) 순백색입니다.', 
    details: [['🎨 광학적 본질', '쨍하고 차가운 스노우 화이트 반사']] 
  },
  '98-A097': { 
    role: '이펙트 화이트', type: 'pearl', face: '#ffffff', flop: '#cbd5e1', 
    desc: '내부에 미세한 난반사 입자가 내재된 하이브리드 특수 백색입니다.', 
    details: [['🎯 주요 타겟 감성', 'BMW 미네랄 화이트 등 크리스탈 질감 컬러']] 
  },
  '90-A926': { 
    role: '메인 블랙', type: 'solid', face: '#020617', flop: '#000000', 
    desc: '적색이나 청색으로 치우치지 않은 완벽하게 중립적인 표준 흑색입니다.', 
    details: [['⚠️ 탁색 주의보', '착색력이 극도로 강해 미세한 오차로도 유채색이 시커멓게 죽음']] 
  },
  '90-1250': { 
    role: '제트 블랙', type: 'solid', face: '#000000', flop: '#000000', 
    desc: '빛 흡수율을 극한으로 끌어올린 깊고 진한 심연의 최고급 블랙입니다.', 
    details: [['🎯 주요 타겟 감성', '마이바흐, 포르쉐 등 럭셔리 옵시디안 딥 블랙']] 
  },
  '90-A997': { 
    role: '블랙 / 블루', type: 'solid', face: '#0f172a', flop: '#020617', 
    desc: '서늘한 푸른빛(Bluish) 파장이 감도는 쿨톤 특수 흑색 틴터입니다.', 
    details: [['👀 플롭 성향', '측면으로 눕혀볼 때 서늘한 푸른 기운 발산']] 
  },

  // =====================================================================
  // 🚀 [2구간] 알루미늄 / 실버 (메탈릭) 계열
  // =====================================================================
  '90-M99/00': { 
    role: '수퍼 파인 알루미늄', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', 
    desc: '입자가 보이지 않을 정도로 정제된 극미세 알루미늄 안료입니다.', 
    details: [['🎨 광학적 본질', '거울 표면처럼 매끄러운 액체 금속(Liquid Metal) 정반사']] 
  },
  '90-M99/01': { 
    role: '엑스트라 파인 알루미늄', type: 'silver_fine', face: '#f1f5f9', flop: '#475569', 
    desc: '매우 고운 실버로, 은은한 금속광을 내며 측면이 부드러운 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '최신 차량의 고휘도 미립자 실버']] 
  },
  '90-M99/02': { 
    role: '파인 알루미늄', type: 'silver_fine', face: '#e2e8f0', flop: '#334155', 
    desc: '가장 스탠다드하게 광범위하게 쓰이는 고운 입자 은분입니다.', 
    details: [['⚗️ 배합 및 도장 팁', '범용 실버 조색 데이터의 핵심 뼈대']] 
  },
  '90-M99/03': { 
    role: '미디엄 알루미늄', type: 'silver_coarse', face: '#cbd5e1', flop: '#1e293b', 
    desc: '정면광과 측면광의 명암 대비(Contrast)가 가장 뚜렷한 중간 입자 은분입니다.', 
    details: [['🎯 주요 타겟 감성', '스포티한 다크 그레이, 건메탈 계열']] 
  },
  '90-M99/04': { 
    role: '라지 알루미늄', type: 'silver_coarse', face: '#94a3b8', flop: '#0f172a', 
    desc: '매우 굵은 반사광을 발현하는 조대(Coarse) 알루미늄 입자입니다.', 
    details: [['⚠️ 탁색 주의보', '은폐력이 떨어져 바닥 하도 색상을 완벽히 맞춰야 함']] 
  },
  '90-M99/10': { 
    role: '실버 수퍼 파인', type: 'silver_fine', face: '#ffffff', flop: '#94a3b8', 
    desc: '고휘도의 맑고 밝은 명도를 극한으로 유지하는 극미립자 특수 은분입니다.', 
    details: [['🎨 광학적 본질', '맑은 크롬 수준의 밝기를 유지하는 렌티큘러 컷팅']] 
  },
  '90-905': { 
    role: '벨벳 실버 III', type: 'silver_fine', face: '#e2e8f0', flop: '#cbd5e1', 
    desc: '벨벳 천처럼 빛을 흡수하듯 부드러운 반광(Matte) 느낌을 주는 특수 난반사 실버입니다.', 
    details: [['🎯 주요 타겟 감성', '플라스틱 범퍼 가니쉬 및 매트 메탈릭']] 
  },
  '98-M919': { 
    role: '크리스탈 실버', type: 'xirallic', face: '#ffffff', flop: '#e2e8f0', 
    desc: '은분과 유리 펄(시라릭)의 장점만 결합시킨 궁극의 투명 실버입니다.', 
    details: [['🎨 광학적 본질', '얼음조각이 부서지는 듯한 압도적 맑음']] 
  },

  // =====================================================================
  // 🚀 [3구간] 블루, 그린, 옐로우, 오커 원색 계열
  // =====================================================================
  '90-A528': { 
    role: '메인 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', 
    desc: '붉은기나 노란기가 전혀 섞이지 않은 가장 중립적인 스탠다드 청색 원색입니다.', 
    details: [['🎯 주요 타겟 감성', '대다수 솔리드 블루 및 메탈릭의 뼈대']] 
  },
  '90-A533': { 
    role: '사파이어 블루', type: 'solid', face: '#1d4ed8', flop: '#1e40af', 
    desc: '채도가 극도로 높고 영롱한 보석빛(사파이어)을 내는 하이엔드 블루 안료입니다.', 
    details: [['🎨 광학적 본질', '빛을 뿜어내는 네온사인 같은 고채도']] 
  },
  '90-A563': { 
    role: '미드 블루', type: 'solid', face: '#3b82f6', flop: '#1e3a8a', 
    desc: '명도가 살짝 억제된 차분한 중간 톤의 솔리드 청색입니다.', 
    details: [['🎯 주요 타겟 감성', '차분한 다크 블루 차량']] 
  },
  '90-A589': { 
    role: '진스 블루', type: 'solid', face: '#1e3a8a', flop: '#0f172a', 
    desc: '낡은 데님 청바지처럼 깊고 진한 어두운 네이비 블루입니다.', 
    details: [['👀 플롭 성향', '측면에서는 거의 흑색에 가까운 무거운 섀도우']] 
  },
  '90-A640': { 
    role: '스프링 그린', type: 'solid', face: '#84cc16', flop: '#4d7c0f', 
    desc: '명도와 채도가 매우 높은 맑고 싱그러운 연두/라임색 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '고채도 라임색 스포츠카 솔리드']] 
  },
  '90-A695': { 
    role: '메인 그린', type: 'solid', face: '#15803d', flop: '#14532d', 
    desc: '짙고 안정적인 가장 스탠다드한 기준점 녹색 안료입니다.', 
    details: [['🎨 광학적 본질', '치우치지 않은 정직한 그린 파장']] 
  },
  '90-A696': { 
    role: '올리브 그린', type: 'solid', face: '#4d7c0f', flop: '#3f6212', 
    desc: '자연스럽고 탁한 흙빛이 섞인 카키/국방색 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '오프로드 SUV의 택티컬 카키 색상']] 
  },
  '90-A105': { 
    role: '오커 (황토)', type: 'solid', face: '#b45309', flop: '#451a03', 
    desc: '은폐력이 매우 강하고 무거운 전형적인 황토색/흙빛 안료입니다.', 
    details: [['⚠️ 탁색 주의보', '투명감이 생명인 맑은 컬러엔 절대 투입 금지']] 
  },
  '90-A115': { 
    role: '메인 옐로우', type: 'solid', face: '#eab308', flop: '#a16207', 
    desc: '불순물이 섞이지 않은 가장 맑고 선명한 표준 노란색입니다.', 
    details: [['🎨 광학적 본질', '완벽한 순수 옐로우 파장']] 
  },
  '90-A136': { 
    role: '골든 오커', type: 'solid', face: '#d97706', flop: '#92400e', 
    desc: '오커(황토)의 칙칙함을 빼고 화사한 금빛 반사를 품은 맑은 황토색입니다.', 
    details: [['🎯 주요 타겟 감성', '고급스러운 샴페인 골드 바닥칠']] 
  },
  '90-A143': { 
    role: '다크 옐로우', type: 'solid', face: '#ca8a04', flop: '#854d0e', 
    desc: '명도가 살짝 억제된 진하고 정직한 진노랑(머스타드) 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '경고색 노랑, 굴삭기 컬러']] 
  },
  '90-A148': { 
    role: '레몬 골드', type: 'solid', face: '#fde047', flop: '#ca8a04', 
    desc: '푸른빛(Cool-tone)이 살짝 감도는 매우 밝고 투명한 레몬 옐로우입니다.', 
    details: [['⚠️ 탁색 주의보', '붉은기(웜톤)와 섞이면 형광빛 즉각 소실']] 
  },
  '90-A149': { 
    role: '리듀스드 레몬 옐로우', type: 'solid', face: '#fef08a', flop: '#eab308', 
    desc: '착색력을 낮춰 미세 보정용으로 만든 안전망 레몬 안료입니다.', 
    details: [['⚗️ 배합 및 도장 팁', '화이트 펄의 웜톤 벤딩용']] 
  },
  '90-A177': { 
    role: '오가닉 옐로우', type: 'solid', face: '#eab308', flop: '#a16207', 
    desc: '자연물에 가까운 편안하고 유기적인 웜톤 파장을 뿜어냅니다.', 
    details: [['🎯 주요 타겟 감성', '깊이감 있는 옐로우 펄 바닥칠']] 
  },
  '90-A201': { 
    role: '라이트 오렌지', type: 'solid', face: '#f97316', flop: '#c2410c', 
    desc: '레드와 옐로우의 경계에 아슬아슬하게 있는 눈부신 밝은 귤색 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '포르쉐 파파야 오렌지 등 포인트 컬러']] 
  },

  // =====================================================================
  // 🚀 [4구간] 레드 & 브라운 원색 계열
  // =====================================================================
  '90-3A0': { 
    role: '체리 레드', type: 'solid', face: '#be123c', flop: '#7f1d1d', 
    desc: '핏빛에 가까울 정도로 짙고 매혹적인 체리색 틴터입니다.', 
    details: [['🎨 광학적 본질', '다크 와인 톤 형성']] 
  },
  '90-A306': { 
    role: '옥사이드 레드', type: 'solid', face: '#7c2d12', flop: '#450a0a', 
    desc: '은폐력이 압도적인 적갈색 산화철 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '캔디 레드 하도 바닥칠']] 
  },
  '90-A328': { 
    role: '스탠다드 레드', type: 'solid', face: '#dc2626', flop: '#991b1b', 
    desc: '가장 표준적인 적색 솔리드입니다.', 
    details: [['🎨 광학적 본질', '치우침 없는 정중앙의 레드 파장']] 
  },
  '90-A329': { 
    role: '투명 레드', type: 'solid', face: '#ef4444', flop: '#b91c1c', 
    desc: '빛 투과율이 매우 높은 맑은 고채도 투명 적색 안료입니다.', 
    details: [['🎯 주요 타겟 감성', '마쯔다 소울레드 등 캔디톤 프리미엄 레드']] 
  },
  '90-A347': { 
    role: '브라운', type: 'solid', face: '#78350f', flop: '#450a0a', 
    desc: '깊고 따뜻한 톤의 솔리드 갈색 원색입니다.', 
    details: [['🎯 주요 타겟 감성', '초코 브라운, 웜톤 다크 계열']] 
  },
  '90-A350': { 
    role: '다크 레드', type: 'solid', face: '#831843', flop: '#4c0519', 
    desc: '명도가 극도로 억제된 짙고 묵직한 진자주색 원색입니다.', 
    details: [['🎯 주요 타겟 감성', '플럼(자두)색 및 딥 다크 레드 바탕']] 
  },
  '90-A372': { 
    role: '스칼렛', type: 'solid', face: '#ef4444', flop: '#991b1b', 
    desc: '강렬한 주황빛이 도는 눈부신 다홍색/스칼렛 안료입니다.', 
    details: [['🎨 광학적 본질', '가장 뜨겁고 눈이 시린 고채도 발색']] 
  },
  '98-M319': { 
    role: '라디언트 레드 (시라릭)', type: 'pearl', face: '#be123c', flop: '#7f1d1d', 
    desc: '보석처럼 투과되는 극채도 특수 레드 틴터입니다.', 
    details: [['⚠️ 탁색 주의보', '은폐력 0%이므로 바닥 매칭이 생명']] 
  },

  // =====================================================================
  // 🚀 [5, 6, 7구간 및 특수 라인] 마이카/시라릭/우레탄/에코 라인 통합
  // =====================================================================
  '93-M010': { role: '화이트 펄', type: 'pearl', face: '#ffffff', flop: '#e2e8f0', desc: '가장 스탠다드한 진주빛 마이카 펄' },
  '93-M011': { role: '파인 화이트 펄', type: 'pearl', face: '#f8fafc', flop: '#cbd5e1', desc: '고운 입자의 실크 화이트 펄' },
  '93-M176': { role: '골드 펄', type: 'pearl', face: '#fde047', flop: '#ca8a04', desc: '따뜻한 18K 황금빛 간섭광 펄' },
  '93-M505': { role: '블루 펄', type: 'pearl', face: '#3b82f6', flop: '#1e3a8a', desc: '쨍한 청색 반사광 마이카 펄' },
  '93-M822': { role: '그린 펄', type: 'pearl', face: '#4ade80', flop: '#14532d', desc: '청량한 녹색빛 난반사 펄' },
  '90-A33': { role: '다이아몬드 화이트 파인', type: 'xirallic', face: '#ffffff', flop: '#e2e8f0', desc: '고휘도 유리 베이스 화이트 시라릭' },
  '90-A34': { role: '다이아몬드 화이트', type: 'xirallic', face: '#ffffff', flop: '#f1f5f9', desc: '가장 쨍한 굵은 화이트 크리스탈' },
  '90-A35': { role: '다이아몬드 레드', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d', desc: '붉은 루비빛의 크리스탈 시라릭' },
  '90-A423': { role: '퍼플 / 바이올렛', type: 'solid', face: '#7e22ce', flop: '#4c1d95', desc: '푸른빛이 도는 스탠다드 보라색' },
  '90-A430': { role: '마젠타', type: 'solid', face: '#db2777', flop: '#9d174d', desc: '강렬한 자주/핑크빛 레드' },
  '98-M80': { role: '매직 카멜레온 (시안-퍼플)', type: 'xirallic', face: '#2dd4bf', flop: '#a855f7', desc: '청록색에서 보라색으로 변환되는 카멜레온 펄' },
  '90-M3': { role: '무광 수지 (매팅)', type: 'binder', face: '#e2e8f0', flop: '#e2e8f0', desc: '광택을 죽이는 투명 수지' },
  '22-MC35': { role: '2K 우레탄 믹싱 클리어', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '하이솔리드 우레탄 전용 수지' },
  '22-M1': { role: '2K 우레탄 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '우레탄 흑경 블랙' },
  '100-MB50': { role: '100라인 고농축 수지', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '에코 100라인 전용 믹싱 베이스' },
  '100-M1': { role: '100라인 에코 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '고농축 수용성 심연 블랙' }
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('알루미늄') || r.includes('실버') || r.includes('펄') || r.includes('이펙트') || r.includes('다이아몬드') || r.includes('시라릭') || r.includes('카멜레온'); };

// eslint-disable-next-line
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

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => `${t.code}_${t.adjustedWeight || ''}`).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c || '', adjustedWeight: w || '', history: [], memo: '', isExpanded: false }; }); };

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); 
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedBase = localStorage.getItem('glasurit_base'); const savedPearl = localStorage.getItem('glasurit_pearl'); 
        if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl));
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('glasurit_base', JSON.stringify(toners)); localStorage.setItem('glasurit_pearl', JSON.stringify(pearlToners)); 
      }
  }, [toners, pearlToners, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); 
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2));
    setIsBaseMetallic(toners.some(t => TONER_DB[t.code] && isTonerMetallic(TONER_DB[t.code].role)));
    setIsPearlMetallic(pearlToners.some(t => TONER_DB[t.code] && isTonerMetallic(TONER_DB[t.code].role)));
  }, [toners, pearlToners]);

  useEffect(() => {
    if (focusTarget) {
      setTimeout(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        setFocusTarget(null);
      }, 50);
    }
  }, [focusTarget]);

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const rawVal = newCode.toUpperCase(); 
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if (t.id === id) { if (TONER_DB[rawVal]) setFocusTarget({ id: id, type: 'weight' }); return { ...t, code: rawVal }; } return t; }));
  };

  const handleWeightChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  const addToner = (isPearl = false) => {
    const newToner = { id: `new_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false };
    if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]);
    setFocusTarget({ id: newToner.id, type: 'code' });
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id));
  };

  const renderTonerList = (tonerList: any[], isPearl: boolean) => (
    <div className="space-y-2">
      <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1">
        <span>{isPearl ? "▼ 펄 코트 (Mid Coat)" : "▼ 베이스 원색 리스트 (Ground Coat)"}</span>
      </div>
      {tonerList.map((toner) => {
        const info = TONER_DB[toner.code] || { role: '미등록 안료', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
        const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
        return (
          <div key={toner.id} className={`flex flex-col p-2.5 mb-1.5 rounded-xl border shadow-sm transition-colors ${isPearl ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
              <div className="flex flex-col flex-1 w-full overflow-hidden">
                  <div className="flex items-center gap-2 mb-1 w-full">
                      <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0">
                           <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                           <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                      </div>
                      <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, isPearl)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                          type="text" className="w-24 text-center text-sm font-black border border-slate-300 rounded p-1.5 focus:border-blue-500 focus:outline-none shadow-inner shrink-0 uppercase" placeholder="번호" />
                      <span className={`font-bold text-sm truncate ${isPearl ? 'text-purple-700' : 'text-blue-700'}`}>{info.role}</span>
                  </div>
              </div>
              <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                 <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} 
                     onChange={e => handleWeightChange(toner.id, e.target.value, isPearl)} onKeyDown={(e) => { if(e.key==='Enter') addToner(isPearl); }}
                     className={`w-16 text-right text-base font-black focus:outline-none mx-1 ${isPearl ? 'text-purple-600' : 'text-blue-600'}`} placeholder="0.0" />
                 <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                 <button onClick={() => removeToner(toner.id, isPearl)} className="ml-1 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        )
      })}
      <button onClick={() => addToner(isPearl)} className="w-full py-3 border border-dashed border-slate-300 bg-white hover:bg-blue-50 rounded-lg text-slate-500 font-bold text-sm flex justify-center items-center shadow-sm">
          <Plus size={18} className="mr-1"/>안료 추가
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-[180px]">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2"><div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">G</div>조색 Pro (Glasurit)</h1>
      </header>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-xl shadow-xl p-4">
          <h2 className="text-sm font-bold flex items-center mb-3"><Sliders className="text-blue-600 mr-2" size={16} />배합 워크 시트</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <input type="date" value={registrationDate} onChange={e=>setRegistrationDate(e.target.value)} className="border p-2 rounded text-sm font-bold w-full" />
              <input type="text" value={targetColorCode} onChange={e=>setTargetColorCode(e.target.value)} placeholder="컬러코드 (예: UX)" className="border p-2 rounded text-sm font-bold w-full uppercase" />
          </div>

          {renderTonerList(toners, false)}

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center mb-4">
              <label className="flex items-center cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border">
                <span className="mr-2 text-xs font-black text-purple-700">3Coat (펄 추가) 켜기</span>
                <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                <div className={`w-10 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
              </label>
          </div>
          {isThreeCoatMode && renderTonerList(pearlToners, true)}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-300 rounded-xl shadow-xl p-4">
            <h3 className="text-xs font-black mb-2 text-slate-800">💎 글라슈리트 카탈로그 검색</h3>
            <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / 색상코드 검색" className="w-full bg-slate-100 border border-slate-300 text-slate-800 text-sm px-3 py-2 rounded-lg mb-4" />
            
            <div className="h-[500px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {catalogData.filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch)).map((item) => (
                    <div key={item.code} className="p-3 border rounded-lg hover:border-blue-400 cursor-pointer shadow-sm">
                        <div className="font-black text-blue-700">{item.code} <span className="text-xs text-slate-600 ml-1">{item.role}</span></div>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900 p-4 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex justify-between items-center">
          <div className="flex gap-4">
             <div className="text-white text-xs">베이스: <span className="text-blue-400 font-bold text-base">{totalBaseWeight}g</span> <span className="text-slate-500">+ 환원제 {(parseFloat(totalBaseWeight)*(isBaseMetallic?0.2:0.1)).toFixed(1)}g</span></div>
             {isThreeCoatMode && <div className="text-white text-xs">펄: <span className="text-purple-400 font-bold text-base">{totalPearlWeight}g</span> <span className="text-slate-500">+ 환원제 {(parseFloat(totalPearlWeight)*(isPearlMetallic?0.2:0.1)).toFixed(1)}g</span></div>}
          </div>
          <div className="text-yellow-400 font-black text-2xl">
              총 {(parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)).toFixed(1)}g
          </div>
      </div>
    </div>
  );
}
