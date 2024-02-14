import FeedDetail from "./FeedDetail.tsx";
import React, {FC, useEffect, useState} from "react";

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
    getFreeFeeds: () => void;
};

const FreeFeedSimple: FC<FreeFeedSimpleProps> = ({
                                                     nickname,
                                                     imgUrl,
                                                     boardId,
                                                     createdAt,
                                                     title,
                                                     popFeeds,
                                                     index,
                                                     getFreeFeeds
                                                 }) => {
    //보드 디테일 상태
    const [showDetail, setShowDetail] = useState(false);
    
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

    useEffect(()  => {
        if (showDetail) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showDetail]);

    const formatDate = (dateString: string): string => {
        const serverDateTime = new Date(dateString);

        const koreaDateTime = new Date(serverDateTime.getTime() + 9 * 60 * 60 * 1000);

        const formattedDateTime = `${koreaDateTime.getFullYear()}.${String(
            koreaDateTime.getMonth() + 1
        ).padStart(2, '0')}.${String(koreaDateTime.getDate()).padStart(2, '0')} ${
            String(koreaDateTime.getHours()).padStart(2, '0')}:${
            String(koreaDateTime.getMinutes()).padStart(2, '0')}:${
            String(koreaDateTime.getSeconds()).padStart(2, '0')}`;

        return formattedDateTime
    };
    return (
        <div
            onClick={handleDetailClick}
            className="gap-4 hover:bg-stone-50 border-t-2 border-indigo-300 p-4 h-24"
        >
            <div className="flex justify-between items-center">
                <div className="grid gap-4">
                    <p><img className="flex-none w-8 h-8 rounded-full"
                            src={imgUrl} alt="Profile"/></p>
                    <p>{nickname}</p>
                </div>
                <div className=" ml-4 mr-4">
                    <p className="mt-2">{title}</p>
                    {showDetail && (
                        <FeedDetail
                            boardId={boardId}
                            onClose={onClickClose}
                            popFeeds={popFeeds}
                            index={index}
                            getFreeFeeds={() => getFreeFeeds()}
                        />
                    )}
                </div>
                <div className="flex gap-4">
                    <p>{formatDate(createdAt)}</p>

                </div>
            </div>
        </div>
    );
};

export default FreeFeedSimple;
