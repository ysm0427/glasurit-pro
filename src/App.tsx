// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, X, Maximize, Beaker, Sun, 
  Layers, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, 
  FileSpreadsheet, History, Mail, Code, Calendar, Eye, ThumbsUp, 
  CheckCircle, Edit3, Target, MessageSquare, Send, Save, RefreshCw 
} from 'lucide-react';

import { TONER_DB, shortcuts, PEARL_LEVELS, OEM_COLORS } from './tonerDB';
import { FeedbackModal } from './FeedbackModal';

if (typeof window !== 'undefined' && !document.querySelector('#tailwind-script')) {
  const script = document.createElement('script');
  script.id = 'tailwind-script';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('다이아몬드') || r.includes('시라릭') || r.includes('크리스탈'); };

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

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const w = t.adjustedWeight || ''; return `${t.code}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { 
  if (!str) return []; 
  const baseTime = Date.now();
  return str.split('*').map((t, i) => { 
    const [c, w] = t.split('_'); 
    return { id: `restored_${baseTime}_${i}_${Math.random().toString(36).substring(2, 7)}`, code: c || '', adjustedWeight: w || '', history: [], memo: '', isExpanded: false }; 
  }); 
};

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
  const [designReady, setDesignReady] = useState(false); 
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
  const [activeTab, setActiveTab] = useState<'90LINE'|'100LINE'|'22LINE'|'68LINE'|'EFFECT'|'ADDITIVE'>('90LINE');
  
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
  const glossarySearchRef = useRef<HTMLInputElement | null>(null);

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === '90LINE') return code.startsWith('90-');
    if (activeTab === '100LINE') return code.startsWith('100-');
    if (activeTab === '22LINE') return code.startsWith('22-');
    if (activeTab === '68LINE') return code.startsWith('68-');
    if (activeTab === 'EFFECT') return code.startsWith('93-') || code.startsWith('98-') || ['90-A34', '90-A35'].includes(code);
    if (activeTab === 'ADDITIVE') return code.startsWith('H-') || code.startsWith('R-') || code.startsWith('285-') || code.startsWith('923-') || code === '522-111';
    return true; 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.toUpperCase();
      return item.code.includes(searchTxt) || item.role.toUpperCase().includes(searchTxt);
  });

  useEffect(() => {
    let attempts = 0;
    const timer = setInterval(() => {
      if ((window as any).tailwind || attempts > 50) { clearInterval(timer); setDesignReady(true); }
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
                let parsedData: any = null;
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
      if (!isLoaded || typeof window === 'undefined') return;
      localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
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

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const val = newCode.toUpperCase().replace(/[^A-Z0-9/.\- ]/g, '');
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => t.id === id ? { ...t, code: val } : t));
  };

  const resolveCode = (rawVal: string): string => {
    const val = rawVal.toUpperCase().trim();
    if (!val) return val;
    if (shortcuts[val]) return shortcuts[val];
    if (TONER_DB[val]) return val;
    const keys = Object.keys(TONER_DB);
    const exact    = keys.find(k => k === val);
    const stripped = keys.find(k => k.replace(/[-\/]/g,'') === val.replace(/[-\/]/g,''));
    const starts   = keys.find(k => k.startsWith(val));
    const includes = keys.find(k => k.includes(val));
    return exact || stripped || starts || includes || val;
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
        if (t.id !== id) return t;
        const resolved = resolveCode(t.code);
        if (TONER_DB[resolved]) setFocusTarget({ id, type: 'weight' });
        return { ...t, code: resolved };
    }));
  };

  const handleCodeBlur = (e: React.FocusEvent<HTMLInputElement>, id: string, isPearl = false) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
        if (t.id !== id) return t;
        return { ...t, code: resolveCode(t.code) };
    }));
  };

  const addToner = (isPearl = false) => { 
      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
      if (isPearl) setPearlToners(prev => [...prev, newToner]); 
      else setToners(prev => [...prev, newToner]); 
      setFocusTarget({ id: newId, type: 'code' }); 
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

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => { 
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const currentList = isPearl ? pearlToners : toners;
    const current = currentList.find(t => t.id === id);
    if (current?.adjustedWeight) { handleWeightBlur(id, current.adjustedWeight, isPearl); }
    
    const idx = currentList.findIndex(t => t.id === id);
    if (idx === currentList.length - 1) { addToner(isPearl); } 
    else { const nextId = currentList[idx + 1].id; setFocusTarget({ id: nextId, type: 'code' }); }
  };

  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  
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
    return `[조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 93-E3 수지 (50%): ${(parseFloat(totalBaseWeight) * 0.5).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 합계: ${totalPearlWeight}g\n▶ 93-E3 수지 (50%): ${(parseFloat(totalPearlWeight) * 0.5).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 총량: ${((parseFloat(totalBaseWeight) * 1.5) + (isThreeCoatMode ? (parseFloat(totalPearlWeight) * 1.5) : 0)).toFixed(1)}g\n\n👉 링크:\n${shareUrl}`;
  };

  const handleShareKakao = () => { 
    const text = generateShareText();
    const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(text)}`;
    const start = Date.now();
    window.location.href = kakaoUrl;
    setTimeout(() => {
        if (Date.now() - start < 1500) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => alert("📋 앱을 열 수 없습니다. 클립보드에 복사되었습니다! 카카오톡에 붙여넣으세요."));
            }
        }
    }, 1000);
    setIsShareModalOpen(false); 
  };

  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  
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
      const val = glossarySearchRef.current?.value?.trim();
      if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; }
      window.open(`https://www.google.com/search?q=글라슈리트+조색+${val}+뜻`, '_blank');
  };

  if (!designReady) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#38bdf8', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>🎨 글라슈리트 시스템 초기화 중...</h2>
        <p style={{ marginTop: '10px', color: '#94a3b8' }}>인터넷 환경에 따라 최대 3~4초 정도 소요될 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[180px] lg:pb-[140px] notranslate" translate="no">
      <header className="bg-slate-900 flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0 gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">GF</span></div>
          <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2 w-full">
              <span className="text-white tracking-wide truncate">윤성만 님을 위한 BASF (글라슈리트) PRO MASTER EDITION</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-1 hidden sm:inline-block shrink-0">모바일 UI 최적화 완료</span>
          </h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button onClick={() => setIsGlossaryModalOpen(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                📖 글라슈리트 용어 사전
            </button>
            <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <RefreshCw size={14} /> 업데이트
            </button>
            <button onClick={() => setIsBoardOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Layers size={14} /> 시편 게시판
            </button>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center shrink-0"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트</h2>
              <button onClick={handleClearAllInfo} className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center transition-colors bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm shrink-0"><Trash2 size={14} className="mr-1"/> 전체 초기화</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📅 등록 날짜</label><input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm cursor-pointer" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚗 차량 번호</label><input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="예: 12가3456" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm h-12" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label><input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm h-12" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label><input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm h-12 notranslate" translate="no" /></div>
              </div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🛠️ 작업 내용</label><input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="예: 조수석 앞휀다 교환 등" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm h-12" /></div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📌 특이사항 및 스펙 메모</label><input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="직접 입력 (예: 이색 심함)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 h-12" /></div>
              <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 mt-2">
                <button onClick={() => setIsExcelModalOpen(true)} className="flex-1 min-w-[120px] bg-green-600 text-white p-3 rounded-xl text-xs font-black flex items-center justify-center hover:bg-green-700 shadow-sm"><FileSpreadsheet size={16} className="mr-1 hidden sm:block"/> 엑셀 복사</button>
                <button onClick={() => { saveToBoard(); setIsBoardOpen(true); }} className="flex-1 min-w-[120px] bg-blue-600 text-white p-3 rounded-xl text-xs font-black flex items-center justify-center hover:bg-blue-700 shadow-sm"><Layers size={16} className="mr-1 hidden sm:block"/> 시편 공유</button>
                <button onClick={() => setIsShareModalOpen(true)} className="flex-[2] min-w-[150px] bg-[#FEE500] text-slate-900 p-3 rounded-xl text-sm font-black flex items-center justify-center hover:bg-[#E5C100] shadow-sm"><Share2 size={18} className="mr-1.5"/> 공유 전송</button>
                <button onClick={handleResetFormula} className="w-[60px] bg-white border border-red-200 text-red-500 rounded-xl flex flex-col items-center justify-center hover:bg-red-50 shadow-sm"><Trash2 size={18} className="mb-0.5" /><span className="text-[9px] font-black">리셋</span></button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between shadow-sm gap-3">
                <div className="flex items-center gap-2"><Beaker size={16} className="text-indigo-600" /><span className="text-sm font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-16 h-10 text-center text-base font-black text-indigo-700 border rounded-lg" />
                    <span className="text-[12px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="flex-1 sm:flex-none h-10 bg-indigo-600 text-white text-sm font-bold px-4 rounded-lg shadow-sm hover:bg-indigo-700">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="flex-1 sm:flex-none h-10 bg-white border border-indigo-300 text-indigo-700 text-sm font-bold px-4 rounded-lg shadow-sm hover:bg-indigo-50">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1"><span>▼ 베이스 원색 리스트 (Ground Coat)</span></div>
              {toners.map((toner, idx) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-3 mb-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {/* 입력칸 및 코드 영역 */}
                      <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                          <div className="flex w-16 h-14 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative" 
                               onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: false, text: toner.memo || '', history: toner.history || []})}>
                               <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                               <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                               {toner.memo && <div className="absolute top-1 right-1 bg-yellow-400 w-3 h-3 rounded-full border border-white shadow-sm"></div>}
                          </div>
                          <input 
                              ref={el => { codeRefs.current[toner.id] = el; }} 
                              value={toner.code} 
                              onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                              onKeyDown={e => handleCodeKeyDown(e, toner.id, false)}
                              onBlur={e => handleCodeBlur(e, toner.id, false)}
                              type="text"
                              inputMode="text"
                              className="w-full sm:w-32 h-14 text-center text-xl font-black border-2 border-slate-300 rounded-xl px-2 focus:border-blue-500 focus:outline-none shadow-inner shrink-0 uppercase bg-white" 
                              placeholder="코드입력" 
                              autoCapitalize="characters"
                              autoCorrect="off"
                              autoComplete="off"
                              spellCheck={false}
                          />
                      </div>
                      
                      {/* 큼직한 무게 입력 및 액션 영역 */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex items-center flex-1 bg-white border-2 border-slate-200 rounded-xl px-1 py-1 shadow-sm h-14">
                             <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="w-12 h-full text-red-500 font-black text-2xl hover:bg-red-50 rounded-lg flex items-center justify-center">-</button>
                             <input 
                                 ref={el => { weightRefs.current[toner.id] = el; }} 
                                 inputMode="decimal" 
                                 type="text"
                                 pattern="[0-9.]*" 
                                 value={toner.adjustedWeight} 
                                 onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} 
                                 onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} 
                                 onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                                 className="w-full text-center text-2xl font-black text-blue-600 focus:outline-none clean-number-input bg-transparent mx-1" 
                                 placeholder="0.0" 
                             />
                             <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="w-12 h-full text-blue-500 font-black text-2xl hover:bg-blue-50 rounded-lg flex items-center justify-center">+</button>
                          </div>
                          <span className="text-sm font-black text-slate-400 shrink-0 mx-1">g</span>
                          <button onClick={() => removeToner(toner.id, false)} className="w-14 h-14 bg-slate-100 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors shrink-0"><Trash2 size={22} className="text-slate-400 hover:text-red-500"/></button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full mt-2 px-1">
                        <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1.5 px-2 rounded-lg transition-colors flex-1 overflow-hidden" onClick={() => toggleExpand(toner.id, false)}>
                            <span className="font-bold text-blue-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                            {toner.isExpanded ? <ChevronUp size={18} className="text-blue-400 shrink-0" /> : <ChevronDown size={18} className="text-blue-400 shrink-0" />}
                        </div>
                    </div>

                    {toner.isExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-3 border-t border-slate-200 px-1">
                            {info.details && info.details.length > 0 ? (
                                <div className="flex flex-col gap-2 w-full">
                                    {info.details.map((d: any, i: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-3 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 rounded-lg border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[11px] font-black leading-tight break-keep">{mainTitle}</span>
                                                {subTitle && <span className="text-[10px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className="text-xs text-slate-700 leading-relaxed break-keep pt-0.5 whitespace-pre-line">{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            ) : <p className="text-xs text-slate-500 leading-tight break-keep">{info.desc}</p>}
                        </div>
                    )}

                    {/* ✨ 대안 A 적용: 모바일 편의성 극대화된 [다음 안료 추가] 버튼 */}
                    {idx === toners.length - 1 && (
                       <button onClick={() => addToner(false)} className="mt-4 w-full h-14 border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-black text-lg flex justify-center items-center transition-all shadow-sm">
                          <Plus size={24} className="mr-2"/> 다음 안료 추가
                       </button>
                    )}
                  </div>
                )
              })}
              
              <div className="flex w-full gap-2 mt-3">
                  <button onClick={handleSaveSnapshot} className="flex-1 bg-indigo-600 text-white rounded-xl py-3 hover:bg-indigo-700 font-bold text-sm flex justify-center items-center transition-all shadow-md">
                      <Save size={18} className="mr-1.5"/>데이터 확정
                  </button>
                  <button onClick={() => setIsSnapshotModalOpen(true)} className="flex-1 bg-slate-800 text-white rounded-xl py-3 hover:bg-slate-700 font-bold text-sm flex justify-center items-center transition-all shadow-md relative">
                      <History size={18} className="mr-1.5"/>수정 내역
                      {snapshots.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">{snapshots.length}</span>}
                  </button>
              </div>
            </div>
            
            <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shadow-sm hover:bg-purple-50 transition-colors w-full">
                  <span className="flex-1 text-sm font-black text-purple-700">3Coat (펄 추가) 켜기</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform ${isThreeCoatMode ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </label>
            </div>

            {isThreeCoatMode && (
              <div className="pt-5 mt-5 border-t border-purple-200 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 flex justify-between border-b pb-1"><span>▼ 펄 코트 (Mid Coat)</span></div>
                {pearlToners.map((toner, idx) => {
                  const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-3 mb-2 rounded-2xl border-2 border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {/* 입력칸 및 코드 영역 */}
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                            <div className="flex w-16 h-14 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative" 
                                 onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: true, text: toner.memo || '', history: toner.history || []})}>
                                 <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                                 <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                 {toner.memo && <div className="absolute top-1 right-1 bg-yellow-400 w-3 h-3 rounded-full border border-white shadow-sm"></div>}
                            </div>
                            <input 
                                ref={el => { codeRefs.current[toner.id] = el; }} 
                                value={toner.code} 
                                onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                                onKeyDown={e => handleCodeKeyDown(e, toner.id, true)}
                                onBlur={e => handleCodeBlur(e, toner.id, true)}
                                type="text" 
                                inputMode="text"
                                className="w-full sm:w-32 h-14 text-center text-xl font-black border-2 border-purple-300 rounded-xl px-2 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500 shrink-0 uppercase bg-white" 
                                placeholder="코드입력" 
                                autoCapitalize="characters"
                                autoCorrect="off"
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                        
                        {/* 큼직한 무게 입력 및 액션 영역 */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center flex-1 bg-white border-2 border-purple-200 rounded-xl px-1 py-1 shadow-sm h-14">
                               <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="w-12 h-full text-red-500 font-black text-2xl hover:bg-red-50 rounded-lg flex items-center justify-center">-</button>
                               <input 
                                   ref={el => { weightRefs.current[toner.id] = el; }} 
                                   inputMode="decimal" 
                                   type="text"
                                   pattern="[0-9.]*" 
                                   value={toner.adjustedWeight} 
                                   onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} 
                                   onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} 
                                   onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                                   className="w-full text-center text-2xl font-black text-purple-600 focus:outline-none clean-number-input bg-transparent mx-1" 
                                   placeholder="0.0" 
                               />
                               <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="w-12 h-full text-blue-500 font-black text-2xl hover:bg-blue-50 rounded-lg flex items-center justify-center">+</button>
                            </div>
                            <span className="text-sm font-black text-slate-400 shrink-0 mx-1">g</span>
                            <button onClick={() => removeToner(toner.id, true)} className="w-14 h-14 bg-slate-100 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors shrink-0"><Trash2 size={22} className="text-purple-300 hover:text-red-500"/></button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full mt-2 px-1">
                          <div className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1.5 px-2 rounded-lg transition-colors flex-1 overflow-hidden" onClick={() => toggleExpand(toner.id, true)}>
                              <span className="font-bold text-purple-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                              {toner.isExpanded ? <ChevronUp size={18} className="text-purple-400 shrink-0" /> : <ChevronDown size={18} className="text-purple-400 shrink-0" />}
                          </div>
                      </div>

                      {toner.isExpanded && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-3 border-t border-purple-200 px-1">
                              {info.details && info.details.length > 0 ? (
                                  <div className="flex flex-col gap-2 w-full">
                                      {info.details.map((d: any, i: number) => {
                                          const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                          if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                          return (
                                          <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-3 mb-2">
                                              <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 rounded-lg border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                  <span className="text-[11px] font-black leading-tight">{mainTitle}</span>
                                                  {subTitle && <span className="text-[10px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                              </div>
                                              <span className={`text-xs leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-bold' : 'text-slate-700'}`}>{d[1]}</span>
                                          </div>
                                      )})}
                                  </div>
                              ) : <p className="text-xs text-slate-500 leading-tight break-keep">{info.desc}</p>}
                          </div>
                      )}

                      {/* ✨ 대안 A 적용: 모바일 편의성 극대화된 [다음 안료 추가] 버튼 */}
                      {idx === pearlToners.length - 1 && (
                         <button onClick={() => addToner(true)} className="mt-4 w-full h-14 border-2 border-dashed border-purple-400 bg-purple-100/50 hover:bg-purple-200/50 rounded-xl text-purple-700 font-black text-lg flex justify-center items-center transition-all shadow-sm">
                            <Plus size={24} className="mr-2"/> 다음 펄 조색제 추가
                         </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-4 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black mb-3 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Target size={16} className="mr-1.5 text-purple-600"/> 💎 PEARL OPTICS SPECTRUM MAP</span>
                <button onClick={() => setIsConfiguratorOpen(true)} className="text-[11px] px-3 py-2 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={12} className="mr-1.5"/>먼셀 컬러 믹싱 랩</button>
              </h3>
              
              <div 
                  className="h-44 rounded-xl overflow-hidden shadow-inner border border-slate-300 cursor-pointer relative group transition-all" 
                  onClick={() => setIsPearlGuideOpen(true)}
                  style={{ background: 'linear-gradient(to right, #f8fafc 0%, #cbd5e1 20%, #8b5cf6 50%, #1e3a8a 80%, #0f172a 100%)' }}
              >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <span className="bg-white/90 text-slate-900 font-black px-5 py-3 rounded-full text-sm shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform"><BookOpen size={18}/> 글라슈리트 펄/이펙트 마스터 인덱스 열기</span>
                  </div>
              </div>

              <div className="flex gap-2 mt-4 relative z-50">
                  <button onClick={() => setIsEmailModalOpen(true)} className="flex-1 bg-yellow-400 border border-yellow-500 text-slate-900 py-3 rounded-xl text-sm font-black flex items-center justify-center hover:bg-yellow-500 transition-colors shadow-sm cursor-pointer">
                      <Mail size={18} className="mr-1.5 text-slate-800 pointer-events-none" /> <span className="pointer-events-none">다이렉트 피드백 보내기</span>
                  </button>
                  <button onClick={() => setIsHistoryModalOpen(true)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl text-sm font-black flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-sm cursor-pointer">
                      <Code size={18} className="mr-1.5 text-slate-400 pointer-events-none" /> <span className="pointer-events-none">Pro 제작 과정 보기</span>
                  </button>
              </div>
            </div>

            <div className="flex flex-col h-full bg-slate-100">
                <div className="flex bg-slate-900 shrink-0 overflow-x-auto custom-scrollbar">
                    <button onClick={()=>{setActiveTab('90LINE'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[80px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === '90LINE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>💧 90라인</button>
                    <button onClick={()=>{setActiveTab('100LINE'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[80px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === '100LINE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🌱 100라인</button>
                    <button onClick={()=>{setActiveTab('22LINE'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[80px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === '22LINE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🚚 22라인</button>
                    <button onClick={()=>{setActiveTab('68LINE'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[80px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === '68LINE' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🚌 68라인</button>
                    <button onClick={()=>{setActiveTab('EFFECT'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[90px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === 'EFFECT' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}>✨ 특수/이펙트</button>
                    <button onClick={()=>{setActiveTab('ADDITIVE'); setCatalogSearch('');}} className={`flex-1 py-4 px-3 min-w-[100px] text-[13px] font-black transition-colors whitespace-nowrap ${activeTab === 'ADDITIVE' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🧪 첨가제/경화제</button>
                </div>
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex shrink-0 gap-2">
                    <div className="relative flex-1">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / 색상코드 (예: 919, M4) 검색" className="w-full bg-slate-900 border border-slate-600 text-white text-sm px-3 py-3 rounded-xl pl-10 focus:outline-none focus:border-blue-500 transition-colors h-12" />
                        <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {activeTab === 'EFFECT' && (
                        <div className="mb-4 bg-purple-50 border border-purple-300 p-4 rounded-xl shadow-sm">
                           <h4 className="text-sm font-black text-purple-800 mb-2">⚠️ 글라슈리트 스페셜 이펙트 도장 가이드</h4>
                           <ul className="text-xs text-purple-700 space-y-1.5 font-bold">
                              <li>1. 투명도가 생명입니다. 바탕색 평활도(샌딩)를 완벽히 하세요.</li>
                              <li>2. 캔디나 크리스탈 펄은 블렌딩 시 얼룩 발생률이 매우 높습니다.</li>
                              <li>3. 분말 타입(90-A34 등)은 믹싱 클리어와 100% 교반해야 뭉치지 않습니다.</li>
                           </ul>
                        </div>
                    )}
                    
                    {catalogSearch.trim() !== '' && OEM_COLORS.some(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())) && (
                        <div className="mb-3 p-4 bg-blue-50 rounded-2xl border border-blue-200 shadow-sm">
                            <h4 className="text-sm font-black text-blue-800 mb-3">🔍 OEM 색상코드 검색 결과</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {OEM_COLORS.filter(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())).slice(0, 20).map((oem, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400" onClick={() => setTargetColorCode(oem.code)}>
                                        <span className="font-black text-blue-600 text-base">{oem.code}</span>
                                        <span className="text-sm text-slate-600 font-bold truncate max-w-[120px]">{oem.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sortedCatalog.map((item) => {
                        const isMetallic = item.type !== 'solid' && item.type !== 'binder' && item.type !== 'candy';
                        const isCurrentlyUsed = activeCodes.includes(item.code);
                        return (
                            <div key={item.code} className={`flex flex-col bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                                <div className="h-16 w-full relative transition-all border-b border-slate-200" style={{background: getTonerDetailBackground(item.code, item.role, 'face')}}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-2 left-4 text-white text-base font-black drop-shadow-md">{item.code} <span className="text-[11px] font-normal opacity-90 ml-1.5">{item.role}</span></div>
                                    {isCurrentlyUsed && <div className="absolute top-2 right-3 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow">배합 중</div>}
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <p className="text-xs text-slate-500 font-bold mb-1 break-keep leading-tight bg-slate-50 p-2 rounded-lg">{item.desc}</p>
                                    {item.details?.map((d: any, idx: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-2 text-[10px] font-bold rounded-lg border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[11px] font-black leading-tight">{mainTitle}</span>
                                                {subTitle && <span className="text-[10px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className={`text-xs leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-black' : 'text-slate-700'}`}>{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ 모바일 완벽 최적화된 Sticky Bottom Bar + E3(50%) 고정 산출 로직 적용 */}
      <div className="fixed bottom-0 left-0 w-full z-[500] bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-12px_45px_rgba(0,0,0,0.85)] text-slate-100 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-row p-3 sm:p-4 justify-between items-stretch gap-3 max-w-screen-2xl mx-auto">
            
            <div className="flex flex-col gap-1.5 flex-1 justify-center">
                <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs sm:text-sm">
                   <span className="text-slate-400 font-black tracking-widest text-[10px] sm:text-xs">A. 베이스</span>
                   <div className="flex items-center gap-1.5 sm:gap-3">
                     <div className="flex flex-col items-end sm:items-center"><span className="text-[9px] text-slate-500 font-bold hidden sm:block">순수안료</span><span className="text-white font-black">{totalBaseWeight}g</span></div>
                     <span className="text-slate-600 font-black">+</span>
                     <div className="flex flex-col items-end sm:items-center"><span className="text-[9px] text-blue-400 font-bold">E3 수지 (50%)</span><span className="text-blue-400 font-black">{(parseFloat(totalBaseWeight) * 0.5).toFixed(1)}g</span></div>
                   </div>
                </div>
                {isThreeCoatMode && (
                <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs sm:text-sm">
                   <span className="text-purple-400 font-black tracking-widest text-[10px] sm:text-xs">B. 펄 코트</span>
                   <div className="flex items-center gap-1.5 sm:gap-3">
                     <div className="flex flex-col items-end sm:items-center"><span className="text-[9px] text-slate-500 font-bold hidden sm:block">순수안료</span><span className="text-white font-black">{totalPearlWeight}g</span></div>
                     <span className="text-slate-600 font-black">+</span>
                     <div className="flex flex-col items-end sm:items-center"><span className="text-[9px] text-purple-400 font-bold">E3 수지 (50%)</span><span className="text-purple-400 font-black">{(parseFloat(totalPearlWeight) * 0.5).toFixed(1)}g</span></div>
                   </div>
                </div>
                )}
            </div>
            
            <div className="flex flex-col items-center justify-center shrink-0 bg-gradient-to-br from-amber-950/50 to-yellow-900/20 border-2 border-yellow-500/60 px-5 sm:px-8 py-2 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
               <span className="text-[10px] sm:text-[11px] text-yellow-500 font-black tracking-widest flex items-center uppercase"><Beaker size={14} className="mr-1"/> 최종 총량</span>
               <span className="text-2xl sm:text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] leading-none mt-1 sm:mt-2">
                  {(parseFloat((parseFloat(totalBaseWeight) * 1.5).toFixed(1)) + (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * 1.5).toFixed(1)) : 0)).toFixed(1)}<span className="text-sm sm:text-xl font-bold text-yellow-600 ml-0.5">g</span>
               </span>
            </div>

          </div>
      </div>

      {memoModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-indigo-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Edit3 size={18} /> {memoModal.code || '선택된 안료'} 메모 및 히스토리</h3>
              <button onClick={() => setMemoModal({...memoModal, isOpen: false})} className="hover:text-red-200 transition-colors bg-indigo-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 bg-slate-50">
              <div>
                <label className="text-xs font-black text-indigo-800 mb-1.5 flex items-center gap-1"><Edit3 size={14}/> 조색 커스텀 메모</label>
                <textarea 
                    value={memoModal.text} 
                    onChange={e => setMemoModal({...memoModal, text: e.target.value})} 
                    placeholder="이 안료에 대한 특별한 조색 팁이나 주의사항을 자유롭게 적어두세요." 
                    className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner font-medium" 
                />
              </div>
              {memoModal.history.length > 0 && (
                <div>
                  <label className="text-xs font-black text-slate-500 mb-1.5 flex items-center gap-1"><History size={14}/> 용량(g) 변경 히스토리 기록</label>
                  <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-sm max-h-32 overflow-y-auto">
                    {memoModal.history.map((h, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">{h}g</span>
                    ))}
                  </div>
                </div>
              )}
              <button 
                  onClick={() => {
                      if(memoModal.isPearl) setPearlToners(prev => prev.map(t => t.id === memoModal.id ? {...t, memo: memoModal.text} : t));
                      else setToners(prev => prev.map(t => t.id === memoModal.id ? {...t, memo: memoModal.text} : t));
                      setMemoModal({...memoModal, isOpen: false});
                  }} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
              >
                <Save size={18}/> 메모 저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border-2 border-green-600">
            <div className="p-4 bg-green-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><FileSpreadsheet size={18} /> 엑셀(Excel) 연동 가이드 및 복사</h3>
              <button onClick={() => setIsExcelModalOpen(false)} className="hover:text-red-200 transition-colors bg-green-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 bg-slate-50">
              <div className="text-sm text-slate-700 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="font-black text-green-800 mb-2">✅ 초간단 엑셀 복사 사용 방법 (매크로 불필요!)</p>
                  <p><b>Step 1.</b> 처음 사용하실 때만 아래 <b>'엑셀 기본 양식 복사'</b>를 눌러 엑셀 A1 셀에 붙여넣어 <b>제목 틀</b>을 만드세요.</p>
                  <p className="mt-1"><b>Step 2.</b> 데이터 입력 후 <b>초록색 [엑셀 복사] 버튼을 누른 다음, 엑셀의 빈 줄 첫 칸(A열)에 바로 붙여넣기(Ctrl+V)</b> 하시면 자동으로 팝업 복원 링크가 생성됩니다.</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                  <button onClick={handleCopyExcelTemplate} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-sm hover:bg-slate-700 transition-colors text-sm">📋 Step 1. 엑셀 기본 양식 복사 (제목줄 만들기)</button>
                  <button onClick={handleDirectExcelCopy} className="w-full bg-green-600 text-white py-4 rounded-xl font-black shadow-md hover:bg-green-700 transition-colors text-sm">🚀 Step 2. 현재 데이터 엑셀 복사 (배합 저장하기)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Share2 size={18} /> 배합 데이터 공유 전송</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="hover:text-red-200 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 bg-slate-50">
                <button onClick={handleShareKakao} className="w-full bg-[#FEE500] text-slate-900 py-3.5 rounded-xl font-black shadow-sm hover:bg-[#E5C100] transition-colors flex items-center justify-center gap-2"><MessageSquare size={18}/> 카카오톡 복사 전송</button>
                <button onClick={handleShareSMS} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"><Send size={18}/> 문자(SMS)로 앱 열기</button>
                
                {/* ✨ 네이버 / 구글 메일 쪼개기 + 배합 데이터 자동 입력 */}
                <div className="flex gap-2 w-full mt-1">
                    <button 
                        onClick={() => {
                            window.open(`https://mail.naver.com/v2/new?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`, '_blank');
                            setIsShareModalOpen(false);
                        }} 
                        className="flex-1 bg-[#03C75A] text-white py-3.5 rounded-xl font-black shadow-sm hover:bg-[#02b350] transition-colors flex items-center justify-center gap-1.5 text-sm"
                    >
                        <Mail size={16}/> 네이버 메일
                    </button>
                    <button 
                        onClick={() => {
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`, '_blank');
                            setIsShareModalOpen(false);
                        }} 
                        className="flex-1 bg-white border border-slate-300 text-slate-700 py-3.5 rounded-xl font-black shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm"
                    >
                        <Mail size={16}/> 구글 메일
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 새롭게 연결된 EmailJS 피드백 팝업창 */}
      <FeedbackModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        targetColorCode={targetColorCode}
      />

      {isSnapshotModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] rounded-2xl w-[800px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-slate-900">
              <h3 className="text-white font-bold flex items-center gap-2"><History size={18} className="text-blue-400" /> 현재 페이지 데이터 수정 내역 보기</h3>
              <button onClick={() => setIsSnapshotModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0f172a]">
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50 overflow-y-auto bg-slate-900/50 flex flex-col">
                    {snapshots.length === 0 ? ( <div className="p-6 text-center text-slate-500 text-sm">확정된 기록이 없습니다.</div> ) : (
                        snapshots.map((snap, idx) => (
                            <button key={snap.id} onClick={() => setSelectedSnapshot(snap)} className={`p-4 text-left border-b border-slate-800 transition-colors flex flex-col gap-1 ${selectedSnapshot?.id === snap.id ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800'}`}>
                                <span className="text-xs text-slate-400 font-bold">{snap.dateStr}</span>
                                <span className="text-white font-black text-sm">{snapshots.length - idx}차 확정 데이터</span>
                                <span className="text-xs text-emerald-400 font-bold flex items-center"><CheckCircle size={12} className="mr-1"/> {snap.timestamp}</span>
                            </button>
                        ))
                    )}
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-[#0f172a]">
                    {selectedSnapshot ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-3"><Search size={20} className="text-yellow-400"/> 데이터 상세 보기 및 복원</h4>
                            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50 mb-4 flex justify-between items-center"><span className="text-sm text-slate-300 font-bold">최종 혼합 총량</span><span className="text-xl font-black text-yellow-400">{selectedSnapshot.totalFinal}g</span></div>
                            <div className="mb-4">
                                <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Layers size={14} className="text-blue-400"/> 베이스 코트 내역</h5>
                                <div className="space-y-2">
                                    {selectedSnapshot.base?.filter((t: any) => t.code).map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-slate-700/50">
                                            <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">{t.code}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">{TONER_DB[t.code]?.role || ''}</span></div>
                                            <span className="text-blue-400 font-bold">{t.adjustedWeight}g</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedSnapshot.isThreeCoat && selectedSnapshot.pearl?.filter((t: any) => t.code).length > 0 && (
                                <div className="mb-6">
                                    <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Zap size={14} className="text-purple-400"/> 펄 코트 내역</h5>
                                    <div className="space-y-2">
                                        {selectedSnapshot.pearl?.filter((t: any) => t.code).map((t: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-purple-900/30">
                                                <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">{t.code}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">{TONER_DB[t.code]?.role || ''}</span></div>
                                                <span className="text-purple-400 font-bold">{t.adjustedWeight}g</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => restoreSnapshot(selectedSnapshot)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-4 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all flex justify-center items-center gap-2 text-base"><RefreshCw size={20}/> 이 상태로 완벽하게 덮어쓰기 (복원)</button>
                        </div>
                    ) : ( <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50"><History size={64} className="mb-4"/><p className="font-bold">왼쪽에서 확인하실 수정 내역을 선택해주세요.</p></div> )}
                </div>
            </div>
          </div>
        </div>
      )}

      {isBoardOpen && (
        <div className="fixed inset-0 bg-slate-900/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl w-[800px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-300">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} className="text-emerald-400"/> 브랜드별 실시간 시편 데이터 (Beta)</h3>
              <button onClick={() => setIsBoardOpen(false)} className="hover:text-red-300 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3 shrink-0">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['전체', ...Array.from(new Set(boardPosts.map(p => p.brand).filter(Boolean)))].map(b => (
                        <button key={b as string} onClick={() => setBoardBrandFilter(b as string)} className={`px-3 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${boardBrandFilter === b ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'}`}>{b as string}</button>
                    ))}
                </div>
                <div className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <input type="text" value={boardSearch} onChange={e=>setBoardSearch(e.target.value)} placeholder="브랜드, 컬러코드 검색" className="w-full bg-slate-50 border border-slate-300 text-sm px-3 py-2.5 rounded-xl pl-9 focus:outline-none focus:border-emerald-500 shadow-sm" />
                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                    <button onClick={saveToBoard} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors shrink-0 whitespace-nowrap flex items-center gap-1"><Plus size={14}/> 배합 등록</button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100">
                {boardPosts.filter(p => {
                    const passBrandFilter = boardBrandFilter === '전체' || p.brand === boardBrandFilter;
                    const searchLower = boardSearch.toLowerCase();
                    const passSearch = p.brand.toLowerCase().includes(searchLower) || p.code.toLowerCase().includes(searchLower) || p.spec.toLowerCase().includes(searchLower);
                    return passBrandFilter && passSearch;
                }).map(post => (
                    <div key={post.id} onClick={() => handleOpenPost(post)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative">
                        <button onClick={(e) => deleteBoardPost(post.id, e)} className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 font-bold text-[11px]" title="이 시편 삭제하기"><Trash2 size={14} /> 삭제</button>
                        <div className="flex justify-between items-start mb-2 pr-20">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded-md font-bold">{post.brand}</span>
                                <span className="text-xl font-black text-emerald-700 uppercase tracking-wide group-hover:text-emerald-500 transition-colors notranslate" translate="no">{post.code}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-bold mb-3 break-keep pr-16">{post.spec}</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="text-xs text-slate-500">By. <b>{post.author}</b></span>
                            <div className="flex gap-4 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors"><Eye size={16}/> {post.views}</span>
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp size={16}/> {post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {boardPosts.length === 0 && <div className="text-center py-10 text-slate-500">검색 조건에 맞는 시편 데이터가 없습니다.</div>}
            </div>
          </div>
        </div>
      )}

      {viewingPost && (
        <div className="fixed inset-0 bg-slate-900/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-300 my-8">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} /> 시편 배합 상세 보기</h3>
              <button onClick={() => setViewingPost(null)} className="hover:text-red-200 transition-colors bg-emerald-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-50">
              {isEditingPost ? (
                  <div className="flex flex-col gap-3 mb-2 bg-emerald-50 p-4 rounded-xl border border-emerald-200 animate-in fade-in">
                      <h4 className="text-xs font-black text-emerald-700 flex items-center gap-1"><Edit3 size={14}/> 게시물 정보 수정</h4>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">브랜드 (차종)</label>
                          <input value={editPostForm.brand} onChange={e => setEditPostForm({...editPostForm, brand: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">컬러 코드</label>
                          <input value={editPostForm.code} onChange={e => setEditPostForm({...editPostForm, code: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg text-sm font-bold uppercase text-slate-800 focus:outline-none focus:border-emerald-500 notranslate" translate="no" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">특이사항 및 스펙</label>
                          <textarea value={editPostForm.spec} onChange={e => setEditPostForm({...editPostForm, spec: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 h-24 resize-none focus:outline-none focus:border-emerald-500 font-medium" />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setIsEditingPost(false)} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors">취소</button>
                          <button onClick={handleSavePostEdit} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1"><CheckCircle size={14}/> 저장하기</button>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex justify-between items-start border-b border-slate-200 pb-3 relative">
                         <div>
                            <span className="bg-slate-800 text-white text-[11px] px-2.5 py-1 rounded-md font-bold mr-2">{viewingPost.brand}</span>
                            <span className="text-3xl font-black text-emerald-700 uppercase tracking-wide notranslate" translate="no">{viewingPost.code}</span>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-slate-500 font-medium">{viewingPost.date}</span>
                            <button onClick={() => setIsEditingPost(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[11px] font-black flex items-center gap-1 transition-colors shadow-sm border border-slate-200"><Edit3 size={14}/> 내용 수정</button>
                         </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm font-bold text-slate-700 break-keep">{viewingPost.spec}</div>
                  </>
              )}

              <div>
                <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-1.5"><Layers size={16} /> 베이스 코트 (Ground Coat)</h4>
                <div className="space-y-2">
                  {viewingPost.baseFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2"><span className="text-slate-800 font-black text-base w-20">{t.code}</span><span className="text-sm text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span></div>
                      <span className="text-blue-600 font-bold text-lg">{t.adjustedWeight}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {viewingPost.isThreeCoat && viewingPost.pearlFormula?.filter((t: any) => t.code).length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-1.5"><Zap size={16} /> 펄 코트 (Mid Coat)</h4>
                  <div className="space-y-2">
                    {viewingPost.pearlFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2"><span className="text-slate-800 font-black text-base w-20">{t.code}</span><span className="text-sm text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span></div>
                        <span className="text-purple-600 font-bold text-lg">{t.adjustedWeight}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
               <button onClick={() => setViewingPost(null)} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-md">닫기</button>
            </div>
          </div>
        </div>
      )}

      {isGlossaryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[700px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><BookOpen size={18} /> 📖 글라슈리트 실무 용어 사전</h3>
              <button onClick={() => setIsGlossaryModalOpen(false)} className="hover:text-red-200 bg-emerald-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-8">
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full text-sm">
                      <p className="font-black text-blue-800 mb-1">🔍 사전에 없는 용어가 궁금하신가요?</p>
                      <p className="text-slate-600 text-xs break-keep">아래 검색창에 궁금한 용어를 입력하고 엔터(Enter) 키를 치시면 구글 검색 결과로 이동합니다.</p>
                      <div className="flex mt-3">
                        <input 
                            ref={glossarySearchRef} 
                            lang="ko" 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGoogleGlossarySearch(); }} 
                            type="text" 
                            placeholder="예: 글라슈리트 시라릭 펄, 플롭 현상 등 입력 후 엔터" 
                            className="flex-1 p-3 border border-blue-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold h-12" 
                        />
                        <button onClick={handleGoogleGlossarySearch} className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-xl font-bold text-sm flex items-center justify-center"><Search size={16} className="mr-1.5"/> 검색</button>
                      </div>
                  </div>
              </div>

              <div>
                <h4 className="font-black text-emerald-800 mb-3 border-b-2 border-emerald-200 pb-2">1. 수지 / 베이스 / 환원제</h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold mr-2">믹싱 베이스 (Mixing Base / 90-M4)</span><br/>안료들이 뭉치지 않고 차체에 균일하게 달라붙도록 안료를 품어주는 투명 기초 수지.<br/><span className="text-[11px] text-slate-500 block mt-1">비유: 물감 튜브 안의 '투명 베이스 반죽'. 없으면 안료가 뭉쳐 분사 불가.</span></li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold mr-2">블렌딩 클리어 (Blending Clear / 90-M5)</span><br/>부분 도장(보카시) 시 신도막·구도막 경계를 화학적으로 녹여 자연스럽게 이어주는 수지.<br/><span className="text-[11px] text-slate-500 block mt-1">비유: 색이 다른 두 종이를 자연스럽게 이어주는 '투명 테이프'.</span></li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold mr-2">환원제 (Adjusting Base / 93-E3)</span><br/>완성된 원액의 점도를 낮춰 스프레이 건으로 뿌릴 수 있게 만드는 희석제. 글라슈리트 90라인 기준 전체 안료 무게의 50%를 투입.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl w-[700px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-700 my-8">
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-white font-black text-lg flex items-center gap-2"><Code className="text-blue-400" /> Pro 제작 과정 보기</h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 text-slate-300 text-sm leading-relaxed font-mono">
                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-600 shadow-inner text-emerald-400 whitespace-pre font-bold overflow-x-auto">
{`┌─────────────────────────────────────────┐
│ 🎨 윤성만 님을 위한 전용 프로그램         │
│ 제작: Claude AI × 윤성만                 │
│ 목적: BASF 글라슈리트 현장 조색 자동화    │
│                                         │
│ [v10] 모바일 UI/UX 최적화 및             │
│       E3 50% 글라슈리트 룰 확정 패치!     │
└─────────────────────────────────────────┘`}
                </div>
            </div>
          </div>
        </div>
      )}

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-scroll custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-3 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={20}/></button>
          </header>
          <main className="flex-1 p-6 md:p-10 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 overflow-x-hidden">
             <div className="mt-4 pb-12 w-full flex justify-center shrink-0">
                <button onClick={() => setIsConfiguratorOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 px-16 rounded-full transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-lg"><X size={24} /> 믹싱 스튜디오 닫기</button>
             </div>
          </main>
        </div>
      )}
    </div>
  );
}
