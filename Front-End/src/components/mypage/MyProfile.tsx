import {useState} from "react";
import MyProject from "./MyProject.tsx";
import MyProfileDetail from "./MyProfileDetail.tsx";

type ComponentType = "MyProfileDetail" | "MyGit" | "MyProject";

const MyProfile = () => {
  const [selectedComponentType, setSelectedComponentType] = useState("MyProfileDetail");

  const handleProjectTypeChange = (type: ComponentType) => {
    setSelectedComponentType(type);
  };

  return (
      <div>
          <div className="flex justify-center">
              <div
                  className={`mx-16 text-2xl cursor-pointer ${selectedComponentType === "MyProfileDetail"
                      ? "font-semibold text-main-color"
                      : ""}`}
                  onClick={() => handleProjectTypeChange("MyProfileDetail")}
              >
                  상세정보
              </div>
              <div
                  className={`mx-16 text-2xl cursor-pointer ${selectedComponentType === "MyProject"
                      ? "font-semibold text-main-color"
                      : ""}`}
                  onClick={() => handleProjectTypeChange("MyProject")}
              >
                  나의 프로젝트
              </div>
          </div>

          {selectedComponentType === "MyProfileDetail" && <MyProfileDetail/>}
          {selectedComponentType === "MyProject" && <MyProject/>}
      </div>
  );
};

export default MyProfile;