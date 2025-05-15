import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

const SurveyFor20s = ({ account }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // 투표 여부 확인
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!account) return;

      try {
        const votesRef = collection(db, "votes");
        const q = query(votesRef, where("account", "==", account), where("surveyType", "==", "20s"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setAlreadyVoted(true);
        }
      } catch (error) {
        console.error("투표 상태 확인 중 오류 발생:", error);
      }
    };

    checkVoteStatus();
  }, [account]);

  const handleSubmit = async () => {
    if (selectedColor) {
      setSubmitted(true);
      console.log('20대 응답:', selectedColor);

      try {
        // Firestore에 투표 결과 저장 (account 포함)
        await addDoc(collection(db, "votes"), {
          account: account,
          surveyType: "20s",
          response: selectedColor,
          timestamp: new Date()
        });

        // 설문 결과 집계에도 추가
        const colorRef = doc(db, "results", "20s_colors");
        const colorData = {
          [selectedColor]: 1 // 증가시킬 값
        };

        // 도큐먼트 업데이트 또는 생성
        await setDoc(colorRef, colorData, { merge: true });

      } catch (error) {
        console.error("투표 저장 중 오류 발생:", error);
      }

      // 3초 후에 메인 화면으로 돌아가기 위한 타이머 설정
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      alert('색상을 선택해주세요!');
    }
  };

  // 이미 투표한 경우 메시지 표시
  if (alreadyVoted) {
    return (
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold my-10">20대 설문조사</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          이미 이 설문에 참여하셨습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold my-10">20대 설문조사</h2>
      <div className="mb-8">
        <p className="text-xl mb-6">어떤 색을 가장 좋아하시나요?</p>
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          {['빨강', '주황', '노랑'].map((color) => (
            <label key={color} className="flex items-center space-x-2">
              <input
                type="radio"
                name="color"
                value={color}
                checked={selectedColor === color}
                onChange={() => setSelectedColor(color)}
                className="w-5 h-5"
              />
              <span className="text-lg">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-10 rounded text-lg"
        >
          제출하기
        </button>
      ) : (
        <div className="text-green-600 font-bold">
          응답해 주셔서 감사합니다!
        </div>
      )}
    </div>
  );
};

const SurveyFor30s = ({ account }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // 투표 여부 확인
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!account) return;

      try {
        const votesRef = collection(db, "votes");
        const q = query(votesRef, where("account", "==", account), where("surveyType", "==", "30s"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setAlreadyVoted(true);
        }
      } catch (error) {
        console.error("투표 상태 확인 중 오류 발생:", error);
      }
    };

    checkVoteStatus();
  }, [account]);

  const handleSubmit = async () => {
    if (selectedFood) {
      setSubmitted(true);
      console.log('30대 응답:', selectedFood);

      try {
        // Firestore에 투표 결과 저장 (account 포함)
        await addDoc(collection(db, "votes"), {
          account: account,
          surveyType: "30s",
          response: selectedFood,
          timestamp: new Date()
        });

        // 설문 결과 집계에도 추가
        const foodRef = doc(db, "results", "30s_foods");
        const foodData = {
          [selectedFood]: 1 // 증가시킬 값
        };

        // 도큐먼트 업데이트 또는 생성
        await setDoc(foodRef, foodData, { merge: true });

      } catch (error) {
        console.error("투표 저장 중 오류 발생:", error);
      }

      // 3초 후에 메인 화면으로 돌아가기 위한 타이머 설정
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      alert('음식을 선택해주세요!');
    }
  };

  // 이미 투표한 경우 메시지 표시
  if (alreadyVoted) {
    return (
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold my-10">30대 설문조사</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          이미 이 설문에 참여하셨습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold my-10">30대 설문조사</h2>
      <div className="mb-8">
        <p className="text-xl mb-6">어떤 음식을 가장 좋아하시나요?</p>
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          {['한식', '일식', '중식'].map((food) => (
            <label key={food} className="flex items-center space-x-2">
              <input
                type="radio"
                name="food"
                value={food}
                checked={selectedFood === food}
                onChange={() => setSelectedFood(food)}
                className="w-5 h-5"
              />
              <span className="text-lg">{food}</span>
            </label>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-10 rounded text-lg"
        >
          제출하기
        </button>
      ) : (
        <div className="text-green-600 font-bold">
          응답해 주셔서 감사합니다!
        </div>
      )}
    </div>
  );
};

// 알림 토스트 컴포넌트
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-0 w-full flex justify-center z-50">
      <div className="bg-white py-3 px-5 rounded-lg shadow-lg border-2 border-green-500 flex items-center">
        <p className="text-lg mr-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
        >
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
      if (event.origin !== 'http://localhost:3000') return; // 보안 체크
      console.log('인증된 데이터 수신:', event.data);

      if (event.data.isVerified) {
        const receivedAccount = event.data.account;
        const receivedAge = event.data.age;

        try {
          // Firestore에서 해당 계정의 투표 여부 확인
          const votesRef = collection(db, "votes");
          const surveyType = receivedAge >= 20 && receivedAge < 30 ? "20s" : receivedAge >= 30 && receivedAge < 40 ? "30s" : null;
          
          if (!surveyType) {
            // 지원하지 않는 연령대
            setToastMessage("죄송합니다. 현재 20대와 30대를 위한 설문만 진행 중입니다.");
            setShowToast(true);
            return;
          }

          const q = query(votesRef, where("account", "==", receivedAccount), where("surveyType", "==", surveyType));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // 이미 투표한 경우
            setToastMessage("이미 투표가 완료되었습니다!");
            setShowToast(true);
            return;
          }

          // 투표하지 않은 경우에만 로그인 상태 업데이트
          setIsLoggedIn(true);
          setUserData({ age: receivedAge, account: receivedAccount });
          setAccount(receivedAccount);
          setShowLoginButton(false);
          setToastMessage("✅ VeriVote 인증 완료! 설문조사에 참여할 수 있습니다.");
          setShowToast(true);

        } catch (error) {
          console.error("투표 상태 확인 중 오류 발생:", error);
          setToastMessage("오류가 발생했습니다. 다시 시도해주세요.");
          setShowToast(true);
        }
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

  // 사용자 연령대에 따른 설문조사 컴포넌트 선택
  const renderSurvey = () => {
    if (!userData || !userData.age) return null;

    const age = parseInt(userData.age);
    if (age >= 20 && age < 30) {
      return <SurveyFor20s account={account} />;
    } else if (age >= 30 && age < 40) {
      return <SurveyFor30s account={account} />;
    } else {
      return (
        <div className="text-center py-10">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            죄송합니다. 현재 20대와 30대를 위한 설문만 진행 중입니다.
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">PollChain</h1>
          <p className="text-xl">블록체인 기반 신뢰할 수 있는 설문조사 플랫폼</p>
        </div>

        {showLoginButton && (
          <div className="text-center my-16">
            <h2 className="text-2xl font-medium mb-8">VeriVote로 인증하고 설문에 참여하세요</h2>
            <button
              onClick={handleLoginClick}
              className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-8 rounded text-lg"
            >
              VeriVote로 로그인
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="my-4">
            {renderSurvey()}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;