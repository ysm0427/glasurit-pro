import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetColorCode: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, targetColorCode }) => {
  const form = useRef<HTMLFormElement>(null); // ✨ sendForm을 위한 폼 참조 변수
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState(''); // ✨ 첨부파일 이름 표시용 상태
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // 첨부파일이 선택되었을 때 파일 이름을 화면에 보여주는 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('브랜드명 및 지점명(필수)을 입력해주세요.');
      return;
    }
    if (message.trim() === '') {
      alert('피드백 내용(필수)을 입력해주세요.');
      return;
    }
    
    setIsSending(true);

    // ✨ sendForm 방식 적용: form.current에 담긴 데이터와 첨부파일을 통째로 전송!
    emailjs.sendForm(
      'service_2p7m4lf',    // 대표님의 Service ID
      'template_q0i4r84',   // ✅ 올바른 Template ID 적용 완료
      form.current!,        // 묶여있는 폼 데이터 (파일 포함)
      '9HCVNg6wCK_IFMHaj'   // Public Key
    )
    .then(() => {
      alert('📸 파일과 피드백이 성공적으로 전송되었습니다!');
      setName('');
      setContact('');
      setMessage('');
      setFileName('');
      setIsSending(false);
      onClose();
    })
    .catch((error) => {
      console.error('전송 실패:', error);
      alert('전송에 실패했습니다. 사진 용량이 너무 크거나 네트워크 문제일 수 있습니다.');
      setIsSending(false);
    });
  };

  // EmailJS 템플릿( {{message}} )으로 보낼 데이터를 몰래 하나로 합쳐주는 변수
  const combinedMessage = `
[브랜드/지점명] ${name || '미입력'}
[연락처] ${contact || '미입력'}
[작업 중이던 컬러코드] ${targetColorCode || '미입력/없음'}

[피드백 내용]
${message}
  `.trim();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      {/* ✨ div 대신 form 태그 사용 */}
      <form ref={form} onSubmit={handleSend} style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '15px',
        width: '450px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: '15px'
      }}>
        
        {/* EmailJS가 읽어갈 수 있도록 숨겨둔 통합 메시지 칸 */}
        <input type="hidden" name="message" value={combinedMessage} />

        <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#1e293b', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📸 현장 피드백 & 사진 전송
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>브랜드명 및 지점명 (필수)</label>
            <input 
              type="text" 
              placeholder="예: 현대자동차 오포점"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>연락처 (선택)</label>
            <input 
              type="text" 
              placeholder="답변 받을 번호"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>피드백 내용 (필수)</label>
          <textarea
            rows={4}
            placeholder="시편 불량, 색상 차이 등 현장에서 겪으신 문제를 자유롭게 적어주세요. (현재 컬러코드 자동 첨부됨)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid #cbd5e1', boxSizing: 'border-box',
              resize: 'none', backgroundColor: '#f8fafc'
            }}
          />
        </div>

        {/* ✨ 대망의 사진/파일 첨부 영역 */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', border: '1px dashed #94a3b8' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>불량 시편 및 화면 캡처 첨부</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{
              backgroundColor: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '6px',
              fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', whiteSpace: 'nowrap'
            }}>
              📁 사진 선택하기
              {/* 실제 파일 입력 칸은 못생겼으므로 숨김 처리 (name="attachment"가 핵심!) */}
              <input type="file" name="attachment" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            <span style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName ? fileName : '선택된 사진이 없습니다.'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button"
            onClick={onClose}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSending}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#059669', color: '#fff', fontWeight: '900', cursor: 'pointer' }}
          >
            {isSending ? '전송 중...' : '작업 완료 및 전송'}
          </button>
        </div>
      </form>
    </div>
  );
};
