import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const moveRecruit = () => {
    navigate("../recruit/");
  };

  const moveLogin = () => {
    navigate("../login/");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <img src={logo} alt="React logo" className="w-4/12 h-auto" />
        <div className="font-bold text-4xl">Programmer가 되고 싶은 ProG들</div>
        <div className="grid items-center justify-center text-center">
          <span
            className="bg-main-color p-5 m-3 text-xl text-white cursor-pointer"
            onClick={moveRecruit}
          >
            프로젝트 찾아보기
          </span>
        </div>
          <span
            className="bg-yellow-300 p-5 mx-3 text-xl cursor-pointer"
            onClick={moveLogin}
          >
            로그인으로 시작하기
          </span>
      </div>
    </div>
  );
};

export default HomePage;
