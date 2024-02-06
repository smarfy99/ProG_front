import { useEffect, useState } from "react";
import KeepBoard from "../../../components/retrospectMemo/KeepBoard";
import ProblemBoard from "../../../components/retrospectMemo/ProblemBoard";
import TryBoard from "../../../components/retrospectMemo/TryBoard";
import KPTMemo from "../../../components/retrospectMemo/WriteKptMemo";
import { FaAnglesLeft, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../apis/lib/axios";

export const RetrospectPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const getKPT = async () => {
    try {
      const response = await axiosInstance.get("/retrospects/11");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getKPT();
  }, []);

  return (
    <div>
      <p>현재 N주차</p>
      <div className="flex justify-center items-center">
        <div className="mt-10">
          <KeepBoard />
          <ProblemBoard />
          <TryBoard />
          <div className="flex justify-center my-4">
            <FaAnglesLeft
              onClick={() => navigate("/project/11/prevretrospect")} // 후에 url project params 받아서 다시 수정
              className="cursor-pointer bg-sub-color border-black border-1 text-main-color font-bold rounded-full shadow-lg flex items-center justify-center w-12 h-12 m-2"
            />
            <FaPlus
              onClick={() => setModalOpen(true)}
              className="cursor-pointer m-2 bg-main-color text-white font-bold rounded-full shadow-lg flex items-center justify-center w-12 h-12"
            />
          </div>
          <KPTMemo modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default RetrospectPage;
