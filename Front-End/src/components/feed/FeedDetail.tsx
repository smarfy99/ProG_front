import {FC, useCallback, useEffect, useRef, useState} from "react";
import {FaEllipsisVertical, FaMapPin} from "react-icons/fa6";
import {axiosInstance} from "../../apis/lib/axios.ts";
import ModiDetail from "./ModiDetail.tsx";

type FeedDetailProps = {
    boardId: number;
    onClose?: () => void;
    popFeeds?: (boardId: number, index: number) => void;
    index: number;
};

interface Feed {
    memberId: number;
    nickname: string;
    imgUrl: string;
    boardId: number;
    createdAt: string;
    isDeleted: boolean;
    title: string;
    content:string;
    viewCnt: number;
    isNotice: boolean;
}

const FeedDetail: FC<FeedDetailProps> = ({
                                             boardId,
                                             onClose = () => {},
                                             popFeeds,
                                             index
                                         }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    // useCallBack, React의 훅 중 하나, 함수의 메모이제이션에 사용 / 반복된 계산, 메모리에 저장.
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                modalRef.current &&
                event.target instanceof Node && // 그래서 event.target을 instanceof 을 사용하여 Node인지 확인
                !modalRef.current.contains(event.target) // event.target은 EventTarget 타입이지만, contains는 Node 타입을 필요로 함.
            ) {
                onClose();
            }
        },
        [onClose]
    );

    const handleClickClose = useCallback(
        () => {
            onClose();
        },
        [onClose]
    );

    // 컴포넌트가 마운트될 때 이벤트 리스너 추가
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const [feed, setFeed] = useState<Feed>({
        memberId: 0,
        nickname: '',
        imgUrl: '',
        boardId: 0,
        createdAt: '',
        isDeleted: false,
        title: '',
        content:'',
        viewCnt: 0,
        isNotice: false,
    });

    const getFreeFeed = async () => {
        try {
            const response = await axiosInstance.get(`/boards/detail/${boardId}`, {
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjozODUzOTA4NDgwLCJpYXQiOjE3MDY0MjQ4MzMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.vXlMCRdnAL60yLcAtV70jgpKfYvKBlwSu-NFrCI9LSI'
                },
            });

            const data = response.data.data;
            setFeed(() => ({
                memberId: data.memberId,
                nickname: data.nickname,
                imgUrl: data.imgUrl,
                boardId: data.boardId,
                createdAt: data.createdAt,
                isDeleted: data.isDeleted,
                title: data.title,
                content: data.content,
                viewCnt: data.viewCnt,
                isNotice: data.isNotice,
            }));
            console.log("피드 디테일", data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getFreeFeed();
    }, []);

    const [showModiDelete, setShowModiDelete] = useState(false);
    //수정 모달 상태
    const [showModiDetail, setShowModiDetail] = useState(false);

    const handleEllipsisClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // 상위 버전으로 이벤트 전파 중단
        setShowModiDelete((prev) => !prev);

        console.log(showModiDelete);
    };

    //수정하기 버튼 클릭
    const handleModifyClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowModiDetail(true);
    };

    const handleCloseModiDetail = () => {
        setShowModiDetail(false);
    };

    //삭제하기 버튼 클릭
    const handleDelete = (event: React.MouseEvent) => {
        // 삭제하기 버튼 눌렀을 때 요청.
        event.stopPropagation();
        console.log("버튼 클릭")
        if (popFeeds) {
            console.log("삭제 함수 실행");
            popFeeds(boardId, index);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-10">
            <div
                ref={modalRef}
                id="indi"
                className="bg-white mt-2 gap-4 border-2 border-main-color rounded-lg p-4 shadow-lg"
                >
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <p><img className="flex-none w-12 h-12 rounded-full"
                                src={feed.imgUrl} alt="Profile"/></p>
                        <p>{feed.nickname}</p>
                        <p>{feed.createdAt}</p>
                    </div>
                    <div className="flex gap-2">
                        <FaMapPin className="text-xl"/>
                        <FaEllipsisVertical
                            className="text-xl"
                            color="#4B33E3"
                            onClick={handleEllipsisClick}
                        />
                        {showModiDelete && (
                            <div className="row absolute 40 right-0 top-auto bg-white shadow-md rounded-md mt-1 z-40">
                                <button className="w-40 mt-2" onClick={handleModifyClick}>수정하기</button>
                                <button className="w-40 mt-2" onClick={handleDelete}>삭제하기</button>
                            </div>
                        )}
                        {showModiDetail && (
                            <div className="z-40">
                                <ModiDetail
                                    boardId={boardId}
                                    onClose={handleCloseModiDetail}
                                />
                            </div>

                        )}{" "}
                    </div>
                </div>
                <div>
                    <p className="mt-2">{feed.title}</p>
                    <hr/>
                    <div>
                        <div
                            className="mt-4"
                            dangerouslySetInnerHTML={{__html: feed.content}}
                        ></div>
                    </div>
                    <hr/>
                    <div>
                        <p>여기에 댓글이 들어갑니다.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleClickClose}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-300 mt-4"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedDetail;
