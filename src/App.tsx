import React, { useState, useMemo } from 'react';
import { TONER_DB, shortcuts, TonerData } from './tonerDB';

// ━━━━━━━━ 글라슈리트 용어 사전 데이터 (전면 복구) ━━━━━━━━
const GLOSSARY_DATA = [
  { term: 'Face (정면)', desc: '태양광이나 조명을 수직(90도)으로 직접 받았을 때 보이는 색상과 밝기입니다.' },
  { term: 'Flop (측면)', desc: '시선을 비스듬히(대략 15~45도) 눕혀서 측면 섀도우를 볼 때 나타나는 색상과 밝기 변화입니다. (플롭 현상)' },
  { term: 'Solid (솔리드)', desc: '은분이나 펄 입자가 섞이지 않은 순수한 원색 물감(안료)입니다.' },
  { term: 'Metallic (메탈릭)', desc: '알루미늄(은분) 입자가 포함되어 금속 특유의 반짝임과 정측면 명암비(대비)를 강하게 내는 도료입니다.' },
  { term: 'Pearl / Mica (펄/마이카)', desc: '빛을 투과하고 굴절시키는 천연 운모 입자로, 부드럽고 입체적인 진주광을 냅니다.' },
  { term: 'Xirallic (질라릭/실라릭)', desc: '인공 크리스탈(Alumina Flake)로 만들어져 일반 펄보다 빛 투과율이 압도적으로 높고 다이아몬드처럼 거칠게 반짝이는 하이엔드 안료입니다.' },
  { term: '은폐력 (Opacity/Hiding Power)', desc: '페인트가 바닥면(하도 서페이서나 퍼티)을 가리고 완벽하게 덮어버리는 능력을 말합니다.' },
  { term: '보카시 (Blending)', desc: '부분 도장 시 기존 도막과 새로 칠한 도막의 경계선이 보이지 않게 자연스럽게 흩뿌려 녹여 잇는 그라데이션 기술입니다.' },
  { term: '모틀링 (Mottling)', desc: '메탈릭이나 펄 입자가 도막 내에서 고르게 펴지지 못하고 뭉쳐서 구름처럼 얼룩덜룩해지는 치명적인 도장 하자입니다.' },
  { term: 'HS (High Solid) / MS', desc: 'HS는 페인트 내에 날아가는 용제가 적고 실제 도막이 되는 수지 성분이 많아 살오름성(두께감)이 뛰어난 도료이며, MS는 중간 형태입니다.' }
];

