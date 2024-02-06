import { axiosInstance } from "../apis/lib/axios";

export const fetchUserProfile = async (
  accessToken: string,
  setProfile: (profile: {
    id: number;
    email: string;
    nickname: string;
    imgUrl: string;
  }) => void,
  navigate: (path: string) => void
) => {
  if (!accessToken) {
    navigate("/login");
    return;
  }
  try {
    const response = await axiosInstance.get("/members/my-profile");
    const data = response.data.data;
    // console.log(data);

    setProfile({
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      imgUrl: data.imgUrl,
    });

    navigate("/"); // 사용자 프로필 성공적으로 가져오면 홈으로 이동
  } catch (error) {
    console.error("Fetching user profile failed:", error);
    // 에러 핸들링 (예: 상태 업데이트, 사용자에게 메시지 표시 등)
  }
};
