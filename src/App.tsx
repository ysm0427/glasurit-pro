import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket, Columns, Mail, Code, Users, CreditCard, AlertTriangle, ThumbsUp, Eye, Calendar, RefreshCw, MessageSquare, Send, Save, CheckCircle, Edit3, Target, Edit
} from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

const LAST_PATCH_DATE = "2026.09.14 (글라슈리트 BASF 전용 뼈대 런칭)"; 

export const PEARL_LEVELS = [
  // 여기에 글라슈리트 전용 펄 입자 크기 및 비교 데이터를 넣을 예정입니다.
];

export const TONER_DB: Record<string, TonerData> = {
  // 💡💡💡 여기에 대표님이 주실 글라슈리트 안료 데이터가 들어갈 자리입니다! 💡💡💡
  // 예시:
  '90-A032': { 
    role: '화이트 펄 (예시)', type: 'pearl', face: '#ffffff', flop: '#e2e8f0', 
    desc: '글라슈리트 90라인 화이트 펄 예시 데이터입니다.', 
    details: [
      ['🎨 광학적 특성', '예시 내용입니다.'],
      ['💡 비교 분석', '[비교] 90-A032 vs 90-A031\n예시 비교 분석입니다.']
    ] 
  }
};

export const OEM_COLORS: { code: string; name: string }[] = [
    // 👇👇👇 여기에 글라슈리트 엑셀 데이터 복사 👇👇👇

    // 👆👆👆 여기에 글라슈리트 엑셀 데이터 복사 👆👆👆
];

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('분말') || r.includes('글라스'); };

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
    if(title.includes("특성") || title.includes("분말") || title.includes("캔디") || title.includes("배합")) return "bg-teal-50 text-teal-700 border-teal-300 shadow-sm";
    if(title.includes("용도") || title.includes("컬러") || title.includes("확인")) return "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm";
    if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-300 shadow-sm";
    if(title.includes("비교") || title.includes("유동성") || title.includes("원리")) return "bg-yellow-100 text-yellow-800 border-yellow-400 shadow-md font-black";
    if(title.includes("경고") || title.includes("주의") || title.includes("한계") || title.includes("철칙")) return "bg-red-50 text-red-700 border-red-300 shadow-sm font-black";
    return "bg-slate-50 text-slate-700 border-slate-300 shadow-sm";
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬') || r.includes('캔디')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹') || r.includes('에메랄드')) { h = 150; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황') || r.includes('오렌지')) { h = 45; s = 80; baseL = 50; }
  else if (r.includes('화이트') || r.includes('백')) { h = 0; s = 0; baseL = 90; }
  else if (r.includes('블랙') || r.includes('흑')) { h = 0; s = 0; baseL = 15; }
  else if (r.includes('실버') || r.includes('알루미늄')) { h = 210; s = 10; baseL = 60; }
  else { h=0; s=0; baseL=95; } 
  const isMetallic = isTonerMetallic(r);
  if (angle === 'face') {
    const l = isMetallic ? Math.min(100, baseL + 25) : Math.min(100, baseL + 10);
    return `radial-gradient(circle at 40% 40%, hsl(${h}, ${s}%, ${Math.min(100, l+20)}%) 0%, hsl(${h}, ${s}%, ${l}%) 60%, hsl(${h}, ${s}%, ${Math.max(0, l-15)}%) 100%)`;
  } else {
    const l = isMetallic ? Math.max(0, baseL - 30) : Math.max(0, baseL - 15);
    return `radial-gradient(circle at 10% 10%, hsl(${h}, ${s}%, ${Math.min(100, l+10)}%) 0%, hsl(${h}, ${s}%, ${l}%) 100%)`;
  }
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
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

  // 💡 글라슈리트 라인에 맞춰 탭 이름 변경 (90라인, 22라인, 100라인 등)
  const [activeTab, setActiveTab] = useState<'90'|'100'|'ADDITIVE'>('90');
  
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
  // 💡 글라슈리트 라인 분류 로직 변경
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === 'ADDITIVE') return !code.startsWith('90-') && !code.startsWith('100-');
    if (activeTab === '100') return code.startsWith('100-');
    return code.startsWith('90-'); 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.toUpperCase();
      return item.code.includes(searchTxt) || item.role.toUpperCase().includes(searchTxt);
  });

  useEffect(() => { document.title = "글라슈리트 조색 Pro"; setIsLoaded(true); }, []);

  // 💡 글라슈리트 안료 코드 자동완성 로직 (사용자가 90A032 치면 90-A032 로 자동 변환)
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    let rawVal = newCode.toUpperCase().replace(/[^0-9A-Z-]/g, ''); 
    
    // 자동 하이픈 추가 (예: 90A -> 90-A, 100M -> 100-M)
    if (rawVal.startsWith('90') && !rawVal.includes('-') && rawVal.length > 2) {
        rawVal = '90-' + rawVal.substring(2);
    } else if (rawVal.startsWith('100') && !rawVal.includes('-') && rawVal.length > 3) {
        rawVal = '100-' + rawVal.substring(3);
    }

    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { 
        if (toner.id === id) return { ...toner, code: rawVal }; 
        return toner; 
    }));
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val; 
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t)); else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[320px] notranslate" translate="no">
      <header className="bg-slate-900 flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0 gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* 💡 앵무새 대신 텍스트 로고나 바스프 컬러(빨강)로 변경 */}
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">G</span></div>
          <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2 w-full">
              <span className="text-white tracking-wide truncate">글라슈리트(BASF)</span>
              <span className="text-red-400 font-normal shrink-0">조색 Pro</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-1 hidden sm:inline-block shrink-0">v1.0</span>
          </h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
           {/* 워크시트 상단 부분 (스피스헥커와 동일 구조) */}
           <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
              <div className="text-sm font-bold text-slate-800 flex items-center shrink-0"><Sliders className="text-red-600 mr-2" size={16} />공식 배합 워크 시트</div>
              {/* 입력 폼 (차량번호, 컬러코드 등 - 생략, 스피스헥커와 동일하게 넣으면 됨) */}
           </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex flex-col h-full bg-slate-100">
                <div className="flex bg-slate-900 shrink-0">
                    <button onClick={()=>{setActiveTab('90'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === '90' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>💧 90 LINE (수성)</button>
                    <button onClick={()=>{setActiveTab('100'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === '100' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>✨ 100 LINE (에코)</button>
                    <button onClick={()=>{setActiveTab('ADDITIVE'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'ADDITIVE' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>⚗️ 첨가제 및 수지</button>
                </div>
                {/* 안료 리스트 렌더링 부분 (스피스헥커와 동일 구조) */}
                <div className="p-10 text-center text-slate-400 font-bold">
                    대표님이 글라슈리트 데이터를 넣어주시면 이 공간이 완벽하게 채워집니다!
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
