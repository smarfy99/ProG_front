import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";

export const useRequireAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    //로그인 상태가 아니면 로그인 페이지로 이동
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  return accessToken;
};
