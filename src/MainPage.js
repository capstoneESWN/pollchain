import React, { useEffect, useState } from 'react';

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // 메시지로 받은 데이터 저장

  useEffect(() => {
    const receiveMessage = (event) => {
      if (event.origin !== 'http://localhost:3000') return; // 보안 체크

      console.log('인증된 데이터 수신:', event.data);

      if (event.data.isVerified) {
        setIsLoggedIn(true);
        setUserData(event.data); // 메시지 저장
      }
    };

    window.addEventListener('message', receiveMessage);

    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  const handleLoginClick = () => {
    const popup = window.open(
      'http://localhost:3000',
      'VeriVoteLogin',
      'width=600,height=600'
    );

    if (!popup) {
      alert('팝업 차단이 되어 있습니다. 허용해 주세요!');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to PollChain</h1>
      <button onClick={handleLoginClick}>VeriVote로 로그인</button>

      {isLoggedIn && (
        <div>
          <p>✅ 로그인 성공! 여론조사에 참여할 수 있습니다.</p>
          <p>🔐 인증 정보: {JSON.stringify(userData)}</p>
        </div>
      )}
    </div>
  );
}

export default MainPage;
