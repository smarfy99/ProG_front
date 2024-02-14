import {FC} from "react";

type TaskFeedSimpleProps = {
    feedId: number;
    contentsCode: number;
    contentsId: number;
    memberImgUrl: string;
    feedContent: string;
    index: number;
};

const TaskFeedSimple: FC<TaskFeedSimpleProps> = ({
                                                     feedId,
                                                     contentsCode,
                                                     contentsId,
                                                     memberImgUrl,
                                                     feedContent,
                                                     index,
                                                 }) => {


    return (
        <div
            className="gap-4 hover:bg-stone-50 border-t-2 border-indigo-300 p-4 h-24"
        >
            <div className="flex items-center justify-between">
                <div className="grid gap-4">
                    <p><img className="flex-none w-8 h-8 rounded-full"
                            src={memberImgUrl} alt="Profile"/></p>
                </div>
                <div className="flex-grow text-center mr-4">
                    <p className="mt-2">{feedContent}</p>
                </div>
            </div>
        </div>
    );
};
export default TaskFeedSimple;
