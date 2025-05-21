import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

const SurveyCard = ({ title, question, options, selected, setSelected, onSubmit, submitted }) => (
  <div className="relative z-10 bg-white rounded-2xl shadow-xl p-10 max-w-md mx-auto border border-blue-200" z-20>
  <h2 className="text-4xl font-bold mb-6 text-blue-900">{title}</h2>
  <p className="text-lg text-gray-700 mb-6">{question}</p>
    <div className="space-y-4 mb-8">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 text-left">
          <input
            type="radio"
            value={opt}
            checked={selected === opt}
            onChange={() => setSelected(opt)}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-lg text-gray-800">{opt}</span>
        </label>
      ))}
    </div>
    {!submitted ? (
      <button
        onClick={onSubmit}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-lg text-lg font-semibold transition"
      >
        제출하기
      </button>
    ) : (
      <div className="text-rose-600 font-semibold text-center text-lg">✅ 응답해 주셔서 감사합니다!</div>
    )}
  </div>
);

const SurveyFor20s = ({ account }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    if (!account) return;
    const checkVote = async () => {
      const q = query(collection(db, "votes"), where("account", "==", account), where("surveyType", "==", "20s"));
      const res = await getDocs(q);
      if (!res.empty) setAlreadyVoted(true);
    };
    checkVote();
  }, [account]);

  const handleSubmit = async () => {
    if (!selectedColor) return alert("의견을 선택해주세요.");
    setSubmitted(true);
    await addDoc(collection(db, "votes"), {
      account,
      surveyType: "20s",
      response: selectedColor,
      timestamp: new Date()
    });
    const ref = doc(db, "results", "20s_colors");
    await setDoc(ref, { [selectedColor]: 1 }, { merge: true });
    setTimeout(() => window.location.reload(), 3000);
  };

  if (alreadyVoted)
    return (
      <div className="text-center p-8 text-rose-700 bg-rose-100 border border-rose-300 rounded-xl max-w-md mx-auto">
         
        이미 이 설문에 참여하셨습니다.
      </div>
    );

  return (
    <SurveyCard
      title="20대 설문조사"
      question="실질적으로 MZ 세대가 몇살 까지를 지칭한다고 보시나요?"
      options={['20~30대', '20~40대', '잘 모르겠다.']}
      selected={selectedColor}
      setSelected={setSelectedColor}
      onSubmit={handleSubmit}
      submitted={submitted}
    />
  );
};

const SurveyFor30s = ({ account }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    if (!account) return;
    const checkVote = async () => {
      const q = query(collection(db, "votes"), where("account", "==", account), where("surveyType", "==", "30s"));
      const res = await getDocs(q);
      if (!res.empty) setAlreadyVoted(true);
    };
    checkVote();
  }, [account]);

  const handleSubmit = async () => {
    if (!selectedFood) return alert("의견을 선택해주세요.");
    setSubmitted(true);
    await addDoc(collection(db, "votes"), {
      account,
      surveyType: "30s",
      response: selectedFood,
      timestamp: new Date()
    });
    const ref = doc(db, "results", "30s_foods");
    await setDoc(ref, { [selectedFood]: 1 }, { merge: true });
    setTimeout(() => window.location.reload(), 3000);
  };

  if (alreadyVoted)
    return (
      <div className="text-center p-8 text-rose-700 bg-rose-100 border border-rose-300 rounded-xl max-w-md mx-auto">
        이미 이 설문에 참여하셨습니다.
      </div>
    );

  return (
    <SurveyCard
      title="30대 설문조사"
      question="MZ 세대에 본인이 포함된다고 생각한다."
      options={['그렇다', '아니다', '잘 모르겠다.']}
      selected={selectedFood}
      setSelected={setSelectedFood}
      onSubmit={handleSubmit}
      submitted={submitted}
    />
  );
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-0 w-full flex justify-center z-50">
      <div className="bg-rose-100 border border-rose-400 px-6 py-4 rounded-xl shadow-md text-rose-800 flex items-center gap-4">
        <p className="text-base font-medium">{message}</p>
        <button onClick={onClose} className="text-sm px-3 py-1 bg-rose-200 hover:bg-rose-300 rounded-md">
          확인
        </button>
      </div>
    </div>
  );
};

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const receiveMessage = async (event) => {
      if (event.origin !== 'http://localhost:3000') return;

      if (event.data.isVerified) {
        const receivedAccount = event.data.account;
        const receivedAge = event.data.age;
        console.log("알수 있는 것 :",receivedAge);
        const surveyType =
          receivedAge >= 20 && receivedAge < 30 ? '20s' :
          receivedAge >= 30 && receivedAge < 40 ? '30s' : null;

        if (!surveyType) {
          setToastMessage("❌ 현재 20대와 30대만 참여 가능합니다.");
          setShowToast(true);
          return;
        }

        const q = query(collection(db, "votes"),
          where("account", "==", receivedAccount),
          where("surveyType", "==", surveyType));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setToastMessage("이미 설문에 참여하셨습니다!");
          console.log(receivedAge)
          setShowToast(true);
          return;
        }

        setIsLoggedIn(true);
        setUserData({ age: receivedAge, account: receivedAccount });
        setAccount(receivedAccount);
        setShowLoginButton(false);
        setToastMessage("✅ 인증 완료! 설문조사에 참여하세요.");
        setShowToast(true);
      }
    };

    window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, []);

  const handleLoginClick = () => {
    const popup = window.open(
      'http://localhost:3000',
      'VeriVoteLogin',
      'width=600,height=600'
    );
    if (!popup) alert('팝업 차단을 해제해주세요.');
  };

  const renderSurvey = () => {
    if (!userData) return null;
    const age = parseInt(userData.age);
    if (age >= 20 && age < 30) return <SurveyFor20s account={account} />;
    if (age >= 30 && age < 40) return <SurveyFor30s account={account} />;
    return <div className="text-center mt-10 text-red-500">지원되지 않는 연령대입니다.</div>;
  };

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-4">
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-sm">MZ 세대에 대한 인식 조사</h1>
        <div className="flex justify-center items-center gap-2">
    <img src="/logo.png" alt="로고" className="w-6 h-6" />
    <p className="text-lg text-blue-700 italic">국민화합위원회</p>
  </div>
        </div>

        {showLoginButton && (
          <div className="text-center mt-16">
     <h2 className="text-2xl font-semibold mb-4 text-gray-800">
  VeriVote로 인증하고 설문에 참여하세요
</h2>
<p className="text-base text-gray-600 mb-6">
  *본 설문조사는 보다 정확한 분석을 위해 설문자의 나이를 요구합니다.
</p>

            <button
              onClick={handleLoginClick}
              className="bg-rose-600 hover:bg-rose-700 text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-md transition"
            >
              VeriVote로 로그인하기
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="mt-10">
            {renderSurvey()}
          </div>
        )}
      </div>

  
      <div className="fixed bottom-0 left-0 w-full flex justify-center gap-0 overflow-hidden py-4 z-0 pointer-events-none">
  {Array(2).fill(0).map((_, i) => (
    <img
      key={i}
      src="/people.png"
      alt="설문 이미지"
      className="w-1/2 h-auto object-cover"
    />
  ))}
</div>





    </div>
  );
}

export default MainPage;
