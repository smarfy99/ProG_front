import FeedDetail from "./FeedDetail.tsx";
import React, {FC, useState} from "react";

type FreeFeedSimpleProps = {
    memberId: number;
    nickname: string;
    imgUrl: string;
    boardId: number;
    createdAt: string;
    isDeleted: boolean;
    title: string;
    viewCnt: number;
    isNotice: boolean;
    popFeeds?: (boardId: number, index: number) => void;
    index: number;
};

const FreeFeedSimple: FC<FreeFeedSimpleProps> = ({
                                                     nickname,
                                                     imgUrl,
                                                     boardId,
                                                     createdAt,
                                                     title,
                                                     popFeeds,
                                                     index
                                                 }) => {
    //보드 디테일 상태
    const [showDetail, setShowDetail] = useState(false);
    //수정 삭제 메뉴 모달 상태
    
    //수정 삭제 모달 생성
    const handleDetailClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowDetail(true);
    };
    
    //보드 디테일 모달 닫기 버튼
    const onClickClose = () => {
        console.log("모달닫아")
        setShowDetail(false);
    }

    return (
        <div
            onClick={handleDetailClick}
            className="mt-2 gap-4 border-2 border-main-color rounded-lg p-4"

        >
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <p><img className="flex-none w-12 h-12 rounded-full"
                            src={imgUrl} alt="Profile"/></p>
                    <p>{nickname}</p>
                    <p>{createdAt}</p>
                </div>
            </div>
            <div className="z-30">
                <p className="mt-2">{title}</p>
                {showDetail && (
                    <FeedDetail
                        boardId={boardId}
                        onClose={onClickClose}
                        popFeeds={popFeeds}
                        index={index}
                    />
                )}{" "}
            </div>
        </div>
    );
};

export default FreeFeedSimple;
