import { useState } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa6";
import DetailTask from "./DetailTask";

// interface List {
//   id: number;
//   task: string;
//   state: string;
//   asignee: string;
//   startDate: Date;
//   endDate: Date;
// }

type TodoListProps = {
  title: string;
};

const TaskIndex: React.FC<TodoListProps> = ({ title }) => {
  const [indexListOn, setIndexListOn] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showDetailTask, setShowDetailTask] = useState<boolean>(false);

  const list = [
    {
      id: 1,
      task: "첫 번째 메모",
      state: "진행 중",
      asignee: "박은수",
      startDate: "01-31",
      endDate: "02-16",
    },
    {
      id: 2,
      task: "집에 일찍 가기",
      state: "완료",
      asignee: "박은수",
      startDate: "01-31",
      endDate: "02-16",
    },
    {
      id: 3,
      task: "야근하기",
      state: "시작 전",
      asignee: "정지원",
      startDate: "01-31",
      endDate: "02-16",
    },
  ];

  const handleIndexListOn = () => {
    setIndexListOn((prev) => !prev);
  };

  const handleShowDetailTask = () => {
    setShowDetailTask((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setShowButton(true);
  };

  const handleMouseLeave = () => {
    setShowButton(false);
  };

  return (
    <div>
      <div
        className="flex border border-main-color p-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div></div>
        {indexListOn ? (
          <FaCaretRight className="text-xl mr-1" onClick={handleIndexListOn} />
        ) : (
          <FaCaretDown className="text-xl mr-1" onClick={handleIndexListOn} />
        )}
        <span className="text-xl font-bold">
          {title} ({list.length})
        </span>{" "}
        {/*나중에 이 부분 바꿔야함, 실제 넘어오는 데이터는 다른 유형을 가짐*/}
        {showButton && (
          <button
            className="ml-4 border-2 border-black"
            onClick={handleShowDetailTask}
          >
            업무 추가
          </button>
        )}
      </div>
      {!indexListOn && (
        <ul>
          {list.map((item) => (
            <li key={item.id} className="flex border">
              <div className="w-1/2 flex-grow p-2 ml-6">{item.task}</div>
              <div className="w-1/6 p-2 text-center">{item.state}</div>
              <div className="w-1/6 p-2 text-center">{item.asignee}</div>
              <div className="w-1/12 p-2 text-center">{item.startDate}</div>
              <div className="w-1/12 p-2 text-center">{item.endDate}</div>
            </li>
          ))}
        </ul>
      )}
      {showDetailTask && (
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <DetailTask />
        </div>
      )}
    </div>
  );
};

export default TaskIndex;
