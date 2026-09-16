import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket, Columns, Mail, Code, Users, CreditCard, AlertTriangle, ThumbsUp, Eye, Calendar, RefreshCw, MessageSquare, Send, Save, CheckCircle, Edit3, Target } from 'lucide-react';

export interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

export const TONER_DB: Record<string, TonerData> = {
  // =====================================================================
  // 🚀 [1구간] 90라인 시스템 수지 및 무채색 (솔리드 화이트 & 블랙)
  // =====================================================================
  '90-M4': { 
    role: '스탠다드 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '수용성 조색 시스템의 모든 기본 뼈대를 형성하는 투명 수지입니다.', 
    details: [
      ['⚗️ 화학적 특성', '수용성 아크릴 및 폴리우레탄 분산 수지로 도막의 물리적 뼈대(골조)를 완벽히 형성합니다.'],
      ['🎯 일반 특성', '90라인 시스템 전 색상의 근간이 되는 필수 투명 베이스 수지입니다.'],
      ['👁️ 외관 변화', '안료 고유의 색상에 전혀 간섭하지 않으며 메탈릭/펄 입자의 배열(Orientation)을 고르게 안착시킵니다.'],
      ['⚖️ 배합 비율', '컬러 뼈대 구축을 위해 조색 시 가장 기본적이고 다량으로 계량되어 투입됩니다.'],
      ['💡 비교 분석', '[비교] 90-M4 (뼈대) vs 93-E3 (환원제) : M4는 굳어서 도막의 두께가 되고, E3는 점도만 맞춘 뒤 증발하여 날아갑니다.']
    ] 
  },
  '90-M5': { 
    role: '블렌딩 클리어 / 틴터', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '메탈릭 입자를 투명하고 부드럽게 펴주는 블렌딩(보카시) 전용 수지입니다.', 
    details: [
      ['⚗️ 화학적 특성', '기존 도막의 클리어층과 화학적 친화력이 높은 특수 용제가 포함된 침투성 수지입니다.'],
      ['🎯 일반 특성', '부분 도장(숨김 도장) 시 신구 도막의 이질감을 없애고 시각적 경계를 허물어버립니다.'],
      ['👁️ 외관 변화', '메탈릭 입자가 뭉치지 않고 투명하고 넓게 분산되도록 유도하여 모틀링(얼룩)을 방지합니다.'],
      ['⚖️ 배합 비율', '도장 부위 경계면에 선행 도장(Wet-bed)하거나 특수 투명 베이스 조색 시 사용됩니다.'],
      ['💡 비교 분석', '[비교] 90-M5 vs 일반 90-M4 : 일반 M4 대비 용제 침투력이 뛰어나 경계면을 자연스럽게 녹여 잇는 데 탁월합니다.']
    ] 
  },
  '93-E3': { 
    role: '어저스팅 베이스 (환원제)', type: 'binder', face: '#ffffff', flop: '#ffffff', 
    desc: '수용성 조색 시스템의 점도를 제어하는 핵심 투명 환원제(Reducer)입니다.', 
    details: [
      ['⚗️ 화학적 특성', '시각적 특성이 0%인 완벽한 투명 수용성 환원제로, 증발 속도를 제어합니다.'],
      ['🎯 일반 특성', '도막이 안착할 최적의 웻(Wet) 상태를 유지시켜 줍니다.'],
      ['👁️ 외관 변화', '입자가 고르게 펴지도록(Leveling) 도와 도막 표면의 오렌지필을 억제합니다.'],
      ['⚖️ 배합 비율', '조색 완료된 원액에 10~20% 비율로 희석하여 사용합니다.'],
      ['💡 비교 분석', '[환경 변수] 부스 온도가 30도 이상일 경우, 증발을 늦추는 93-E3 Slow(지연제)로 대체해야 얼룩이 생기지 않습니다.']
    ] 
  },
  '90-A031': { 
    role: '스탠다드 화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', 
    desc: '은폐력이 가장 우수하며 밑바탕을 단단하게 덮어버리는 메인 백색 안료입니다.', 
    details: [
      ['⚗️ 화학적 특성', '빛의 투과를 차단하는 고밀도 이산화티타늄(TiO2) 기반의 무기 안료입니다.'],
      ['🎯 일반 특성', '하도(바닥)의 흠집이나 서페이서 색상을 완벽하게 차단하는 바탕 공사용 백색입니다.'],
      ['👁️ 외관 변화', '투명도 없이 묵직하고 정직한 우윳빛 순백색의 면을 형성합니다.'],
      ['⚖️ 배합 비율', '솔리드 화이트 원톤이나 밝은 파스텔톤 하도 조색 시 베이스로 다량 배합됩니다.'],
      ['💡 비교 분석', '[주의사항] 펄(진주) 안료와 섞이면 펄 고유의 투명도를 시멘트처럼 덮어버리므로 탁색에 주의해야 합니다.']
    ] 
  },
  '90-A032': { 
    role: '틴터 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', 
    desc: '투명도를 가져 메탈릭/펄의 광채를 완전히 가리지 않는 조색용 소프트 화이트입니다.', 
    details: [
      ['⚗️ 화학적 특성', '입자를 고르게 분산시켜 은폐력을 의도적으로 낮춘 초미립 티타늄 틴터입니다.'],
      ['🎯 일반 특성', '맑은 톤을 유지하면서 뽀얀 느낌만 살짝 가미하는 \'보정/조색용\' 안료입니다.'],
      ['👁️ 외관 변화', '메탈릭 베이스에 안개처럼 깔려 입자의 반짝임을 살리면서 명도를 부드럽게 톤업시킵니다.'],
      ['⚖️ 배합 비율', '투명한 3코트 펄의 미들 코트 조색이나 미세한 톤업을 위해 소량 투입됩니다.'],
      ['💡 비교 분석', '[비교] 90-A032 (틴터) vs 90-A031 (스탠다드) : 바탕을 막아내는 A031과 달리 바닥을 비추는 반투명 화이트입니다.']
    ] 
  },
  '90-A926': { 
    role: '메인 블랙', type: 'solid', face: '#020617', flop: '#000000', 
    desc: '적색이나 청색으로 치우치지 않은 완벽하게 중립적인 표준 흑색입니다.', 
    details: [
      ['⚗️ 화학적 특성', '특정 파장(웜/쿨)으로 쏠리지 않도록 밸런스가 잡힌 고순도 카본 블랙 안료입니다.'],
      ['🎯 일반 특성', '가장 정직하고 무거운 심연의 섀도우를 단단하게 형성하는 기준점 흑색입니다.'],
      ['👁️ 외관 변화', '유채색을 칙칙한 흙빛으로 오염시키지 않고 맑고 깨끗하게 명도만 수직으로 떨어뜨립니다.'],
      ['⚖️ 배합 비율', '어두운 명도 조절 시 강력한 착색력 때문에 0.1g 단위로 아주 신중하게 계량해야 합니다.'],
      ['💡 비교 분석', '[주의사항] 1방울의 오차로도 유채색 톤 전체가 무겁게 죽어버리는 탁색 현상(Dead Color)이 발생할 수 있습니다.']
    ] 
  },
  // =====================================================================
  // 🚀 [2구간] 알루미늄 / 실버 (메탈릭) 계열
  // =====================================================================
  '90-M99/00': { 
    role: '수퍼 파인 알루미늄', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', 
    desc: '입자가 보이지 않을 정도로 정제된 극미세 알루미늄 안료입니다.', 
    details: [
      ['⚗️ 화학적 특성', '금속 입자를 극한으로 정제하여 난반사를 억제한 초미립 실버 페이스트입니다.'],
      ['🎯 일반 특성', '입자감이 없어야 하는 최고급 수입차의 하이퍼 실버 도장에 사용됩니다.'],
      ['👁️ 외관 변화', '정면은 거울(크롬)처럼 매끄럽고 눈부시지만 측면으로 꺾일수록 묵직한 솔리드 그레이 톤으로 떨어집니다.'],
      ['⚖️ 배합 비율', '입자가 고와 자기들끼리 뭉치는 클럼핑(Clumping) 하자가 잦으므로 점도를 묽게 희석하여 분사합니다.'],
      ['💡 비교 분석', '[테크닉] 웻 코트로 두껍게 치면 100% 뭉치므로 거리를 띄운 드롭 코트(Drop Coat) 위주로 안착시켜야 합니다.']
    ] 
  },
  '90-M99/02': { 
    role: '파인 알루미늄', type: 'silver_fine', face: '#e2e8f0', flop: '#334155', 
    desc: '가장 스탠다드하게 광범위하게 쓰이는 고운 입자 은분입니다.', 
    details: [
      ['⚗️ 화학적 특성', '빛을 안정적이고 둥글게 산란시키는 중간 이하 크기의 코발트 컷팅 알루미늄입니다.'],
      ['🎯 일반 특성', '대중적인 양산차 실버 메탈릭의 뼈대가 되는 현장 범용 스탠다드 은분입니다.'],
      ['👁️ 외관 변화', '거칠지 않고 익숙하며 편안한 스탠다드 실버감을 도막 전체에 고르게 부여합니다.'],
      ['⚖️ 배합 비율', '일반 범용 실버 조색 데이터 레시피에서 가장 많은 중량 비중을 차지합니다.'],
      ['💡 비교 분석', '[비교] 99/02 (파인) vs 99/03 (미디엄) : 03번보다 촘촘하여 빈 공간을 부드럽게 메워 다루기가 가장 쉽습니다.']
    ] 
  },
  '90-M99/04': { 
    role: '라지 알루미늄', type: 'silver_coarse', face: '#94a3b8', flop: '#0f172a', 
    desc: '매우 굵은 반사광을 발현하는 조대(Coarse) 알루미늄 입자입니다.', 
    details: [
      ['⚗️ 화학적 특성', '면적이 넓고 불규칙하게 컷팅된 초대형 금속 입자로 거친 난반사를 유도합니다.'],
      ['🎯 일반 특성', '거친 스파클이 돋보여야 하는 특수 다크 실버 및 커스텀 튜닝카 베이스에 사용됩니다.'],
      ['👁️ 외관 변화', '직사광선에서 부서진 쇳조각처럼 굵고 거친 남성적인 메탈릭 스파클을 폭발시킵니다.'],
      ['⚖️ 배합 비율', '입자가 커서 도료 침전이 빠르므로 스프레이 직전까지 교반을 확실하게 해야 합니다.'],
      ['💡 비교 분석', '[주의사항] 입자 틈새가 커서 자체 은폐력이 떨어지므로 바닥 서페이서 색상 매칭이 완벽해야 얼룩이 안 비칩니다.']
    ] 
  },

  // =====================================================================
  // 🚀 [3구간] 블루, 그린, 옐로우, 오커 원색 계열
  // =====================================================================
  '90-A528': { 
    role: '메인 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', 
    desc: '붉은기나 노란기가 전혀 섞이지 않은 가장 중립적인 스탠다드 청색 원색입니다.', 
    details: [
      ['⚗️ 화학적 특성', '파란색 파장의 정중앙에 위치하여 웜톤이나 쿨톤으로 치우치지 않는 퓨어 블루 안료입니다.'],
      ['🎯 일반 특성', '대다수 솔리드 블루 및 범용 블루 메탈릭 조색 시 기준점이 되는 핵심 뼈대입니다.'],
      ['👁️ 외관 변화', '정면의 맑은 파란색이 측면으로 갈수록 붉은 멍울 없이 차분하고 정직하게 톤다운됩니다.'],
      ['⚖️ 배합 비율', '청색 계열 조색 시 가장 다량으로 배합되어 전체적인 파란색 톤의 도화지 역할을 합니다.'],
      ['💡 비교 분석', '[주의사항] 화이트 펄 안료와 잘못 혼합되면 블루의 맑은 채도가 급감하고 탁한 파스텔톤으로 뭉개집니다.']
    ] 
  },
  '90-A695': { 
    role: '메인 그린', type: 'solid', face: '#15803d', flop: '#14532d', 
    desc: '짙고 안정적인 가장 스탠다드한 기준점 녹색 안료입니다.', 
    details: [
      ['⚗️ 화학적 특성', '노란기나 푸른기로 쏠리지 않은 정직하고 깊은 녹색 파장을 흡수/반사합니다.'],
      ['🎯 일반 특성', '브리티시 레이싱 그린 등 고전적이고 클래식한 솔리드 그린 및 다크 그린 펄의 하도입니다.'],
      ['👁️ 외관 변화', '가볍게 뜨지 않고 색의 중심을 무겁고 단단하게 잡아주는 깊은 숲속 질감을 냅니다.'],
      ['⚖️ 배합 비율', '녹색 계열 베이스 바탕색 구축 시 가장 광범위하게 쓰이는 메인 안료입니다.'],
      ['💡 비교 분석', '[비교] 90-A695 vs 90-A696(올리브) : A696의 칙칙한 흙빛 카키 톤과 달리 맑고 정돈된 딥 그린입니다.']
    ] 
  },
  '90-A115': { 
    role: '메인 옐로우', type: 'solid', face: '#eab308', flop: '#a16207', 
    desc: '불순물이 섞이지 않은 가장 맑고 선명한 표준 노란색입니다.', 
    details: [
      ['⚗️ 화학적 특성', '적색이나 청색 간섭을 차단한 고순도 퓨어 옐로우 유기 안료입니다.'],
      ['🎯 일반 특성', '스쿨버스, 스포츠카 등 눈길을 확 사로잡는 밝은 명시성의 솔리드 노랑 원톤 베이스입니다.'],
      ['👁️ 외관 변화', '눈부시고 쨍한 순수 옐로우 반사를 통해 도막 전체를 가장 밝은 웜톤으로 끌어올립니다.'],
      ['⚖️ 배합 비율', '모든 옐로우/오렌지/골드 조색의 메인 뼈대로 대량 배합됩니다.'],
      ['💡 비교 분석', '[주의사항] 순수 노란색 특성상 자체 은폐력이 매우 약해 화이트 서페이서 하도 처리가 절대적으로 필요합니다.']
    ] 
  },
  // =====================================================================
  // 🚀 [4구간] 레드 & 마젠타 / 특수 이펙트 계열
  // =====================================================================
  '90-A328': { 
    role: '스탠다드 레드', type: 'solid', face: '#dc2626', flop: '#991b1b', 
    desc: '가장 표준적이고 정직한 스탠다드 적색 솔리드입니다.', 
    details: [
      ['⚗️ 화학적 특성', '오렌지빛이나 자줏빛으로 치우치지 않은 완벽한 정중앙의 퓨어 레드 파장입니다.'],
      ['🎯 일반 특성', '소방차, 우체국 차량 등 대중적이고 기준이 되는 솔리드 레드 원톤에 쓰입니다.'],
      ['👁️ 외관 변화', '탁색 없이 화사하면서도 따뜻하고 단단한 붉은빛으로 도막을 덮습니다.'],
      ['⚖️ 배합 비율', '모든 적색 베이스 조색 시 기초 체력이 되는 스탠다드 비율로 들어갑니다.'],
      ['💡 비교 분석', '[도장 팁] 은폐력이 100% 완벽하진 않으므로 하도 얼룩을 덮기 위해 여러 번의 웻 코트가 요구됩니다.']
    ] 
  },
  '90-A329': { 
    role: '투명 레드 (캔디용)', type: 'solid', face: '#ef4444', flop: '#b91c1c', 
    desc: '빛 투과율이 매우 높은 맑은 고채도 투명 적색 안료입니다.', 
    details: [
      ['⚗️ 화학적 특성', '은폐력을 강제로 제거하여 빛이 100% 투과하는 특수 염료(Dye) 기반의 안료입니다.'],
      ['🎯 일반 특성', '마쯔다 소울레드 크리스탈 등 프리미엄 캔디톤 3코트 레드의 미들 코트에 쓰입니다.'],
      ['👁️ 외관 변화', '빛이 도막을 뚫고 들어가 바닥의 은분을 치고 나오는 이중 반사(Double Reflection) 효과를 냅니다.'],
      ['⚖️ 배합 비율', '하도의 메탈릭 위에 올라가 맑은 붉은빛 셀로판지 필터(틴팅) 역할을 수행합니다.'],
      ['💡 비교 분석', '[주의사항] 은폐가 안 되므로 하도 샌딩 기스나 서페 얼룩이 돋보기처럼 그대로 노출됩니다. 바닥 작업이 생명입니다.']
    ] 
  },
  '93-M010': { 
    role: '화이트 펄 (스탠다드)', type: 'pearl', face: '#ffffff', flop: '#e2e8f0', 
    desc: '가장 널리 쓰이는 표준 진주빛 마이카 펄입니다.', 
    details: [
      ['⚗️ 화학적 특성', '천연 운모(Mica) 위에 이산화티타늄을 코팅하여 부드러운 빛의 간섭을 유도합니다.'],
      ['🎯 일반 특성', '대중적인 국산차 3코트 화이트 펄 시스템의 메인 미들 코트 뼈대입니다.'],
      ['👁️ 외관 변화', '입자가 거칠게 튀지 않고 둥글고 뽀얀 정통 우윳빛 진주광을 왜곡 없이 뿜어냅니다.'],
      ['⚖️ 배합 비율', '모든 화이트 펄 조색 시 가장 다량으로, 가장 빈번하게 배합됩니다.'],
      ['💡 비교 분석', '[비교] 다이아몬드 시라릭 화이트와 달리, 반사가 예리하지 않고 포근하며 실키한 텍스처를 지닙니다.']
    ] 
  },
  '90-A34': { 
    role: '다이아몬드 화이트 (시라릭)', type: 'xirallic', face: '#ffffff', flop: '#f1f5f9', 
    desc: '햇빛을 100% 난반사로 튕겨내는 초고휘도 투명 유리 펄입니다.', 
    details: [
      ['⚗️ 화학적 특성', '운모가 아닌 인공 합성 크리스탈(Alumina Flake) 베이스로 컷팅된 첨단 다이아몬드 펄입니다.'],
      ['🎯 일반 특성', '최고급 대형 세단의 다이아몬드 화이트 펄 도장 시 궁극의 반짝임을 위해 처방됩니다.'],
      ['👁️ 외관 변화', '둥근 진주광이 아니라 차갑고 예리한 유리 파편이 부서지듯 압도적인 스파클링을 폭발시킵니다.'],
      ['⚖️ 배합 비율', '소량 투입으로도 극강의 화려함을 내며, 일반 펄과 섞으면 반사율이 너무 높아 이색에 주의해야 합니다.'],
      ['💡 비교 분석', '[테크닉] 분말 성향이 강해 믹싱 클리어 수지에 완벽히 액상화시켜서 분사해야 뭉치지 않습니다.']
    ] 
  }
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('알루미늄') || r.includes('실버') || r.includes('펄') || r.includes('이펙트') || r.includes('다이아몬드') || r.includes('시라릭') || r.includes('매직'); };

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

  const toggleExpand = (id: string, isPearl = false) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
  };
  const renderTonerList = (tonerList: any[], isPearl: boolean) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
        <Layers className="text-cyan-400" size={18} />
        <span className="text-sm font-bold text-slate-300">{isPearl ? "PEARL COAT (미들 코트)" : "GROUND COAT (베이스 원색)"}</span>
      </div>
      {tonerList.map((toner) => {
        const info = TONER_DB[toner.code] || { role: '미등록 안료', type: 'solid', face: '#334155', flop: '#1e293b', desc: '코드를 입력해주세요.' };
        const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
        return (
          <div key={toner.id} className="flex flex-col bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300">
            <div className="flex items-center p-3 gap-3">
              {/* Texture Icon */}
              <div className="flex w-14 h-14 rounded-md shadow-inner border border-slate-600 overflow-hidden shrink-0 cursor-pointer" onClick={() => toggleExpand(toner.id, isPearl)}>
                <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                <div className="flex-1 border-l border-slate-600" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
              </div>
              
              {/* Code & Role */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, isPearl)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                    className="w-24 bg-slate-900 border border-slate-600 text-cyan-300 text-center font-black rounded p-1 focus:border-cyan-400 focus:outline-none uppercase" placeholder="코드" />
                  <span className="font-bold text-sm text-slate-200 truncate">{info.role}</span>
                </div>
              </div>

              {/* Weight Input */}
              <div className="flex items-center bg-slate-900 border border-slate-600 rounded-md px-2 py-1 shrink-0">
                <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} 
                  onChange={e => handleWeightChange(toner.id, e.target.value, isPearl)} onKeyDown={(e) => { if(e.key==='Enter') addToner(isPearl); }}
                  className="w-16 bg-transparent text-right text-lg font-black text-yellow-400 focus:outline-none" placeholder="0.0" />
                <span className="text-xs font-bold text-slate-500 ml-1">g</span>
                <button onClick={() => removeToner(toner.id, isPearl)} className="ml-3 text-slate-500 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>

            {/* 5 Details Expandable Panel */}
            {toner.isExpanded && info.details && (
              <div className="bg-slate-900 p-4 border-t border-slate-700 text-sm">
                <div className="text-slate-400 mb-3 text-xs">{info.desc}</div>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-black text-cyan-500 shrink-0 w-24">{detail[0]}</span>
                      <span className="text-slate-300 leading-relaxed">{detail[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      <button onClick={() => addToner(isPearl)} className="w-full py-3 mt-2 border border-dashed border-slate-600 bg-slate-800 hover:bg-slate-700 rounded-lg text-cyan-400 font-bold text-sm flex justify-center items-center shadow-md transition-colors">
          <Plus size={18} className="mr-2"/>안료 행 추가하기
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-[200px]">
      {/* 👑 다크모드 프리미엄 헤더 */}
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-xl z-10 relative">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-800 rounded flex items-center justify-center font-bold text-white shadow-lg border border-cyan-500/30">
            GF
          </div>
          BASF 글라슈리트 90-Line <span className="text-xs text-cyan-400 font-normal ml-2 tracking-widest border border-cyan-800 px-2 py-1 rounded-full bg-cyan-900/20">PRO MASTER EDITION</span>
        </h1>
      </header>

      {/* 💻 메인 대시보드 레이아웃 */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto mt-4">
        
        {/* 왼쪽: 배합 워크시트 */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2"><Beaker className="text-cyan-500" size={20} /> 공식 배합 워크 시트</h2>
            <div className="flex gap-3">
              <input type="date" value={registrationDate} onChange={e=>setRegistrationDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 p-2 rounded-lg text-sm font-bold shadow-inner focus:border-cyan-500 focus:outline-none" />
              <input type="text" value={targetColorCode} onChange={e=>setTargetColorCode(e.target.value)} placeholder="차량 컬러코드 (예: UG4)" className="bg-slate-800 border border-slate-700 text-cyan-300 p-2 rounded-lg text-sm font-black w-40 uppercase shadow-inner focus:border-cyan-500 focus:outline-none placeholder-slate-600" />
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            {renderTonerList(toners, false)}
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-between items-center mb-6">
              <label className="flex items-center cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl border border-slate-700 transition-colors shadow-lg">
                <span className="mr-3 text-sm font-black text-purple-400">3Coat (진주/펄 추가) 시스템 켜기</span>
                <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isThreeCoatMode ? 'bg-purple-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isThreeCoatMode ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
          </div>
          
          {isThreeCoatMode && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-purple-900/30">
              {renderTonerList(pearlToners, true)}
            </div>
          )}
        </div>

        {/* 오른쪽: 카탈로그 & 디테일 사전 */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col h-[800px]">
            <h3 className="text-lg font-black mb-4 text-white flex items-center gap-2"><BookOpen className="text-cyan-500" size={20}/> 글라슈리트 마스터 사전</h3>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-slate-500" size={18} />
              <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료 코드 번호나 이름을 검색하세요..." className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:border-cyan-500 focus:outline-none shadow-inner font-bold" />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {catalogData.filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch)).map((item) => {
                  const isEffect = item.type !== 'solid' && item.type !== 'binder' && item.type !== 'candy';
                  return (
                    <div key={item.code} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
                           <div className="w-10 h-10 rounded border border-slate-600 overflow-hidden flex" style={getCachedTexture(item.type, item.face, item.flop, isEffect)}>
                             <div className="flex-1"></div><div className="flex-1" style={{ background: `linear-gradient(135deg, transparent 0%, ${isEffect ? item.flop : 'rgba(0,0,0,0.5)'} 100%)` }}></div>
                           </div>
                           <div>
                             <div className="font-black text-cyan-400 text-lg">{item.code} <span className="text-sm font-bold text-slate-300 ml-2">{item.role}</span></div>
                             <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                           </div>
                        </div>
                        {item.details && (
                          <div className="space-y-1.5 mt-2">
                            {item.details.map((d, i) => (
                              <div key={i} className="flex gap-2 text-xs">
                                <span className="font-bold text-cyan-600 shrink-0 w-20">{d[0]}</span>
                                <span className="text-slate-400">{d[1]}</span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                )})}
            </div>
        </div>
      </div>

      {/* 🚀 하단 플로팅 총합계 바 */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950 p-5 border-t border-slate-800 shadow-[0_-20px_50px_rgba(0,0,0,0.7)] flex justify-between items-center px-10">
          <div className="flex gap-8">
             <div className="text-slate-400 text-sm font-bold bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
               그라운드 베이스 총량: <span className="text-cyan-400 font-black text-xl ml-2">{totalBaseWeight}g</span> 
               <span className="text-slate-600 ml-2 text-xs font-normal">+ 환원제(E3) {(parseFloat(totalBaseWeight)*(isBaseMetallic?0.2:0.1)).toFixed(1)}g</span>
             </div>
             {isThreeCoatMode && (
               <div className="text-slate-400 text-sm font-bold bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-900/50">
                 미들 펄 코트 총량: <span className="text-purple-400 font-black text-xl ml-2">{totalPearlWeight}g</span> 
                 <span className="text-slate-600 ml-2 text-xs font-normal">+ 환원제(E3) {(parseFloat(totalPearlWeight)*(isPearlMetallic?0.2:0.1)).toFixed(1)}g</span>
               </div>
             )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-bold text-sm">최종 도료 배합 중량</span>
            <div className="text-yellow-400 font-black text-4xl bg-slate-900 px-6 py-2 rounded-xl border border-yellow-600/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                {(parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)).toFixed(1)} <span className="text-2xl text-yellow-600">g</span>
            </div>
          </div>
      </div>
    </div>
  );
}