// 우측 라인별 카테고리 탭 목록
const CATEGORIES = ['전체', '90라인', '100라인', '22라인', '68라인', '특수/이펙트', '첨가제/경화제'];
const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // 용어 사전 모달 핸들러
  const openGlossary = () => setIsGlossaryOpen(true);
  const closeGlossary = () => setIsGlossaryOpen(false);
 // ━━━━━━━━ 스마트 단축키 검색 및 필터링 로직 ━━━━━━━━
  const filteredToners = useMemo(() => {
    let results = Object.entries(TONER_DB);

    // 1. 라인별 카테고리 필터링
    if (activeCategory !== '전체') {
      results = results.filter(([key, data]) => {
        if (activeCategory === '90라인') return key.startsWith('90-') && !['binder','additive'].includes(data.type);
        if (activeCategory === '100라인') return key.startsWith('100-') && !['binder','additive'].includes(data.type);
        if (activeCategory === '22라인') return key.startsWith('22-') && !['binder','additive'].includes(data.type);
        if (activeCategory === '68라인') return key.startsWith('68-') && !['binder','additive'].includes(data.type);
        if (activeCategory === '특수/이펙트') return key.startsWith('11-') || data.type === 'pearl' || data.type === 'xirallic';
        if (activeCategory === '첨가제/경화제') return ['binder', 'clear', 'hardener', 'thinner', 'primer', 'putty', 'additive'].includes(data.type);
        return true;
      });
    }

    // 2. 검색어 필터링 (스마트 매칭 알고리즘)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.trim().toUpperCase();
      
      // 단축키 매핑본에서 정확한 풀네임 키 찾기 (예: 'M4' -> '90-M4' 또는 '22-M4')
      const exactMatchKey = shortcuts[query]; 

      const exactMatches: [string, TonerData][] = [];
      const partialMatches: [string, TonerData][] = [];

      results.forEach(([key, data]) => {
        // [우선순위 1등] 단축키가 정확히 일치하는 경우
        if (exactMatchKey && key === exactMatchKey) {
          exactMatches.push([key, data]);
        } 
        // [우선순위 1등] 입력어 자체가 키와 완전히 일치하는 경우 (예: '90-M4')
        else if (key.toUpperCase() === query) {
          exactMatches.push([key, data]);
        }
        // [우선순위 2등] 그 외 코드나 설명에 글자가 포함되어 있는 경우
        else if (
          key.toUpperCase().includes(query) ||
          data.role.toUpperCase().includes(query) ||
          data.desc.toUpperCase().includes(query)
        ) {
          // 중복 추가 방지
          if (exactMatchKey !== key) {
            partialMatches.push([key, data]);
          }
        }
      });

      // 정확히 일치한 항목을 맨 위에, 부분 일치 항목을 그 아래에 배치
      results = [...exactMatches, ...partialMatches];
    }

    return results;
  }, [searchTerm, activeCategory]);
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-6 bg-blue-900 text-white p-5 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Glasurit Toner DB</h1>
        <button 
          onClick={openGlossary}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-lg shadow transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📖</span> 글라슈리트 용어 사전
        </button>
      </header>

      {/* 라인별 카테고리 필터 탭 */}
      <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-gray-200 pb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-2 px-5 rounded-full font-bold text-sm md:text-base transition-all duration-200 shadow-sm ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 용어 사전 모달창 (UI 복구) */}
      {isGlossaryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📖</span> 글라슈리트 용어 사전
              </h2>
              <button 
                onClick={closeGlossary} 
                className="text-white hover:text-red-400 text-3xl font-bold transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 bg-gray-50">
              {GLOSSARY_DATA.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-lg text-gray-800 mb-2">{item.term}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
     {/* ━━━━━━━━ 스마트 검색창 영역 ━━━━━━━━ */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="🔍 안료명 또는 단축키 검색 (예: M4, 90-M4, 1250, 투명)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 text-lg border-2 border-blue-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 font-medium placeholder-gray-400"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400"></span>
      </div>

      {/* 검색 결과 카운트 */}
      <div className="mb-4 text-gray-600 font-medium px-2 flex justify-between items-center">
        <span>총 <strong className="text-blue-700 text-lg">{filteredToners.length}</strong>개의 안료가 검색되었습니다.</span>
      </div>

      {/* ━━━━━━━━ 안료 카드 리스트 렌더링 영역 ━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredToners.map(([code, toner]) => (
          <div key={code} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            
            {/* 카드 헤더 (안료 코드 및 롤) */}
            <div 
              className="bg-gray-800 text-white p-4 flex justify-between items-center border-b-4" 
              style={{ borderColor: toner.face.startsWith('#') ? toner.face : '#3b82f6' }}
            >
              <h2 className="text-xl font-bold tracking-wider">
                {code} <span className="text-sm font-normal text-gray-300 ml-1">{toner.role}</span>
              </h2>
              <span className="px-3 py-1 bg-gray-700 text-xs font-semibold rounded-full border border-gray-600 shadow-inner">
                {toner.type.toUpperCase()}
              </span>
            </div>
            
            {/* 카드 바디 */}
            <div className="p-5 flex-1 flex flex-col">
              
              {/* 색상 미리보기 (Face & Flop) */}
              <div className="flex gap-3 mb-5">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">정면 (Face)</p>
                  <div 
                    className="h-12 rounded-lg shadow-inner border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600" 
                    style={{ backgroundColor: toner.face.startsWith('#') ? toner.face : '#f3f4f6' }}
                  >
                    {!toner.face.startsWith('#') && toner.face}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">측면 (Flop)</p>
                  <div 
                    className="h-12 rounded-lg shadow-inner border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600" 
                    style={{ backgroundColor: toner.flop.startsWith('#') ? toner.flop : '#f3f4f6' }}
                  >
                    {!toner.flop.startsWith('#') && toner.flop}
                  </div>
                </div>
              </div>
              
              {/* 안료 핵심 요약 (desc) */}
              <p className="text-sm text-gray-800 font-bold mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 leading-snug">
                {toner.desc}
              </p>
              
              {/* 안료 상세 정보 (details) */}
              {toner.details && toner.details.length > 0 && (
                <div className="space-y-4 mt-auto">
                  {toner.details.map((detail, idx) => (
                    <div key={idx} className="text-sm border-l-4 border-blue-400 pl-3 bg-gray-50 py-2 pr-2 rounded-r-md">
                      <strong className="text-blue-900 block mb-1 text-xs">{detail[0]}</strong>
                      <span className="text-gray-600 leading-relaxed text-xs sm:text-sm block">{detail[1]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* ━━━━━━━━ 검색 결과 없음 예외 처리 ━━━━━━━━ */}
      {filteredToners.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
          <span className="text-5xl block mb-4">🥲</span>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500">다른 단축키(예: M4)나 안료명을 입력해보세요.</p>
        </div>
      )}
    </div>
  );
};
{/* ━━━━━━━━ Pro 제작 과정 모달창 (윤성만 팀장님 릴리즈 노트) ━━━━━━━━ */}
      {isProcessOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border-2 border-gray-300">
            
            {/* 헤더 영역 */}
            <div className="bg-gray-900 px-6 py-5 flex justify-between items-center border-b-4 border-blue-500">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                  글라슈리트 마스터 DB 아키텍처 구축 내역
                </h2>
                <p className="text-blue-300 text-sm mt-1 font-semibold">
                  Total 161 Items Perfectly Built & Engineered
                </p>
              </div>
              <button 
                onClick={() => setIsProcessOpen(false)} 
                className="text-gray-400 hover:text-white text-4xl font-bold transition-colors"
              >
                &times;
              </button>
            </div>

            {/* 작성자 명시 영역 */}
            <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-end">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300 shadow-sm mr-2">
                Version 2.0.0 Masterpiece
              </span>
              <span className="text-gray-700 font-bold text-sm">
                Lead Color & Data Engineer : <span className="text-black font-extrabold text-base">윤성만 팀장</span>
              </span>
            </div>

            {/* 본문 릴리즈 노트 영역 */}
            <div className="p-6 overflow-y-auto space-y-6 bg-gray-50">
              
              {/* 1. 90라인 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                <h3 className="font-extrabold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">Update 1</span>
                  90라인 수용성 솔리드 전면 교정 (총 38개 품목)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  기존 단순 명칭에 의존한 AI의 톤(웜톤/쿨톤) 유추 오류를 공식 기술지원집의 정면/측면 색상 데이터를 기반으로 완벽히 교정했습니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2 pl-4 list-disc marker:text-blue-500">
                  <li><strong className="text-gray-900">90-A503 (스카이 블루):</strong> 다크 코발트 블루 묘사 삭제 → 정/측면 산뜻한 녹미(Greenish) 청색으로 교정.</li>
                  <li><strong className="text-gray-900">90-A927 (블랙 2):</strong> 차가운 블루블랙 오표기 수정 → A926 저농 기반의 따뜻한 적황미(Red-yellowish) 발현으로 교정.</li>
                  <li><strong className="text-gray-900">98-A097 (마이크로 화이트):</strong> 고농 불투명 솔리드 오표기 수정 → 바탕 은폐 불가한 완전 투명 백색 틴터로 확립.</li>
                </ul>
              </div>

              {/* 2. 22라인 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
                <h3 className="font-extrabold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm">Update 2</span>
                  22라인 우레탄 솔리드 및 틴터 체계 확립 (총 28개 품목)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  가장 큰 수정이 일어난 파트로, 품번 알파벳 오류를 교정하고 뼈대(페인트)와 조미료(틴터)의 역할을 명확히 분리했습니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2 pl-4 list-disc marker:text-red-500">
                  <li><strong className="text-gray-900">저농 틴터 알파벳 오류 교정:</strong> A105, A126 오표기를 기술집 기준 M105, M126 등으로 전면 교체.</li>
                  <li><strong className="text-gray-900">고농(뼈대) vs 저농(틴터) 분리:</strong> M60, M26 등 은폐력이 막강한 뼈대 안료를 틴팅에 사용할 경우 발생하는 탁색 하자를 경고. 미세 톤 보정 시에는 은폐력이 파괴된 저농 틴터만 투입하도록 로직 엄격 적용.</li>
                </ul>
              </div>

              {/* 3. 특수 펄 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-500">
                <h3 className="font-extrabold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">Update 3</span>
                  11/93/98라인 특수 펄 및 파우더 이펙트 (총 26개 품목)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  펄 안료의 핵심인 '측면 플롭(Flop) 반사광'과 도장 방식(액상 vs 분말)에 대한 치명적 오류를 바로잡았습니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2 pl-4 list-disc marker:text-purple-500">
                  <li><strong className="text-gray-900">11-E120 (엠버 골드 펄):</strong> 측면 붉은빛 오표기 수정 → 정면 골드, 측면 백청미(하얗고 푸른빛)가 도는 역전 플롭 특성 확립.</li>
                  <li><strong className="text-gray-900">파우더 펄 독립 분류 (11-M021, M033 등):</strong> 액상형 취급 오류 수정. 100% 교반 및 드롭 코트 미준수 시 발생하는 좁쌀/멍자국 하자 경고 로직 추가.</li>
                </ul>
              </div>

              {/* 4. 신규 카테고리 (55라인 & 부자재) */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-emerald-500">
                <h3 className="font-extrabold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm">Update 4</span>
                  신규 카테고리 전면 추가 (총 60개 품목)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  기존 DB의 공백을 기술지원집을 통해 완벽하게 채워 넣어 완전한 시스템을 구축했습니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2 pl-4 list-disc marker:text-emerald-500">
                  <li><strong className="text-gray-900">55라인 유성 시스템 46종 신규 구축:</strong> 55-M99/19(표준 광휘형) 등 은분 10종, 55-M319(질라릭 착색) 등 펄 14종, 유색/틴터 22종 완벽 동기화.</li>
                  <li><strong className="text-gray-900">상도 투명 클리어 (4종):</strong> 923-155(MS), 923-255(HS), 923-447(불소), 923-55(무광) 등 용도 세분화.</li>
                  <li><strong className="text-gray-900">하도재 및 경화제/첨가제 (10종):</strong> 프라이머 필러(285-16, 550), 퍼티(839-20), 온도별 경화제(929-33, 93, 55), 플라스틱 범퍼 유연제(522-111), 보카시(55-8.500) 등 혼합비/건조시간 규격 확립.</li>
                </ul>
              </div>

              {/* 요약 결론 */}
              <div className="bg-gray-800 p-5 rounded-xl shadow-inner mt-4">
                <p className="text-gray-200 text-sm leading-relaxed text-center">
                  본 시스템은 90라인(수용성 47종), 22라인(우레탄 28종), 55라인(유성 46종), 특수펄(26종)의 안료부터 도장의 뼈대를 세우고 마감하는 클리어, 서페이서, 경화제, 유연제 등 <strong className="text-white text-base">총 161종의 데이터</strong>가 단 하나의 누락이나 명칭 오류 없이 설계된 <strong className="text-blue-400">완벽한 마스터 데이터베이스</strong>입니다.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
export default App; 
