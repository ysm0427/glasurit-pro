import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// App.tsx로부터 팝업창 상태와 현재 컬러코드를 전달받기 위한 설정
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetColorCode: string; // ✨ 추가: 메인 화면의 컬러코드를 몰래 넘겨받는 통로
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, targetColorCode }) => {
  // 이름과 연락처를 저장할 공간 추가
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') {
      alert('피드백 내용(필수)을 입력해주세요.');
      return;
    }
    
    setIsSending(true);

    // ✨ 마법의 코드: 입력받은 정보와 앱의 현재 컬러코드를 하나로 예쁘게 묶어줍니다.
    const combinedMessage = `
[보낸 사람] ${name || '미입력'}
[연락처] ${contact || '미입력'}
[작업 중이던 컬러코드] ${targetColorCode || '미입력/없음'}

[피드백 내용]
${message}
    `.trim();

    // 새롭게 발급받은 Service ID 적용 완료!
    emailjs.send(
      'service_2p7m4lf',    // 대표님의 새로운 Service ID
      'template_q0i4r84',            // Template ID
      { message: combinedMessage }, // 하나로 예쁘게 포장된 메시지 덩어리를 전송!
      '9HCVNg6wCK_IFMHaj'   // Public Key
    )
    .then(() => {
      alert('소중한 피드백이 전송되었습니다. 감사합니다!');
      setName('');
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
        width: '450px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💬 개발자에게 피드백 보내기
        </h2> {/* 🚨 아까 누락되었던 태그 복구 완료 */}

        {/* ✨ 새롭게 추가된 이름/연락처 입력 칸 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>보내시는 분 (선택)</label>
            <input 
              type="text" 
              placeholder="예: 홍길동 (또는 공업사명)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>연락처 (선택)</label>
            <input 
              type="text" 
              placeholder="답변 받을 번호/이메일"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>피드백 내용 (필수)</label>
          <textarea
            rows={5}
            placeholder="조색 앱 사용 중 불편한 점 등을 자유롭게 적어주세요. (현재 작업 중인 컬러코드는 자동으로 함께 전송됩니다.)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid #cbd5e1', marginBottom: '20px', boxSizing: 'border-box',
              resize: 'none', backgroundColor: '#f8fafc'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending}
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#eab308', color: '#fff', fontWeight: '900', cursor: 'pointer' }}
          >
            {isSending ? '전송 중...' : '피드백 보내기'}
          </button>
        </div>
      </div>
    </div>
  );
};
