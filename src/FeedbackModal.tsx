import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') {
      alert('피드백 내용을 입력해주세요.');
      return;
    }
    
    setIsSending(true);

    // 대표님의 고유 키 3개가 미리 입력되어 있습니다!
    emailjs.send(
      'service_k3dr1jm',    // Service ID
      'dv8q5x1',            // Template ID
      { message: message }, 
      '9HCVNg6wCK_IFMHaj'   // Public Key
    )
    .then(() => {
      alert('소중한 피드백이 전송되었습니다. 감사합니다!');
      setMessage('');
      setIsSending(false);
      onClose(); // 전송 완료 후 팝업창 닫기
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
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
        width: '400px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>💬 다이렉트 피드백</h2>
        <textarea
          rows={6}
          placeholder="조색 Pro 앱 사용 중 불편한 점이나 추가되었으면 하는 안료, 건의사항을 자유롭게 적어주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%', padding: '10px', borderRadius: '5px',
            border: '1px solid #ccc', marginBottom: '20px', boxSizing: 'border-box',
            resize: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#e2e8f0', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#ffd700', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isSending ? '전송 중...' : '피드백 보내기'}
          </button>
        </div>
      </div>
    </div>
  );
};
