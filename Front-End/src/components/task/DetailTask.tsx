import { ChangeEvent, useEffect, useState } from "react";
import {
  FaAnglesRight,
  FaRegCircleUser,
  FaBoltLightning,
  FaBookBookmark,
  FaCalendarCheck,
} from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill 스타일시트 임포트
import { axiosInstance } from "../../apis/lib/axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import TaskDatePicker from "../calendar/TaskDatePicker";
import { useMultipleDetailCodes } from "../../hooks/useMultipleDataCodes";
import Chip from "@mui/material/Chip";

interface ProjectMember {
  member: {
    id: number;
    nickname: string;
    imgUrl: string | null;
  };
  jobCode: {
    id: number;
    detailName: string;
    detailDescription: string;
    imgUrl: string | null;
    isUse: boolean;
  };
}

interface DetailCode {
  id: number;
  detailName: string;
  detailDescription: string;
  imgUrl?: string | null;
}

interface DetailTaskProps {
  onClose: () => void; // onClose의 타입 명시
}

const DetailTask: React.FC<DetailTaskProps> = ({ onClose }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(
    null
  );
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isOpen] = useState<boolean>(true);
  const [id, setId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [endDay, setEndDay] = useState(tomorrow);

  const { data: multipleDetailCodesData } = useMultipleDetailCodes([
    "WorkType",
    "WorkPriority",
    "WorkStatus",
  ]);
  const workTypes = multipleDetailCodesData?.[0] ?? [];
  const workPriorities = multipleDetailCodesData?.[1] ?? [];

  const getPrjMember = async () => {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/members`
      );
      setProjectMembers(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postTask = async () => {
    const taskInfo = {
      projectId: projectId,
      producerId: id,
      statusCode: 1,
      typeCode: selectedTypeId,
      priorityCode: selectedPriorityId,
      consumerId: selectedMemberId,
      title: title,
      content: editorContent,
      startDay: moment().format("YYYY-MM-DD"),
      endDay: moment(endDay).format("YYYY-MM-DD"),
    };

    if (
      !title ||
      !selectedMemberId ||
      !selectedTypeId ||
      !selectedPriorityId ||
      !editorContent
    ) {
      setShowModal(true); // 필요한 모든 필드가 입력되지 않았으므로 모달 표시
      return; // 함수를 여기서 종료시켜서, API 호출을 방지
    }

    try {
      await axiosInstance.post("/works", taskInfo, {
        headers: {
          "Content-Type": "application/json", // 명시적으로 Content-Type 설정
        },
      });
    } catch (error) {
      console.log(taskInfo);
      console.log(error);
    }
  };

  const handleMemberChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    // 선택된 멤버 ID를 문자열로 상태 업데이트, 빈 문자열이면 null 처리
    setSelectedMemberId(event.target.value ? Number(event.target.value) : null);
  };
  const handleWorkTypeClick = (id: number) => {
    setSelectedTypeId(id);
  };

  const handleWorkPriorityClick = (id: number) => {
    setSelectedPriorityId(id);
  };

  const editorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // 로컬 스토리지에서 userProfile을 가져옴
    const userProfileString = localStorage.getItem("userProfile");
    if (userProfileString) {
      const userProfile = JSON.parse(userProfileString);
      setId(userProfile.id); // 닉네임 상태 업데이트
      setNickname(userProfile.nickname);
    }

    getPrjMember();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${
          !isOpen && "hidden"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed right-0 mt-16 top-0 h-full overflow-y-auto bg-slate-50 p-8 rounded-md shadow-lg z-40 w-full max-w-2xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ease-in-out duration-300`}
      >
        <div className="flex items-center mb-4">
          <FaAnglesRight
            onClick={onClose}
            className="text-lg text-gray-600 mr-2 cursor-pointer"
          />
          <h1 className="text-xl font-bold">상세 업무 등록</h1>
        </div>
        <div className="flex items-center mb-4">
          <FaRegCircleUser className="text-gray-600 mr-2" />
          <p className="text-md">업무 요청자: {nickname}</p>
          <FaCalendarCheck className="text-md ml-4 mr-2" />
          <p>업무 시작일: {moment().format("YYYY-MM-DD")}</p>
        </div>
        <p className="font-semibold mb-2">업무 제목</p>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="border border-gray-300 rounded p-2 mr-2 w-full"
        />
        <hr />
        <div className="flex my-4">
          <FaRegCircleUser className="text-gray-600 mt-4 mr-2" />
          <label htmlFor="member-select" className="mt-3 mr-2">
            담당자:
          </label>
          <select
            id="member-select"
            value={selectedMemberId ? selectedMemberId.toString() : ""}
            onChange={handleMemberChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">담당자 선택...</option>
            {projectMembers.map((member) => (
              <option
                key={member.member.id}
                value={member.member.id.toString()}
              >
                {member.member.nickname} - {member.jobCode.detailDescription}
              </option>
            ))}
          </select>
        </div>
        <div className="flex my-4">
          <FaBookBookmark className="mt-4" />
          {workTypes.map((workType: DetailCode, index: number) => (
            <Chip
              key={workType.id}
              label={workType.detailDescription}
              onClick={() => handleWorkTypeClick(workType.id)}
              variant={selectedTypeId === workType.id ? "filled" : "outlined"}
              sx={{
                margin: 0.5,
                color: selectedTypeId === workType.id ? "#fff" : "#000",
                backgroundColor:
                  selectedTypeId === workType.id
                    ? ["#FF5733", "#33FF57", "#3357FF", "#F833FF", "#FF8333"][
                        index % 5
                      ]
                    : "#e0e0e0",
                "&:hover": {
                  opacity: 0.75,
                },
              }}
            />
          ))}
        </div>
        <div className="flex my-4">
          <FaBoltLightning className="mt-4" />
          {workPriorities.map((workPriority: DetailCode, index: number) => (
            <Chip
              key={workPriority.id}
              label={workPriority.detailDescription}
              onClick={() => handleWorkPriorityClick(workPriority.id)}
              variant={
                selectedPriorityId === workPriority.id ? "filled" : "outlined"
              }
              sx={{
                margin: 0.5,
                color: selectedPriorityId === workPriority.id ? "#fff" : "#000",
                backgroundColor:
                  selectedPriorityId === workPriority.id
                    ? ["#FF5733", "#33FF57", "#3357FF", "#F833FF", "#FF8333"][
                        index % 5
                      ]
                    : "#e0e0e0",
                "&:hover": {
                  opacity: 0.75,
                },
              }}
            />
          ))}
        </div>
        <TaskDatePicker selectedDate={endDay} setSelectedDate={setEndDay} />
        <div className="flex flex-col">
          <div className="mb-4">
            <ReactQuill
              className="h-40"
              theme="snow"
              value={editorContent}
              onChange={editorChange}
            />
          </div>
        </div>
        <button
          onClick={postTask}
          className="mt-10 bg-blue-500 text-white p-2 rounded"
        >
          업무 등록
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="flex justify-center font-bold text-lg mb-4">알림</h2>
            <p className="mb-4">부족한 부분을 채워주세요!</p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-main-color hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailTask;
