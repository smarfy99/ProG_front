import React, { useState } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa6";
import DetailTask from "./DetailTask"; // 업무 추가 모달 컴포넌트, 경로 확인 필요
import TaskOneDetail from "./TaskOneDetail"; // 업무 상세 정보 모달 컴포넌트, 경로 확인 필요
import moment from "moment";

type TodoListProps = {
  title: string;
  tasks: Task[];
};

interface Task {
  id: number;
  workId?: number;
  title: string;
  statusCode: {
    id: number;
    detailName: string;
    detailDescription: string;
    imgUrl: string | null;
  };
  typeCode: {
    id: number;
    detailName: string;
    detailDescription: string;
    imgUrl: string | null;
  };
  priorityCode: {
    id: number;
    detailName: string;
    detailDescription: string;
    imgUrl: string | null;
  };
  producerMemberName: string;
  startDay: string;
  endDay: string;
}

const TaskIndex: React.FC<TodoListProps> = ({ title, tasks }) => {
  const [showButton, setShowButton] = useState<boolean>(false);
  const [indexListOn, setIndexListOn] = useState<boolean>(false);
  const [showDetailTaskModal, setShowDetailTaskModal] =
    useState<boolean>(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(
    null
  );

  const handleIndexListOn = () => {
    setIndexListOn(!indexListOn);
  };

  const handleShowDetailTaskModal = () => {
    setShowDetailTaskModal((prev) => !prev);
  };

  const handleTaskClick = (taskDetail: Task) => {
    setSelectedTaskDetail(taskDetail);
  };

  return (
    <div>
      <div
        className="flex border border-main-color p-2 items-center"
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <div onClick={handleIndexListOn}>
          {indexListOn ? (
            <FaCaretRight className="text-xl" />
          ) : (
            <FaCaretDown className="text-xl" />
          )}
        </div>
        <span className="text-xl font-bold">
          {title} ({tasks.length})
        </span>
        <button
          className={`ml-2 border-2 px-2 ${
            showButton ? "block" : "hidden"
          } transition-all duration-300`}
          onClick={handleShowDetailTaskModal}
        >
          업무 추가
        </button>
      </div>
      {!indexListOn && (
        <ul>
          {tasks.map((item) => (
            <li
              key={item.id}
              className="flex border p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleTaskClick(item)}
            >
              <div className="w-1/2 flex-grow p-2">{item.title}</div>
              <div className="w-1/6 p-2 text-center">
                {item.statusCode.detailDescription} |{" "}
                {item.priorityCode.detailDescription}
              </div>
              <div className="w-1/6 p-2 text-center">
                {item.producerMemberName}
              </div>
              <div className="w-1/12 p-2 text-center">
                {moment(item.startDay).format("MM-DD")}
              </div>
              <div className="w-1/12 p-2 text-center">
                {moment(item.endDay).format("MM-DD")}
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedTaskDetail && (
        <TaskOneDetail
          taskDetail={selectedTaskDetail}
          onClose={() => setSelectedTaskDetail(null)}
        />
      )}
      {showDetailTaskModal && (
        <DetailTask onClose={() => setShowDetailTaskModal((prev) => !prev)} />
      )}
    </div>
  );
};

export default TaskIndex;
