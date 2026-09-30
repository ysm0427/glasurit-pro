import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetColorCode: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, targetColorCode }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState(''); // 직책을 저장할 상태 추가
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

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

    // 직책이 선택되었으면 소속 뒤에 괄호로 붙여주고, 안 골랐으면 생략합니다.
    const combinedMessage = `
[소속] ${name} ${position ? `(${position})` : ''}
[연락처] ${contact || '미입력'}
[작업 중이던 컬러코드] ${targetColorCode || '미입력/없음'}

[피드백 내용]
${message}
    `.trim();

    // 기존의 가볍고 빠른 emailjs.send 방식으로 복구 완료
    emailjs.send(
      'service_2p7m4lf',
      'template_q0i4r84',   // ✅ 올바른 Template ID 유지
      { message: combinedMessage },
      '9HCVNg6wCK_IFMHaj'
    )
    .then(() => {
      alert('소중한 피드백이 전송되었습니다. 감사합니다!');
      setName('');
      setPosition('');
      setContact('');
      setMessage('');
      setIsSending(false);
      onClose();
    })
    .catch((error) => {
      console.error('전송 실패:', error);
      alert('전송에 실패했습니다. 다시 시도해 주세요.');
      setIsSending(false);
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '15px',
        width: '480px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: '15px'
      }}>
        
        <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#1e293b', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💬 현장 피드백 보내기
        </h2>

        {/* 1. 소속 및 직책 입력란 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 2 }}>
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>직책 (선택)</label>
            <select 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', backgroundColor: '#fff' }}
            >
              <option value="">선택</option>
              <option value="사원">사원</option>
              <option value="주임">주임</option>
              <option value="대리">대리</option>
              <option value="과장">과장</option>
              <option value="차장">차장</option>
              <option value="팀장">팀장</option>
            </select>
          </div>
        </div>

        {/* 2. 연락처 입력란 */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>연락처 (선택)</label>
          <input 
            type="text" 
            placeholder="답변 받을 번호 또는 이메일"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        {/* 3. 피드백 내용 */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>피드백 내용 (필수)</label>
          <textarea
            rows={4}
            placeholder="불편한 점이나 추가 요청사항을 자유롭게 적어주세요. (현재 컬러코드 자동 첨부됨)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid #cbd5e1', boxSizing: 'border-box',
              resize: 'none', backgroundColor: '#f8fafc'
            }}
          />
        </div>

        {/* 4. 텍스트 전용 안내 경고문 */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', border: '1px dashed #94a3b8', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
            ※ 현재 시스템 상 텍스트 형식으로만 전송 가능합니다. (사진/파일 첨부 불가)
          </span>
        </div>

        {/* 5. 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
          <button 
            onClick={onClose}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#059669', color: '#fff', fontWeight: '900', cursor: 'pointer' }}
          >
            {isSending ? '전송 중...' : '피드백 보내기'}
          </button>
        </div>
      </div>
    </div>
  );
};
