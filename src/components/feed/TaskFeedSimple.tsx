import { FC } from "react";

type TaskFeedSimpleProps = {
  feedId: number;
  contentsCode: number;
  contentsId: number;
  memberImgUrl: string;
  feedContent: string;
};

const TaskFeedSimple: FC<TaskFeedSimpleProps> = ({
  memberImgUrl,
  feedContent,
}) => {
  return (
    // <div className="gap-4 hover:bg-stone-50 border-t-2 border-indigo-300 p-4 h-24">
    <div className="gap-4 hover:bg-stone-50 p-4 h-24">
      <div className="flex items-center">
        <div className="grid gap-4">
          <p>
            <img
              className="flex-none mt-1 w-12 h-12 rounded-full"
              src={memberImgUrl}
              alt="Profile"
            />
          </p>
        </div>
        <div className="flex-grow pl-10 mr-4">
          <p className="mt-3">{feedContent}</p>
        </div>
      </div>
      {/*<TaskOneDetail taskDetail={} onClose={} onTaskUpdate={} />*/}
    </div>
  );
};
export default TaskFeedSimple;
