import React, { ReactNode, useEffect, useState } from "react";
import { axiosInstance } from "../../apis/lib/axios";
import { useMultipleDetailCodes } from "../../hooks/useMultipleDataCodes";
import Chip from "@mui/material/Chip";
import ModifyTask from "./ModifyTask";
import TaskChkList from "./TaskChkList";

interface DetailData {
  workContent: string;
}

interface DetailCode{
  detailDescription: ReactNode;
  id: number,
}

interface TaskOneDetailProps {
  taskDetail: {
    workId?: number;
    statusCode: DetailCode;
    typeCode: DetailCode;
    priorityCode: DetailCode;
    producerMemberName: string;
    title: string;
    startDay: string;
    endDay: string;
  };
  onClose: () => void;
}

const TaskOneDetail: React.FC<TaskOneDetailProps> = ({
  taskDetail,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number>(
    taskDetail.statusCode.id
  );

  const { data: multipleDetailCodesData } = useMultipleDetailCodes([
    "WorkStatus",
  ]);
  const workStatus = multipleDetailCodesData?.[0] ?? [];

  const fetchDetailTask = async () => {
    try {
      const response = await axiosInstance.get(
        `/works/details/${taskDetail.workId}`
      );
      setDetailData(response.data.data);
      console.log(detailData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetailTask();
  }, [taskDetail.workId]);

  const handleChangeStatus = async (statusId: number) => {
    try {
      await axiosInstance.patch(`/works/status/${taskDetail.workId}`, {
        statusCode: statusId,
      });
      setSelectedStatusId(statusId);
      // window.location.reload(); 새로고침할 것인가 말 것인가,,
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end mt-16">
      <div className="bg-white p-6 rounded-l-lg shadow-lg z-50 w-full max-w-xl transition-transform transform ease-in-out duration-300 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{taskDetail.title}</h1>
          <button
            onClick={onClose}
            className="text-white bg-gray-500 hover:bg-gray-600 font-bold py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>

        <div className="mb-4">
          <strong className="mr-2">상태:</strong>
          {workStatus.map((status: DetailCode) => (
            <Chip
              key={status.id}
              label={status.detailDescription}
              onClick={() => handleChangeStatus(status.id)}
              color={selectedStatusId === status.id ? "primary" : "default"}
              variant="outlined"
              className="mr-2"
            />
          ))}
        </div>

        <div className="mb-4">
          <strong>우선순위:</strong> {taskDetail.priorityCode.detailDescription}
        </div>
        <div className="mb-4">
          <strong>담당자:</strong> {taskDetail.producerMemberName}
        </div>
        {detailData && (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: detailData.workContent }}
          ></div>
        )}
        <TaskChkList 
        taskDetail={taskDetail}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            수정
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            삭제
          </button>
        </div>

        {isEditing && (
          <ModifyTask
            taskDetail={taskDetail}
            onClose={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskOneDetail;
