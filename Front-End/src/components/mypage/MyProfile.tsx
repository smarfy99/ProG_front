import { useEffect, useState } from "react";
import { FaPencil, FaUser } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import TechStack from "../techstack/TechStack";
import { axiosInstance } from "../../apis/lib/axios";

interface ProfileData {
  email: string;
  name: string;
  nickname: string;
  description: string;
}

const MyProfile = () => {
  const [changeName, setchangeName] = useState<string>("");
  const [changeNickname, setChangeNickname] = useState<string>("");
  const [changeDescription, setChangeDescription] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 상태
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    email: "",
    name: "",
    nickname: "",
    description: "",
  });
  const [loadProfile, setLoadProfile] = useState<boolean>(true); // 프로필 데이터를 불러올지 여부를 결정하는 상태
  const [id, setId] = useState<string>("");

  // 모달 표시/숨김 함수
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);

    if (!isEditMode) {
      setchangeName(profileData.name);
      setChangeNickname(profileData.nickname);
      setChangeDescription(profileData.description);
    }
  };

  const profileGet = async () => {
    try {
      const response = await axiosInstance.get(`members/detail-profile/${id}`); // 지금 여기 id로 바뀜
      const data = response.data.data;
      console.log(data);
      setProfileData({
        email: data.email,
        name: data.name,
        nickname: data.nickname,
        description: data.description,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadProfile(false);
    }
  };

  const changeProfile = async () => {
    const profileData = {
      id: id,
      name: changeName,
      nickname: changeNickname,
      description: changeDescription,
      memberTechDtoList: [],
    };

    const form = new FormData();
    const formData = JSON.stringify(profileData);
    form.append("member", new Blob([formData], { type: "application/json" }));
    try {
      await axiosInstance.patch("/members/update-profile", form, {});
      setIsEditMode(!isEditMode);
      setLoadProfile(true);
    } catch (error) {
      console.log(error);
    }
  };

  const chkNickNameDuplication = async () => {
    try {
      await axiosInstance.post("/members/nickname-validation-check", {
        nickname: changeNickname,
      });

      console.log("닉네임 사용 가능");
    } catch (error) {
      console.log("닉네임 중복 오류");
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // 컴포넌트 마운트 시 프로필 데이터 가져오기
  useEffect(() => {
    const userProfileString = localStorage.getItem("userProfile");
    if (userProfileString) {
      const userProfile = JSON.parse(userProfileString);
      setId(userProfile.id); // 닉네임 상태 업데이트
    }

    profileGet();
  }, [loadProfile]);

  return (
    <div className="min-h-screen bg-sub-color mt-16 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* 프로필 사진 변경 부분 */}
        <div className="flex justify-center mb-8 relative">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer"
          >
            <FaUser
              size="100"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            />
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 rounded-full">
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-600">
                    클릭하여 프로필 사진을 변경해보세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 사용자 인사말 */}
        <p className="text-center text-xl font-semibold mb-6">
          환영합니다,{" "}
          <span className="text-indigo-600">{profileData.nickname}</span> 님
        </p>

        <div className="bg-white shadow rounded-lg p-6">
          {/* 프로필 정보 및 수정 버튼 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
            <FaPencil
              size="24"
              onClick={toggleEditMode}
              className="cursor-pointer text-indigo-500 hover:text-indigo-600 transition-colors duration-200"
            />
          </div>
          {isEditMode && (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto block"
              onClick={changeProfile}
            >
              수정
            </button>
          )}

          {/* 사용자 정보 표시 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* 이메일 필드 */}
              <div className="pb-4">
                <p className="border-b border-main-color text-m font-semibold text-main-color">이메일</p>
                <p className="text-gray-800 font-bold text-lg">{profileData.email}</p>
              </div>
              {/* 이름 필드 */}
              <div className="pb-4">
                <p className="border-b border-main-color text-m font-semibold text-main-color">이름</p>
                {isEditMode ? (
                  <input
                    value={changeName}
                    onChange={(e) => setchangeName(e.target.value)}
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  <p className="text-gray-800 font-bold text-lg">{profileData.name}</p>
                )}
              </div>
              {/* 닉네임 필드 */}
              <div className=" pb-4">
                <p className="border-b border-main-color text-m font-semibold text-main-color">닉네임</p>
                {isEditMode ? (
                  <>
                    <input
                      value={changeNickname}
                      onChange={(e) => setChangeNickname(e.target.value)}
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      onClick={chkNickNameDuplication}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                    >
                      검사
                    </button>
                  </>
                ) : (
                  <p className="text-gray-800 font-bold text-lg">{profileData.nickname}</p>
                )}
              </div>
              {/* 비밀번호 변경 필드 */}
              <div className="pb-4">
                <p className="border-b border-main-color text-m font-semibold text-main-color">
                  비밀번호 변경
                </p>
                <input
                  type="password"
                  placeholder="●●●●●●●●●●●●●●●●"
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  disabled={!isEditMode}
                />
                <button
                  onClick={toggleModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                >
                  변경
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {/* 나의 소개 */}
              <div className="pb-4">
                <p className="border-b border-main-color text-m font-semibold text-main-color">나의 소개</p>
                {isEditMode ? (
                  <textarea
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  <p className="text-gray-800 font-bold text-lg">
                    {profileData.description || "나의 한 줄 소개를 추가해보세요!"}
                  </p>
                )}
              </div>
              <TechStack />
            </div>
          </div>
        </div>
        {showModal && <ChangePw onClose={toggleModal} />}
      </div>
    </div>
  );
};

export default MyProfile;