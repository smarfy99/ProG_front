import { ChangeEvent, useEffect, useState } from "react";
import {
  FaRegCircleUser,
  FaBoltLightning,
  FaBookBookmark,
  FaCalendarCheck,
  FaCheck,
} from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill 스타일시트 임포트
import { axiosInstance } from "../../apis/lib/axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import TaskDatePicker from "../calendar/TaskDatePicker";
import { useMultipleDetailCodes } from "../../hooks/useMultipleDataCodes";
import Chip from "@mui/material/Chip";

interface TaskDetail {
  workId?: number;
}

interface ModifyTaskProps {
  taskDetail: TaskDetail;
  onClose: () => void;
}

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

const ModifyTask: React.FC<ModifyTaskProps> = ({ taskDetail }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { projectId } = useParams<{ projectId: string; workId: string }>();
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [, setId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [endDay, setEndDay] = useState(tomorrow);

  const { data: multipleDetailCodesData } = useMultipleDetailCodes([
    "workType",
    "workPriority",
    "WorkStatus",
  ]);
  const workTypes = multipleDetailCodesData?.[0] ?? [];
  const workPriorities = multipleDetailCodesData?.[1] ?? [];
  const WorkStatus = multipleDetailCodesData?.[2] ?? [];

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

  const modifyTask = async () => {
    const modifyTaskInfo = {
      statusCode: selectedStatusId,
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
      !selectedStatusId ||
      !selectedMemberId ||
      !selectedTypeId ||
      !selectedPriorityId ||
      !editorContent
    ) {
      setShowModal(true); // 필요한 모든 필드가 입력되지 않았으므로 모달 표시
      return; // 함수를 여기서 종료시켜서, API 호출을 방지
    }

    try {
      await axiosInstance.patch(`/works/${taskDetail.workId}`, modifyTaskInfo, {
        headers: {
          "Content-Type": "application/json", // 명시적으로 Content-Type 설정
        },
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    // 선택된 멤버 ID를 문자열로 상태 업데이트, 빈 문자열이면 null 처리
    setSelectedMemberId(event.target.value ? Number(event.target.value) : null);
  };

  const handleWorkStatusClick = (id: number) => {
    setSelectedStatusId(id);
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

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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

  const closeModal = () => {
    setShowModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          !isOpen && "hidden"
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`fixed right-0 top-0 p-6 h-full overflow-y-auto bg-slate-50 p-4 rounded-md shadow-lg z-50 w-full max-w-2xl max-h-full transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ease-in-out duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">상세 업무 수정</h1>
          <button
            onClick={handleClose}
            className="text-white bg-gray-500 hover:bg-gray-600 font-bold py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>
        <div className="flex items-center mb-4">
          <FaRegCircleUser className="text-gray-600 mr-2" />
          <p className="text-md">업무 요청자: {nickname}</p>
          <FaCalendarCheck className="text-md ml-4" />
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
        <div className="flex">
          <FaCheck className="mt-3" />
          {WorkStatus.map((workType: DetailCode, index: number) => (
            <Chip
              key={workType.id}
              label={workType.detailDescription}
              onClick={() => handleWorkStatusClick(workType.id)}
              variant={selectedStatusId === workType.id ? "filled" : "outlined"}
              sx={{
                margin: 0.5,
                color: selectedStatusId === workType.id ? "#fff" : "#000",
                backgroundColor:
                  selectedStatusId === workType.id
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
          <div className="flex">
          <FaBookBookmark className="mt-3" />
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
        <div className="flex">
          <FaBoltLightning className="mt-3" />
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
        {/* <TaskChkList /> */}
        <button
          onClick={modifyTask}
          className="mt-10 bg-blue-500 text-white p-2 rounded"
        >
          업무 수정
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

export default ModifyTask;

