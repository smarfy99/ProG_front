import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import TechStack from "../techstack/TechStack";
// import { axiosInstance } from "../../apis/lib/axios";

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [isEditMode, setIsEditMode] = useState(false);
  // const [profileData, setProfileData] = useState({
  //   email: "",
  //   name: "",
  //   nickname: "",
  //   introduction: "",
  //   // 기타 필요한 프로필 데이터
  // });

  // 모달 표시/숨김 함수
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // const profileGet = async () => {
  //   try {
  //     const response = await axiosInstance.get("여기 내일 확인");
  //     setProfileData(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // 컴포넌트 마운트 시 프로필 데이터 가져오기
  // useEffect(() => {
  //   profileGet();
  // }, []);

  return (
    <div>
      {/* 내용 부분 추후에 data. 정보 추가*/}
      <div className="flex">
        {/* My Profile과 Pencil 아이콘 부분 */}
        <div className="flex flex-col items-start mr-10">
          <div className="flex items-center mb-4">
            <p className="font-mainFont font-semibold mr-2">My Profile</p>
            <FaPencil
              size="28"
              onClick={toggleEditMode}
              className="cursor-pointer text-gray-500"
            />
          </div>
          {isEditMode && (
            <button
              className="ml-10 bg-main-color hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {}} //axios.fetch 들어감
            >
              수정
            </button>
          )}
        </div>
        {/* 입력 필드 부분 */}
        <div className="flex-1">
          {/* 이메일 필드 */}
          <div className="mb-4">
            <p className="mb-2 font-mainFont">이메일</p>
            <p>사용자 이메일이 보여짐</p>
          </div>
          {/* 이름 필드 */}
          <div className="mb-4">
            <p className="mb-2 font-mainFont">이름</p>
            {isEditMode ? (
              <input className="w-96 p-2 border border-gray-300 rounded" />
            ) : (
              <p>이름</p> // axios.get을 통해 받아온 데이터 표시
            )}
          </div>
          {/* 닉네임 필드 */}
          <div className="mb-4">
            <p className="mb-2 font-mainFont">닉네임</p>
            {isEditMode ? (
              <input className="w-96 p-2 border border-gray-300 rounded" />
            ) : (
              <p>닉네임</p> // axios.get을 통해 받아온 데이터 표시
            )}
          </div>
          {/* 비밀번호 변경 필드 */}
          <div className="flex items-center mb-4">
            <div>
              <p className="flex mb-2 font-mainFont">비밀번호 변경</p>
              <input
                type="password"
                className="w-80 p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={toggleModal}
              className="ml-1 mt-8 bg-main-color hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              변경
            </button>
          </div>
        </div>
        <div className="flex-1 flex-col">
          <div className="mb-4">
            <p className="mb-2">나의 소개</p>
            {isEditMode ? (
              <textarea className="w-96 h-32 p-2 border border-gray-300 rounded" />
            ) : (
              <p>나의 소개가 보여집니다.</p>
            )}
          </div>
          <div>
            <p className="font-mainFont text-lg mb-2">관심있는 기술 태그</p>
            <p className="font-mainFont mb-4">
              사용 중인 기술이나 관심있는 기술을 선택해주세요
            </p>
            <TechStack />
          </div>
        </div>
        {showModal && <ChangePw onClose={toggleModal} />}
      </div>
    </div>
  );
};

export default MyProfile;
