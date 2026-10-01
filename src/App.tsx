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

export default App; 
