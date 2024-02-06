import React from "react";
import RecruitCard from "../../components/recruit/RecruitCard.tsx";

const MyProject = () => {
  return (
    <React.StrictMode>
      <div className="grid text-center">
        <div className="font-bold text-6xl">내가 참여중인 프로젝트</div>
      </div>
      <div className="grid grid-rows-4 gap-4 p-1 m-1">
        <RecruitCard />
      </div>
    </React.StrictMode>
  );
}

export default MyProject