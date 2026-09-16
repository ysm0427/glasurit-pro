import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Layers, BookOpen, Search, Beaker } from 'lucide-react';

export interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

// 💡 5가지 기준(화학/일반/외관/배합/비교)이 단 1개도 누락 없이 100% 반영된 BASF 마스터 데이터
export const TONER_DB: Record<string, TonerData> = {
  // [1구간] 수지 및 무채색
  '90-M4': { role: '스탠다드 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수용성 조색 시스템의 모든 기본 뼈대를 형성하는 투명 수지입니다.', details: [['⚗️ 화학적 특성', '수용성 아크릴/폴리우레탄 분산 수지로 물리적 뼈대(골조)를 완벽히 형성함'], ['🎯 일반 특성', '90라인 시스템 전 색상의 근간이 되는 필수 투명 베이스'], ['👁️ 외관 변화', '안료 색상에 간섭 없이 메탈릭/펄 입자의 배열을 고르게 안착시킴'], ['⚖️ 배합 비율', '컬러 뼈대 구축을 위해 조색 시 가장 기본적이고 다량으로 투입됨'], ['💡 비교 분석', '[비교] M4는 굳어서 도막의 두께가 되고, 환원제(E3)는 점도만 맞춘 뒤 증발함']] },
  '90-M5': { role: '블렌딩 클리어 / 틴터', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '메탈릭 입자를 투명하고 부드럽게 펴주는 블렌딩 전용 수지입니다.', details: [['⚗️ 화학적 특성', '기존 도막과 화학적 친화력이 높은 용제가 포함된 침투성 수지'], ['🎯 일반 특성', '부분 도장(보카시) 시 신구 도막의 이질감을 없애고 경계를 허묾'], ['👁️ 외관 변화', '메탈릭 입자가 뭉치지 않고 넓게 분산되도록 유도하여 얼룩 방지'], ['⚖️ 배합 비율', '도장 부위 경계면에 선행 도장(Wet-bed) 시 단독/혼합 사용'], ['💡 비교 분석', '[비교] 일반 M4 대비 용제 침투력이 뛰어나 경계면을 녹여 잇는 데 탁월함']] },
  '90-M1': { role: '이펙트 어디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막의 흐름성과 웻(Wet) 상태를 강제로 유지하는 투명 첨가제입니다.', details: [['⚗️ 화학적 특성', '도막 표면이 급격히 마르는 것을 억제하는 보습/흐름성 지연 수지'], ['🎯 일반 특성', '한여름 고온 건조한 악조건 환경(열풍기 가동 등) 작업 안정성 극대화'], ['👁️ 외관 변화', '발색/광택에 개입 없이 거친 표면을 매끄럽게 눕혀줌'], ['⚖️ 배합 비율', '부스 환경 조건에 따라 조색 최종 단계에서 미량만 정밀 첨가'], ['💡 비교 분석', '[경고] 과다 투입 시 수분이 날아가지 않아(트래핑) 완전 건조 시간이 치명적으로 지연됨']] },
  '93-E3': { role: '어저스팅 베이스 (환원제)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수용성 조색 시스템의 점도를 제어하는 투명 환원제입니다.', details: [['⚗️ 화학적 특성', '시각적 특성이 0%인 투명 수용성 환원제로, 입자의 분산 공간 제공'], ['🎯 일반 특성', '도막이 안착할 최적의 웻(Wet) 상태를 유지시켜 미립화를 돕는다'], ['👁️ 외관 변화', '입자가 고르게 펴지도록(Leveling) 유도하여 오렌지필 억제'], ['⚖️ 배합 비율', '조색 완료된 원액에 10~20% 비율로 희석하여 사용'], ['💡 비교 분석', '[환경 변수] 부스 온도 30도 이상일 경우, 반드시 지연제(E3 Slow)로 대체해야 함']] },
  '93-E3 Slow': { role: '지연형 환원제 (Slow)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '고온 환경에서 도료의 증발 속도를 강제로 늦추는 지연제입니다.', details: [['⚗️ 화학적 특성', '비등점이 높은 용제로 수용성 도료의 급격한 증발 화학적 방어'], ['🎯 일반 특성', '여름철 28도 이상 고온 건조 환경이나 대면적 도장 시 필수 첨가제'], ['👁️ 외관 변화', '메탈릭/펄 입자가 도막 위에서 고르게 자리 잡을 충분한 시간을 벌어줌'], ['⚖️ 배합 비율', '일반 93-E3를 100% 대체하여 10~20% 희석 배합'], ['💡 비교 분석', '[경고] 겨울철(저온)에 사용 시 칠이 마르지 않고 눈물 자국처럼 흘러내리는 하자 발생']] },
  '90-M3': { role: '매팅 에이전트 (무광 수지)', type: 'binder', face: '#e2e8f0', flop: '#e2e8f0', desc: '광택을 죽여 난반사로 흩뿌리는 무광 첨가 수지입니다.', details: [['⚗️ 화학적 특성', '빛의 난반사를 유도하는 특수 미립자가 포함된 소광 수지 베이스'], ['🎯 일반 특성', '무광 특수 질감 도장이나 범퍼 가니쉬에 사용'], ['👁️ 외관 변화', '도막 표면을 미세하게 거칠게 만들어 매트한(Satin) 질감 형성'], ['⚖️ 배합 비율', '타겟 광택도에 따라 10%~30%까지 유동적으로 배합'], ['💡 비교 분석', '[경고] 과다 투입 시 도막 결합 강도와 은폐력이 떨어지므로 정량 엄수 필수']] },
  '90-M20': { role: '플롭 컨트롤러 (배열제)', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '메탈릭 안료의 눕는 각도만 강제로 제어하는 첨가제입니다.', details: [['⚗️ 화학적 특성', '색상에 개입하지 않고 은분/펄 입자의 물리적 배향(Orientation) 각도만 비틈'], ['🎯 일반 특성', '조색 비율을 건드리지 않고 정/측면 명도만 미세 조절'], ['👁️ 외관 변화', '은분을 세우거나 눕혀 측면을 환하게 개방하거나 정면을 어둡게 누름'], ['⚖️ 배합 비율', '현장 데이터 보정 시 0.5%~2% 이내 극미량만 정밀 첨가'], ['💡 비교 분석', '[테크닉] 톤은 맞는데 측면만 어둡거나 밝아 이색이 날 때 쓰는 최후의 치트키']] },
  '90-A031': { role: '스탠다드 화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', desc: '밑바탕을 단단하게 덮어버리는 메인 백색 안료입니다.', details: [['⚗️ 화학적 특성', '빛 투과를 100% 차단하는 고밀도 이산화티타늄(TiO2) 무기 안료'], ['🎯 일반 특성', '하도(서페이서) 색상을 차단하는 바탕 공사용 메인 백색'], ['👁️ 외관 변화', '투명도 없이 묵직하고 정직한 우윳빛 순백색 면 뿜어냄'], ['⚖️ 배합 비율', '솔리드 화이트 원톤/밝은 컬러 조색 시 뼈대로 다량 배합'], ['💡 비교 분석', '[경고] 펄(Mica) 안료와 섞이면 펄 고유의 진주광을 시멘트처럼 덮어 탁색 유발']] },
  '90-A032': { role: '틴터 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: '메탈릭의 광채를 가리지 않는 반투명 조색용 소프트 화이트입니다.', details: [['⚗️ 화학적 특성', '입자를 고르게 분산시켜 은폐력을 의도적으로 낮춘 초미립 티타늄 틴터'], ['🎯 일반 특성', '맑은 톤을 유지하면서 뽀얀 느낌만 가미하는 조색 전용 안료'], ['👁️ 외관 변화', '안개처럼 깔려 메탈릭 반짝임을 살리면서 명도를 부드럽게 톤업'], ['⚖️ 배합 비율', '투명한 3코트 펄 미들 코트나 미세 명도 조절을 위해 소량 투입'], ['💡 비교 분석', '[비교] 바탕을 덮는 A031과 달리 바닥을 맑게 비추는 반투명 틴트 안료임']] },
  '90-A035': { role: '스노우 화이트', type: 'solid', face: '#f1f5f9', flop: '#94a3b8', desc: '푸른기가 살짝 도는 가장 차갑고 깨끗한 쿨톤 순백색입니다.', details: [['⚗️ 화학적 특성', '순백색 베이스에 미세한 푸른(Bluish) 파장을 결합시킨 쿨톤 마스터'], ['🎯 일반 특성', '최신 차량의 형광기가 감돌 정도로 쨍한 스노우 화이트 전용'], ['👁️ 외관 변화', '눈부신 설원이나 얼음장처럼 쨍하고 차가운 스노우 화이트 광채 발산'], ['⚖️ 배합 비율', '최신 고채도 쿨톤 바탕색 조색 시 메인 베이스로 다량 투입'], ['💡 비교 분석', '[경고] 웜톤 화이트에 1방울이라도 들어가면 톤 전체가 창백하게 죽어버림']] },
  '98-A097': { role: '이펙트 화이트', type: 'pearl', face: '#ffffff', flop: '#cbd5e1', desc: '미세한 난반사 입자가 내재된 하이브리드 특수 백색입니다.', details: [['⚗️ 화학적 특성', '도막 내부에서 빛을 산란시키는 이펙트 입자가 포함된 펄-솔리드 결합형'], ['🎯 일반 특성', 'BMW 미네랄 화이트 등 크리스탈 질감이 돋보이는 특수 컬러용'], ['👁️ 외관 변화', '단순 솔리드가 아닌 미세하게 부서지듯 빛나는 은은한 진주광이 감돎'], ['⚖️ 배합 비율', '바탕을 완벽히 은폐한 후 미들 코트 펄 층처럼 독립적으로 도장'], ['💡 비교 분석', '[테크닉] 믹싱 클리어와 섞어 드롭 코트를 병행해야 본연의 색이 발현됨']] },
  '90-A926': { role: '메인 블랙', type: 'solid', face: '#020617', flop: '#000000', desc: '적색이나 청색으로 치우치지 않은 중립적인 표준 흑색입니다.', details: [['⚗️ 화학적 특성', '특정 파장으로 쏠리지 않도록 밸런스가 잡힌 고순도 카본 블랙'], ['🎯 일반 특성', '딥 블랙 솔리드 및 다크 남색, 쥐색 메탈릭 톤다운 베이스'], ['👁️ 외관 변화', '유채색을 오염시키지 않고 가장 정직하고 무거운 심연의 섀도우를 형성'], ['⚖️ 배합 비율', '착색력이 극도로 강해 0.1g 단위로 최소량부터 정밀 계량'], ['💡 비교 분석', '[비교] 저가 범용 블랙과 달리 유채색을 흙빛으로 더럽히지 않고 맑게 명도만 떨어뜨림']] },
  '90-1250': { role: '제트 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '빛 흡수율을 극한으로 끌어올린 심연의 최고급 블랙입니다.', details: [['⚗️ 화학적 특성', '카본을 넘어선 완벽한 빛 흡수 구조로 회색빛 잔상조차 허용하지 않는 암흑 안료'], ['🎯 일반 특성', '마이바흐 등 럭셔리 플래그십 브랜드의 옵시디안 딥 블랙 전용'], ['👁️ 외관 변화', '어떠한 난반사도 없이 거울처럼 맑고 완벽한 흑경(Black Mirror) 발현'], ['⚖️ 배합 비율', '순수 블랙 원톤 도장에 단독으로 다량 사용됨'], ['💡 비교 분석', '[경고] 메탈릭에 일반 블랙 대신 섞으면 톤이 비정상적으로 까맣게 뭉개짐']] },
  '90-A997': { role: '블랙 / 블루', type: 'solid', face: '#0f172a', flop: '#020617', desc: '서늘한 푸른빛 파장이 감도는 쿨톤 특수 흑색 틴터입니다.', details: [['⚗️ 화학적 특성', '카본 베이스에 쿨톤 푸른 파장을 화학적으로 결합시킨 측면 제어용 안료'], ['🎯 일반 특성', '측면에서 차가운 푸른빛이 돌아야 하는 묵직한 다크 네이비 메탈릭용'], ['👁️ 외관 변화', '정면은 딥 블랙이나 측면으로 눕히면 심해의 깊은 푸른 기운을 뿜어냄'], ['⚖️ 배합 비율', '블루 메탈릭 명도를 낮추면서 쿨톤 섀도우 유지 시 A926 대신 첨가'], ['💡 비교 분석', '[경고] 노란색이나 오커 안료와 섞이면 즉각 칙칙한 카키색(탁색) 발생']] },
  '90-A992': { role: '틴팅 그레이 (블랙/화이트)', type: 'solid', face: '#475569', flop: '#1e293b', desc: '블랙과 화이트가 미세하게 섞여있는 반투명 안전망 틴터입니다.', details: [['⚗️ 화학적 특성', '착색력이 강한 블랙의 밀도를 대폭 희석시켜 반투명하게 만든 회색 틴트'], ['🎯 일반 특성', '밝은 실버나 파스텔톤의 미세한 톤다운 보정 시 안전망(Safety net)으로 사용'], ['👁️ 외관 변화', '도막을 더럽히지 않고 장막을 치듯 채도와 명도를 동시에 살짝 내려줌'], ['⚖️ 배합 비율', '명도를 1/10 단위로 아주 미세하게 떨어뜨릴 때 마이크로 도징 배합'], ['💡 비교 분석', '[테크닉] 메인 블랙(A926)을 쓰기엔 톤이 확 죽을까 봐 겁날 때 쓰는 대체제']] },

  // [2구간] 알루미늄 메탈릭
  '90-M99/00': { role: '수퍼 파인 알루미늄', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', desc: '입자가 보이지 않을 정도로 정제된 극미세 알루미늄 안료입니다.', details: [['⚗️ 화학적 특성', '금속 입자를 극한으로 정제하여 난반사를 억제한 초미립 렌티큘러 실버'], ['🎯 일반 특성', '입자감이 없어야 하는 최고급 수입차의 하이퍼 실버 도장 전용'], ['👁️ 외관 변화', '정면은 액체 거울(Liquid Metal)처럼 매끄럽고 측면은 묵직한 그레이로 차분하게 떨어짐'], ['⚖️ 배합 비율', '하이엔드 미립자 실버 조색 시 메인 베이스로 다량 배합'], ['💡 비교 분석', '[경고] 웻 코트를 치면 100% 뭉치므로(Clumping) 거리를 띄운 드롭 코트가 생명임']] },
  '90-M99/01': { role: '엑스트라 파인 알루미늄', type: 'silver_fine', face: '#f1f5f9', flop: '#475569', desc: '매우 고운 실버로, 측면이 부드러운 안료입니다.', details: [['⚗️ 화학적 특성', '튀는 난반사를 억제하도록 표면이 균일하게 컷팅된 미립자 구조'], ['🎯 일반 특성', '최신 차량의 입자감이 튀지 않는 차분한 고휘도 미립 실버톤에 사용'], ['👁️ 외관 변화', '거친 느낌 없이 도막 전체에 은은하고 고급스러운 금속 윤기를 형성'], ['⚖️ 배합 비율', '일반적인 미세 메탈릭 베이스 조색 시 메인 뼈대로 다량 투입'], ['💡 비교 분석', '[비교] 00번과 02번 사이의 절묘한 간극을 메우는 텍스처로 모틀링 제어가 수월함']] },
  '90-M99/02': { role: '파인 알루미늄', type: 'silver_fine', face: '#e2e8f0', flop: '#334155', desc: '가장 광범위하게 쓰이는 중간 고운 입자 은분입니다.', details: [['⚗️ 화학적 특성', '빛을 가장 안정적이고 둥글게 산란시키는 코발트형 입자 구조'], ['🎯 일반 특성', '대중적인 양산차 실버 및 밝은 쥐색 메탈릭의 근간이 되는 범용 은분'], ['👁️ 외관 변화', '과하게 빛나지도 칙칙하지도 않은 편안한 스탠다드 실버감을 선사'], ['⚖️ 배합 비율', '범용 실버 조색 레시피에서 가장 큰 중량 비중을 차지함'], ['💡 비교 분석', '[주의사항] 마이카 펄과 혼용 시 이 은분의 금속 스파클이 진주광을 억제할 수 있음']] },
  '90-M99/03': { role: '미디엄 알루미늄', type: 'silver_coarse', face: '#cbd5e1', flop: '#1e293b', desc: '정면/측면 명암 대비가 가장 뚜렷한 중간 입자 은분입니다.', details: [['⚗️ 화학적 특성', '빛을 강하게 반사시키는 렌티큘러 입자 특성이 나타나는 중간 굵기 알루미늄'], ['🎯 일반 특성', '명암 대비와 입체감이 살아야 하는 다크 그레이, 건메탈 계열 최적화'], ['👁️ 외관 변화', '정면은 화사하게 터지고 측면은 그림자가 묵직하게 지며 굴곡을 극대화'], ['⚖️ 배합 비율', '어두운 메탈릭 컬러 조색 시 메인 베이스로 활약'], ['💡 비교 분석', '[경고] 찌르는 스파클이 강해 부드러운 파스텔톤에 들어가면 입자가 지저분하게 떠 보임']] },
  '90-M99/04': { role: '라지 알루미늄', type: 'silver_coarse', face: '#94a3b8', flop: '#0f172a', desc: '매우 굵은 반사광을 발현하는 조대(Coarse) 알루미늄 입자입니다.', details: [['⚗️ 화학적 특성', '면적이 넓고 불규칙하게 컷팅된 초대형 금속 입자로 거친 난반사 유도'], ['🎯 일반 특성', '입자감이 도드라지는 특수 다크 실버 및 커스텀 튜닝카 베이스용'], ['👁️ 외관 변화', '거친 모래알이나 쇳조각이 부서지듯 야성적이고 화려한 스파클 폭발'], ['⚖️ 배합 비율', '도료 침전이 빠르므로 스프레이 직전 교반을 확실히 한 뒤 포인트로 첨가'], ['💡 비교 분석', '[경고] 입자 사이 빈 공간이 많아 자체 은폐력이 떨어져 바닥 색상 매칭 완벽 필수']] },
  '90-M99/10': { role: '실버 수퍼 파인', type: 'silver_fine', face: '#ffffff', flop: '#94a3b8', desc: '맑고 밝은 명도를 극한으로 유지하는 극미립자 특수 은분입니다.', details: [['⚗️ 화학적 특성', '탁색 불순물을 완전히 제거한 고휘도 극미립 렌티큘러 컷팅 공법'], ['🎯 일반 특성', '최고급 맑은 크롬톤 실버 메탈릭 및 고채도 캔디 하도용'], ['👁️ 외관 변화', '측면으로 누워도 탁해지지 않고 정/측면 모두 맑은 백색 크롬 밝기 유지'], ['⚖️ 배합 비율', '모틀링 제어를 위해 블렌딩 클리어(M5)와 믹싱하여 아주 얇게 분산 도포'], ['💡 비교 분석', '[경고] 반사율이 너무 예리해서 하도 샌딩 기스나 단차를 현미경처럼 드러냄']] },
  '90-905': { role: '벨벳 실버 III', type: 'silver_fine', face: '#e2e8f0', flop: '#cbd5e1', desc: '빛을 흡수하듯 부드러운 반광(Matte) 느낌을 주는 특수 실버입니다.', details: [['⚗️ 화학적 특성', '빛을 날카롭게 튕기지 않고 도막 내부에서 포근하게 흩뿌리도록 표면 처리됨'], ['🎯 일반 특성', '일부 OEM 차량의 매트 메탈릭 느낌 보정 및 플라스틱 범퍼 가니쉬 복원용'], ['👁️ 외관 변화', '은빛을 넘어 도막의 질감 자체를 부드럽고 뿌옇게 튜닝하는 효과 발현'], ['⚖️ 배합 비율', '매트 질감 극대화를 위해 지정 데이터 비율에 맞춰 정밀 혼합'], ['💡 비교 분석', '[테크닉] 표면 얼룩(모틀링)이 유독 심해 에어압을 낮추고 멀리서 건조하게(Dry) 흩뿌려야 함']] },
  '98-M919': { role: '크리스탈 실버 (시라릭 실버)', type: 'xirallic', face: '#ffffff', flop: '#e2e8f0', desc: '은분과 유리 펄의 장점만 결합시킨 궁극의 투명 실버입니다.', details: [['⚗️ 화학적 특성', '금속 특유의 탁함을 배제하고 투과율이 극대화된 시라릭 베이스 융합 안료'], ['🎯 일반 특성', '맑고 투명한 캔디톤 베이스 핵심 입자 및 눈부신 크리스탈 화이트 도장용'], ['👁️ 외관 변화', '탁한 쇳조각 반사가 아니라 투명한 유리 파편이 쨍하게 부서지는 압도적 맑음'], ['⚖️ 배합 비율', '믹싱 클리어와 교반하여 도막 맨 위에 투명한 스파클링 레이어로 분사'], ['💡 비교 분석', '[경고] 은폐력이 0%에 가까워 바닥 색상 영향을 100% 받음. 일반 은분으로 착각 시 하자 발생']] },

  // [3구간] 블루/그린/옐로우 계열
  '90-A528': { role: '메인 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', desc: '붉은/노란기가 전혀 섞이지 않은 가장 중립적인 청색 원색입니다.', details: [['⚗️ 화학적 특성', '웜/쿨 어느 쪽으로도 치우치지 않는 퓨어 블루 안료'], ['🎯 일반 특성', '대다수 솔리드 블루 및 범용 블루 메탈릭 조색의 핵심 뼈대'], ['👁️ 외관 변화', '정면의 맑은 파란색이 측면으로 갈수록 차분하고 정직하게 톤다운 됨'], ['⚖️ 배합 비율', '청색 계열 조색 시 도화지 역할로 가장 대량 투입'], ['💡 비교 분석', '[경고] 화이트 펄 안료와 섞이는 순간 맑은 채도가 급감하고 탁한 파스텔톤으로 뭉개짐']] },
  '90-A533': { role: '사파이어 블루', type: 'solid', face: '#1d4ed8', flop: '#1e40af', desc: '채도가 극도로 높고 영롱한 보석빛을 내는 하이엔드 블루 안료입니다.', details: [['⚗️ 화학적 특성', '빛 투과율을 극대화하여 메탈릭 입자와 결합 시 이중 반사를 일으키는 구조'], ['🎯 일반 특성', '고성능 스포츠카의 고채도 특수 블루 도장 전용'], ['👁️ 외관 변화', '빛을 뿜어내는 네온사인처럼 일반 블루가 범접할 수 없는 깊고 선명한 반사율'], ['⚖️ 배합 비율', '맑은 은분(99/10 등)과 결합하여 정면광을 한계치까지 끌어올릴 때 다량 사용'], ['💡 비교 분석', '[경고] 색이 너무 화려하게 튀어, 차분한 세단 색상 조색에 섞으면 톤이 가벼워지고 겉돎']] },
  '90-A563': { role: '미드 블루', type: 'solid', face: '#3b82f6', flop: '#1e3a8a', desc: '명도가 살짝 억제된 차분한 중간 톤의 솔리드 청색입니다.', details: [['⚗️ 화학적 특성', '블루 파장에 미세한 무채색 입자가 결합되어 채도 폭발을 막아줌'], ['🎯 일반 특성', '무게감 있는 다크 블루 차량 및 어두운 네이비 메탈릭 기본 하도용'], ['👁️ 외관 변화', '블랙을 타지 않고도 자연스럽고 진중한 블루 본연의 깊은 섀도우 형성'], ['⚖️ 배합 비율', '고채도 블루 색감을 차분하게 톤다운시킬 때 탁해지는 블랙 대신 투입'], ['💡 비교 분석', '[경고] 명도가 낮으므로 다량 배합 시 전체 색상이 칙칙해지는 탁색 위험 존재']] },
  '90-A589': { role: '진스 블루', type: 'solid', face: '#1e3a8a', flop: '#0f172a', desc: '낡은 데님 청바지처럼 깊고 진한 어두운 네이비 블루입니다.', details: [['⚗️ 화학적 특성', '블랙에 가까울 정도로 빛 흡수율이 높게 설계된 심연의 딥 블루 틴터'], ['🎯 일반 특성', '주간에만 파란빛이 감도는 묵직한 딥 블루 펄 메탈릭용'], ['👁️ 외관 변화', '정면은 다크 블루이나 측면은 완전한 흑색에 가까운 무거운 그림자 형성'], ['⚖️ 배합 비율', '가장 깊은 바다 같은 베이스 톤을 잡을 때 소량씩 조심스럽게 계량'], ['💡 비교 분석', '[경고] 블랙 원색이 추가 결합되면 파란색이 완전 소멸하고 완벽한 흑색으로 착각할 만큼 어두워짐']] },
  '90-A640': { role: '스프링 그린', type: 'solid', face: '#84cc16', flop: '#4d7c0f', desc: '명도와 채도가 매우 높은 맑고 싱그러운 라임색 안료입니다.', details: [['⚗️ 화학적 특성', '노란 파장과 녹색 파장이 최적 비율로 결합되어 맑은 발색 구현'], ['🎯 일반 특성', '고채도 라임색 스포츠카 솔리드 및 특수 에메랄드 메탈릭 도장용'], ['👁️ 외관 변화', '칙칙함 없이 투명하고 맑은 봄날 새싹처럼 화사하고 쨍한 질감 부여'], ['⚖️ 배합 비율', '옐로우 틴터와 혼용하여 형광빛 고채도 녹색 연출 시 메인 배합'], ['💡 비교 분석', '[경고] 블루 틴터를 잘못 혼용하면 탁한 청록색(시체색)으로 스와이프되며 톤이 망가짐']] },
  '90-A695': { role: '메인 그린', type: 'solid', face: '#15803d', flop: '#14532d', desc: '짙고 안정적인 가장 스탠다드한 기준점 녹색 안료입니다.', details: [['⚗️ 화학적 특성', '노란기/푸른기로 쏠리지 않은 정직하고 깊은 녹색 파장 흡수/반사'], ['🎯 일반 특성', '클래식한 솔리드 딥 그린 및 다크 펄의 기본 하도'], ['👁️ 외관 변화', '가볍게 뜨지 않고 묵직하고 진중한 정통 녹색의 깊이감 유지'], ['⚖️ 배합 비율', '그린 계열 베이스 바탕색 구축 시 광범위하게 쓰이는 필수 뼈대'], ['💡 비교 분석', '[경고] 단독 과량 사용 시 발색이 어두워지므로 맑은 색상 조색 시엔 투입량 조절 필수']] },
  '90-A696': { role: '올리브 그린', type: 'solid', face: '#4d7c0f', flop: '#3f6212', desc: '자연스럽고 탁한 흙빛이 섞인 카키/국방색 안료입니다.', details: [['⚗️ 화학적 특성', '무기질 산화 성향을 띠어 빛 반사를 부드럽게 흡수하는 탁색 녹색'], ['🎯 일반 특성', '오프로드 SUV 특유의 택티컬 밀리터리 카키 색상에 최적화'], ['👁️ 외관 변화', '선명함을 죽이고 흙/나무가 섞인 무겁고 탁한 야생 올리브 톤 발현'], ['⚖️ 배합 비율', '오커(황토)와 혼용하여 따뜻하고 야생적인 카키톤을 완벽히 재현'], ['💡 비교 분석', '[경고] 맑은 원색(스프링 그린 등)에 1방울이라도 섞이면 전체가 칙칙한 늪지대 색으로 탁해짐']] },
  '90-A105': { role: '오커 (황토)', type: 'solid', face: '#b45309', flop: '#451a03', desc: '은폐력이 매우 강하고 무거운 전형적인 황토색 안료입니다.', details: [['⚗️ 화학적 특성', '산화철 기반 무기질 안료로 빛 투과를 강하게 차단하는 불투명 구조'], ['🎯 일반 특성', '구형 베이지, 브론즈 솔리드 하도 및 빈티지 탁색 베이스용'], ['👁️ 외관 변화', '맑은 색상을 차분하게 짓누르며 도막 전체를 에이징 된 흙빛으로 다운시킴'], ['⚖️ 배합 비율', '진중한 웜톤 계열 명도 조절 시 소량씩 조심스럽게 사용'], ['💡 비교 분석', '[경고] 채도를 급격히 떨어뜨리므로 투명감이 생명인 맑은 골드/메탈릭 조색 시 투입 금지']] },
  '90-A115': { role: '메인 옐로우', type: 'solid', face: '#eab308', flop: '#a16207', desc: '불순물이 섞이지 않은 가장 맑고 선명한 표준 노란색입니다.', details: [['⚗️ 화학적 특성', '적색/청색 간섭을 차단한 고순도 퓨어 옐로우 유기 안료'], ['🎯 일반 특성', '스포츠카 등 눈길을 확 사로잡는 밝은 명시성의 옐로우 원톤 뼈대'], ['👁️ 외관 변화', '눈부시고 쨍한 순수 옐로우 반사를 통해 왜곡 없이 화사한 웜톤 광채 발산'], ['⚖️ 배합 비율', '모든 옐로우/오렌지 조색 시 메인 베이스로 대량 배합됨'], ['💡 비교 분석', '[경고] 순수 노란색이라 자체 은폐력이 매우 약해 화이트 서페이서(하도) 처리가 절대적 필수임']] },
  '90-A136': { role: '골든 오커', type: 'solid', face: '#d97706', flop: '#92400e', desc: '화사한 금빛 반사를 품은 맑은 황토색 안료입니다.', details: [['⚗️ 화학적 특성', '일반 산화철 탁도를 획기적으로 개선하여 빛 투과율을 높인 투명 산화철 구조'], ['🎯 일반 특성', '고급 샴페인 골드, 화이트 골드 메탈릭의 웜톤 바닥칠 및 틴팅용'], ['👁️ 외관 변화', '메탈릭 입자와 만나 칙칙한 흙빛 대신 맑고 투명한 빈티지 골드 효과 발현'], ['⚖️ 배합 비율', '은분과 직접 결합하여 고급스러운 골드 톤을 열어줄 때 정량 배합'], ['💡 비교 분석', '[경고] 보색 관계인 푸른색 안료와 섞이면 골드가 아닌 시퍼렇게 질린 시체색(녹갈색) 탁색 발생']] },
  '90-A148': { role: '레몬 골드', type: 'solid', face: '#fde047', flop: '#ca8a04', desc: '푸른빛이 살짝 감도는 매우 밝고 투명한 레몬 옐로우입니다.', details: [['⚗️ 화학적 특성', '적색 파장을 완벽히 배제하고 미세한 녹/청 파장을 결합시킨 서늘한 황색 안료'], ['🎯 일반 특성', '형광 옐로우 계열 스포츠 색상 및 맑은 하이퍼 실버의 레몬 틴팅 전용'], ['👁️ 외관 변화', '눈이 시리도록 밝고 투명한 형광 레몬빛 필터로 도막을 차갑고 예리하게 튜닝'], ['⚖️ 배합 비율', '시원하고 맑은 노란색 연출 시 칙칙해짐을 막기 위해 메인 베이스 투입'], ['💡 비교 분석', '[경고] 웜톤(레드)과 완벽 상극. 단 1방울만 섞여도 형광빛 즉각 소실 및 톤 붕괴']] },
  '90-A149': { role: '리듀스드 레몬 옐로우', type: 'solid', face: '#fef08a', flop: '#eab308', desc: '착색력을 강제로 대폭 낮춰 만든 안전망 레몬 안료입니다.', details: [['⚗️ 화학적 특성', 'A148의 착색 농도를 극도로 희석하여 아주 연한 셀로판지 효과만 줌'], ['🎯 일반 특성', '파스텔톤 연노랑 크림색 및 화이트 펄의 아주 미세한 웜톤 벤딩 보정용'], ['👁️ 외관 변화', '도막을 탁하게 덮지 않고 티가 날 듯 말 듯 투명하고 맑은 옐로우 틴팅 효과 부여'], ['⚖️ 배합 비율', '밝은 바탕에 노란 기운을 0.1g 단위로 줄 때 실패 확률을 줄이는 안전망(Safety net)'], ['💡 비교 분석', '[경고] 은폐력과 착색력이 거의 전무해 짙은 색에 섞으면 색이 완전히 먹혀 발현 안 됨']] },
  '90-A201': { role: '라이트 오렌지', type: 'solid', face: '#f97316', flop: '#c2410c', desc: '레드와 옐로우 경계에 있는 눈부시게 밝은 귤색 안료입니다.', details: [['⚗️ 화학적 특성', '옐로우 베이스에 적색 파장을 폭발적으로 결합시킨 웜톤 극채도 안료'], ['🎯 일반 특성', '포르쉐 파파야 오렌지 등 고채도 귤색 솔리드 및 포인트 스포츠카 전용'], ['👁️ 외관 변화', '어둡거나 탁하지 않고 불타오르는 듯한 역동적인 생동감과 화사함 부여'], ['⚖️ 배합 비율', '강렬한 레드/옐로우 조색 시 웜톤 채도를 끝까지 끌어올릴 때 다량 배합'], ['💡 비교 분석', '[경고] 채도가 억세 차분한 세단 컬러에 미량만 튀어도 톤이 형광펜처럼 떠 붓끝 관리 필수']] },

  // [4구간] 레드 & 마젠타 계열
  '90-3A0': { role: '체리 레드', type: 'solid', face: '#be123c', flop: '#7f1d1d', desc: '핏빛에 가까울 정도로 짙고 매혹적인 쿨톤 체리색 틴터입니다.', details: [['⚗️ 화학적 특성', '깊은 레드 파장에 미세한 푸른빛이 개입되어 서늘한 핏빛 와인 심도 형성'], ['🎯 일반 특성', '다크 와인 원톤 및 깊은 레드 펄 메탈릭 섀도우를 잡는 뼈대'], ['👁️ 외관 변화', '가볍게 뜨지 않고 도막 깊은 곳에서 차분하고 단단한 퍼플/체리 톤 음영 부여'], ['⚖️ 배합 비율', '다크 레드 조색 시 명도를 묵직하게 가라앉히기 위해 다량 배합'], ['💡 비교 분석', '[경고] 밝은 화사한 스포츠 레드 조색 시 들어가면 색이 순식간에 칙칙하고 무거워짐']] },
  '90-A306': { role: '옥사이드 레드', type: 'solid', face: '#7c2d12', flop: '#450a0a', desc: '은폐력이 압도적인 적갈색 무기 산화철 안료입니다.', details: [['⚗️ 화학적 특성', '빛을 완벽히 차단하는 강력한 무기질 산화철 구조로 하도를 빈틈없이 덮음'], ['🎯 일반 특성', '캔디 레드 도장 전 바닥칠 및 짙은 브라운 베이스의 뼈대 공사용'], ['👁️ 외관 변화', '화려한 붉은빛을 탁하고 묵직한 적갈색 흙빛으로 눌러 빈티지한 음영 연출'], ['⚖️ 배합 비율', '붉은 계열 도장 시 바닥 얼룩을 가리기 위한 은폐 콘크리트 베이스로 다량 쓰임'], ['💡 비교 분석', '[경고] 맑고 투명한 캔디 조색 틴터에 1방울만 섞여도 구정물처럼 오염되니 절대 격리']] },
  '90-A328': { role: '스탠다드 레드', type: 'solid', face: '#dc2626', flop: '#991b1b', desc: '가장 표준적이고 정직한 스탠다드 적색 솔리드입니다.', details: [['⚗️ 화학적 특성', '오렌지나 마젠타로 치우침이 없는 완벽한 정중앙의 퓨어 레드 파장'], ['🎯 일반 특성', '소방차 등 대중적이고 기준이 되는 솔리드 레드 원톤 필수 뼈대'], ['👁️ 외관 변화', '탁색이나 이질감 없이 화사하면서도 정직하고 따뜻한 붉은빛 도막 형성'], ['⚖️ 배합 비율', '적색 베이스 조색 시 기초 체력이 되는 스탠다드 비율 차지'], ['💡 비교 분석', '[테크닉] 은폐력이 100% 완벽하진 않으므로 하도 얼룩을 덮으려면 정석적인 웻 코트 겹침 필수']] },
  '90-A329': { role: '투명 레드 (캔디)', type: 'solid', face: '#ef4444', flop: '#b91c1c', desc: '빛 투과율이 매우 높은 맑은 고채도 투명 적색 틴터입니다.', details: [['⚗️ 화학적 특성', '안료 은폐력을 화학적으로 제거하여 맑은 셀로판지 효과를 내는 염료성 틴터'], ['🎯 일반 특성', '마쯔다 소울레드 크리스탈 등 프리미엄 캔디톤 3코트 레드 핵심 미들 코트'], ['👁️ 외관 변화', '빛이 도막을 뚫고 들어가 바닥 메탈릭을 치고 나오는 이중 반사 캔디 이펙트 폭발'], ['⚖️ 배합 비율', '밝은 메탈릭 위에 올라가 맑고 쨍한 붉은빛 필터 역할 수행'], ['💡 비교 분석', '[경고] 은폐력 전무. 바탕 서페이서 자국이나 샌딩 얼룩 돋보기처럼 비춰버림. 바닥 평탄화 생명']] },
  '90-A347': { role: '브라운', type: 'solid', face: '#78350f', flop: '#450a0a', desc: '깊고 따뜻한 톤의 솔리드 갈색 원색입니다.', details: [['⚗️ 화학적 특성', '일반 산화철의 칙칙한 흙빛을 빼고 맑게 정제된 초콜릿빛 웜톤 파장'], ['🎯 일반 특성', '초코 브라운, 브론즈 메탈릭 등 웜톤 다크 계열 조색 필수 베이스'], ['👁️ 외관 변화', '가볍지 않고 단단하며 부드러운 커피/초콜릿 질감의 고급 섀도우 형성'], ['⚖️ 배합 비율', '웜톤 메탈릭 조색 시 톤다운과 채도 유지를 동시에 수행할 때 투입'], ['💡 비교 분석', '[경고] 명도가 낮아 야간엔 완전한 검은색으로 착각할 정도로 진하게 발현되니 톤 체크 유의']] },
  '90-A350': { role: '다크 레드', type: 'solid', face: '#831843', flop: '#4c0519', desc: '명도가 극도로 억제된 짙고 묵직한 진자주색 원색입니다.', details: [['⚗️ 화학적 특성', '레드 채도를 잃지 않으면서 명도만 암실처럼 극한으로 낮춘 설계'], ['🎯 일반 특성', '묵직한 플럼(자두)색 및 딥 다크 레드 메탈릭 무게감을 잡는 바탕 뼈대'], ['👁️ 외관 변화', '피를 깊게 머금은 듯한 차분하고 단단한 진자주색 섀도우를 바닥에 깔아줌'], ['⚖️ 배합 비율', '깊은 메탈릭 레드의 심도 개방 시 블랙 대신 메인 베이스로 다량 배합'], ['💡 비교 분석', '[경고] 자체 명도가 암흑에 가까워 계량 시 0.1g만 튀어도 전체 톤이 시커멓게 암전됨']] },
  '90-A372': { role: '스칼렛', type: 'solid', face: '#ef4444', flop: '#991b1b', desc: '강렬한 주황빛이 도는 눈부신 다홍색/스칼렛 안료입니다.', details: [['⚗️ 화학적 특성', '레드 파장에 옐로우 파장이 최적 결합되어 빛을 가장 강하게 튕겨내는 구조'], ['🎯 일반 특성', '페라리 등 스포츠카 특유의 밝고 경쾌하며 시선을 찌르는 다홍색 원톤용'], ['👁️ 외관 변화', '가장 뜨겁고 눈이 시린 화려한 고채도 웜톤 스파클을 터뜨림'], ['⚖️ 배합 비율', '노란색 안료와 미세 혼용하여 시선을 끄는 스포티한 발색 연출 시 메인으로 사용'], ['💡 비교 분석', '[경고] 정숙한 차량에 실수로 섞으면 톤이 오렌지로 경박하게 틀어져 복구 불가']] },
  '98-M319': { role: '라디언트 레드 (시라릭)', type: 'pearl', face: '#be123c', flop: '#7f1d1d', desc: '보석처럼 투과되는 극채도 특수 레드 틴터입니다.', details: [['⚗️ 화학적 특성', '무기 안료가 아닌 염료(Dye) 베이스에 가까운 극강 투과율의 핏빛 스파클'], ['🎯 일반 특성', '프리미엄 3코트 캔디 레드 이펙트 전용 특수 안료'], ['👁️ 외관 변화', '빛을 내부로 완전히 흡수했다가 바닥을 치고 뱉어내는 3D 입체 유리알 텍스처'], ['⚖️ 배합 비율', '믹싱 클리어와 교반하여 3코트 도장 틴팅 층으로 고르게 분사'], ['💡 비교 분석', '[경고] 1코트 단독 사용 절대 불가. 바탕색 매칭 실패 시 최종 색상도 구제 불능 망가짐']] },

  // [5구간 이상 특수 펄/에코 라인]
  '93-M010': { role: '스탠다드 화이트 펄', type: 'pearl', face: '#ffffff', flop: '#e2e8f0', desc: '가장 대중적인 표준 진주빛 마이카 펄입니다.', details: [['⚗️ 화학적 특성', '천연 운모에 티타늄 코팅을 입힌 스탠다드 간섭 구조'], ['🎯 일반 특성', '양산차 화이트 펄 미들 코트의 중심 뼈대'], ['👁️ 외관 변화', '부드럽고 둥근 우윳빛 진주 난반사 연출'], ['⚖️ 배합 비율', '화이트 펄 조색 시 압도적 대량 첨가'], ['💡 비교 분석', '[주의사항] 웻 코트로 뭉치면 황변 하자 발생']] },
  '90-A34': { role: '다이아몬드 화이트', type: 'xirallic', face: '#ffffff', flop: '#f1f5f9', desc: '유리 파편처럼 예리하게 부서지는 크리스탈 화이트입니다.', details: [['⚗️ 화학적 특성', '투과율 극대화 인공 크리스탈 시라릭 펄'], ['🎯 일반 특성', '최고급 플래그십 세단 화이트 펄 전용'], ['👁️ 외관 변화', '태양광 아래 눈을 찌르는 쨍한 스파클링'], ['⚖️ 배합 비율', '소량 정량 엄수'], ['💡 비교 분석', '[주의사항] 분말 형태라 믹싱 클리어에 완벽 액상화 필수']] },
  '98-M80': { role: '매직 카멜레온 (시안-퍼플)', type: 'xirallic', face: '#2dd4bf', flop: '#a855f7', desc: '청록에서 보라로 변환되는 펄입니다.', details: [['⚗️ 화학적 특성', '입사각에 따라 스펙트럼이 꺾이는 다층 코팅 구조'], ['🎯 일반 특성', '특수 쇼카 투톤 컬러용'], ['👁️ 외관 변화', '정면 청록 측면 보라 완벽 180도 스와이프'], ['⚖️ 배합 비율', '독립 레이어로 정밀 분사'], ['💡 비교 분석', '[경고] 바탕이 딥 블랙이 아니면 탁한 은가루로 보임']] },
  '22-MC35': { role: '2K 우레탄 믹싱 클리어', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '22라인 우레탄의 뼈대와 방패 수지입니다.', details: [['⚗️ 화학적 특성', '자외선/오염 방어 하이솔리드 코팅제 겸용 뼈대'], ['🎯 일반 특성', '상도 클리어 없는 22라인 원톤 컬러 뼈대'], ['👁️ 외관 변화', '건조 후 젤리처럼 맑고 깊은 묵직한 고광택 발현'], ['⚖️ 배합 비율', '22라인 조색 시 대량 배합'], ['💡 비교 분석', '[경고] 경화제 비율 틀어지면 크랙 하자 직빵 발생']] },
  '100-MB50': { role: '100라인 에코 믹싱 베이스', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '100라인 안료를 펴주는 혁신 수지입니다.', details: [['⚗️ 화학적 특성', '퍼짐성 극대화 차세대 에코 분산 수지'], ['🎯 일반 특성', '100라인 에코 시스템 전 색상 필수 뼈대'], ['👁️ 외관 변화', '도막을 얇고 단단히 잡아 메탈릭 배열 최고 투명도 안착'], ['⚖️ 배합 비율', '100라인 구축 시 필수 베이스'], ['💡 비교 분석', '[경고] 90라인 수지와 혼용 시 즉각 젤리처럼 굳어버림 대참사']] }
};

// 💡 스마트 자동 완성 로직 (숫자/영문 최우선! m5 치면 90-M5로 완벽 변환)
const autoFormatGlasuritCode = (input: string) => {
    let val = input.toUpperCase().replace(/[^A-Z0-9/]/g, '');
    if (!val) return val;
    const keys = Object.keys(TONER_DB);
    let match = keys.find(k => k.replace(/-/g, '') === val.replace(/-/g, ''));
    if (match) return match;
    match = keys.find(k => k.split('-')[1] === val);
    if (match) return match;
    match = keys.find(k => k.split('-')[1]?.replace(/\//g, '') === val);
    if (match) return match;
    return input.toUpperCase(); 
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
        const savedBase = localStorage.getItem('glasurit_master_base'); const savedPearl = localStorage.getItem('glasurit_master_pearl'); 
        if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl));
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('glasurit_master_base', JSON.stringify(toners)); localStorage.setItem('glasurit_master_pearl', JSON.stringify(pearlToners)); 
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

  // 스마트 타자 자동 완성 (m5 -> 90-M5)
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = autoFormatGlasuritCode(newCode); 
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { 
      if (t.id === id) { 
        if (TONER_DB[formattedCode]) setFocusTarget({ id: id, type: 'weight' }); 
        return { ...t, code: formattedCode }; 
      } 
      return t; 
    }));
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
        const info = TONER_DB[toner.code] || { role: '미등록 안료 (M5, E3 등을 입력해보세요)', type: 'solid', face: '#334155', flop: '#1e293b', desc: '코드를 입력해주세요.' };
        const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
        return (
          <div key={toner.id} className="flex flex-col bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300">
            <div className="flex items-center p-3 gap-3">
              <div className="flex w-14 h-14 rounded-md shadow-inner border border-slate-600 overflow-hidden shrink-0 cursor-pointer" onClick={() => toggleExpand(toner.id, isPearl)}>
                <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                <div className="flex-1 border-l border-slate-600" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, isPearl)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                    className="w-24 bg-slate-900 border border-slate-600 text-cyan-300 text-center font-black rounded p-1 focus:border-cyan-400 focus:outline-none uppercase placeholder-slate-600" placeholder="코드" />
                  <span className="font-bold text-sm text-slate-200 truncate">{info.role}</span>
                </div>
              </div>
              <div className="flex items-center bg-slate-900 border border-slate-600 rounded-md px-2 py-1 shrink-0">
                <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} 
                  onChange={e => handleWeightChange(toner.id, e.target.value, isPearl)} onKeyDown={(e) => { if(e.key==='Enter') addToner(isPearl); }}
                  className="w-16 bg-transparent text-right text-lg font-black text-yellow-400 focus:outline-none" placeholder="0.0" />
                <span className="text-xs font-bold text-slate-500 ml-1">g</span>
                <button onClick={() => removeToner(toner.id, isPearl)} className="ml-3 text-slate-500 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
            {toner.isExpanded && info.details && (
              <div className="bg-slate-900 p-4 border-t border-slate-700 text-sm">
                <div className="text-slate-400 mb-3 text-xs border-b border-slate-700 pb-2">{info.desc}</div>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-black text-cyan-500 shrink-0 w-[100px]">{detail[0]}</span>
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
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-xl z-10 relative">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-800 rounded flex items-center justify-center font-bold text-white shadow-lg border border-cyan-500/30">
            GF
          </div>
          BASF 글라슈리트 <span className="text-cyan-400">90-Line</span> <span className="text-xs text-cyan-400 font-normal ml-2 tracking-widest border border-cyan-800 px-2 py-1 rounded-full bg-cyan-900/20">PRO MASTER EDITION</span>
        </h1>
      </header>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto mt-4">
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

        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col h-[800px]">
            <h3 className="text-lg font-black mb-4 text-white flex items-center gap-2"><BookOpen className="text-cyan-500" size={20}/> 글라슈리트 마스터 사전</h3>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-slate-500" size={18} />
              <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="검색: 영문/숫자 코드 (예: M5) 또는 이름" className="w-full bg-slate-800 border border-slate-700 text-cyan-300 pl-10 pr-4 py-3 rounded-xl focus:border-cyan-500 focus:outline-none shadow-inner font-bold placeholder-slate-600" />
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
                                <span className="font-bold text-cyan-600 shrink-0 w-[100px]">{d[0]}</span>
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
